import {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} from 'node:path';
import { realPathOf } from '../fs-actions.js';

/** The real location of a path, the part that does not exist yet resolved from its deepest existing folder */
const realLocationOf = async (path: string): Promise<string> => {
  const real = await realPathOf(path);

  if (real !== undefined) return real;

  const parent = dirname(path);

  if (parent === path) return path;

  return join(await realLocationOf(parent), basename(path));
};

const isWithin = (root: string, path: string): boolean => {
  const fromRoot = relative(root, path);

  return (
    !isAbsolute(fromRoot) &&
    fromRoot !== '..' &&
    !fromRoot.startsWith(`..${sep}`)
  );
};

/** Resolves the scan targets against the project root, refusing any that reaches outside it, links included */
export const resolveTargets = async (
  root: string,
  targets: string[]
): Promise<string[]> => {
  const realRoot = await realLocationOf(root);
  const resolved = await Promise.all(
    (targets.length > 0 ? targets : ['.']).map(async (target) => {
      const path = resolve(root, target);

      return { target, path, real: await realLocationOf(path) };
    })
  );
  const outside = resolved.filter(({ real }) => !isWithin(realRoot, real));

  if (outside.length > 0)
    throw new Error(
      `the checkers scan only inside the project, and ${outside.map(({ target }) => `"${target}"`).join(', ')} is outside it`
    );

  return resolved.map(({ path }) => path);
};
