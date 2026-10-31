import { stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { stdin, stdout } from 'node:process';
import { noProjectFolder } from '../cli/messages.js';
import { loadVersion } from '../core/version.js';
import { serveMcp } from '../mcp/server.js';

const isFolder = async (path: string): Promise<boolean> => {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
};

export const runMcp = async (
  requested: string | undefined,
  cwd: string,
  packageRoot: URL,
  entry: string
): Promise<void> => {
  const project = resolve(cwd, requested ?? '.');

  if (!(await isFolder(project))) throw new Error(noProjectFolder(project));

  await serveMcp(
    { entry, project, version: await loadVersion(packageRoot) },
    stdin,
    stdout
  );
};
