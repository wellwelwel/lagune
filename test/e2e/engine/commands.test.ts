import type { PrefixedCommand } from '../../../src/types/test.js';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { delimiter, join } from 'node:path';
import { env, execPath } from 'node:process';
import { createInterface } from 'node:readline';
import { describe, it, strict } from 'poku';
import { loadVersion } from '../../../src/core/version.js';
import { ENGINE, newWorkspace, runEngine } from './__utils__.js';

const VECTOR =
  'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N';
const FINDING = '{"entries":[{"name":"Leaked secret","paths":["config.ts"]}]}';

const BEHIND_PREFIX: PrefixedCommand[] = [
  { prefix: 'read', command: 'catalog', args: [] },
  { prefix: 'read', command: 'list', args: ['--categories'] },
  { prefix: 'read', command: 'validate', args: [] },
  { prefix: 'read', command: 'cvss', args: ['--vector', VECTOR] },
  {
    prefix: 'read',
    command: 'agent',
    args: ['--lang', 'javascript', '--pattern', 'query({ prompt })'],
  },
  { prefix: 'read', command: 'cors', args: ['--origin', '*'] },
  {
    prefix: 'read',
    command: 'crypto',
    args: ['--lang', 'python', '--pattern', 'hashlib.md5(data)'],
  },
  {
    prefix: 'read',
    command: 'infra',
    args: ['--kind', 'dockerfile', '--pattern', 'FROM node:20'],
  },
  {
    prefix: 'read',
    command: 'interpreter',
    args: ['--lang', 'javascript', '--pattern', 'eval(x)'],
  },
  {
    prefix: 'read',
    command: 'jwt',
    args: ['--lang', 'javascript', '--pattern', 'jwt.verify(token, secret)'],
  },
  { prefix: 'read', command: 'network', args: ['--url', 'http://[::1]/'] },
  { prefix: 'read', command: 'regex', args: ['--pattern', '^abc$'] },
  { prefix: 'read', command: 'secrets', args: [] },
  { prefix: 'write', command: 'add', args: ['--categories', 'python'] },
  { prefix: 'write', command: 'remove', args: ['--categories', 'owasp'] },
  { prefix: 'write', command: 'track', args: [FINDING] },
  {
    prefix: 'write',
    command: 'untrack',
    args: ['{"names":["Leaked secret"]}'],
  },
  { prefix: 'write', command: 'repair', args: [FINDING] },
];
const OTHER_PREFIX: Record<string, string> = { read: 'write', write: 'read' };
const HELP_SECTIONS: Record<string, string[]> = {
  'Read commands': [
    'catalog',
    'list',
    'validate',
    'cvss',
    'agent',
    'cors',
    'crypto',
    'infra',
    'interpreter',
    'jwt',
    'network',
    'regex',
    'secrets',
  ],
  'Write commands': ['add', 'remove', 'track', 'untrack', 'repair'],
  'Other commands': ['dashboard', 'migrate', 'mcp'],
};
const BROWSER_OPENERS = ['open', 'xdg-open'];

const commandsOf = (prefix: string): string[] =>
  BEHIND_PREFIX.filter((row) => row.prefix === prefix).map(
    (row) => row.command
  );

/** The command names a help section lists, read from the start of each of its rows */
const listedNames = (section: string): string[] =>
  section
    .split('\n')
    .flatMap((row) => row.split('•').slice(1))
    .flatMap((row) =>
      row
        .trim()
        .split(/\s{2,}/)[0]
        .split(/[ ,]+/)
    )
    .filter((word) => /^[a-z]+$/.test(word));

const helpSections = (help: string): Map<string, string> =>
  new Map(
    help.split('\n\n').map((section) => {
      const [heading = '', ...rows] = section.trim().split('\n');

      return [heading, rows.join('\n')];
    })
  );

const freePort = async (): Promise<number> => {
  const server = createServer().listen(0, '127.0.0.1');

  await once(server, 'listening');

  const address = server.address();

  server.close();

  return typeof address === 'object' && address !== null ? address.port : 0;
};

/** A search path whose browser openers open nothing, and a temporary folder inside the workspace */
const quietBrowser = async (workspace: string): Promise<NodeJS.ProcessEnv> => {
  const bin = join(workspace, 'bin');

  await mkdir(bin);
  await Promise.all(
    BROWSER_OPENERS.map((opener) =>
      writeFile(join(bin, opener), '#!/bin/sh\n', { mode: 0o755 })
    )
  );

  return { ...env, PATH: [bin, env.PATH].join(delimiter), TMPDIR: workspace };
};

/** Starts the dashboard as a person would and answers the status of its page */
const dashboardPage = async (
  workspace: string,
  port: number
): Promise<number> => {
  const url = `http://127.0.0.1:${port}`;
  const dashboard = spawn(
    execPath,
    [ENGINE, 'dashboard', '--port', String(port)],
    { cwd: workspace, env: await quietBrowser(workspace) }
  );
  const closed = once(dashboard, 'close');

  try {
    for await (const line of createInterface({ input: dashboard.stdout }))
      if (line.includes(url)) break;

    return (await fetch(url)).status;
  } finally {
    dashboard.kill();
    await closed;
  }
};

await describe('the commands no engine tool runs keep their form', async () => {
  await it('shows the help on --help, and outside a terminal with no command or with only a port', async () => {
    const workspace = await newWorkspace();
    const runs = await Promise.all(
      [['--help'], [], ['--port', '5000']].map((args) =>
        runEngine(workspace, args)
      )
    );
    const [help] = runs;

    strict(help.stdout.includes('Usage'));
    strict.deepStrictEqual(
      runs.map(({ stdout, code }) => ({ stdout, code })),
      runs.map(() => ({ stdout: help.stdout, code: 0 }))
    );
  });

  await it('prints the package version on --version', async () => {
    const workspace = await newWorkspace();
    const [run, version] = await Promise.all([
      runEngine(workspace, ['--version']),
      loadVersion(new URL('../../../', import.meta.url)),
    ]);

    strict.deepStrictEqual(run, {
      stdout: `${version}\n`,
      stderr: '',
      code: 0,
    });
  });

  await it('serves the dashboard on the port dashboard names', async () => {
    const workspace = await newWorkspace();
    const status = await dashboardPage(workspace, await freePort());

    strict.strictEqual(status, 200);
  });

  await it('answers migrate in a project with nothing to migrate', async () => {
    const workspace = await newWorkspace();
    const run = await runEngine(workspace, ['migrate']);

    strict.strictEqual(run.code, 0);
    strict(run.stdout.includes('nothing to migrate'));
  });
});

await describe('the help groups the commands under read, write, and the rest', async () => {
  await it('lists every command once, under the section of its prefix', async () => {
    const workspace = await newWorkspace();
    const { stdout } = await runEngine(workspace, ['--help']);
    const sections = helpSections(stdout);

    strict.deepStrictEqual(
      Object.keys(HELP_SECTIONS).map((heading) =>
        listedNames(sections.get(heading) ?? '').toSorted()
      ),
      Object.values(HELP_SECTIONS).map((commands) => commands.toSorted())
    );
  });
});

await describe('a command an engine tool runs answers only behind its prefix', async () => {
  for (const { prefix, command, args } of BEHIND_PREFIX)
    await it(`runs ${command} only as ${prefix} ${command}, refusing it unprefixed or behind ${OTHER_PREFIX[prefix]} without running it`, async () => {
      const [prefixed, unprefixed, elsewhere] = await Promise.all([
        newWorkspace(),
        newWorkspace(),
        newWorkspace(),
      ]);
      const runs = await Promise.all([
        runEngine(prefixed, [prefix, command, ...args]),
        runEngine(unprefixed, [command, ...args]),
        runEngine(elsewhere, [OTHER_PREFIX[prefix], command, ...args]),
      ]);
      const written = await Promise.all(
        [unprefixed, elsewhere].map((folder) => readdir(folder))
      );
      const [ran, ...refused] = runs;

      strict(ran.stdout.length > 0, 'the prefixed form runs');
      strict.deepStrictEqual(refused, [
        {
          stdout: '',
          stderr: `${command} runs only as npx lagune ${prefix} ${command}.\n`,
          code: 1,
        },
        {
          stdout: '',
          stderr: `${command} runs through npx lagune ${prefix}, not npx lagune ${OTHER_PREFIX[prefix]}.\n`,
          code: 1,
        },
      ]);
      strict.deepStrictEqual(written, [[], []]);
    });

  for (const prefix of Object.keys(OTHER_PREFIX))
    await it(`refuses ${prefix} with an unknown or no command, listing every command ${prefix} runs`, async () => {
      const workspace = await newWorkspace();
      const runs = await Promise.all([
        runEngine(workspace, [prefix, 'frobnicate']),
        runEngine(workspace, [prefix]),
      ]);

      strict.deepStrictEqual(
        runs.map(({ stdout, stderr, code }) => ({
          stdout,
          code,
          unlisted: commandsOf(prefix).filter(
            (command) => !stderr.includes(command)
          ),
        })),
        runs.map(() => ({ stdout: '', code: 1, unlisted: [] }))
      );
    });
});
