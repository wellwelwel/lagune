import type { CheckerSettings } from '../../types/checkers.js';
import type { GitIgnores } from '../../types/git.js';
import type {
  ExtractedFile,
  ReachingFile,
  RegexAssessment,
  RegexCandidate,
  RegexFinding,
  RegexScanResult,
  TieredFile,
} from '../../types/hooks/regex.js';
import type { LanguageId } from '../../types/scan.js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { checkerSettings } from '../../core/checkers.js';
import { gitIgnoresOf } from '../../core/git/repository.js';
import { SOURCE_FILTER } from '../../core/scan/filters.js';
import { languageOf } from '../../core/scan/language.js';
import { skippedCounts, walkTargetsWith } from '../../core/scan/walk.js';
import {
  familyOf,
  reachingNames,
  tiersOf,
  unprovenFamilies,
} from './evidence.js';
import { extractPatterns, readingKey } from './extract.js';
import { assessReadings } from './pool.js';
import { readSource } from './source.js';
import { regexUsage } from './usage.js';

const readText = async (root: string, file: string): Promise<string | null> => {
  try {
    return await readFile(join(root, file), 'utf8');
  } catch {
    return null;
  }
};

const extractFile = async (
  root: string,
  file: string
): Promise<ExtractedFile | null> => {
  const language = languageOf(file);

  if (language === null) return null;

  const text = await readText(root, file);

  if (text === null) return null;

  const source = readSource(text, language);

  return {
    file,
    language,
    ...extractPatterns(source),
    ...regexUsage(source),
  };
};

const reachingOf = async (
  root: string,
  file: string,
  families: ReadonlySet<LanguageId>
): Promise<ReachingFile | null> => {
  const language = languageOf(file);

  if (language === null || !families.has(familyOf(language))) return null;

  const text = await readText(root, file);

  return text === null
    ? null
    : { language, reaching: regexUsage(readSource(text, language)).reaching };
};

const reachingOutside = async (
  root: string,
  files: readonly string[],
  families: ReadonlySet<LanguageId>,
  settings: CheckerSettings,
  ignores: GitIgnores | null
): Promise<ReachingFile[]> => {
  const scanned = new Set(files);
  const project = await walkTargetsWith(
    root,
    [root],
    SOURCE_FILTER,
    settings,
    ignores
  );
  const read = await Promise.all(
    project.files
      .filter((file) => !scanned.has(file))
      .map((file) => reachingOf(root, file, families))
  );

  return read.filter((entry) => entry !== null);
};

const distinctReadings = (
  tiered: readonly TieredFile[]
): Map<string, RegexCandidate> =>
  new Map(
    tiered.flatMap(({ proven, plausible }) =>
      [...proven, ...plausible].map((candidate): [string, RegexCandidate] => [
        readingKey(candidate),
        candidate,
      ])
    )
  );

const findingsOf = (
  tiered: readonly TieredFile[],
  tier: 'proven' | 'plausible',
  assessments: ReadonlyMap<string, RegexAssessment>,
  verdict: 'unsafe' | 'undetermined'
): RegexFinding[] =>
  tiered.flatMap((entry) =>
    entry[tier].flatMap((candidate) => {
      const assessment = assessments.get(readingKey(candidate));

      return assessment?.verdict === verdict
        ? [
            {
              file: entry.file,
              source: candidate.source,
              flags: candidate.flags,
              reason: assessment.reason,
              scope: assessment.scope,
            },
          ]
        : [];
    })
  );

const filesWhere = (
  extracted: readonly ExtractedFile[],
  holds: (entry: ExtractedFile) => boolean
): string[] =>
  extracted
    .filter(holds)
    .map(({ file }) => file)
    .toSorted((left, right) => left.localeCompare(right));

/** Maps ReDoS-prone, unsettled, unconfirmed, and dynamic regexes across paths, judging each distinct reading once. A string the scanned files do not prove a regex is followed by name through the rest of the project, in its own language family */
export const scan = async (
  root: string,
  targets: string[],
  repetitionLimit?: number
): Promise<RegexScanResult> => {
  const settings = await checkerSettings(root, 'regex');
  const ignores = settings.gitignore ? await gitIgnoresOf(root) : null;
  const { files, skipped } = await walkTargetsWith(
    root,
    targets,
    SOURCE_FILTER,
    settings,
    ignores
  );
  const read = await Promise.all(files.map((file) => extractFile(root, file)));
  const extracted = read.filter((entry) => entry !== null);
  const families = targets.includes(root)
    ? new Set<LanguageId>()
    : unprovenFamilies(extracted, reachingNames(extracted));
  const outside =
    families.size === 0
      ? []
      : await reachingOutside(root, files, families, settings, ignores);
  const reaching = reachingNames([...extracted, ...outside]);
  const tiered = extracted.map((entry) => tiersOf(entry, reaching));
  const assessments = await assessReadings(
    distinctReadings(tiered),
    repetitionLimit
  );

  return {
    unsafe: findingsOf(tiered, 'proven', assessments, 'unsafe'),
    undetermined: findingsOf(tiered, 'proven', assessments, 'undetermined'),
    unconfirmed: findingsOf(tiered, 'plausible', assessments, 'unsafe'),
    dynamic: filesWhere(extracted, ({ dynamic }) => dynamic),
    staticWrap: filesWhere(extracted, ({ staticWrap }) => staticWrap),
    skipped: skippedCounts(skipped),
  };
};
