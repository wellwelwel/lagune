import type { ParsedCliArgs } from '../../../src/types/core.js';
import type { HookRun, InitArgs } from '../../../src/types/test.js';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execPath, stdin } from 'node:process';
import { afterEach, beforeEach } from 'poku';
import { run } from '../../../src/cli/run.js';

const workspaces: string[] = [];
export const packageRoot = new URL('../../../', import.meta.url);

const runHeadless = async (args: ParsedCliArgs, cwd: string): Promise<void> => {
  const wasTTY = stdin.isTTY;
  stdin.isTTY = false;

  try {
    await run(args, cwd, packageRoot);
  } finally {
    stdin.isTTY = wasTTY;
  }
};

const baseArgs: ParsedCliArgs = {
  command: undefined,
  agent: undefined,
  skills: [],
  skillsRequested: false,
  findingsRequested: false,
  help: false,
  version: false,
  bare: false,
  port: undefined,
};

export const newWorkspace = async (): Promise<string> => {
  const workspace = await mkdtemp(join(tmpdir(), 'lagune-'));

  workspaces.push(workspace);
  return workspace;
};

export const readManifest = async (
  workspace: string
): Promise<Record<string, unknown>> =>
  JSON.parse(await readFile(join(workspace, '.lagune/manifest.json'), 'utf8'));

export const spawnHook = (
  workspace: string,
  hookFile: string,
  args: string[]
): Promise<HookRun> =>
  new Promise((resolve, reject) => {
    const child = spawn(execPath, [`.lagune/hooks/${hookFile}`, ...args], {
      cwd: workspace,
    });
    const out: string[] = [];
    const err: string[] = [];

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => out.push(chunk));
    child.stderr.on('data', (chunk: string) => err.push(chunk));
    child.on('error', reject);
    child.on('close', (code) =>
      resolve({ stdout: out.join(''), stderr: err.join(''), code })
    );
  });

export const initInto = (workspace: string, args: InitArgs): Promise<void> =>
  runHeadless(
    {
      ...baseArgs,
      command: args.init ? 'init' : undefined,
      agent: args.agent,
      skills: args.skills ?? [],
      skillsRequested: args.skills !== undefined,
    },
    workspace
  );

export const updateInto = (workspace: string): Promise<void> =>
  runHeadless({ ...baseArgs, command: 'update' }, workspace);

export const pullInto = (workspace: string): Promise<void> =>
  runHeadless({ ...baseArgs, command: 'pull' }, workspace);

export const migrateInto = (workspace: string): Promise<void> =>
  runHeadless({ ...baseArgs, command: 'migrate' }, workspace);

const clear = async () => {
  await Promise.all(
    workspaces.map((workspace) =>
      rm(workspace, { recursive: true, force: true })
    )
  );

  workspaces.length = 0;
};

beforeEach(clear);
afterEach(clear);
