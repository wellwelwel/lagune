import { resolve } from 'node:path';
import { execPath, stdin, stdout } from 'node:process';
import { noProjectFolder, notAProjectFolder } from '../cli/messages.js';
import { loadVersion } from '../core/version.js';
import { isFolder, isOwnFolderOrRoot } from '../mcp/project.js';
import { serveMcp } from '../mcp/server.js';

const UNEXPANDED_VARIABLE = /\$\{[^{}]*\}/;

/** An agent that cannot fill in the project variable passes it as written */
const projectNamed = (requested: string | undefined): string | undefined =>
  requested === undefined || UNEXPANDED_VARIABLE.test(requested)
    ? undefined
    : requested;

const namedProject = async (
  project: string,
  packageRoot: URL
): Promise<string> => {
  if (!(await isFolder(project))) throw new Error(noProjectFolder(project));
  if (await isOwnFolderOrRoot(project, packageRoot))
    throw new Error(notAProjectFolder(project));

  return project;
};

/** The folder the agent started the server in, unless it is no project and only the client's roots can name one */
const startingProject = async (
  cwd: string,
  packageRoot: URL
): Promise<string | undefined> =>
  (await isOwnFolderOrRoot(cwd, packageRoot)) ? undefined : cwd;

export const runMcp = async (
  requested: string | undefined,
  cwd: string,
  packageRoot: URL,
  entry: string
): Promise<void> => {
  const named = projectNamed(requested);
  const project =
    named === undefined
      ? await startingProject(cwd, packageRoot)
      : await namedProject(resolve(cwd, named), packageRoot);

  await serveMcp(
    {
      runtime: execPath,
      entry,
      project,
      packageRoot,
      version: await loadVersion(packageRoot),
    },
    stdin,
    stdout
  );
};
