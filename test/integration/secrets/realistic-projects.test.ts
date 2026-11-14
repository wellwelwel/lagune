import type { ScanDetail, ScanReport } from '../../../src/types/scan.js';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import {
  hideUserHome,
  newWorkspace,
  trackedRepository,
  writeFiles,
} from '../scan/__utils__.js';
import { scanWhole } from './__utils__.js';

hideUserHome();

/** Assembled from parts: no secret scanner may find a whole token in the repository */
const STRIPE_KEY = 'sk_live_' + 'a1'.repeat(12);
const NPM_TOKEN = 'npm_' + 'a1'.repeat(18);
const REMOTE_DATABASE =
  'postgres://admin:S3cr3tP4ss99' + '@db.prod.internal/app';
const PEM_KEY = [
  '-----BEGIN ' + 'PRIVATE KEY-----',
  'MIIEvQfixture',
  '-----END ' + 'PRIVATE KEY-----',
  '',
].join('\n');
const PUBLIC_PEM = [
  '-----BEGIN PUBLIC KEY-----',
  'MIIBIjANfixture',
  '-----END PUBLIC KEY-----',
  '-----BEGIN CERTIFICATE-----',
  'MIIDdzCCfixture',
  '-----END CERTIFICATE-----',
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
  'ISRG Root X1',
  '============',
  '-----BEGIN CERTIFICATE-----',
  'MIIFazCCfixture',
  '-----END CERTIFICATE-----',
  '',
].join('\n');
const DOTENVX = [
  '#/-------------------[DOTENV_PUBLIC_KEY]--------------------/',
  `DOTENV_PUBLIC_KEY="03${'f8'.repeat(32)}"`,
  'DATABASE_PASSWORD="encrypted:BNr24F4vW9CQ37LOXeRgOL6QlwtJfAoAVXtSdSfpicPDHtqo"',
  'STRIPE_SECRET_KEY="encrypted:BD9paBaun2284WcqdFQZUlDKapPiuE/ruoLY7rINtQPXKWcfqI"',
  '',
].join('\n');
const SILENCE = { findings: [], review: [], advisory: [] };

const repository =
  (tracked: readonly string[]) =>
  (files: Readonly<Record<string, string>>): Promise<string> =>
    trackedRepository(['init', '--quiet'], files, tracked);

const withoutGit = async (
  files: Readonly<Record<string, string>>
): Promise<string> => {
  const workspace = await newWorkspace();

  await writeFiles(workspace, files);

  return workspace;
};

const worktree = (files: Readonly<Record<string, string>>): Promise<string> =>
  withoutGit({ ...files, '.git': 'gitdir: ../main/.git/worktrees/feature\n' });

const filesOf = (details: readonly ScanDetail[]): string[] =>
  details
    .map(({ file }) => file)
    .toSorted((left, right) => left.localeCompare(right));

const tiersOf = ({ findings, review, advisory }: ScanReport) => ({
  findings: filesOf(findings),
  review: filesOf(review),
  advisory: filesOf(advisory),
});

const PROJECTS: [
  name: string,
  files: Readonly<Record<string, string>>,
  prepare: (files: Readonly<Record<string, string>>) => Promise<string>,
  tiers: Record<'findings' | 'review' | 'advisory', readonly string[]>,
][] = [
  [
    'stays silent on the defaults a Next.js project commits',
    {
      '.gitignore': '.env*.local\n',
      '.env':
        'NEXT_PUBLIC_SITE_URL=https://example.org\nAPI_BASE_URL=https://api.example.org\n',
      '.env.development': 'NEXT_PUBLIC_SITE_URL=http://localhost:3000\n',
      '.env.production': 'LOG_LEVEL=warn\n',
    },
    repository(['.']),
    SILENCE,
  ],
  [
    'leads the development passwords of a Docker Compose project, in its environment file and in its source',
    {
      '.env':
        'POSTGRES_USER=postgres\nPOSTGRES_PASSWORD=postgres\nDATABASE_URL=postgres://postgres:postgres@db:5432/app\n',
      'docker-compose.yml': 'services:\n  db:\n    image: postgres:17\n',
      'src/db.ts':
        'export const url = "postgres://postgres:postgres@db:5432/app";\n',
    },
    repository(['.']),
    { findings: [], review: ['.env', join('src', 'db.ts')], advisory: [] },
  ],
  [
    'leads the local database URL Prisma generates',
    {
      '.env':
        '# Environment variables declared in this file are automatically made available to Prisma.\nDATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"\n',
    },
    repository(['.env']),
    { findings: [], review: ['.env'], advisory: [] },
  ],
  [
    'stays silent on dotenvx ciphertext whose key file Git ignores',
    {
      '.gitignore': '.env.keys\n',
      '.env': DOTENVX,
      '.env.keys': `DOTENV_PRIVATE_KEY="${'a1'.repeat(32)}"\n`,
    },
    repository(['.gitignore', '.env']),
    SILENCE,
  ],
  [
    'stays silent on the debug keystore and truststore of a React Native app',
    {
      'android/app/debug.keystore': 'fixture\n',
      'android/app/src/main/res/raw/truststore.jks': 'fixture\n',
    },
    repository(['android']),
    SILENCE,
  ],
  [
    'leads each key in Go testdata and test fixtures once, without failing',
    {
      'internal/tls/testdata/server.key': PEM_KEY,
      'test/fixtures/keys/agent1.key': PEM_KEY,
      'test/fixtures/credentials.json': '{"client_id":"fake"}\n',
    },
    repository(['.']),
    {
      findings: [],
      review: [
        join('internal', 'tls', 'testdata', 'server.key'),
        join('test', 'fixtures', 'credentials.json'),
        join('test', 'fixtures', 'keys', 'agent1.key'),
      ],
      advisory: [],
    },
  ],
  [
    'stays silent on a Keynote deck',
    { 'docs/talk.key': 'PK\u0003\u0004keynote' },
    repository(['docs']),
    SILENCE,
  ],
  [
    'stays silent on a public key and certificate saved as .key',
    { 'certs/server.key': PUBLIC_PEM },
    repository(['certs']),
    SILENCE,
  ],
  [
    'stays silent on a vendored CA bundle that names each certificate',
    { 'lib/certs/cacert.pem': CA_BUNDLE },
    repository(['lib']),
    SILENCE,
  ],
  [
    'advises on a tracked .env.local that sets only public values',
    { '.env.local': 'NEXT_PUBLIC_SITE_URL=http://localhost:3000\n' },
    repository(['.env.local']),
    { findings: [], review: [], advisory: ['.env.local'] },
  ],
  [
    'stays silent on token counts named like a token',
    { '.env': 'OPENAI_MAX_TOKEN=4096\nLLM_MAX_TOKEN="4096"\n' },
    repository(['.env']),
    SILENCE,
  ],
  [
    'stays silent on an .npmrc that reads its token from the environment',
    {
      '.npmrc':
        '//registry.npmjs.org/:_authToken=${NPM_TOKEN}\nalways-auth=true\n',
    },
    repository(['.npmrc']),
    SILENCE,
  ],
  [
    'advises on a private key Git would commit, without failing',
    { '.gitignore': 'node_modules/\n', id_ed25519: PEM_KEY },
    repository(['.gitignore']),
    { findings: [], review: [], advisory: ['id_ed25519'] },
  ],
  [
    'stays silent on a folder without .git that sets only public values',
    {
      '.env.local': 'NEXT_PUBLIC_SITE_URL=http://localhost:3000\n',
      '.env.development': 'NEXT_PUBLIC_API_URL=https://api.example.org\n',
    },
    withoutGit,
    SILENCE,
  ],
  [
    'leads a folder without .git holding a copied .env.local with a Stripe key',
    {
      '.env': 'NEXT_PUBLIC_SITE_URL=https://example.org\n',
      '.env.local': `STRIPE_SECRET_KEY=${STRIPE_KEY}\n`,
    },
    withoutGit,
    { findings: [], review: ['.git'], advisory: [] },
  ],
  [
    'leads a Git worktree holding a Stripe key, without failing',
    {
      '.gitignore': '.env*.local\n',
      '.env.local': `STRIPE_SECRET_KEY=${STRIPE_KEY}\n`,
    },
    worktree,
    { findings: [], review: ['.git'], advisory: [] },
  ],
];

const REAL_RISKS: [
  name: string,
  files: Readonly<Record<string, string>>,
  findings: readonly string[],
][] = [
  [
    'a PEM private key under certs, reported once',
    { 'certs/server.key': PEM_KEY },
    [join('certs', 'server.key')],
  ],
  [
    'Terraform state',
    { 'infra/terraform.tfstate': '{"version":4}\n' },
    [join('infra', 'terraform.tfstate')],
  ],
  [
    'an .npmrc holding a real token',
    { '.npmrc': `//registry.npmjs.org/:_authToken=${NPM_TOKEN}\n` },
    ['.npmrc'],
  ],
  [
    'a Stripe live key in .env.production',
    { '.env.production': `STRIPE_SECRET_KEY=${STRIPE_KEY}\n` },
    ['.env.production'],
  ],
  [
    'a database URL with a password on a remote host, in an environment file and in source',
    {
      '.env.production': `DATABASE_URL=${REMOTE_DATABASE}\n`,
      'src/db.ts': `export const url = "${REMOTE_DATABASE}";\n`,
    },
    ['.env.production', join('src', 'db.ts')],
  ],
];

await describe('the secrets checker weighs the look-alikes real projects carry below a finding', async () => {
  for (const [name, files, prepare, tiers] of PROJECTS)
    await it(name, async () => {
      const workspace = await prepare(files);

      const report = await scanWhole(workspace);

      strict.deepStrictEqual(tiersOf(report), tiers);
    });
});

await describe('the secrets checker still fails on each real risk Git tracks', async () => {
  for (const [name, files, findings] of REAL_RISKS)
    await it(name, async () => {
      const workspace = await trackedRepository(['init', '--quiet'], files, [
        '.',
      ]);

      const report = await scanWhole(workspace);

      strict.deepStrictEqual(tiersOf(report), {
        findings,
        review: [],
        advisory: [],
      });
    });
});
