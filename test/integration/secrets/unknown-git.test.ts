import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { hideUserHome, newWorkspace, writeFiles } from '../scan/__utils__.js';
import { reported, scanWhole } from './__utils__.js';

hideUserHome();

/** Assembled from parts: no secret scanner may find a whole token in the repository */
const STRIPE_KEY = 'sk_live_' + 'a1'.repeat(12);
const REMOTE_DATABASE =
  'postgres://admin:S3cr3tP4ss99' + '@db.prod.internal/app';

const FILES: Readonly<Record<string, string>> = {
  id_rsa: 'fixture\n',
  'license.key': 'fixture\n',
  'test/id_rsa': 'fixture\n',
  'apps/web/.env.local': `STRIPE_SECRET_KEY=${STRIPE_KEY}\n`,
  '.env.local': 'NEXT_PUBLIC_SITE_URL=http://localhost:3000\n',
  '.npmrc': '//registry.npmjs.org/:_authToken=${NPM_TOKEN}\n',
  'docs/talk.key': 'PK\u0003\u0004keynote',
  'config.ts': `export const db = "${REMOTE_DATABASE}";\n`,
};

const NO_REPOSITORY =
  'with no .git at the project root to tell whether Git tracks them: run the check from the repository root, or confirm by hand that none of them is committed';

await describe('without a Git status it can read, the secrets checker gathers every file at stake under one lead that names the cause', async () => {
  const cases: [
    name: string,
    prepare: (workspace: string) => Promise<void>,
    cause: string,
  ][] = [
    [
      'outside a repository, or in a package folder below its root',
      async () => {},
      NO_REPOSITORY,
    ],
    [
      'in a worktree or submodule, whose .git is a file pointing elsewhere',
      (workspace) =>
        writeFile(
          join(workspace, '.git'),
          'gitdir: ../main/.git/worktrees/feature\n'
        ),
      'with a .git that points to an index elsewhere, as a worktree or submodule does, which the checker never follows: confirm in this checkout, with git ls-files, that none of them is committed',
    ],
    [
      'with a .git folder whose index it cannot read',
      async (workspace) => {
        await mkdir(join(workspace, '.git'));
        await writeFile(join(workspace, '.git', 'index'), 'DIRC not an index');
      },
      'with a Git index the checker cannot read to tell whether Git tracks them: confirm by hand that none of them is committed',
    ],
  ];

  for (const [name, prepare, cause] of cases)
    await it(`names the files that would be a finding or a lead if tracked, ${name}, and keeps the source findings`, async () => {
      const workspace = await newWorkspace();

      await writeFiles(workspace, FILES);
      await prepare(workspace);

      const report = await scanWhole(workspace);

      strict.deepStrictEqual(reported(report), {
        findings: [
          {
            file: 'config.ts',
            detail:
              'credential embedded in a connection/DSN string: move it to an environment variable or secret store',
          },
        ],
        review: [
          {
            file: '.git',
            detail: `possible secrets in ${join('apps', 'web', '.env.local')}, id_rsa, license.key, and ${join('test', 'id_rsa')}, ${cause}`,
          },
        ],
        advisory: [],
      });
    });

  await it('raises nothing when no file would be a finding or a lead if tracked', async () => {
    const workspace = await newWorkspace();

    await writeFiles(workspace, {
      '.env': 'NEXT_PUBLIC_SITE_URL=https://example.org\n',
      '.env.local': 'NEXT_PUBLIC_SITE_URL=http://localhost:3000\n',
      '.npmrc': '//registry.npmjs.org/:_authToken=${NPM_TOKEN}\n',
      'docs/talk.key': 'PK\u0003\u0004keynote',
    });

    const report = await scanWhole(workspace);

    strict.deepStrictEqual(reported(report), {
      findings: [],
      review: [],
      advisory: [],
    });
  });

  await it('names five files and counts the rest', async () => {
    const workspace = await newWorkspace();

    await writeFiles(
      workspace,
      Object.fromEntries(
        ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((name) => [
          `keys/${name}.key`,
          'fixture\n',
        ])
      )
    );

    const report = await scanWhole(workspace);

    strict.deepStrictEqual(reported(report).review, [
      {
        file: '.git',
        detail: `possible secrets in ${join('keys', 'a.key')}, ${join('keys', 'b.key')}, ${join('keys', 'c.key')}, ${join('keys', 'd.key')}, ${join('keys', 'e.key')}, and 2 more, ${NO_REPOSITORY}`,
      },
    ]);
  });
});
