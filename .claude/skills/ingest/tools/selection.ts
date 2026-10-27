import type { Digest, Entry, Options, Scope, Target } from './types.ts';
import { basename, posix } from 'node:path';
import { parseAnchor, parseRange } from './anchor.ts';
import { fail } from './fail.ts';
import { extensionOf, stripRoot } from './paths.ts';

const normalizeDirectory = (directory: string): string => {
  const normalized = posix.normalize(directory).replace(/^\/+|\/+$/g, '');

  return normalized === '.' ? '' : normalized;
};

const isUnder = (path: string, directory: string): boolean =>
  directory === '' || path === directory || path.startsWith(`${directory}/`);

const inScope = (entry: Entry, scope: Scope): boolean => {
  if (entry.noise && !scope.noise) return false;
  if (
    scope.under.length > 0 &&
    !scope.under.some((directory) => isUnder(entry.path, directory))
  )
    return false;
  if (
    scope.extensions.length > 0 &&
    !scope.extensions.includes(extensionOf(entry.path))
  )
    return false;
  if (
    scope.name !== null &&
    !basename(entry.path).toLowerCase().includes(scope.name.toLowerCase())
  )
    return false;

  return true;
};

export const scopeFor = (digest: Digest, scope: Scope): Scope => ({
  ...scope,
  under: scope.under.map((directory) =>
    normalizeDirectory(stripRoot(digest, directory))
  ),
});

export const selectedEntries = (digest: Digest, options: Options): Entry[] => {
  const scope = scopeFor(digest, options.scope);

  return digest.entries.filter(
    (entry) => entry.kind === 'text' && inScope(entry, scope)
  );
};

export const resolveTargets = (
  digests: Digest[],
  options: Options
): Target[] => {
  const fromAt = options.at.map(
    (text) => parseAnchor(text) ?? fail(`invalid --at: ${text}`)
  );
  const fromPaths = options.paths.map((path) => ({
    path,
    range:
      options.lines === null
        ? null
        : (parseRange(options.lines) ??
          fail(`invalid --lines: ${options.lines}`)),
  }));

  return [...fromAt, ...fromPaths].flatMap(({ path, range }) => {
    const found = digests.flatMap((digest) => {
      const entry = digest.byPath.get(stripRoot(digest, path));

      return entry === undefined ? [] : [{ digest, entry, range }];
    });

    return found.length > 0 ? found : fail(`not in any digest: ${path}`);
  });
};
