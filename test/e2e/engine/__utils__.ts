import type { EngineRunOptions, HookRun } from '../../../src/types/test.js';
import { spawn } from 'node:child_process';
import { cp, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execPath, platform } from 'node:process';
import { fileURLToPath } from 'node:url';
import { afterEach } from 'poku';

const packageRoot = new URL('../../../', import.meta.url);
const ENGINE_ENTRY = 'lib/bin/index.js';
const INSTALLED_FILES = ['package.json', 'lib/bin'];
const workspaces: string[] = [];

export const ENGINE = fileURLToPath(new URL(ENGINE_ENTRY, packageRoot));
export const IS_WINDOWS = platform === 'win32';

export const newWorkspace = async (): Promise<string> => {
  const workspace = await mkdtemp(join(tmpdir(), 'lagune-engine-'));

  workspaces.push(workspace);

  return workspace;
};

export const installEngine = async (): Promise<string> => {
  const folder = await mkdtemp(join(tmpdir(), 'lagune-install-'));

  await Promise.all(
    INSTALLED_FILES.map((path) =>
      cp(fileURLToPath(new URL(path, packageRoot)), join(folder, path), {
        recursive: true,
      })
    )
  );

  return join(folder, ENGINE_ENTRY);
};

export const runEngine = (
  cwd: string,
  args: string[],
  { env, input, engine = ENGINE }: EngineRunOptions = {}
): Promise<HookRun> =>
  new Promise((resolve, reject) => {
    const child = spawn(execPath, [engine, ...args], { cwd, env });
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

    if (input !== undefined) child.stdin.end(input);
  });

afterEach(async () => {
  await Promise.all(
    workspaces.map((workspace) =>
      rm(workspace, { recursive: true, force: true })
    )
  );

  workspaces.length = 0;
});
