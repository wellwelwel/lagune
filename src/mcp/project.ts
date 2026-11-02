import { stat } from 'node:fs/promises';
import { parse } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readField } from '../core/collections.js';
import { existingWithin } from '../core/fs-actions.js';

const FILE_SCHEME = 'file:';

export const isFolder = async (path: string): Promise<boolean> => {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
};

/** Whether a folder is the engine's own or the root of the file system, never a project */
export const isOwnFolderOrRoot = async (
  folder: string,
  packageRoot: URL
): Promise<boolean> =>
  parse(folder).root === folder ||
  (await existingWithin(fileURLToPath(packageRoot), folder)) !== undefined;

const localFolderOf = (uri: unknown): string | undefined => {
  if (typeof uri !== 'string' || !URL.canParse(uri)) return undefined;

  const url = new URL(uri);

  if (url.protocol !== FILE_SCHEME) return undefined;

  try {
    return fileURLToPath(url);
  } catch {
    return undefined;
  }
};

/** The project a client names by listing it as its only root, or none for any other list */
export const projectFromRoots = async (
  answer: unknown,
  packageRoot: URL
): Promise<string | undefined> => {
  const roots = readField(answer, 'roots');

  if (!Array.isArray(roots) || roots.length !== 1) return undefined;

  const folder = localFolderOf(readField(roots[0], 'uri'));

  if (folder === undefined || !(await isFolder(folder))) return undefined;
  if (await isOwnFolderOrRoot(folder, packageRoot)) return undefined;

  return folder;
};
