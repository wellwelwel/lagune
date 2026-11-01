import { access, constants, stat } from 'node:fs/promises';
import { basename, delimiter, dirname, isAbsolute, join } from 'node:path';
import { env, platform } from 'node:process';

const NODE_BINARY = platform === 'win32' ? 'node.exe' : 'node';

const isPackageBinFolder = (entry: string): boolean =>
  basename(entry) === '.bin' && basename(dirname(entry)) === 'node_modules';

const isExecutableFile = async (path: string): Promise<boolean> => {
  try {
    await access(path, constants.X_OK);

    return (await stat(path)).isFile();
  } catch {
    return false;
  }
};

export const pathKey = (): string =>
  Object.keys(env).find((key) => key.toUpperCase() === 'PATH') ?? 'PATH';

/** The folders of a search path that neither the working folder nor a package can plant into */
export const trustedFolders = (inherited: string | undefined): string[] =>
  (inherited ?? '')
    .split(delimiter)
    .filter((entry) => isAbsolute(entry) && !isPackageBinFolder(entry));

/** The Node.js on the trusted folders of the search path, for a host that does not run on Node.js itself */
export const nodeOnSearchPath = async (
  inherited: string | undefined = env[pathKey()]
): Promise<string | undefined> => {
  const candidates = trustedFolders(inherited).map((folder) =>
    join(folder, NODE_BINARY)
  );
  const executable = await Promise.all(candidates.map(isExecutableFile));

  return candidates.find((_candidate, index) => executable[index]);
};
