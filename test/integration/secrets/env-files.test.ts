import type { EnvFileKind } from '../../../src/types/hooks/secrets.js';
import { chmod } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import {
  envFileAnalysis,
  envFileOf,
} from '../../../src/hooks/secrets/env-files.js';
import { hideUserHome, trackedRepository } from '../scan/__utils__.js';
import {
  itWithPermissionBits,
  reported,
  scanWhole,
  sortedDetails,
} from './__utils__.js';

hideUserHome();

/** Assembled from parts: no secret scanner may find a whole token in the repository */
const STRIPE_KEY = 'sk_live_' + 'a1'.repeat(12);
const DATABASE_URL = 'postgres://admin:S3cr3tP4ss99' + '@db.prod.internal/app';

const MOVE = 'move the secret to a local file Git ignores, such as .env.local';
const UNTRACK =
  'stop tracking this file (git rm --cached) and add it to .gitignore';
const IGNORE =
  'add this file to .gitignore, so the next git add cannot commit it';

const WEIGHTS = {
  finding: [1, 0, 0],
  lead: [0, 1, 0],
  silence: [0, 0, 0],
} as const;

const ENV_FILES: Readonly<Record<string, string>> = {
  '.env': `DATABASE_URL=${DATABASE_URL}\n`,
  '.env.production': `PAYMENTS=${STRIPE_KEY}\n`,
  '.env.production.local': `PAYMENTS=${STRIPE_KEY}\n`,
  '.env.staging': 'POSTGRES_PASSWORD=postgres\n',
  '.env.development': 'NEXT_PUBLIC_API_KEY=public-key-1234\nPORT=3000\n',
  '.env.local': 'PORT=3000\n',
  '.env.example': `DATABASE_PASSWORD=hunter2hunter2\nPAYMENTS=${STRIPE_KEY}\n`,
  '.env.sample': 'DATABASE_PASSWORD=hunter2hunter2\n',
  '.env.template': 'DATABASE_PASSWORD=hunter2hunter2\n',
};

const databaseUrlOn = (host: string): string =>
  `DATABASE_URL=postgres://admin:S3cr3tP4ss99@${host}/app\n`;

const filesUnder = (folder: string): Record<string, string> =>
  Object.fromEntries(
    Object.entries(ENV_FILES).map(([name, content]) => [
      `${folder}/${name}`,
      content,
    ])
  );

await describe('the secrets checker weighs each environment file by its evidence and by what Git does with it', async () => {
  await it('reports a proven secret Git tracks, leads a secret-named value to a manual check, advises when Git would commit a secret or a local file, and stays silent on public defaults, templates, and what Git ignores', async () => {
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
        {
          file: join('tracked', '.env'),
          detail: `secret (DATABASE_URL) in an environment file tracked by Git: ${MOVE}, or ${UNTRACK}`,
        },
        {
          file: join('tracked', '.env.production'),
          detail: `secret (PAYMENTS) in an environment file tracked by Git: ${MOVE}, or ${UNTRACK}`,
        },
        {
          file: join('tracked', '.env.production.local'),
          detail: `secret (PAYMENTS) in an environment file meant to stay local tracked by Git: ${UNTRACK}`,
        },
      ]),
      review: sortedDetails([
        {
          file: join('tracked', '.env.staging'),
          detail: `possible secret (POSTGRES_PASSWORD) in an environment file tracked by Git: if it is a real credential rather than a development default, ${MOVE}, or ${UNTRACK}`,
        },
        {
          file: join('untracked', '.env.staging'),
          detail: `possible secret (POSTGRES_PASSWORD) in an environment file that Git does not ignore: if it is a real credential rather than a development default, ${MOVE}, or ${IGNORE}`,
        },
      ]),
      advisory: sortedDetails([
        {
          file: join('tracked', '.env.local'),
          detail: `environment file meant to stay local tracked by Git: the next secret written here lands in a commit, so ${UNTRACK}`,
        },
        {
          file: join('untracked', '.env.local'),
          detail: `environment file meant to stay local that Git does not ignore: ${IGNORE}`,
        },
        {
          file: join('untracked', '.env'),
          detail: `secret (DATABASE_URL) in an environment file that Git does not ignore: ${MOVE}, or ${IGNORE}`,
        },
        {
          file: join('untracked', '.env.production'),
          detail: `secret (PAYMENTS) in an environment file that Git does not ignore: ${MOVE}, or ${IGNORE}`,
        },
        {
          file: join('untracked', '.env.production.local'),
          detail: `secret (PAYMENTS) in an environment file meant to stay local that Git does not ignore: ${IGNORE}`,
        },
      ]),
    });
  });

  await itWithPermissionBits(
    'leads a tracked environment file it cannot read to a manual check, never to silence',
    async () => {
      const workspace = await trackedRepository(
        ['init', '--quiet'],
        { '.env': 'PORT=3000\n' },
        ['.env']
      );

      await chmod(join(workspace, '.env'), 0o000);

      const report = await scanWhole(workspace);

      strict.deepStrictEqual(reported(report), {
        findings: [],
        review: [
          {
            file: '.env',
            detail:
              'possible secret in a file that could not be read: check it by hand',
          },
        ],
        advisory: [],
      });
    }
  );
});

describe('the values a tracked environment file sets decide how much weight it carries', () => {
  const cases: [name: string, content: string, weight: keyof typeof WEIGHTS][] =
    [
      [
        'a known token format under any name',
        `PAYMENTS=${STRIPE_KEY}\n`,
        'finding',
      ],
      [
        'a known token format left in a comment',
        `# OLD=${STRIPE_KEY}\n`,
        'finding',
      ],
      [
        'a known token format under a public prefix',
        `NEXT_PUBLIC_PAYMENTS=${STRIPE_KEY}\n`,
        'finding',
      ],
      [
        'a connection string that carries its password to a remote host',
        `DATABASE_URL=${DATABASE_URL}\n`,
        'finding',
      ],
      [
        'a connection string to localhost, as Prisma generates it',
        'DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"\n',
        'lead',
      ],
      [
        'a connection string to a Docker Compose service',
        'DATABASE_URL=postgres://postgres:postgres@db:5432/app\n',
        'lead',
      ],
      [
        'a connection string to a loopback address',
        'REDIS_URL=redis://:devpass@127.0.0.1:6379\nMYSQL_URL=mysql://root:rootpass@[::1]:3306/app\n',
        'lead',
      ],
      [
        'a connection string to the unspecified address',
        'DATABASE_URL=postgres://postgres:postgres@0.0.0.0:5432/app\n',
        'lead',
      ],
      [
        "a connection string to Docker's host machine",
        'DATABASE_URL=postgres://postgres:postgres@host.docker.internal:5432/app\n',
        'lead',
      ],
      [
        'a connection string to a local and one to a remote host',
        `LOCAL_URL=postgres://postgres:postgres@localhost/app\nDATABASE_URL=${DATABASE_URL}\n`,
        'finding',
      ],
      [
        'a connection string to an address that only looks like a loopback one',
        databaseUrlOn('127.0.0.1.attacker.example'),
        'finding',
      ],
      [
        'a connection string to an address that only looks like the unspecified one',
        databaseUrlOn('0.0.0.0.attacker.example'),
        'finding',
      ],
      [
        "a connection string to an address that only looks like Docker's host machine",
        databaseUrlOn('host.docker.internal.attacker.example'),
        'finding',
      ],
      ['a password', 'DB_PASSWORD=hunter2hunter2\n', 'lead'],
      ['an exported, quoted secret', 'export JWT_SECRET="abc123"\n', 'lead'],
      ['a single-quoted API key', "STRIPE_API_KEY='abc123'\n", 'lead'],
      ['a Rails secret key base', 'SECRET_KEY_BASE=abc123\n', 'lead'],
      [
        'a development default',
        'POSTGRES_PASSWORD=postgres\nSESSION_SECRET=keyboard cat\n',
        'lead',
      ],
      ['a numeric password', 'DB_PASSWORD=123456\n', 'lead'],
      ['a secret with dots inside it', 'JWT_SECRET=abc...def\n', 'lead'],
      [
        'a reference to another variable',
        'DB_PASSWORD=$POSTGRES_PASSWORD\n',
        'silence',
      ],
      ['an interpolated variable', 'GITHUB_TOKEN=${GITHUB_TOKEN}\n', 'silence'],
      ['an empty value', 'DB_PASSWORD=\n', 'silence'],
      [
        'an empty value before a comment',
        'DB_PASSWORD= # set it locally\n',
        'silence',
      ],
      ['a switch', 'REQUIRE_PASSWORD=true\n', 'silence'],
      [
        'settings named after a secret',
        'TOKEN_TTL=3600\nPASSWORD_MIN_LENGTH=12\nCSRF_TOKEN_HEADER=x-csrf\n',
        'silence',
      ],
      [
        'a count under a token name',
        'OPENAI_MAX_TOKEN=4096\nLLM_MAX_TOKEN="4096"\n',
        'silence',
      ],
      [
        'a dotenvx ciphertext',
        'DATABASE_PASSWORD="encrypted:BNr24F4vW9CQ37LOXeRgOL6QlwtJfAoAVXtSdSfpicPDHtqo"\n',
        'silence',
      ],
      [
        'a connection string with a placeholder password',
        'DATABASE_URL=postgres://admin:changeme@localhost/app\n',
        'silence',
      ],
      [
        'a connection string that reads its password from a variable',
        'DATABASE_URL=postgres://admin:${DB_PASSWORD}@localhost/app\n',
        'silence',
      ],
    ];

  for (const [name, content, weight] of cases)
    it(`weighs ${name} as ${weight}`, () => {
      const { findings, review, advisory } = envFileAnalysis(
        'shared',
        content,
        'tracked'
      );

      strict.deepStrictEqual(
        [findings.length, review.length, advisory.length],
        WEIGHTS[weight]
      );
    });
});

describe('a placeholder under a secret name is no secret', () => {
  const placeholders: readonly string[] = [
    'your-api-key',
    'changeme',
    'REPLACE_ME',
    'replace-me',
    'insert-key-here',
    'sk-...',
    'sk_live_...',
    'sk-…',
  ];

  for (const placeholder of placeholders)
    it(`stays silent on ${placeholder}`, () => {
      strict.deepStrictEqual(
        envFileAnalysis('shared', `API_KEY=${placeholder}\n`, 'tracked'),
        { findings: [], review: [], advisory: [] }
      );
    });
});

describe('a variable a framework ships to the browser is public by design', () => {
  const prefixes: readonly string[] = [
    'NEXT_PUBLIC_',
    'VITE_',
    'EXPO_PUBLIC_',
    'PUBLIC_',
    'REACT_APP_',
    'VUE_APP_',
    'NUXT_PUBLIC_',
    'GATSBY_',
  ];

  for (const prefix of prefixes)
    it(`stays silent on a secret-named variable prefixed ${prefix}`, () => {
      strict.deepStrictEqual(
        envFileAnalysis('shared', `${prefix}API_KEY=abc123def456\n`, 'tracked'),
        { findings: [], review: [], advisory: [] }
      );
    });
});

describe('a report names what holds the secret, never its value', () => {
  it('names each variable that proves a secret once, the line where no variable holds one, and leaves out the weaker evidence of the same file', () => {
    const analysis = envFileAnalysis(
      'shared',
      `PAYMENTS=${STRIPE_KEY}\nJWT_SECRET=dev-secret\n# OLD=${STRIPE_KEY}\nPAYMENTS=${STRIPE_KEY}\n`,
      'tracked'
    );

    strict.deepStrictEqual(analysis, {
      findings: [
        `secret (PAYMENTS and line 3) in an environment file tracked by Git: ${MOVE}, or ${UNTRACK}`,
      ],
      review: [],
      advisory: [],
    });
  });

  it('names every secret-named variable of a file that proves no secret', () => {
    const analysis = envFileAnalysis(
      'shared',
      'POSTGRES_PASSWORD=postgres\nPORT=5432\nREDIS_PASSWORD=redis\n',
      'tracked'
    );

    strict.deepStrictEqual(analysis, {
      findings: [],
      review: [
        `possible secret (POSTGRES_PASSWORD and REDIS_PASSWORD) in an environment file tracked by Git: if it is a real credential rather than a development default, ${MOVE}, or ${UNTRACK}`,
      ],
      advisory: [],
    });
  });
});

describe('a file is an environment file by its name', () => {
  const cases: [name: string, kind: EnvFileKind | null][] = [
    ['.env', 'shared'],
    ['.env.production', 'shared'],
    ['apps/web/.env.test', 'shared'],
    ['.env.local', 'local'],
    ['.env.production.local', 'local'],
    ['.ENV.LOCAL', 'local'],
    ['.env.example', null],
    ['.env.sample', null],
    ['.env.template', null],
    ['.env.local.example', null],
    ['.env.keys', null],
    ['.env.ts', null],
    ['.envrc', null],
    ['production.env', null],
  ];

  for (const [name, kind] of cases)
    it(`reads ${name} as ${kind ?? 'none'}`, () => {
      strict.strictEqual(envFileOf(name), kind);
    });
});
