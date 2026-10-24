import type { RemovalStatus } from '../types/core.js';
import { access, lstat, mkdir, rm, writeFile } from 'node:fs/promises';

const hasErrorCode = (error: unknown, code: string): boolean =>
  error instanceof Error && (error as NodeJS.ErrnoException).code === code;

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
