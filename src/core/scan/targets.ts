import { realpath } from 'node:fs/promises';
import { isAbsolute, relative, resolve, sep } from 'node:path';

const realOrSelf = async (path: string): Promise<string> => {
  try {
    return await realpath(path);
  } catch {
    return path;
  }
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
  const realRoot = await realOrSelf(root);
  const resolved = await Promise.all(
    (targets.length > 0 ? targets : ['.']).map(async (target) => {
      const path = resolve(root, target);

      return { target, path, real: await realOrSelf(path) };
    })
  );
  const outside = resolved.filter(({ real }) => !isWithin(realRoot, real));

  if (outside.length > 0)
    throw new Error(
      `the checkers scan only inside the project, and ${outside.map(({ target }) => `"${target}"`).join(', ')} is outside it`
    );

  return resolved.map(({ path }) => path);
};
