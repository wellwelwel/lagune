import { stat } from 'node:fs/promises';
import { parse, resolve } from 'node:path';
import { execPath, stdin, stdout } from 'node:process';
import { fileURLToPath } from 'node:url';
import { noProjectFolder, notAProjectFolder } from '../cli/messages.js';
import { existingWithin } from '../core/fs-actions.js';
import { loadVersion } from '../core/version.js';
import { serveMcp } from '../mcp/server.js';

const UNEXPANDED_VARIABLE = /\$\{[^{}]*\}/;

const isFolder = async (path: string): Promise<boolean> => {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
};

/** An agent that cannot fill in the project variable passes it as written */
const projectNamed = (requested: string | undefined): string =>
  requested === undefined || UNEXPANDED_VARIABLE.test(requested)
    ? '.'
    : requested;

const isOwnFolderOrRoot = async (
  project: string,
  packageRoot: URL
): Promise<boolean> =>
  parse(project).root === project ||
  (await existingWithin(fileURLToPath(packageRoot), project)) !== undefined;

export const runMcp = async (
  requested: string | undefined,
  cwd: string,
  packageRoot: URL,
  entry: string
): Promise<void> => {
  const project = resolve(cwd, projectNamed(requested));

  if (!(await isFolder(project))) throw new Error(noProjectFolder(project));
  if (await isOwnFolderOrRoot(project, packageRoot))
    throw new Error(notAProjectFolder(project));

  await serveMcp(
    {
      runtime: execPath,
      entry,
      project,
      version: await loadVersion(packageRoot),
    },
    stdin,
    stdout
  );
};
