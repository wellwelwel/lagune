import { execFile } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { devNull, tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { env } from 'node:process';
import { promisify } from 'node:util';
import { afterEach } from 'poku';

const run = promisify(execFile);

const workspaces: string[] = [];

export const newWorkspace = async (): Promise<string> => {
  const workspace = await mkdtemp(join(tmpdir(), 'lagune-scan-'));

  workspaces.push(workspace);

  return workspace;
};

export const writeFiles = async (
  workspace: string,
  files: Readonly<Record<string, string>>
): Promise<void> => {
  for (const [path, contents] of Object.entries(files)) {
    const target = join(workspace, path);

    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, contents, 'utf8');
  }
};

export const createFiles = (
  workspace: string,
  paths: readonly string[]
): Promise<void> =>
  writeFiles(workspace, Object.fromEntries(paths.map((path) => [path, ''])));

/** Runs the real Git in a workspace, blind to the machine's own Git settings */
export const git = async (
  workspace: string,
  args: readonly string[]
): Promise<void> => {
  await run('git', [...args], {
    cwd: workspace,
    env: { ...env, GIT_CONFIG_GLOBAL: devNull, GIT_CONFIG_NOSYSTEM: '1' },
  });
};

afterEach(async () => {
  await Promise.all(
    workspaces.map((workspace) =>
      rm(workspace, { recursive: true, force: true })
    )
  );

  workspaces.length = 0;
});
