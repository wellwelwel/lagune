import { rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { env } from 'node:process';
import { describe, it, strict } from 'poku';
import { git } from '../../integration/scan/__utils__.js';
import { commitAt } from '../../integration/secrets/__utils__.js';
import { newWorkspace, runEngine } from './__utils__.js';

/** Assembled from parts: no secret scanner may find a whole token in the repository */
const AWS_KEY = 'AKIA' + 'IOSFODNN7EXAMPLE';

const ADDED_AT = 1_700_000_000;
const REMOVED_AT = ADDED_AT + 100;

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
        'Hardcoded secrets found:\n\nid_rsa\n  private key tracked by Git: stop tracking this file (git rm --cached) and add it to .gitignore\n',
        1,
      ]
    );
  });

  await it('stays silent on an environment file Git tracks with public defaults, and passes', async () => {
    const workspace = await newWorkspace();

    await git(workspace, ['init', '--quiet']);
    await writeFile(join(workspace, '.env'), 'PORT=3000\n', 'utf8');
    await git(workspace, ['add', '.env']);

    const scan = await runEngine(workspace, ['read', 'secrets'], {
      env: { ...env, HOME: workspace, USERPROFILE: workspace },
    });

    strict.deepStrictEqual(
      [scan.stdout, scan.code],
      ['no hardcoded secrets found\n', 0]
    );
  });

  await it('names a secret only the history holds, with its commit, and passes', async () => {
    const workspace = await newWorkspace();

    await git(workspace, ['init', '--quiet']);
    await writeFile(
      join(workspace, 'config.ts'),
      `export const key = "${AWS_KEY}";\n`,
      'utf8'
    );

    const added = await commitAt(workspace, ADDED_AT);

    await rm(join(workspace, 'config.ts'));
    await commitAt(workspace, REMOVED_AT);

    const scan = await runEngine(workspace, ['read', 'secrets', '--history'], {
      env: { ...env, HOME: workspace, USERPROFILE: workspace },
    });

    strict.deepStrictEqual(
      [scan.stdout, scan.code],
      [
        `Secrets in the Git history, to rotate where each was issued:\n\nconfig.ts\n  AWS access key id (AKIA…), in commit ${added}\n`,
        0,
      ]
    );
  });

  const refusals: [name: string, args: string[], refusal: string][] = [
    [
      'a history scan scoped to a path',
      ['--history', '--dir', '.'],
      '--history scans the whole Git history and takes no --dir or --file: run it on its own\n',
    ],
    [
      'a continuation asked of a scan of the files',
      ['--before', 'a'.repeat(40)],
      '--before continues a history scan from the commit it stopped at: run it with --history\n',
    ],
    [
      'a continuation from anything but a whole commit id',
      ['--history', '--before', 'HEAD'],
      '--before takes the whole id of the commit a stopped history scan named, 40 or 64 lowercase hexadecimal characters\n',
    ],
  ];

  for (const [name, args, refusal] of refusals)
    await it(`refuses ${name}, naming why`, async () => {
      const workspace = await newWorkspace();

      const scan = await runEngine(workspace, ['read', 'secrets', ...args]);

      strict.deepStrictEqual([scan.stderr, scan.code], [refusal, 1]);
    });
});
