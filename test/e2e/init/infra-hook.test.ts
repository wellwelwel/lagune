import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { initInto, newWorkspace, spawnHook } from './__utils__.js';

await describe('the scaffolded infra hook runs without install', async () => {
  await it('scores a snippet with -k and scans a Dockerfile', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });

    const iam = await spawnHook(workspace, 'infra.mjs', [
      '-k',
      'terraform',
      '-p',
      'actions = ["*"]',
    ]);
    strict.strictEqual(iam.stdout.trim(), 'iam-wildcard');
    strict.strictEqual(iam.code, 1);

    // reaches a Dockerfile, which the source filter would skip
    await writeFile(
      join(workspace, 'Dockerfile'),
      'FROM node:20\nUSER root\nRUN echo build\n',
      'utf8'
    );
    const scan = await spawnHook(workspace, 'infra.mjs', ['-f', 'Dockerfile']);
    strict.ok(scan.stdout.includes('Infrastructure risks found:'));
    strict.strictEqual(scan.code, 1);
  });
});
