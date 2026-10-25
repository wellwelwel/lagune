import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { newWorkspace, runEngine } from './__utils__.js';

await describe('the secrets hook runs through the engine', async () => {
  await it('scans a file', async () => {
    const workspace = await newWorkspace();

    await writeFile(
      join(workspace, 'config.ts'),
      'export const db = "postgres://admin:S3cr3tP4ss99@db.prod:5432/app";\n',
      'utf8'
    );
    const scan = await runEngine(workspace, ['secrets', '-f', 'config.ts']);

    strict.ok(scan.stdout.includes('Hardcoded secrets found:'));
    strict.strictEqual(scan.code, 1);

    await writeFile(
      join(workspace, 'config.py'),
      'API_KEY = os.getenv("API_KEY", "fallback-secret-1234")\n',
      'utf8'
    );

    const python = await runEngine(workspace, ['secrets', '-f', 'config.py']);

    strict.ok(python.stdout.includes('Hardcoded secrets found:'));
    strict.strictEqual(python.code, 1);
  });
});
