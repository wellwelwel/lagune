import type { BoundedCache } from '../../types/core.js';
import type { HistoryLimits, HistoryVisitor } from '../../types/git.js';
import type {
  CredentialFile,
  EnvFileKind,
  EvidenceTier,
  HistoryEvidence,
  HistoryHit,
  HistoryReport,
  SecretEvidence,
} from '../../types/hooks/secrets.js';
import type { ConfigIgnores, LanguageId } from '../../types/scan.js';
import { sep } from 'node:path';
import { checkerSettings } from '../../core/checkers.js';
import {
  boundedCache,
  cachedValue,
  cacheValue,
  deepFreeze,
} from '../../core/collections.js';
import { walkHistory } from '../../core/git/history.js';
import { HOOK_DEADLINE_SECONDS } from '../../core/hook-deadline.js';
import { languageOf } from '../../core/scan/language.js';
import { blockCommentReach, codeLines } from '../../core/scan/lines.js';
import {
  configIgnoresOf,
  LAGUNE_FOLDER,
  leavesOutFolder,
  matchesConfig,
} from '../../core/scan/walk.js';
import { credentialFileOf, credentialTierOf } from './credential-files.js';
import { envFileOf, envSecretLabel, envSecretsIn } from './env-files.js';
import { SECRETS_FILTER } from './scan.js';
import { secretsInLines } from './secrets.js';

export const MEBIBYTE = 1024 * 1024;
const DEADLINE_MARGIN_MS = 15_000;
const MAX_JUDGED_BYTES = 256 * MEBIBYTE;

export const HISTORY_LIMITS: HistoryLimits = deepFreeze({
  commits: 100_000,
  objects: 1_000_000,
  bytes: 2048 * MEBIBYTE,
  objectBytes: 8 * MEBIBYTE,
  deltaDepth: 4095,
  milliseconds: HOOK_DEADLINE_SECONDS * 1000 - DEADLINE_MARGIN_MS,
});

const TIERS: readonly EvidenceTier[] = deepFreeze(['proven', 'unconfirmed']);

const NO_LINES: ReadonlySet<string> = new Set();

const nativePath = (segments: readonly string[]): string => segments.join(sep);

const isWalkedFolder = (segments: readonly string[]): boolean => {
  const name = segments[segments.length - 1];

  return (
    !leavesOutFolder(SECRETS_FILTER, name) &&
    !(segments.length === 1 && name === LAGUNE_FOLDER)
  );
};

const evidenceOf = (secrets: SecretEvidence): HistoryEvidence[] =>
  TIERS.flatMap((tier) => secrets[tier].map(({ label }) => ({ tier, label })));

const judgedLinesAt = (
  memory: BoundedCache<ReadonlySet<string>>,
  path: string
): ReadonlySet<string> => cachedValue(memory, path) ?? NO_LINES;

/** Blanks every line an earlier version of the same path already settled, keeping each line at its index */
const freshLines = (
  lines: readonly string[],
  judged: ReadonlySet<string>
): string[] => lines.map((line) => (judged.has(line) ? '' : line));

/** Reads a file's comments once, the first time a rule asks for the code form of one of its lines */
const codeLineReader = (
  text: string,
  language: LanguageId | null
): ((index: number) => string) => {
  let lines: readonly string[] | null = null;

  return (index) => {
    lines ??= codeLines(text, language);

    return lines[index];
  };
};

const sourceEvidence = (
  memory: BoundedCache<ReadonlySet<string>>,
  path: string,
  text: string
): HistoryEvidence[] => {
  const language = languageOf(path);
  const lines = text.split('\n');
  const fresh = freshLines(lines, judgedLinesAt(memory, path));
  const reach = blockCommentReach(lines, language);
  const codeLineAt = codeLineReader(text, language);

  cacheValue(
    memory,
    path,
    new Set(lines.filter((_line, index) => !reach[index])),
    text.length
  );

  return evidenceOf(secretsInLines(language, fresh, codeLineAt));
};

const envEvidence = (
  memory: BoundedCache<ReadonlySet<string>>,
  path: string,
  kind: EnvFileKind,
  text: string
): HistoryEvidence[] => {
  const lines = text.split('\n');
  const secrets = envSecretsIn(freshLines(lines, judgedLinesAt(memory, path)));

  cacheValue(memory, path, new Set(lines), text.length);

  return secrets === null
    ? []
    : [{ tier: secrets.tier, label: envSecretLabel(kind, secrets) }];
};

const credentialEvidence = (
  path: string,
  file: CredentialFile,
  text: string
): HistoryEvidence[] => {
  const tier = credentialTierOf(path, file, text);

  return tier === null ? [] : [{ tier, label: file.label }];
};

/** The secrets one version of a file adds to its path, by the rules the working tree answers to, reading only the lines no earlier version of the path settled */
const secretsInFile = (
  memory: BoundedCache<ReadonlySet<string>>,
  path: string,
  text: string
): HistoryEvidence[] => {
  const credentialFile = credentialFileOf(path);
  const envFile = envFileOf(path);

  if (credentialFile === null && envFile === null)
    return sourceEvidence(memory, path, text);

  return [
    ...(credentialFile === null
      ? []
      : credentialEvidence(path, credentialFile, text)),
    ...(envFile === null ? [] : envEvidence(memory, path, envFile, text)),
  ];
};

const hitKey = ({ tier, path, label }: HistoryHit): string =>
  [tier, path, label].join('\n');

/** Hands the walk the checker's filters and settings, memoizing each path's verdict, and keeps the first commit met for each kind of secret at each path */
const historyVisitor = (
  ignores: ConfigIgnores | null,
  hits: Map<string, HistoryHit>,
  skipped: Set<string>
): HistoryVisitor => {
  const verdicts = new Map<string, boolean>();
  const memory = boundedCache<ReadonlySet<string>>(
    MAX_JUDGED_BYTES,
    MAX_JUDGED_BYTES
  );

  const isLeftOut = (
    segments: readonly string[],
    isDirectory: boolean
  ): boolean => {
    if (ignores === null) return false;

    const path = segments.join('/');
    const key = isDirectory ? `${path}/` : path;
    const known = verdicts.get(key);

    if (known !== undefined) return known;

    const leftOut = matchesConfig(ignores, segments, isDirectory);

    verdicts.set(key, leftOut);
    if (leftOut) skipped.add(path);

    return leftOut;
  };

  return {
    entersFolder: (segments) =>
      isWalkedFolder(segments) && !isLeftOut(segments, true),
    readsFile: (segments) =>
      SECRETS_FILTER.accept(nativePath(segments)) &&
      !isLeftOut(segments, false),
    file: (path, content, commit, blob) => {
      for (const evidence of secretsInFile(
        memory,
        nativePath(path.split('/')),
        content.toString('utf8')
      )) {
        const hit = { ...evidence, path, commit, blob };
        const key = hitKey(hit);

        if (!hits.has(key)) hits.set(key, hit);
      }
    },
  };
};

/** Scans every version of every file the repository's history holds for secrets, under the bounds that keep the walk inside the hook deadline, or only the commits after the one where the run it continues stopped */
export const scanHistory = async (
  root: string,
  limits: HistoryLimits,
  before: string | null
): Promise<HistoryReport> => {
  const settings = await checkerSettings(root, 'secrets');
  const hits = new Map<string, HistoryHit>();
  const skipped = new Set<string>();
  const read = await walkHistory(
    root,
    limits,
    historyVisitor(configIgnoresOf(settings.ignore), hits, skipped),
    before
  );

  return { read, hits: [...hits.values()], skipped: skipped.size };
};
