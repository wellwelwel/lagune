import { symlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { newWorkspace, runEngine } from './__utils__.js';

const CHECKERS = [
  'agent',
  'cors',
  'crypto',
  'infra',
  'interpreter',
  'jwt',
  'regex',
  'secrets',
];

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
        runEngine(workspace, [checker, '--dir', '..']),
        runEngine(workspace, [checker, '--dir', 'elsewhere']),
        runEngine(workspace, [checker, '--file', 'elsewhere/config.ts']),
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
