import type { GitTracking } from '../../types/git.js';
import type {
  CommittableTracking,
  ConfigEntry,
  ContentVerdict,
  CredentialFile,
  CredentialVerdict,
} from '../../types/hooks/secrets.js';
import type { FileAnalysis } from '../../types/scan.js';
import { basename, dirname, sep } from 'node:path';
import { deepFreeze } from '../../core/collections.js';
import { EMPTY_ANALYSIS } from '../../core/scan/scope.js';
import { isPlaceholder, PRIVATE_KEY_BLOCK } from './patterns.js';
import {
  exposureOf,
  PLACES,
  REMEDIES,
  reviewOf,
  unreadLead,
} from './verdicts.js';

const SSH_KEY = /^id_(?:rsa|dsa|ecdsa|ed25519)(?:_sk)?$/;
const KEYSTORE = /\.(?:p12|pfx|jks|keystore)$/;
const CREDENTIALS_JSON = /(?:^|[-_.])credentials\.json$/;
const SERVICE_ACCOUNT = /^service[-_]?account/;
const TERRAFORM_STATE = /\.tfstate(?:\.(?:\d{1,20}\.)?backup)?$/;
const KUBECONFIG_YAML = /^kubeconfig(?:[-_.][\w.-]{0,200})?\.ya?ml$/;
const DOTENV_PRIVATE_KEY =
  /^(?:export[ \t]{1,16})?DOTENV_PRIVATE_KEY(?:_[\w.-]{1,64})?$/i;
const LIST_ITEM = /^-[ \t]+/;
const TRAILING_COMMA = /,$/;
const EQUALS = /=/;
const PYPIRC_SEPARATOR = /[=:]/;
const YAML_SEPARATOR = /:/;
const PEM_BOUNDARY = /^-----(BEGIN|END) ([A-Z0-9 ]{1,64})-----$/;

const ZIP_SIGNATURE = 'PK\u0003\u0004';
const DEBUG_KEYSTORE = 'debug.keystore';

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

const TEST_FOLDERS: ReadonlySet<string> = new Set([
  'test',
  'tests',
  'testdata',
  'fixture',
  'fixtures',
  'spec',
  'specs',
]);

/** The labels RFC 7468, OpenSSL, and OpenPGP give to blocks that hold only public material */
const PUBLIC_PEM_LABELS: ReadonlySet<string> = new Set([
  'CERTIFICATE',
  'TRUSTED CERTIFICATE',
  'ATTRIBUTE CERTIFICATE',
  'X509 CRL',
  'CERTIFICATE REQUEST',
  'NEW CERTIFICATE REQUEST',
  'PKCS7',
  'CMS',
  'PUBLIC KEY',
  'RSA PUBLIC KEY',
  'DH PARAMETERS',
  'EC PARAMETERS',
  'PGP PUBLIC KEY BLOCK',
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

/** The key and value a line of an INI, YAML, JSON, or dotenv config sets, split at its first separator */
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

const confirmedBy =
  (holdsSecret: (text: string) => boolean) =>
  (text: string): ContentVerdict =>
    holdsSecret(text) ? 'credential' : 'clean';

const isNpmSecretKey = (key: string): boolean =>
  NPM_SECRET_KEYS.some((name) => key === name || key.endsWith(`:${name}`));

const holdsPrivateKey = (text: string): boolean => PRIVATE_KEY_BLOCK.test(text);

/** RFC 7468 lets a tool write explanatory text around a block, such as the name a CA bundle prints above each certificate */
const isExplanatoryText = (line: string): boolean =>
  !line.startsWith('-') && !line.toLowerCase().includes('private');

/** Whether the text holds at least one PEM block, every one public, and nothing outside them but explanatory text */
const holdsOnlyPublicBlocks = (text: string): boolean => {
  let open: string | null = null;
  let blocks = 0;

  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    const boundary = PEM_BOUNDARY.exec(trimmed);

    if (open !== null) {
      if (boundary !== null && boundary[1] === 'END' && boundary[2] === open) {
        open = null;
        blocks++;
      }

      continue;
    }

    if (boundary === null && isExplanatoryText(trimmed)) continue;
    if (boundary === null || boundary[1] !== 'BEGIN') return false;
    if (!PUBLIC_PEM_LABELS.has(boundary[2])) return false;

    open = boundary[2];
  }

  return open === null && blocks > 0;
};

const pemFileContent = (text: string): ContentVerdict => {
  if (holdsPrivateKey(text)) return 'credential';

  return holdsOnlyPublicBlocks(text) ? 'clean' : 'unconfirmed';
};

/** Keynote saves its decks as zip archives under the same .key extension */
const keyFileContent = (text: string): ContentVerdict =>
  text.startsWith(ZIP_SIGNATURE) ? 'clean' : pemFileContent(text);

/** Android's debug keystore uses a known password, and a truststore holds only public certificates */
const isSecretKeystore = (name: string): boolean =>
  KEYSTORE.test(name) && name !== DEBUG_KEYSTORE && !name.includes('trust');

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
  {
    label: 'private key',
    matches: (name) => SSH_KEY.test(name),
    judgeContent: null,
  },
  {
    label: 'private key',
    matches: (name) => name.endsWith('.key'),
    judgeContent: keyFileContent,
  },
  {
    label: 'private key',
    matches: (name) => name.endsWith('.pem'),
    judgeContent: pemFileContent,
  },
  { label: 'keystore', matches: isSecretKeystore, judgeContent: null },
  {
    label: 'cloud or service account credentials',
    matches: isCloudCredentials,
    judgeContent: null,
  },
  {
    label: 'Terraform state',
    matches: (name) => TERRAFORM_STATE.test(name),
    judgeContent: null,
  },
  {
    label: 'package registry auth token',
    matches: (name) => name === '.npmrc',
    judgeContent: confirmedBy((text) =>
      setsSecret(text, EQUALS, isNpmSecretKey)
    ),
  },
  {
    label: 'package registry auth token',
    matches: (name) => name === '.pypirc',
    judgeContent: confirmedBy((text) =>
      setsSecret(
        text,
        PYPIRC_SEPARATOR,
        (key) => key.toLowerCase() === 'password'
      )
    ),
  },
  {
    label: 'kubeconfig credentials',
    matches: isKubeconfig,
    judgeContent: confirmedBy((text) =>
      setsSecret(text, YAML_SEPARATOR, (key) => KUBE_SECRET_KEYS.has(key))
    ),
  },
  {
    label: 'dotenvx private decryption keys',
    matches: (name) => name === '.env.keys',
    judgeContent: confirmedBy((text) =>
      setsSecret(text, EQUALS, (key) => DOTENV_PRIVATE_KEY.test(key))
    ),
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
  file !== null && file.judgeContent !== null;

const verdictOf = (
  { judgeContent }: CredentialFile,
  text: string | null
): CredentialVerdict => {
  if (judgeContent === null) return 'credential';
  if (text === null) return 'unread';

  return judgeContent(text);
};

const isInTestFolder = (relativePath: string): boolean =>
  dirname(relativePath)
    .toLowerCase()
    .split(sep)
    .some((folder) => TEST_FOLDERS.has(folder));

const testFolderLead = (
  label: string,
  tracking: CommittableTracking
): FileAnalysis =>
  reviewOf(
    `${label} ${PLACES[tracking]}, in a test folder: if it is made only for tests, leave its path out in .lagune/configs.json, otherwise ${REMEDIES[tracking]}`
  );

const unconfirmedLead = (
  label: string,
  tracking: CommittableTracking
): FileAnalysis =>
  reviewOf(
    `possible ${label} ${PLACES[tracking]}, in a format the checker cannot recognize: check it by hand, and if it is one, ${REMEDIES[tracking]}`
  );

const weighed = (
  relativePath: string,
  label: string,
  verdict: Exclude<ContentVerdict, 'clean'>,
  tracking: CommittableTracking
): FileAnalysis => {
  if (isInTestFolder(relativePath)) return testFolderLead(label, tracking);
  if (verdict === 'unconfirmed') return unconfirmedLead(label, tracking);

  return exposureOf(label, tracking);
};

/** A credential file Git tracks is a finding and one Git would commit an advisory. One in a test folder, one whose content the checker cannot recognize, and one it cannot read are leads, and one Git ignores or whose content holds no credential stays silent */
export const credentialFileAnalysis = (
  relativePath: string,
  file: CredentialFile,
  text: string | null,
  tracking: GitTracking
): FileAnalysis => {
  if (tracking === 'ignored') return EMPTY_ANALYSIS;

  const verdict = verdictOf(file, text);

  if (verdict === 'clean') return EMPTY_ANALYSIS;
  if (verdict === 'unread') return unreadLead(file.label);

  return weighed(relativePath, file.label, verdict, tracking);
};
