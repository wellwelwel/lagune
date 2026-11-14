import type { GitTracking } from '../../types/git.js';
import type {
  ConfigEntry,
  CredentialFile,
  CredentialVerdict,
} from '../../types/hooks/secrets.js';
import type { FileAnalysis } from '../../types/scan.js';
import { basename, dirname } from 'node:path';
import { deepFreeze } from '../../core/collections.js';
import { EMPTY_ANALYSIS } from '../../core/scan/scope.js';
import { isPlaceholder, PRIVATE_KEY_BLOCK } from './patterns.js';
import { unreadLead, verdictsFor } from './verdicts.js';

const SSH_KEY = /^id_(?:rsa|dsa|ecdsa|ed25519)(?:_sk)?$/;
const KEYSTORE = /\.(?:p12|pfx|jks|keystore)$/;
const CREDENTIALS_JSON = /(?:^|[-_.])credentials\.json$/;
const SERVICE_ACCOUNT = /^service[-_]?account/;
const TERRAFORM_STATE = /\.tfstate(?:\.(?:\d{1,20}\.)?backup)?$/;
const KUBECONFIG_YAML = /^kubeconfig(?:[-_.][\w.-]{0,200})?\.ya?ml$/;
const LIST_ITEM = /^-[ \t]+/;
const TRAILING_COMMA = /,$/;
const NPMRC_SEPARATOR = /=/;
const PYPIRC_SEPARATOR = /[=:]/;
const YAML_SEPARATOR = /:/;

const NPM_SECRET_KEYS: readonly string[] = deepFreeze([
  '_authToken',
  '_auth',
  '_password',
]);

const KUBE_SECRET_KEYS: ReadonlySet<string> = new Set([
  'token',
  'password',
  'client-key-data',
  'client-secret',
  'id-token',
  'refresh-token',
  'access-token',
]);

const unquoted = (text: string): string => {
  const quote = text[0];

  return text.length >= 2 &&
    (quote === '"' || quote === "'") &&
    text.endsWith(quote)
    ? text.slice(1, -1)
    : text;
};

const isComment = (text: string): boolean =>
  text.startsWith('#') || text.startsWith(';');

/** The key and value a line of an INI, YAML, or JSON config sets, split at its first separator */
const entryOf = (line: string, separator: RegExp): ConfigEntry | null => {
  const text = line.trim().replace(LIST_ITEM, '');

  if (isComment(text)) return null;

  const at = text.search(separator);

  if (at <= 0) return null;

  const value = text
    .slice(at + 1)
    .trim()
    .replace(TRAILING_COMMA, '');

  return [unquoted(text.slice(0, at).trim()), unquoted(value)];
};

const isSet = (value: string): boolean =>
  value !== '' && value !== '~' && !isPlaceholder(value);

const setsSecret = (
  text: string,
  separator: RegExp,
  isSecretKey: (key: string) => boolean
): boolean =>
  text.split('\n').some((line) => {
    const entry = entryOf(line, separator);

    if (entry === null) return false;

    const [key, value] = entry;

    return isSecretKey(key) && isSet(value);
  });

const isNpmSecretKey = (key: string): boolean =>
  NPM_SECRET_KEYS.some((name) => key === name || key.endsWith(`:${name}`));

const isPrivateKey = (name: string): boolean =>
  SSH_KEY.test(name) || name.endsWith('.key');

const isCloudCredentials = (name: string, folder: string): boolean =>
  CREDENTIALS_JSON.test(name) ||
  (SERVICE_ACCOUNT.test(name) && name.endsWith('.json')) ||
  (folder === '.aws' && name === 'credentials');

const isKubeconfig = (name: string, folder: string): boolean =>
  name === 'kubeconfig' ||
  name.endsWith('.kubeconfig') ||
  KUBECONFIG_YAML.test(name) ||
  (folder === '.kube' && name === 'config');

const CREDENTIAL_FILES: readonly CredentialFile[] = deepFreeze([
  { label: 'private key', matches: isPrivateKey, holdsSecret: null },
  {
    label: 'private key',
    matches: (name) => name.endsWith('.pem'),
    holdsSecret: (text) => PRIVATE_KEY_BLOCK.test(text),
  },
  {
    label: 'keystore',
    matches: (name) => KEYSTORE.test(name),
    holdsSecret: null,
  },
  {
    label: 'cloud or service account credentials',
    matches: isCloudCredentials,
    holdsSecret: null,
  },
  {
    label: 'Terraform state',
    matches: (name) => TERRAFORM_STATE.test(name),
    holdsSecret: null,
  },
  {
    label: 'package registry auth token',
    matches: (name) => name === '.npmrc',
    holdsSecret: (text) => setsSecret(text, NPMRC_SEPARATOR, isNpmSecretKey),
  },
  {
    label: 'package registry auth token',
    matches: (name) => name === '.pypirc',
    holdsSecret: (text) =>
      setsSecret(
        text,
        PYPIRC_SEPARATOR,
        (key) => key.toLowerCase() === 'password'
      ),
  },
  {
    label: 'kubeconfig credentials',
    matches: isKubeconfig,
    holdsSecret: (text) =>
      setsSecret(text, YAML_SEPARATOR, (key) => KUBE_SECRET_KEYS.has(key)),
  },
]);

/** The kind of credential file a path names, matched on its name and the folder holding it, or none */
export const credentialFileOf = (
  relativePath: string
): CredentialFile | null => {
  const name = basename(relativePath).toLowerCase();
  const folder = basename(dirname(relativePath)).toLowerCase();

  return CREDENTIAL_FILES.find((file) => file.matches(name, folder)) ?? null;
};

export const readsCredentialContent = (file: CredentialFile | null): boolean =>
  file !== null && file.holdsSecret !== null;

const verdictOf = (
  { holdsSecret }: CredentialFile,
  text: string | null
): CredentialVerdict => {
  if (holdsSecret === null) return 'credential';
  if (text === null) return 'unread';

  return holdsSecret(text) ? 'credential' : 'clean';
};

/** A credential file Git tracks is a finding, one Git would commit is an advisory, one whose content or Git status cannot be read is a lead, and one Git ignores stays silent */
export const credentialFileAnalysis = (
  file: CredentialFile,
  text: string | null,
  tracking: GitTracking
): FileAnalysis => {
  if (tracking === 'ignored') return EMPTY_ANALYSIS;

  const verdict = verdictOf(file, text);

  if (verdict === 'clean') return EMPTY_ANALYSIS;
  if (verdict === 'unread') return unreadLead(file.label);

  return verdictsFor(file.label)[tracking];
};
