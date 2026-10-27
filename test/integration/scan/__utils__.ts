import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach } from 'poku';

const workspaces: string[] = [];

export const newWorkspace = async (): Promise<string> => {
  const workspace = await mkdtemp(join(tmpdir(), 'lagune-scan-'));

  workspaces.push(workspace);
  return workspace;
};

export const createFiles = async (
  workspace: string,
  paths: readonly string[]
): Promise<void> => {
  for (const path of paths) {
    const target = join(workspace, path);

    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, '', 'utf8');
  }
};

afterEach(async () => {
  await Promise.all(
    workspaces.map((workspace) =>
      rm(workspace, { recursive: true, force: true })
    )
  );

  workspaces.length = 0;
});
