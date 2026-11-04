import type { RemovalStatus } from '../types/core.js';
import {
  access,
  lstat,
  mkdir,
  readdir,
  realpath,
  rm,
  writeFile,
} from 'node:fs/promises';
import { basename, dirname, join, sep } from 'node:path';

export const hasErrorCode = (error: unknown, code: string): boolean =>
  error instanceof Error && 'code' in error && error.code === code;

const isWithin = (root: string, path: string): boolean =>
  path === root || path.startsWith(`${root}${sep}`);

export const realPathOf = (path: string): Promise<string | undefined> =>
  realpath(path).catch(() => undefined);

/** The real location of a path that exists and resolves inside the root */
export const existingWithin = async (
  root: string,
  path: string
): Promise<string | undefined> => {
  const [realRoot, realPath] = await Promise.all([
    realPathOf(root),
    realPathOf(path),
  ]);

  if (realRoot === undefined || realPath === undefined) return undefined;

  return isWithin(realRoot, realPath) ? realPath : undefined;
};

/** The names in a folder that resolves inside the root, or none */
export const listingWithin = async (
  root: string,
  folder: string
): Promise<string[]> => {
  const real = await existingWithin(root, folder);

  if (real === undefined) return [];

  return readdir(real).catch((): string[] => []);
};

/** The entry itself, never what it links to, under a folder that resolves inside the root */
export const entryWithin = async (
  root: string,
  path: string
): Promise<string | undefined> => {
  const folder = await existingWithin(root, dirname(path));

  return folder === undefined ? undefined : join(folder, basename(path));
};

/** An entry to write inside the root, refusing a link that would carry the write elsewhere */
export const fileWithin = async (
  root: string,
  path: string
): Promise<string | undefined> => {
  const entry = await entryWithin(root, path);

  if (entry === undefined) return undefined;

  const stats = await lstat(entry).catch(() => undefined);

  return stats?.isSymbolicLink() === true ? undefined : entry;
};

export const ensureDir = async (dir: string): Promise<void> => {
  await mkdir(dir, { recursive: true });
};

export const pathExists = async (path: string): Promise<boolean> => {
  try {
    await access(path);

    return true;
  } catch {
    return false;
  }
};

export const writeFileOverwrite = async (
  filePath: string,
  contents: string
): Promise<void> => {
  await writeFile(filePath, contents, 'utf8');
};

export const removeFileIfPresent = async (
  filePath: string
): Promise<RemovalStatus> => {
  try {
    await rm(filePath);

    return 'removed';
  } catch (error) {
    if (hasErrorCode(error, 'ENOENT')) return 'absent';

    throw error;
  }
};

/** Removes a file, a folder, or a link itself, even one whose target is gone */
export const removeEntryIfPresent = async (
  path: string
): Promise<RemovalStatus> => {
  try {
    await lstat(path);
  } catch {
    return 'absent';
  }

  await rm(path, { recursive: true, force: true });

  return 'removed';
};
