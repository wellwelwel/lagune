import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { env } from 'node:process';
import { describe, it, strict } from 'poku';
import { git } from '../../integration/scan/__utils__.js';
import { newWorkspace, runEngine } from './__utils__.js';

await describe('the secrets hook runs through the engine', async () => {
  await it('reports the hardcoded secret of each named file and exits non-zero', async () => {
    const workspace = await newWorkspace();

    await writeFile(
      join(workspace, 'config.ts'),
      'export const db = "postgres://admin:S3cr3tP4ss99@db.prod:5432/app";\n',
      'utf8'
    );
    await writeFile(
      join(workspace, 'config.py'),
      'API_KEY = os.getenv("API_KEY", "fallback-secret-1234")\n',
      'utf8'
    );

    const typescript = await runEngine(workspace, [
      'read',
      'secrets',
      '-f',
      'config.ts',
    ]);
    const python = await runEngine(workspace, [
      'read',
      'secrets',
      '-f',
      'config.py',
    ]);

    strict.ok(typescript.stdout.includes('Hardcoded secrets found:'));
    strict.strictEqual(typescript.code, 1);
    strict.ok(python.stdout.includes('Hardcoded secrets found:'));
    strict.strictEqual(python.code, 1);
  });

  await it('names a credential file Git tracks, tells how to untrack it, and exits non-zero', async () => {
    const workspace = await newWorkspace();

    await git(workspace, ['init', '--quiet']);
    await writeFile(join(workspace, 'id_rsa'), 'fixture\n', 'utf8');
    await git(workspace, ['add', 'id_rsa']);

    const scan = await runEngine(workspace, ['read', 'secrets'], {
      env: { ...env, HOME: workspace, USERPROFILE: workspace },
    });

    strict.deepStrictEqual(
      [scan.stdout, scan.code],
      [
        'Hardcoded secrets found:\n\nid_rsa\n  private key tracked by Git: stop tracking it (git rm --cached) and add it to .gitignore\n',
        1,
      ]
    );
  });
});
