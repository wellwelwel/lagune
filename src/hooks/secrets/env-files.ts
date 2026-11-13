import type {
  ConfigEntry,
  EnvFileKind,
  GitTracking,
} from '../../types/hooks/secrets.js';
import type { FileAnalysis } from '../../types/scan.js';
import { basename } from 'node:path';
import { languageOf } from '../../core/scan/language.js';
import { EMPTY_ANALYSIS } from '../../core/scan/scope.js';
import { isPlaceholder, SIGNATURES } from './patterns.js';
import {
  advisoryOf,
  findingOf,
  trackedFinding,
  unknownTrackingLead,
  unreadLead,
} from './verdicts.js';

const ENV_NAME = /^\.env(?:\.[\w-]{1,64}){0,8}$/;
const EXPORT = /^export[ \t]+/;
const ENV_KEY = /^[A-Za-z_][\w.-]{0,255}$/;
const SECRET_VARIABLE =
  /(?:^|[_.-])(?:PASSWORD|PASSWD|PASS|PWD|PASSPHRASE|SECRET|TOKEN|SECRET_KEY_BASE|(?:API|SECRET|ACCESS|PRIVATE|ENCRYPTION|SIGNING|MASTER|AUTH)_?KEY)$/i;
const PUBLIC_VARIABLE = /^(?:NEXT_PUBLIC_|VITE_)/;
const BOOLEAN = /^(?:true|false)$/i;

const TEMPLATES: ReadonlySet<string> = new Set([
  'example',
  'sample',
  'template',
]);

const LOCAL_LABEL = 'environment file meant to stay local';
const LEAK_LABEL = 'secret in an environment file';
const TRACKED_LEAK = `${LEAK_LABEL} tracked by Git: move the secret to a local file Git ignores, such as .env.local, or stop tracking this file (git rm --cached) and add it to .gitignore`;
const TRACKED_DEFAULTS =
  'environment file tracked by Git: confirm every value it sets is meant to be public';

/** The kind of environment file a path names, or none for a template or a source file */
export const envFileOf = (relativePath: string): EnvFileKind | null => {
  const name = basename(relativePath).toLowerCase();

  if (!ENV_NAME.test(name) || languageOf(name) !== null) return null;

  const variants = name.split('.').slice(2);

  if (variants.some((variant) => TEMPLATES.has(variant))) return null;

  return variants.includes('local') ? 'local' : 'shared';
};

export const readsEnvContent = (kind: EnvFileKind | null): boolean =>
  kind === 'shared';

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
  !BOOLEAN.test(value) &&
  !isPlaceholder(value);

const setsSecretVariable = (line: string): boolean => {
  const assignment = assignmentOf(line);

  if (assignment === null) return false;

  const [key, value] = assignment;

  return (
    !PUBLIC_VARIABLE.test(key) && SECRET_VARIABLE.test(key) && isSet(value)
  );
};

const holdsSecret = (text: string): boolean =>
  text
    .split('\n')
    .some(
      (line) =>
        SIGNATURES.some((rule) => rule.regex.test(line)) ||
        setsSecretVariable(line)
    );

/** A tracked environment file is a finding when it is meant to stay local or sets a secret, and an advisory otherwise. It is a lead when it cannot be read, or when Git's index cannot tell whether a would-be finding is tracked */
export const envFileAnalysis = (
  kind: EnvFileKind,
  text: string | null,
  tracking: GitTracking
): FileAnalysis => {
  if (tracking === 'untracked') return EMPTY_ANALYSIS;
  if (kind === 'local')
    return tracking === 'tracked'
      ? trackedFinding(LOCAL_LABEL)
      : unknownTrackingLead(LOCAL_LABEL);
  if (text === null) return unreadLead('secret');
  if (!holdsSecret(text))
    return tracking === 'tracked'
      ? advisoryOf(TRACKED_DEFAULTS)
      : EMPTY_ANALYSIS;

  return tracking === 'tracked'
    ? findingOf(TRACKED_LEAK)
    : unknownTrackingLead(LEAK_LABEL);
};
