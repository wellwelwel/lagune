import type { HookCase } from '../../../src/types/test.js';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { newWorkspace, runEngine } from './__utils__.js';

const VECTOR =
  'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N';
const LEAKED_SECRET = { name: 'Leaked secret', paths: ['src/config.ts'] };
const OPEN_REDIRECT = { name: 'Open redirect', paths: ['src/routes.ts'] };

const CASES: HookCase[] = [
  {
    label: 'cvss keeps the -v the engine reads as --version',
    hook: 'cvss',
    args: ['-v', VECTOR],
    verdict: '9.3, Critical\n',
    code: 0,
  },
  {
    label: 'cvss fails on an invalid vector',
    hook: 'cvss',
    args: ['--vector', 'CVSS:4.0/AV:X'],
    verdict: 'invalid vector: AV (Attack Vector) does not take "X"',
    code: 1,
  },
  {
    label: 'regex keeps the -p the engine reads as --port',
    hook: 'regex',
    args: ['-p', '^(a+)+$'],
    verdict: 'unsafe\n',
    code: 1,
  },
  {
    label: 'network fails on a private destination',
    hook: 'network',
    args: ['--url', 'http://127.0.0.1/'],
    verdict: 'private-target\n',
    code: 1,
  },
  {
    label: 'validate fails while no memory exists',
    hook: 'validate',
    args: [],
    verdict: 'no memory artifact exists under .lagune/memory/',
    code: 1,
  },
];

const readTracking = async (workspace: string): Promise<unknown> =>
  JSON.parse(await readFile(join(workspace, '.lagune/tracking.json'), 'utf8'));

await describe('a hook subcommand answers as its hook does', async () => {
  for (const { label, hook, args, verdict, code } of CASES)
    await it(label, async () => {
      const workspace = await newWorkspace();
      const run = await runEngine(workspace, ['read', hook, ...args]);

      strict.strictEqual(run.code, code);
      strict(
        run.stdout.startsWith(verdict),
        'the output opens with the verdict'
      );
      strict.strictEqual(run.stderr, '');
    });

  await it('network reports an unknown flag on standard error', async () => {
    const workspace = await newWorkspace();
    const run = await runEngine(workspace, ['read', 'network', '--nope']);

    strict.strictEqual(run.code, 1);
    strict.strictEqual(run.stdout, '');
    strict(run.stderr.includes('--nope'), 'the error names the flag');
  });

  await it('track keeps a payload with quotes and backticks intact', async () => {
    const workspace = await newWorkspace();
    const run = await runEngine(workspace, [
      'write',
      'track',
      JSON.stringify({
        entries: [{ name: 'A `quoted` "name" $(x)', paths: ['src/a.ts'] }],
      }),
    ]);
    const tracking = await readTracking(workspace);

    strict.strictEqual(run.code, 0);
    strict.deepStrictEqual(tracking, {
      entries: [{ name: 'A `quoted` "name" $(x)', paths: ['src/a.ts'] }],
    });
  });

  await it('repair realigns the tracking map of the project it runs in with its payload', async () => {
    const workspace = await newWorkspace();
    const run = await runEngine(workspace, [
      'write',
      'repair',
      JSON.stringify({ entries: [LEAKED_SECRET] }),
    ]);
    const tracking = await readTracking(workspace);

    strict.strictEqual(run.code, 0);
    strict.deepStrictEqual(tracking, { entries: [LEAKED_SECRET] });
  });

  await it('untrack drops a named finding from the tracking map of the project it runs in, leaving the rest', async () => {
    const workspace = await newWorkspace();

    await mkdir(join(workspace, '.lagune'));
    await writeFile(
      join(workspace, '.lagune/tracking.json'),
      JSON.stringify({ entries: [LEAKED_SECRET, OPEN_REDIRECT] })
    );

    const run = await runEngine(workspace, [
      'write',
      'untrack',
      JSON.stringify({ names: [LEAKED_SECRET.name] }),
    ]);
    const tracking = await readTracking(workspace);

    strict.strictEqual(run.code, 0);
    strict.deepStrictEqual(tracking, { entries: [OPEN_REDIRECT] });
  });
});

await describe('list --findings names what the tracking map holds', async () => {
  await it('lists every tracked finding by name', async () => {
    const workspace = await newWorkspace();

    await mkdir(join(workspace, '.lagune'));
    await writeFile(
      join(workspace, '.lagune/tracking.json'),
      JSON.stringify({ entries: [LEAKED_SECRET, OPEN_REDIRECT] })
    );

    const run = await runEngine(workspace, ['read', 'list', '--findings']);

    strict.strictEqual(run.code, 0);
    strict(
      run.stdout.endsWith('Findings\n  • Leaked secret\n  • Open redirect\n')
    );
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
