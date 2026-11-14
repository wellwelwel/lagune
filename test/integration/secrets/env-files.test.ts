import type { EnvFileKind } from '../../../src/types/hooks/secrets.js';
import { chmod } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import {
  envFileAnalysis,
  envFileOf,
} from '../../../src/hooks/secrets/env-files.js';
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

/** Assembled from parts: no secret scanner may find a whole token in the repository */
const STRIPE_KEY = 'sk_live_' + 'a1'.repeat(12);
const LOCAL =
  'environment file meant to stay local tracked by Git: stop tracking it (git rm --cached) and add it to .gitignore';
const SECRET =
  'secret in an environment file tracked by Git: move the secret to a local file Git ignores, such as .env.local, or stop tracking this file (git rm --cached) and add it to .gitignore';
const DEFAULTS =
  'environment file tracked by Git: confirm every value it sets is meant to be public';
const UNIGNORED_LOCAL =
  'environment file meant to stay local that Git does not ignore: add it to .gitignore, so the next git add cannot commit it';
const UNIGNORED_SECRET =
  'secret in an environment file that Git does not ignore: move the secret to a local file Git ignores, such as .env.local, or add this file to .gitignore, so the next git add cannot commit it';

const ENV_FILES: Readonly<Record<string, string>> = {
  '.env.local': 'PORT=3000\n',
  '.env.production.local': 'PORT=3000\n',
  '.env': 'DATABASE_PASSWORD=hunter2hunter2\n',
  '.env.production': `PAYMENTS=${STRIPE_KEY}\n`,
  '.env.development': 'NEXT_PUBLIC_API_KEY=public-key-1234\nPORT=3000\n',
  '.env.example': `DATABASE_PASSWORD=hunter2hunter2\nPAYMENTS=${STRIPE_KEY}\n`,
  '.env.sample': 'DATABASE_PASSWORD=hunter2hunter2\n',
  '.env.template': 'DATABASE_PASSWORD=hunter2hunter2\n',
};

const filesUnder = (folder: string): Record<string, string> =>
  Object.fromEntries(
    Object.entries(ENV_FILES).map(([name, content]) => [
      `${folder}/${name}`,
      content,
    ])
  );

await describe('the secrets checker reports the environment files Git tracks', async () => {
  await it('reports a local variant or a secret, warns when Git would commit one, advises on public defaults, and stays silent on templates and on what Git ignores', async () => {
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
        { file: join('tracked', '.env.local'), detail: LOCAL },
        { file: join('tracked', '.env.production.local'), detail: LOCAL },
        { file: join('tracked', '.env'), detail: SECRET },
        { file: join('tracked', '.env.production'), detail: SECRET },
      ]),
      review: [],
      advisory: sortedDetails([
        { file: join('tracked', '.env.development'), detail: DEFAULTS },
        { file: join('untracked', '.env.local'), detail: UNIGNORED_LOCAL },
        {
          file: join('untracked', '.env.production.local'),
          detail: UNIGNORED_LOCAL,
        },
        { file: join('untracked', '.env'), detail: UNIGNORED_SECRET },
        {
          file: join('untracked', '.env.production'),
          detail: UNIGNORED_SECRET,
        },
      ]),
    });
  });

  await it('leads a local variant or a secret to a manual check without a readable Git index, and stays silent on public defaults', async () => {
    const workspace = await newWorkspace();

    await writeFiles(workspace, {
      '.env.local': 'PORT=3000\n',
      '.env': 'JWT_SECRET=abc123abc123\n',
      '.env.development': 'PORT=3000\n',
    });

    const report = await scanWhole(workspace);

    strict.deepStrictEqual(reported(report), {
      findings: [],
      review: [
        {
          file: '.env',
          detail:
            'secret in an environment file with no readable Git index to tell whether Git tracks it: confirm it is not committed',
        },
        {
          file: '.env.local',
          detail:
            'environment file meant to stay local with no readable Git index to tell whether Git tracks it: confirm it is not committed',
        },
      ],
      advisory: [],
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

describe('the values a tracked environment file sets decide whether it commits a secret', () => {
  const cases: [name: string, content: string, holds: boolean][] = [
    ['a password', 'DB_PASSWORD=hunter2hunter2\n', true],
    ['an exported, quoted secret', 'export JWT_SECRET="abc123"\n', true],
    ['a single-quoted API key', "STRIPE_API_KEY='abc123'\n", true],
    ['a Rails secret key base', 'SECRET_KEY_BASE=abc123\n', true],
    ['a known token format under any name', `PAYMENTS=${STRIPE_KEY}\n`, true],
    ['a known token format left in a comment', `# OLD=${STRIPE_KEY}\n`, true],
    [
      'a reference to another variable',
      'DB_PASSWORD=$POSTGRES_PASSWORD\n',
      false,
    ],
    ['an interpolated variable', 'GITHUB_TOKEN=${GITHUB_TOKEN}\n', false],
    ['an empty value', 'DB_PASSWORD=\n', false],
    [
      'an empty value before a comment',
      'DB_PASSWORD= # set it locally\n',
      false,
    ],
    ['a placeholder', 'API_KEY=your-api-key\n', false],
    ['a switch', 'REQUIRE_PASSWORD=true\n', false],
    [
      'settings named after a secret',
      'TOKEN_TTL=3600\nPASSWORD_MIN_LENGTH=12\nCSRF_TOKEN_HEADER=x-csrf\n',
      false,
    ],
    [
      'a public variable of Next.js or Vite',
      'NEXT_PUBLIC_API_KEY=abc123\nVITE_API_TOKEN=abc123\n',
      false,
    ],
  ];

  for (const [name, content, holds] of cases)
    it(`${holds ? 'reports' : 'advises on'} ${name}`, () => {
      const analysis = envFileAnalysis('shared', content, 'tracked');

      strict.deepStrictEqual(
        [analysis.findings.length, analysis.advisory.length],
        holds ? [1, 0] : [0, 1]
      );
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
    ['.env.ts', null],
    ['.envrc', null],
    ['production.env', null],
  ];

  for (const [name, kind] of cases)
    it(`reads ${name} as ${kind ?? 'none'}`, () => {
      strict.strictEqual(envFileOf(name), kind);
    });
});
