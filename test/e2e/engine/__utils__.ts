import type { HookRun } from '../../../src/types/test.js';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execPath } from 'node:process';
import { fileURLToPath } from 'node:url';
import { afterEach } from 'poku';

const packageRoot = new URL('../../../', import.meta.url);
const workspaces: string[] = [];

export const ENGINE = fileURLToPath(new URL('lib/bin/index.js', packageRoot));

export const hookFile = (hook: string): string =>
  fileURLToPath(new URL(`lib/hooks/${hook}.mjs`, packageRoot));

export const newWorkspace = async (): Promise<string> => {
  const workspace = await mkdtemp(join(tmpdir(), 'lagune-engine-'));

  workspaces.push(workspace);
  return workspace;
};

export const runScript = (
  cwd: string,
  script: string,
  args: string[]
): Promise<HookRun> =>
  new Promise((resolve, reject) => {
    const child = spawn(execPath, [script, ...args], { cwd });
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

export const runEngine = (cwd: string, args: string[]): Promise<HookRun> =>
  runScript(cwd, ENGINE, args);

afterEach(async () => {
  await Promise.all(
    workspaces.map((workspace) =>
      rm(workspace, { recursive: true, force: true })
    )
  );

  workspaces.length = 0;
});
