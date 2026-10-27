import { mkdir, readFile, symlink, writeFile } from 'node:fs/promises';
import { delimiter, join } from 'node:path';
import { env } from 'node:process';
import { describe, it, strict } from 'poku';
import { newWorkspace, runEngine } from './__utils__.js';

const MANIFEST = JSON.stringify({
  name: 'lagune',
  version: '0.15.0',
  agent: 'claude',
  files: [],
  categories: ['owasp'],
});

const FROZEN_EXIT = 7;

const FROZEN_STUB = `#!/usr/bin/env node
process.stdout.write('frozen ' + JSON.stringify(process.argv.slice(2)) + '\\n');
process.exitCode = ${FROZEN_EXIT};
`;

const PLANTED_NPX = `#!/usr/bin/env node
process.stdout.write('planted\\n');
`;

const installFrozen = async (workspace: string): Promise<void> => {
  const stub = join(workspace, 'node_modules/lagune');

  await mkdir(stub, { recursive: true });
  await mkdir(join(workspace, 'node_modules/.bin'), { recursive: true });
  await writeFile(
    join(stub, 'package.json'),
    JSON.stringify({
      name: 'lagune',
      version: '0.15.0',
      bin: { lagune: 'bin.js' },
    })
  );
  await writeFile(join(stub, 'bin.js'), FROZEN_STUB, { mode: 0o755 });
  await symlink(
    '../lagune/bin.js',
    join(workspace, 'node_modules/.bin/lagune')
  );
};

const installedProject = async (): Promise<string> => {
  const workspace = await newWorkspace();

  await installFrozen(workspace);
  await mkdir(join(workspace, '.lagune'), { recursive: true });
  await writeFile(join(workspace, '.lagune/manifest.json'), MANIFEST);

  return workspace;
};

const plantNpx = async (workspace: string): Promise<NodeJS.ProcessEnv> => {
  const bin = join(workspace, 'node_modules/.bin');

  await writeFile(join(bin, 'npx'), PLANTED_NPX, { mode: 0o755 });

  return { ...env, PATH: [bin, env.PATH].join(delimiter) };
};

await describe('a project the Lagune CLI installed hands its commands to the frozen version', async () => {
  for (const args of [
    ['init', 'claude', '--skills', 'owasp'],
    ['pull'],
    ['update'],
    ['add', '--skills', 'ai'],
    ['list', '--findings'],
    ['dashboard', '--port', '4000'],
    ['--version'],
  ])
    await it(`hands off ${args.join(' ')} with its arguments and exit code`, async () => {
      const workspace = await installedProject();
      const run = await runEngine(workspace, args);

      strict(run.stdout.includes(`frozen ${JSON.stringify(args)}\n`));
      strict.strictEqual(run.code, FROZEN_EXIT);
      strict(run.stderr.includes('https://lagune.ai/docs/commands/migrate'));
    });

  await it('hands off an argument a shell would read as syntax, as plain text', async () => {
    const workspace = await installedProject();
    const args = ['add', '--skills', 'a&b|c;$(d)`e`%f%'];
    const run = await runEngine(workspace, args);

    strict(run.stdout.includes(`frozen ${JSON.stringify(args)}\n`));
    strict.strictEqual(run.code, FROZEN_EXIT);
  });
});

await describe('the hand-off never runs an npx the project plants', async () => {
  await it('ignores one ahead on the search path, where npx puts the project bin folder', async () => {
    const workspace = await installedProject();
    const planted = await plantNpx(workspace);
    const run = await runEngine(workspace, ['pull'], planted);

    strict.strictEqual(run.stdout.includes('planted'), false);
  });
});

await describe('what only the skills-based Lagune has never reaches the frozen version', async () => {
  for (const args of [
    ['catalog'],
    ['catalog', 'regex'],
    ['track', '{"entries":[]}'],
    ['validate'],
    ['add', '--categories', 'ai'],
    ['remove', '--categories', 'owasp'],
    ['list', '--categories'],
    ['frobnicate'],
  ])
    await it(`fails on ${args.join(' ')} in an installed project`, async () => {
      const workspace = await installedProject();
      const run = await runEngine(workspace, args);

      strict.strictEqual(run.code, 1);
      strict.strictEqual(run.stdout.includes('frozen'), false);
    });

  await it('runs migrate itself, leaving the fallback behind', async () => {
    const workspace = await installedProject();
    const run = await runEngine(workspace, ['migrate']);
    const manifest = await readFile(
      join(workspace, '.lagune/manifest.json'),
      'utf8'
    ).catch(() => null);

    strict.strictEqual(run.code, 0);
    strict.strictEqual(run.stdout.includes('frozen'), false);
    strict.strictEqual(manifest, null);
  });
});

await describe('a project without a manifest never reaches the frozen version', async () => {
  for (const command of ['init', 'pull', 'update'])
    await it(`fails on ${command}, pointing to the skills CLI`, async () => {
      const workspace = await newWorkspace();

      await installFrozen(workspace);

      const run = await runEngine(workspace, [command]);

      strict.strictEqual(run.code, 1);
      strict.strictEqual(run.stdout.includes('frozen'), false);
      strict(run.stderr.includes('npx skills add wellwelwel/lagune'));
    });
});
