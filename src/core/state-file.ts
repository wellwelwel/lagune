import { join } from 'node:path';
import { fileWithin } from './fs-actions.js';

/** A state file to write inside the project, refusing a link or a state folder that resolves outside it */
export const containedStateFile = async (
  cwd: string,
  file: string
): Promise<string> => {
  const path = await fileWithin(cwd, join(cwd, file));

  if (path === undefined)
    throw new Error(
      `${file} must be a file inside this project, not a link or a path outside it: fix it, then run this again.`
    );

  return path;
};
