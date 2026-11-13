import { chmod, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import {
  credentialFileAnalysis,
  credentialFileOf,
} from '../../../src/hooks/secrets/credential-files.js';
import { scanSecrets } from '../../../src/hooks/secrets/scan.js';
import {
  hideUserHome,
  newWorkspace,
  trackedRepository,
  writeFiles,
} from '../scan/__utils__.js';
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
const PEM_VALUE = 'private key block (PEM) committed in source';
const UNTRACK = 'stop tracking it (git rm --cached) and add it to .gitignore';
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
  ['server.key', 'fixture\n', 'private key'],
  ['cert.pem', PEM_KEY, 'private key'],
  ['bundle.p12', 'fixture\n', 'keystore'],
  ['identity.pfx', 'fixture\n', 'keystore'],
  ['release.jks', 'fixture\n', 'keystore'],
  ['debug.keystore', 'fixture\n', 'keystore'],
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
];

const filesUnder = (folder: string): Record<string, string> =>
  Object.fromEntries(
    CREDENTIAL_FILES.map(([path, content]) => [`${folder}/${path}`, content])
  );

await describe('the secrets checker reports the credential files Git tracks', async () => {
  await it('reports each one Git tracks, and none of the same files Git ignores or does not track', async () => {
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
      findings: sortedDetails([
        ...CREDENTIAL_FILES.map(([path, , label]) => ({
          file: join('tracked', path),
          detail: `${label} tracked by Git: ${UNTRACK}`,
        })),
        { file: join('tracked', 'cert.pem'), detail: PEM_VALUE },
        { file: join('untracked', 'cert.pem'), detail: PEM_VALUE },
      ]),
      review: [],
      advisory: [],
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
        'src/server.key': 'fixture\n',
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
          file: join('src', 'server.key'),
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

await describe('without a readable Git index, the secrets checker lists the credential files present', async () => {
  const files = { id_rsa: 'fixture\n', 'app.js': 'export const x = 1;\n' };
  const cases: [name: string, prepare: () => Promise<string>][] = [
    [
      'outside a Git repository',
      async () => {
        const workspace = await newWorkspace();

        await writeFiles(workspace, files);

        return workspace;
      },
    ],
    [
      'when .git is a file pointing elsewhere',
      async () => {
        const workspace = await newWorkspace();

        await writeFiles(workspace, { ...files, '.git': 'gitdir: ../other\n' });

        return workspace;
      },
    ],
    [
      'when the index is not one it can read',
      async () => {
        const workspace = await newWorkspace();

        await mkdir(join(workspace, '.git'));
        await writeFile(join(workspace, '.git', 'index'), 'DIRC not an index');
        await writeFiles(workspace, files);

        return workspace;
      },
    ],
  ];

  for (const [name, prepare] of cases)
    await it(name, async () => {
      const workspace = await prepare();

      const report = await scanWhole(workspace);

      strict.deepStrictEqual(reported(report), {
        findings: [],
        review: [
          {
            file: 'id_rsa',
            detail:
              'private key with no readable Git index to tell whether Git tracks it: confirm it is not committed',
          },
        ],
        advisory: [],
      });
    });
});

describe('the content of a registry config or kubeconfig decides whether it holds a credential', () => {
  const cases: [name: string, path: string, content: string, holds: boolean][] =
    [
      [
        'an npm token set with spaces and quotes',
        '.npmrc',
        `//npm.pkg.github.com/:_authToken = "${NPM_TOKEN}"\n`,
        true,
      ],
      ['an npm basic auth', '.npmrc', `_auth=${NPM_TOKEN}\n`, true],
      [
        'an npm token read from the environment',
        '.npmrc',
        '//registry.npmjs.org/:_authToken=${NPM_TOKEN}\n',
        false,
      ],
      [
        'an npm token commented out',
        '.npmrc',
        `# //registry.npmjs.org/:_authToken=${NPM_TOKEN}\n`,
        false,
      ],
      [
        'a PyPI password after a colon',
        '.pypirc',
        `[pypi]\npassword: ${PYPI_TOKEN}\n`,
        true,
      ],
      [
        'a PyPI password left as a placeholder',
        '.pypirc',
        '[pypi]\npassword = <your token>\n',
        false,
      ],
      [
        'a kubeconfig client key',
        'kubeconfig',
        'users:\n- name: dev\n  user:\n    client-key-data: LS0tfixture\n',
        true,
      ],
      [
        'a kubeconfig written as JSON',
        'prod.kubeconfig',
        `{"users": [{"name": "dev", "user": {\n"token": "${KUBE_TOKEN}",\n}}]}\n`,
        true,
      ],
      [
        'a kubeconfig pointing at a key file',
        'kubeconfig',
        'users:\n- name: dev\n  user:\n    client-key: /home/dev/.kube/dev.key\n    tokenFile: /var/run/token\n',
        false,
      ],
    ];

  for (const [name, path, content, holds] of cases)
    it(`${holds ? 'reports' : 'passes'} ${name}`, () => {
      const file = credentialFileOf(path);
      const findings =
        file === null
          ? null
          : credentialFileAnalysis(file, content, 'tracked').findings;

      strict.strictEqual(findings?.length, holds ? 1 : 0);
    });
});

describe('a name that only resembles a credential file is never one', () => {
  const names = [
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
