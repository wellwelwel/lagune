import { mkdir, symlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { isolatedEnv, newWorkspace, runEngine } from './__utils__.js';

const CHECKERS = [
  'agent',
  'cors',
  'crypto',
  'dependency',
  'infra',
  'interpreter',
  'jwt',
  'regex',
  'secrets',
];

const SKIPPED_NOTE =
  'Skipped 1 path that Git ignores. Name one with --dir or --file to scan it.\n';

const BOTH_SKIPPED_NOTE =
  'Skipped 1 path that Git ignores and 1 path that .lagune/configs.json ignores. Name one with --dir or --file to scan it.\n';

await describe('the checkers stay inside the project they run from', async () => {
  for (const checker of CHECKERS)
    await it(`${checker} refuses a folder above the project and a link that leaves it`, async () => {
      const [workspace, outside] = await Promise.all([
        newWorkspace(),
        newWorkspace(),
      ]);

      await writeFile(join(outside, 'config.ts'), 'export const x = 1;\n');
      await symlink(outside, join(workspace, 'elsewhere'));

      const runs = await Promise.all([
        runEngine(workspace, ['read', checker, '--dir', '..']),
        runEngine(workspace, ['read', checker, '--dir', 'elsewhere']),
        runEngine(workspace, [
          'read',
          checker,
          '--file',
          'elsewhere/config.ts',
        ]),
      ]);

      strict.deepStrictEqual(
        runs.map(({ code, stderr }) => ({
          code,
          refused: stderr.includes('outside'),
        })),
        [
          { code: 1, refused: true },
          { code: 1, refused: true },
          { code: 1, refused: true },
        ]
      );
    });
});

await describe('the checkers leave out what Git ignores and say so', async () => {
  for (const checker of CHECKERS)
    await it(`${checker} skips a folder Git ignores until that folder is named`, async () => {
      const workspace = await newWorkspace();
      const isolated = isolatedEnv(workspace);

      await mkdir(join(workspace, '.git'));
      await mkdir(join(workspace, 'dist'));
      await writeFile(join(workspace, '.gitignore'), 'dist/\n');
      await writeFile(
        join(workspace, 'dist', 'app.js'),
        'export const x = 1;\n'
      );

      const [whole, named] = await Promise.all([
        runEngine(workspace, ['read', checker], { env: isolated }),
        runEngine(workspace, ['read', checker, '--dir', 'dist'], {
          env: isolated,
        }),
      ]);

      strict.deepStrictEqual(
        [
          whole.stdout.endsWith(SKIPPED_NOTE),
          named.stdout.includes('Git ignores'),
        ],
        [true, false]
      );
    });
});

await describe('the checkers follow the project configs', async () => {
  for (const checker of CHECKERS)
    await it(`${checker} leaves out what the configs ignore, scans what Git ignores once its own setting says so, and refuses configs it cannot trust`, async () => {
      const workspaces = await Promise.all([
        newWorkspace(),
        newWorkspace(),
        newWorkspace(),
      ]);
      const configs = [
        { checkers: { ignore: ['**/vendor'] } },
        {
          checkers: {
            ignore: ['**/vendor'],
            [checker]: { gitignore: false, ignore: [] },
          },
        },
        { checkers: { ignore: ['../outside'] } },
      ];

      await Promise.all(
        workspaces.map(async (workspace, index) => {
          await Promise.all(
            ['.git', '.lagune', 'dist', 'vendor'].map((folder) =>
              mkdir(join(workspace, folder))
            )
          );
          await Promise.all([
            writeFile(join(workspace, '.gitignore'), 'dist/\n'),
            writeFile(
              join(workspace, 'dist', 'app.js'),
              'export const x = 1;\n'
            ),
            writeFile(
              join(workspace, 'vendor', 'lib.js'),
              'export const y = 2;\n'
            ),
            writeFile(
              join(workspace, '.lagune', 'configs.json'),
              JSON.stringify(configs[index])
            ),
          ]);
        })
      );

      const [shared, own, untrusted] = await Promise.all(
        workspaces.map((workspace) =>
          runEngine(workspace, ['read', checker], {
            env: isolatedEnv(workspace),
          })
        )
      );

      strict.deepStrictEqual(
        [
          shared.stdout.endsWith(BOTH_SKIPPED_NOTE),
          own.stdout.includes('Skipped'),
          untrusted.code,
          untrusted.stderr.startsWith('.lagune/configs.json '),
        ],
        [true, false, 1, true]
      );
    });
});
