import type { HookCase } from '../../../src/types/test.js';
import { symlink } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { describe, it, strict } from 'poku';
import { hookFile, newWorkspace, runEngine, runScript } from './__utils__.js';

const VECTOR =
  'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N';

const CASES: HookCase[] = [
  {
    label: 'cvss keeps the -v the engine reads as --version',
    hook: 'cvss',
    args: ['-v', VECTOR],
    code: 0,
  },
  {
    label: 'cvss fails on an invalid vector',
    hook: 'cvss',
    args: ['--vector', 'CVSS:4.0/AV:X'],
    code: 1,
  },
  {
    label: 'regex keeps the -p the engine reads as --port',
    hook: 'regex',
    args: ['-p', '^(a+)+$'],
    code: 1,
  },
  {
    label: 'network fails on a private destination',
    hook: 'network',
    args: ['--url', 'http://127.0.0.1/'],
    code: 1,
  },
  {
    label: 'network reports an unknown flag on standard error',
    hook: 'network',
    args: ['--nope'],
    code: 1,
  },
  {
    label: 'track keeps a payload with quotes and backticks intact',
    hook: 'track',
    args: [
      JSON.stringify({
        entries: [{ name: 'A `quoted` "name" $(x)', paths: ['src/a.ts'] }],
      }),
    ],
    code: 0,
  },
  {
    label: 'validate fails while no memory exists',
    hook: 'validate',
    args: [],
    code: 1,
  },
];

await describe('a hook subcommand answers like running its file', async () => {
  for (const { label, hook, args, code } of CASES)
    await it(label, async () => {
      const [engineProject, fileProject] = await Promise.all([
        newWorkspace(),
        newWorkspace(),
      ]);
      const [viaEngine, viaFile] = await Promise.all([
        runEngine(engineProject, [hook, ...args]),
        runScript(fileProject, hookFile(hook), args),
      ]);

      strict.deepStrictEqual(viaEngine, viaFile);
      strict.strictEqual(viaEngine.code, code);
    });
});

await describe('an unknown subcommand fails instead of reading as clean', async () => {
  for (const subcommand of ['trak', 'validates', 'scan'])
    await it(`fails on ${subcommand}`, async () => {
      const workspace = await newWorkspace();
      const run = await runEngine(workspace, [subcommand, '--dir', 'src']);

      strict.strictEqual(run.code, 1);
      strict.strictEqual(run.stdout, '');
      strict(run.stderr.includes(subcommand), 'the error names the subcommand');
    });
});

await describe('a hook file run through a symlinked folder', async () => {
  await it('prints its verdict instead of exiting silently', async () => {
    const workspace = await newWorkspace();

    await symlink(dirname(hookFile('cvss')), join(workspace, 'hooks'), 'dir');

    const run = await runScript(
      workspace,
      join(workspace, 'hooks', 'cvss.mjs'),
      ['--vector', VECTOR]
    );

    strict.deepStrictEqual(run, {
      stdout: '9.3, Critical\n',
      stderr: '',
      code: 0,
    });
  });
});
