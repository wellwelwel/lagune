import type { GitTracking } from '../../types/git.js';
import type {
  CommittableTracking,
  ConfigEntry,
  EnvEvidence,
  EnvFileKind,
  EvidenceTier,
  TrackingSeverities,
  TrackingVerdicts,
} from '../../types/hooks/secrets.js';
import type { FileAnalysis } from '../../types/scan.js';
import { basename } from 'node:path';
import { allOf, deepFreeze } from '../../core/collections.js';
import { languageOf } from '../../core/scan/language.js';
import { EMPTY_ANALYSIS } from '../../core/scan/scope.js';
import {
  connectionCredentialOf,
  isPlaceholder,
  SIGNATURES,
} from './patterns.js';
import {
  advisoryOf,
  EXPOSURES,
  PLACES,
  REMEDIES,
  reviewOf,
  unreadLead,
} from './verdicts.js';

const ENV_NAME = /^\.env(?:\.[\w-]{1,64}){0,8}$/;
const EXPORT = /^export[ \t]+/;
const ENV_KEY = /^[A-Za-z_][\w.-]{0,255}$/;
const SECRET_VARIABLE =
  /(?:^|[_.-])(?:PASSWORD|PASSWD|PASS|PWD|PASSPHRASE|SECRET|TOKEN|SECRET_KEY_BASE|(?:API|SECRET|ACCESS|PRIVATE|ENCRYPTION|SIGNING|MASTER|AUTH)_?KEY)$/i;
const TOKEN_VARIABLE = /TOKEN$/i;
const PUBLIC_VARIABLE =
  /^(?:(?:NEXT|NUXT|EXPO)_PUBLIC_|PUBLIC_|VITE_|REACT_APP_|VUE_APP_|GATSBY_)/;
const BOOLEAN = /^(?:true|false)$/i;
const COUNT = /^\d{1,32}$/;
const DOTENVX_CIPHERTEXT = 'encrypted:';
const DOTENVX_KEYS = '.env.keys';

const TEMPLATES: ReadonlySet<string> = new Set([
  'example',
  'sample',
  'template',
]);

const LOCAL_LABEL = 'environment file meant to stay local';
const MOVE_SECRET =
  'move the secret to a local file Git ignores, such as .env.local';

const FILES: Readonly<Record<EnvFileKind, string>> = deepFreeze({
  shared: 'an environment file',
  local: `an ${LOCAL_LABEL}`,
});

const SUBJECTS: Readonly<Record<EvidenceTier, string>> = deepFreeze({
  proven: 'secret',
  unconfirmed: 'possible secret',
});

const CONDITIONS: Readonly<Record<EvidenceTier, string>> = deepFreeze({
  proven: '',
  unconfirmed: 'if it is a real credential rather than a development default, ',
});

const SEVERITIES: Readonly<Record<EvidenceTier, TrackingSeverities>> =
  deepFreeze({
    proven: EXPOSURES,
    unconfirmed: { tracked: reviewOf, unignored: reviewOf },
  });

const LOCAL_VERDICTS: TrackingVerdicts = deepFreeze({
  tracked: advisoryOf(
    `${LOCAL_LABEL} ${PLACES.tracked}: the next secret written here lands in a commit, so ${REMEDIES.tracked}`
  ),
  unignored: advisoryOf(
    `${LOCAL_LABEL} ${PLACES.unignored}: ${REMEDIES.unignored}`
  ),
});

/** The kind of environment file a path names, or none for a template, a source file, or the dotenvx key file */
export const envFileOf = (relativePath: string): EnvFileKind | null => {
  const name = basename(relativePath).toLowerCase();

  if (
    name === DOTENVX_KEYS ||
    !ENV_NAME.test(name) ||
    languageOf(name) !== null
  )
    return null;

  const variants = name.split('.').slice(2);

  if (variants.some((variant) => TEMPLATES.has(variant))) return null;

  return variants.includes('local') ? 'local' : 'shared';
};

const valueOf = (raw: string): string => {
  const quote = raw[0];

  if (quote === '"' || quote === "'" || quote === '`') {
    const end = raw.indexOf(quote, 1);

    return end === -1 ? raw.slice(1) : raw.slice(1, end);
  }

  const comment = raw.indexOf('#');

  return (comment === -1 ? raw : raw.slice(0, comment)).trim();
};

/** The variable a line of a dotenv file sets and its value, quotes and trailing comment removed */
const assignmentOf = (line: string): ConfigEntry | null => {
  const text = line.trim().replace(EXPORT, '');

  if (text.startsWith('#')) return null;

  const at = text.indexOf('=');

  if (at <= 0) return null;

  const key = text.slice(0, at).trim();

  if (!ENV_KEY.test(key)) return null;

  return [key, valueOf(text.slice(at + 1).trim())];
};

const isSet = (value: string): boolean =>
  value !== '' &&
  !value.startsWith('$') &&
  !value.startsWith(DOTENVX_CIPHERTEXT) &&
  !BOOLEAN.test(value) &&
  !isPlaceholder(value);

const isTokenCount = (key: string, value: string): boolean =>
  TOKEN_VARIABLE.test(key) && COUNT.test(value);

const setsSecretVariable = ([key, value]: ConfigEntry): boolean =>
  !PUBLIC_VARIABLE.test(key) &&
  SECRET_VARIABLE.test(key) &&
  isSet(value) &&
  !isTokenCount(key, value);

const valueTierOf = (line: string): EvidenceTier | null =>
  SIGNATURES.some((rule) => rule.regex.test(line))
    ? 'proven'
    : connectionCredentialOf(line);

const evidenceOf = (line: string, index: number): EnvEvidence | null => {
  const assignment = assignmentOf(line);
  const tier = valueTierOf(line);

  if (tier !== null)
    return {
      tier,
      source: assignment === null ? `line ${index + 1}` : assignment[0],
    };

  if (assignment === null || !setsSecretVariable(assignment)) return null;

  return { tier: 'unconfirmed', source: assignment[0] };
};

const sourcesOf = (
  evidence: readonly EnvEvidence[],
  tier: EvidenceTier
): string[] => [
  ...new Set(
    evidence.filter((item) => item.tier === tier).map((item) => item.source)
  ),
];

const actionOf = (kind: EnvFileKind, tracking: CommittableTracking): string =>
  kind === 'local'
    ? REMEDIES[tracking]
    : `${MOVE_SECRET}, or ${REMEDIES[tracking]}`;

const leakOf = (
  tier: EvidenceTier,
  sources: readonly string[],
  kind: EnvFileKind,
  tracking: CommittableTracking
): FileAnalysis =>
  SEVERITIES[tier][tracking](
    `${SUBJECTS[tier]} (${allOf(sources)}) in ${FILES[kind]} ${PLACES[tracking]}: ${CONDITIONS[tier]}${actionOf(kind, tracking)}`
  );

/** The one verdict an environment file earns from the strongest evidence it holds and from its Git status */
export const envFileAnalysis = (
  kind: EnvFileKind,
  text: string | null,
  tracking: GitTracking
): FileAnalysis => {
  if (tracking === 'ignored') return EMPTY_ANALYSIS;
  if (text === null) return unreadLead('secret');

  const evidence = text
    .split('\n')
    .map(evidenceOf)
    .filter((item) => item !== null);
  const proven = sourcesOf(evidence, 'proven');

  if (proven.length > 0) return leakOf('proven', proven, kind, tracking);

  const unconfirmed = sourcesOf(evidence, 'unconfirmed');

  if (unconfirmed.length > 0)
    return leakOf('unconfirmed', unconfirmed, kind, tracking);

  return kind === 'local' ? LOCAL_VERDICTS[tracking] : EMPTY_ANALYSIS;
};
