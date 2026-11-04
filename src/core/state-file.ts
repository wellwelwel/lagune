import { lstat, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileWithin } from './fs-actions.js';

const MAX_STATE_FILE_BYTES = 1024 * 1024;

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
