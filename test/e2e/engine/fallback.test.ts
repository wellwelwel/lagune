import { mkdir, readFile, symlink, writeFile } from 'node:fs/promises';
import { delimiter, join } from 'node:path';
import { env } from 'node:process';
import { pathToFileURL } from 'node:url';
import { describe, it, strict } from 'poku';
import { ENGINE, newWorkspace, runEngine } from './__utils__.js';

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

const SELF_STUB = `#!/usr/bin/env node
await import(${JSON.stringify(pathToFileURL(ENGINE).href)});
`;

const HANDOFF_NOTICE = 'lagune@0.15.0 answers here';

const installFrozen = async (
  workspace: string,
  bin: string = FROZEN_STUB
): Promise<void> => {
  const stub = join(workspace, 'node_modules/lagune');

  await mkdir(stub, { recursive: true });
  await mkdir(join(workspace, 'node_modules/.bin'), { recursive: true });
  await writeFile(
    join(stub, 'package.json'),
    JSON.stringify({
      name: 'lagune',
      version: '0.15.0',
      type: 'module',
      bin: { lagune: 'bin.js' },
    })
  );
  await writeFile(join(stub, 'bin.js'), bin, { mode: 0o755 });
  await symlink(
    '../lagune/bin.js',
    join(workspace, 'node_modules/.bin/lagune')
  );
};

const installedProject = async (bin?: string): Promise<string> => {
  const workspace = await newWorkspace();

  await installFrozen(workspace, bin);
  await mkdir(join(workspace, '.lagune'), { recursive: true });
  await writeFile(join(workspace, '.lagune/manifest.json'), MANIFEST);

  return workspace;
};

const plantNpx = async (workspace: string): Promise<NodeJS.ProcessEnv> => {
  const bin = join(workspace, 'node_modules/.bin');

  await writeFile(join(bin, 'npx'), PLANTED_NPX, { mode: 0o755 });

  return { ...env, PATH: [bin, env.PATH].join(delimiter) };
};

await describe('a manifest-based project hands its commands to the frozen version', async () => {
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

  await it('hands off even when the npx that started this version was told what to run', async () => {
    const workspace = await installedProject();
    const run = await runEngine(workspace, ['update'], {
      env: {
        ...env,
        npm_config_package: join(workspace, 'missing.tgz'),
        npm_config_call: 'node --version',
        NPM_CONFIG_WORKSPACES: 'true',
      },
    });

    strict(run.stdout.includes(`frozen ${JSON.stringify(['update'])}\n`));
    strict.strictEqual(run.code, FROZEN_EXIT);
  });

  await it('never hands off to itself when npx answers the frozen version with this one', async () => {
    const workspace = await installedProject(SELF_STUB);
    const run = await runEngine(workspace, ['update']);

    strict.strictEqual(run.code, 1);
    strict.strictEqual(run.stderr.split(HANDOFF_NOTICE).length - 1, 1);
  });
});

await describe('the hand-off never runs an npx the project plants', async () => {
  await it('ignores one ahead on the search path, where npx puts the project bin folder', async () => {
    const workspace = await installedProject();
    const planted = await plantNpx(workspace);
    const run = await runEngine(workspace, ['pull'], { env: planted });

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

await describe('every prefixed command is the skills-based Lagune alone in an installed project', async () => {
  for (const args of [
    ['read', 'list', '--findings'],
    ['read', 'catalog'],
    ['read', 'validate'],
    ['write', 'add', '--categories', 'ai'],
    ['write', 'track', '{"entries":[]}'],
    ['read', 'track'],
    ['write'],
  ])
    await it(`fails on ${args.join(' ')}, pointing to the migration`, async () => {
      const workspace = await installedProject();
      const run = await runEngine(workspace, args);

      strict.strictEqual(run.code, 1);
      strict.strictEqual(run.stdout.includes('frozen'), false);
      strict(run.stderr.includes('https://lagune.ai/docs/commands/migrate'));
    });
});

await describe('a project without a manifest never reaches the frozen version', async () => {
  for (const command of ['init', 'pull', 'update'])
    await it(`fails on ${command}, pointing to the install page`, async () => {
      const workspace = await newWorkspace();

      await installFrozen(workspace);

      const run = await runEngine(workspace, [command]);

      strict.strictEqual(run.code, 1);
      strict.strictEqual(run.stdout.includes('frozen'), false);
      strict.match(run.stderr, /https:\/\/lagune\.ai\/docs$/m);
    });

  await it('points a Blue Spec project to the frozen migrate, which makes it manifest-based first', async () => {
    const workspace = await newWorkspace();

    await installFrozen(workspace);
    await mkdir(join(workspace, '.bluespec'), { recursive: true });
    await writeFile(join(workspace, '.bluespec/manifest.json'), MANIFEST);

    const run = await runEngine(workspace, ['migrate']);

    strict.strictEqual(run.code, 0);
    strict.strictEqual(run.stdout.includes('frozen'), false);
    strict(run.stdout.includes('npx lagune@0.15.0 migrate'));
  });
});
