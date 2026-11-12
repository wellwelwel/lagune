import type { LockedState } from '../types/core.js';
import { lstat, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { fileWithin, retryWhileInUse } from './fs-actions.js';

const MAX_STATE_FILE_BYTES = 1024 * 1024;
const PERMISSION_BITS = 0o777;

export const stateFileRefusal = (file: string, problem: string): Error =>
  new Error(`${file} ${problem}: fix it, then run this again.`);

/** A state file to write inside the project, refusing a link or a state folder that resolves outside it */
export const containedStateFile = async (
  cwd: string,
  file: string
): Promise<string> => {
  const path = await fileWithin(cwd, join(cwd, file));

  if (path === undefined)
    throw stateFileRefusal(
      file,
      'must be a file inside this project, not a link or a path outside it'
    );

  return path;
};

/** A state file's text, none while it is absent, refusing one outside the project, one that is not a regular file, or one too large to be state */
export const readStateFile = async (
  cwd: string,
  file: string
): Promise<string | null> => {
  const stats = await lstat(join(cwd, file)).catch(() => undefined);

  if (stats === undefined) return null;

  const path = await containedStateFile(cwd, file);

  if (!stats.isFile()) throw stateFileRefusal(file, 'is not a regular file');
  if (stats.size > MAX_STATE_FILE_BYTES)
    throw stateFileRefusal(file, 'is larger than 1 MiB');

  try {
    return await readFile(path, 'utf8');
  } catch {
    throw stateFileRefusal(file, 'could not be read');
  }
};

const permissionsOf = async (path: string): Promise<number | undefined> => {
  const stats = await lstat(path).catch(() => undefined);

  return stats === undefined ? undefined : stats.mode & PERMISSION_BITS;
};

/** Replaces a state file inside the project in one step, keeping its permissions, refusing a link or a state folder that resolves outside it */
export const writeStateFile = async (
  state: LockedState,
  file: string,
  contents: string
): Promise<void> => {
  const path = await containedStateFile(state.cwd, file);
  const temporary = join(state.scratch, basename(path));
  const mode = await permissionsOf(path);

  await writeFile(temporary, contents, { encoding: 'utf8', flag: 'wx', mode });
  await retryWhileInUse(() => rename(temporary, path));
};

/** Removes a state file inside the project, refusing a link or a state folder that resolves outside it */
export const removeStateFile = async (
  state: LockedState,
  file: string
): Promise<void> => {
  const path = await containedStateFile(state.cwd, file);

  await retryWhileInUse(() => rm(path, { force: true }));
};
