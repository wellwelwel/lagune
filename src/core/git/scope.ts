import type { GitIgnores, GitScope, GitTracking } from '../../types/git.js';
import { basename, join, relative, sep } from 'node:path';
import { isIgnored, MATCH_STEPS } from './pattern.js';
import { ignoreListAt } from './repository.js';

const IGNORE_FILE = '.gitignore';

const withFolderRules = async (
  scope: GitScope,
  folder: string
): Promise<GitScope> => {
  if (scope.ignored) return scope;

  const list = await ignoreListAt(
    join(folder, IGNORE_FILE),
    scope.segments,
    false
  );

  return list === null ? scope : { ...scope, lists: [...scope.lists, list] };
};

const tracks = (
  scope: GitScope,
  segments: readonly string[],
  isDirectory: boolean
): boolean => {
  const { files, directories } = scope.tracked;

  return (isDirectory ? directories : files).has(segments.join('/'));
};

/** Whether Git ignores a file in the scope's folder, never one it tracks */
export const skipsFile = (scope: GitScope, name: string): boolean => {
  const segments = [...scope.segments, name];

  return (
    !tracks(scope, segments, false) &&
    (scope.ignored || isIgnored(scope.lists, segments, false, scope.budget))
  );
};

/** The scope a subfolder walks under, or `skipped` when Git ignores it and tracks nothing inside it */
export const subfolderScope = async (
  scope: GitScope,
  name: string,
  folder: string
): Promise<GitScope | 'skipped'> => {
  const segments = [...scope.segments, name];
  const ignored =
    scope.ignored || isIgnored(scope.lists, segments, true, scope.budget);

  if (ignored && !tracks(scope, segments, true)) return 'skipped';

  return withFolderRules({ ...scope, segments, ignored }, folder);
};

const folderScope = async (
  root: string,
  rootScope: GitScope,
  names: readonly string[]
): Promise<GitScope | null> => {
  let scope = rootScope;

  for (const name of names) {
    const inner = await subfolderScope(
      scope,
      name,
      join(root, ...scope.segments, name)
    );

    if (inner === 'skipped' || inner.ignored) return null;

    scope = inner;
  }

  return scope;
};

/** The scope the project root walks under, with a match budget of its own, or none without Git ignores to follow */
export const rootScopeOf = async (
  root: string,
  ignores: GitIgnores | null
): Promise<GitScope | null> =>
  ignores === null
    ? null
    : withFolderRules(
        {
          ...ignores,
          segments: [],
          ignored: false,
          budget: { remaining: MATCH_STEPS },
        },
        root
      );

/** The scope a scan target walks under, or none when Git ignores nothing there or ignores the named target itself */
export const targetScope = async (
  root: string,
  target: string,
  ignores: GitIgnores | null
): Promise<GitScope | null> => {
  const rootScope = await rootScopeOf(root, ignores);

  if (rootScope === null) return null;

  const names = relative(root, target)
    .split(sep)
    .filter((name) => name !== '');

  return folderScope(root, rootScope, names);
};

/** Whether Git tracks, ignores, or would commit a file named from the project root, spending the root scope's match budget, or `unknown` without one */
export const trackingOf = async (
  root: string,
  file: string,
  rootScope: GitScope | null
): Promise<GitTracking> => {
  if (rootScope === null) return 'unknown';

  const segments = file.split(sep);

  if (tracks(rootScope, segments, false)) return 'tracked';

  const scope = await folderScope(root, rootScope, segments.slice(0, -1));

  return scope === null || skipsFile(scope, basename(file))
    ? 'ignored'
    : 'unignored';
};
