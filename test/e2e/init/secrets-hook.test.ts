import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { initInto, newWorkspace, spawnHook } from './__utils__.js';

await describe('the scaffolded secrets hook runs without install', async () => {
  await it('scans a file', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });

    await writeFile(
      join(workspace, 'config.ts'),
      'export const db = "postgres://admin:S3cr3tP4ss99@db.prod:5432/app";\n',
      'utf8'
    );
    const scan = await spawnHook(workspace, 'secrets.mjs', ['-f', 'config.ts']);

    strict.ok(scan.stdout.includes('Hardcoded secrets found:'));
    strict.strictEqual(scan.code, 1);

    await writeFile(
      join(workspace, 'config.py'),
      'API_KEY = os.getenv("API_KEY", "fallback-secret-1234")\n',
      'utf8'
    );

    const python = await spawnHook(workspace, 'secrets.mjs', [
      '-f',
      'config.py',
    ]);

    strict.ok(python.stdout.includes('Hardcoded secrets found:'));
    strict.strictEqual(python.code, 1);
  });
});
