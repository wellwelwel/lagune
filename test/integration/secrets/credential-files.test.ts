import type {
  CredentialContentCase,
  CredentialOutcome,
} from '../../../src/types/test.js';
import { chmod } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import {
  credentialFileAnalysis,
  credentialFileOf,
} from '../../../src/hooks/secrets/credential-files.js';
import { scanSecrets } from '../../../src/hooks/secrets/scan.js';
import { hideUserHome, trackedRepository } from '../scan/__utils__.js';
import {
  itWithPermissionBits,
  reported,
  scanWhole,
  sortedDetails,
} from './__utils__.js';

hideUserHome();

const NPM_TOKEN = 'npm_' + 'a1'.repeat(18);
const PYPI_TOKEN = 'pypi-' + 'a1'.repeat(20);
const KUBE_TOKEN = 'k8s-' + 'a1'.repeat(16);
const PEM_KEY = [
  '-----BEGIN ' + 'PRIVATE KEY-----',
  'MIIBfixture',
  '-----END ' + 'PRIVATE KEY-----',
  '',
].join('\n');
const DOTENV_KEY = 'a1'.repeat(32);
const DOTENV_KEYS = [
  '#/ private decryption keys. DO NOT commit to source control /',
  '',
  '# .env',
  `DOTENV_PRIVATE_KEY="${DOTENV_KEY}"`,
  '',
].join('\n');
const PUBLIC_PEM = [
  '-----BEGIN PUBLIC KEY-----',
  'MIIBIjANfixture',
  '-----END PUBLIC KEY-----',
  '',
  '-----BEGIN CERTIFICATE-----',
  'MIIDdzCCfixture',
  '-----END CERTIFICATE-----',
  '',
].join('\n');
const SSH2_PRIVATE_KEY = [
  '---- BEGIN SSH2 ENCRYPTED ' + 'PRIVATE KEY ----',
  'P2/56wAAfixture',
  '---- END SSH2 ENCRYPTED ' + 'PRIVATE KEY ----',
  '',
].join('\n');
const CA_BUNDLE = [
  '##',
  '## Bundle of CA Root Certificates',
  '##',
  '',
  'GlobalSign Root CA',
  '==================',
  '-----BEGIN CERTIFICATE-----',
  'MIIDdTCCfixture',
  '-----END CERTIFICATE-----',
  '',
  '# Issuer: CN=ISRG Root X1 O=Internet Security Research Group',
  '-----BEGIN CERTIFICATE-----',
  'MIIFazCCfixture',
  '-----END CERTIFICATE-----',
  '',
].join('\n');
const PRINTED_PRIVATE_KEY = [
  'Private-Key: (256 bit)',
  'priv:',
  '    7b:3cfixture',
  '-----BEGIN PUBLIC KEY-----',
  'MFkwEwYHfixture',
  '-----END PUBLIC KEY-----',
  '',
].join('\n');
const KEYNOTE_DECK = 'PK\u0003\u0004keynote';
const UNTRACK =
  'stop tracking this file (git rm --cached) and add it to .gitignore';
const IGNORE =
  'add this file to .gitignore, so the next git add cannot commit it';
const TEST_ONLY =
  'if it is made only for tests, leave its path out in .lagune/configs.json, otherwise';
const UNRECOGNIZED =
  'in a format the checker cannot recognize: check it by hand, and if it is one,';
const KUBECONFIG = [
  'apiVersion: v1',
  'kind: Config',
  'users:',
  '- name: dev',
  '  user:',
  `    token: ${KUBE_TOKEN}`,
  '',
].join('\n');

const CREDENTIAL_FILES: readonly (readonly [
  path: string,
  content: string,
  label: string,
])[] = [
  ['id_rsa', 'fixture\n', 'private key'],
  ['keys/id_ed25519', 'fixture\n', 'private key'],
  ['server.key', PEM_KEY, 'private key'],
  ['cert.pem', PEM_KEY, 'private key'],
  ['bundle.p12', 'fixture\n', 'keystore'],
  ['identity.pfx', 'fixture\n', 'keystore'],
  ['release.jks', 'fixture\n', 'keystore'],
  ['upload.keystore', 'fixture\n', 'keystore'],
  ['credentials.json', '{}\n', 'cloud or service account credentials'],
  ['gcp/service-account.json', '{}\n', 'cloud or service account credentials'],
  ['.aws/credentials', 'fixture\n', 'cloud or service account credentials'],
  ['infra/terraform.tfstate', '{}\n', 'Terraform state'],
  ['infra/terraform.tfstate.backup', '{}\n', 'Terraform state'],
  [
    '.npmrc',
    `//registry.npmjs.org/:_authToken=${NPM_TOKEN}\n`,
    'package registry auth token',
  ],
  [
    '.pypirc',
    `[pypi]\nusername = __token__\npassword = ${PYPI_TOKEN}\n`,
    'package registry auth token',
  ],
  ['kubeconfig.yaml', KUBECONFIG, 'kubeconfig credentials'],
  ['.kube/config', KUBECONFIG, 'kubeconfig credentials'],
  ['.env.keys', DOTENV_KEYS, 'dotenvx private decryption keys'],
];

const filesUnder = (folder: string): Record<string, string> =>
  Object.fromEntries(
    CREDENTIAL_FILES.map(([path, content]) => [`${folder}/${path}`, content])
  );

await describe('the secrets checker reports the credential files Git tracks', async () => {
  await it('reports each one Git tracks, warns about each one Git would commit, and stays silent on the ones Git ignores', async () => {
    const workspace = await trackedRepository(
      ['init', '--quiet'],
      {
        '.gitignore': 'ignored/\n',
        ...filesUnder('tracked'),
        ...filesUnder('ignored'),
        ...filesUnder('untracked'),
      },
      ['tracked']
    );

    const report = await scanWhole(workspace);

    strict.deepStrictEqual(reported(report), {
      findings: sortedDetails(
        CREDENTIAL_FILES.map(([path, , label]) => ({
          file: join('tracked', path),
          detail: `${label} tracked by Git: ${UNTRACK}`,
        }))
      ),
      review: [],
      advisory: sortedDetails(
        CREDENTIAL_FILES.map(([path, , label]) => ({
          file: join('untracked', path),
          detail: `${label} that Git does not ignore: ${IGNORE}`,
        }))
      ),
    });
  });

  await it('stays silent on a tracked file whose content holds no secret', async () => {
    const workspace = await trackedRepository(
      ['init', '--quiet'],
      {
        'cert.pem':
          '-----BEGIN CERTIFICATE-----\nMIIBfixture\n-----END CERTIFICATE-----\n',
        '.npmrc':
          'registry=https://registry.npmjs.org/\n//registry.npmjs.org/:_authToken=${NPM_TOKEN}\nignore-scripts=true\n',
        '.pypirc': '[pypi]\nusername = __token__\n',
        kubeconfig:
          'users:\n- name: dev\n  user:\n    token: ""\n    exec:\n      command: aws\n',
        'docs/talk.key': KEYNOTE_DECK,
        'certs/server.key': PUBLIC_PEM,
      },
      ['.']
    );

    const report = await scanWhole(workspace);

    strict.deepStrictEqual(reported(report), {
      findings: [],
      review: [],
      advisory: [],
    });
  });

  await it('leaves out a tracked one the configs ignore, and one outside the named targets', async () => {
    const workspace = await trackedRepository(
      ['init', '--quiet'],
      {
        id_rsa: 'fixture\n',
        'src/id_ed25519': 'fixture\n',
        'src/fixtures/test.key': 'fixture\n',
        '.lagune/configs.json': JSON.stringify({
          checkers: { secrets: { ignore: ['src/fixtures'] } },
        }),
      },
      ['.']
    );

    const report = await scanSecrets(workspace, [join(workspace, 'src')]);

    strict.deepStrictEqual(reported(report), {
      findings: [
        {
          file: join('src', 'id_ed25519'),
          detail: `private key tracked by Git: ${UNTRACK}`,
        },
      ],
      review: [],
      advisory: [],
    });
  });

  await itWithPermissionBits(
    'leads a tracked file it cannot read to a manual check, never to silence',
    async () => {
      const workspace = await trackedRepository(
        ['init', '--quiet'],
        { '.npmrc': `//registry.npmjs.org/:_authToken=${NPM_TOKEN}\n` },
        ['.npmrc']
      );

      await chmod(join(workspace, '.npmrc'), 0o000);

      const report = await scanWhole(workspace);

      strict.deepStrictEqual(reported(report), {
        findings: [],
        review: [
          {
            file: '.npmrc',
            detail:
              'possible package registry auth token in a file that could not be read: check it by hand',
          },
        ],
        advisory: [],
      });
    }
  );
});

await describe('the secrets checker leads a credential it cannot confirm to a manual check, never to a finding', async () => {
  await it('leads each credential file in a test folder Git tracks or would commit, and stays silent on the ones Git ignores', async () => {
    const workspace = await trackedRepository(
      ['init', '--quiet'],
      {
        '.gitignore': 'test/local/\n',
        'test/fixtures/credentials.json': '{}\n',
        'internal/tls/testdata/id_rsa': 'fixture\n',
        'Specs/infra/terraform.tfstate': '{}\n',
        'latest/id_rsa': 'fixture\n',
        'tests/id_ed25519': 'fixture\n',
        'test/local/id_rsa': 'fixture\n',
      },
      ['test/fixtures', 'internal', 'Specs', 'latest']
    );

    const report = await scanWhole(workspace);

    strict.deepStrictEqual(reported(report), {
      findings: [
        {
          file: join('latest', 'id_rsa'),
          detail: `private key tracked by Git: ${UNTRACK}`,
        },
      ],
      review: sortedDetails([
        {
          file: join('test', 'fixtures', 'credentials.json'),
          detail: `cloud or service account credentials tracked by Git, in a test folder: ${TEST_ONLY} ${UNTRACK}`,
        },
        {
          file: join('internal', 'tls', 'testdata', 'id_rsa'),
          detail: `private key tracked by Git, in a test folder: ${TEST_ONLY} ${UNTRACK}`,
        },
        {
          file: join('Specs', 'infra', 'terraform.tfstate'),
          detail: `Terraform state tracked by Git, in a test folder: ${TEST_ONLY} ${UNTRACK}`,
        },
        {
          file: join('tests', 'id_ed25519'),
          detail: `private key that Git does not ignore, in a test folder: ${TEST_ONLY} ${IGNORE}`,
        },
      ]),
      advisory: [],
    });
  });

  await it('leads each .key or .pem file whose content it cannot recognize', async () => {
    const workspace = await trackedRepository(
      ['init', '--quiet'],
      {
        'keys/license.key': 'fixture\n',
        'keys/vendor.key': 'fixture\n',
        'keys/legacy.pem': SSH2_PRIVATE_KEY,
      },
      ['keys/license.key', 'keys/legacy.pem']
    );

    const report = await scanWhole(workspace);

    strict.deepStrictEqual(reported(report), {
      findings: [],
      review: sortedDetails([
        {
          file: join('keys', 'license.key'),
          detail: `possible private key tracked by Git, ${UNRECOGNIZED} ${UNTRACK}`,
        },
        {
          file: join('keys', 'legacy.pem'),
          detail: `possible private key tracked by Git, ${UNRECOGNIZED} ${UNTRACK}`,
        },
        {
          file: join('keys', 'vendor.key'),
          detail: `possible private key that Git does not ignore, ${UNRECOGNIZED} ${IGNORE}`,
        },
      ]),
      advisory: [],
    });
  });
});

describe('the content of a key file, registry config, kubeconfig, or dotenvx keys file decides what a tracked one reports', () => {
  const sectionCounts: Record<
    CredentialOutcome,
    readonly [findings: number, review: number, advisory: number]
  > = { reports: [1, 0, 0], leads: [0, 1, 0], passes: [0, 0, 0] };
  const keyContents: [
    name: string,
    content: string,
    expected: CredentialOutcome,
  ][] = [
    ['a PEM private key', PEM_KEY, 'reports'],
    ['a certificate and its private key', `${PUBLIC_PEM}${PEM_KEY}`, 'reports'],
    ['only a public key and a certificate', PUBLIC_PEM, 'passes'],
    [
      'an RSA public key written with Windows line endings',
      '-----BEGIN RSA PUBLIC KEY-----\r\nMIIBCgfixture\r\n-----END RSA PUBLIC KEY-----\r\n',
      'passes',
    ],
    ['a CA bundle that names each certificate', CA_BUNDLE, 'passes'],
    ['content in a format the checker cannot recognize', 'fixture\n', 'leads'],
    ['an SSH2 encrypted private key', SSH2_PRIVATE_KEY, 'leads'],
    [
      'an unrecognized block after a public one',
      `${PUBLIC_PEM}${SSH2_PRIVATE_KEY}`,
      'leads',
    ],
    [
      'a public block that never ends',
      '-----BEGIN PUBLIC KEY-----\nMIIBIjANfixture\n',
      'leads',
    ],
    [
      'a private key printed as text beside its public block',
      PRINTED_PRIVATE_KEY,
      'leads',
    ],
  ];
  const cases: CredentialContentCase[] = [
    ...keyContents.flatMap(
      ([name, content, expected]): CredentialContentCase[] =>
        ['.key', '.pem'].map((extension) => [
          `a ${extension} file holding ${name}`,
          `server${extension}`,
          content,
          expected,
        ])
    ),
    ['a Keynote deck', 'talk.key', KEYNOTE_DECK, 'passes'],
    [
      'an npm token set with spaces and quotes',
      '.npmrc',
      `//npm.pkg.github.com/:_authToken = "${NPM_TOKEN}"\n`,
      'reports',
    ],
    ['an npm basic auth', '.npmrc', `_auth=${NPM_TOKEN}\n`, 'reports'],
    [
      'an npm token read from the environment',
      '.npmrc',
      '//registry.npmjs.org/:_authToken=${NPM_TOKEN}\n',
      'passes',
    ],
    [
      'an npm token commented out',
      '.npmrc',
      `# //registry.npmjs.org/:_authToken=${NPM_TOKEN}\n`,
      'passes',
    ],
    [
      'a PyPI password after a colon',
      '.pypirc',
      `[pypi]\npassword: ${PYPI_TOKEN}\n`,
      'reports',
    ],
    [
      'a PyPI password left as a placeholder',
      '.pypirc',
      '[pypi]\npassword = <your token>\n',
      'passes',
    ],
    [
      'a kubeconfig client key',
      'kubeconfig',
      'users:\n- name: dev\n  user:\n    client-key-data: LS0tfixture\n',
      'reports',
    ],
    [
      'a kubeconfig written as JSON',
      'prod.kubeconfig',
      `{"users": [{"name": "dev", "user": {\n"token": "${KUBE_TOKEN}",\n}}]}\n`,
      'reports',
    ],
    [
      'a kubeconfig pointing at a key file',
      'kubeconfig',
      'users:\n- name: dev\n  user:\n    client-key: /home/dev/.kube/dev.key\n    tokenFile: /var/run/token\n',
      'passes',
    ],
    [
      'a dotenvx private key for one environment, exported',
      '.env.keys',
      `export DOTENV_PRIVATE_KEY_PRODUCTION=${DOTENV_KEY}\n`,
      'reports',
    ],
    [
      'a dotenvx private key left empty',
      '.env.keys',
      'DOTENV_PRIVATE_KEY=""\n',
      'passes',
    ],
    [
      'a dotenvx private key commented out',
      '.env.keys',
      `# DOTENV_PRIVATE_KEY=${DOTENV_KEY}\n`,
      'passes',
    ],
    [
      'a dotenvx public key',
      '.env.keys',
      `DOTENV_PUBLIC_KEY="${DOTENV_KEY}"\n`,
      'passes',
    ],
  ];

  for (const [name, path, content, expected] of cases)
    it(`${expected} ${name}`, () => {
      const file = credentialFileOf(path);
      const analysis =
        file === null
          ? null
          : credentialFileAnalysis(path, file, content, 'tracked');

      strict.deepStrictEqual(
        analysis && [
          analysis.findings.length,
          analysis.review.length,
          analysis.advisory.length,
        ],
        sectionCounts[expected]
      );
    });
});

describe('a name that only resembles a credential file is never one', () => {
  const names = [
    'android/app/debug.keystore',
    'truststore.jks',
    'client-truststore.p12',
    'id_rsa.pub',
    'kubeconfig.go',
    'kubeconfig.ts',
    'main.tf',
    'credentials.ts',
    'service-account.yaml',
    'aws/credentials',
    'config',
  ];

  for (const name of names)
    it(`passes ${name}`, () => {
      strict.strictEqual(credentialFileOf(name), null);
    });
});
