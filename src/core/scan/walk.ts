import type { GitIgnores, GitScope } from '../../types/git.js';
import type { WalkFilter, WalkResult } from '../../types/scan.js';
import { readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { deepFreeze } from '../collections.js';
import { gitIgnoresOf } from '../git/repository.js';
import { skipsFile, subfolderScope, targetScope } from '../git/scope.js';

const NOTHING: WalkResult = deepFreeze({ files: [], skipped: [] });

const isIgnoredDir = (
  filter: WalkFilter,
  scanRoot: string,
  path: string,
  name: string
): boolean =>
  filter.ignoredDirs.has(name) ||
  filter.ignoredDirPatterns.some((pattern) => pattern.test(name)) ||
  path === join(scanRoot, '.lagune');

const sortedUnique = (paths: readonly string[]): string[] =>
  [...new Set(paths)].toSorted((left, right) => left.localeCompare(right));

const collect = async (
  scanRoot: string,
  displayRoot: string,
  current: string,
  filter: WalkFilter,
  scope: GitScope | null
): Promise<WalkResult> => {
  let entries;

  try {
    entries = await readdir(current, { withFileTypes: true });
  } catch {
    return NOTHING;
  }

  const files: string[] = [];
  const skipped: string[] = [];

  for (const entry of entries.toSorted((left, right) =>
    left.name.localeCompare(right.name)
  )) {
    const path = join(current, entry.name);
    const relativePath = relative(displayRoot, path);

    if (entry.isDirectory()) {
      if (isIgnoredDir(filter, scanRoot, path, entry.name)) continue;

      const inner =
        scope === null ? null : await subfolderScope(scope, entry.name, path);

      if (inner === 'skipped') {
        skipped.push(relativePath);
        continue;
      }

      const walked = await collect(scanRoot, displayRoot, path, filter, inner);

      files.push(...walked.files);
      skipped.push(...walked.skipped);
      continue;
    }

    if (!entry.isFile() || !filter.accept(relativePath)) continue;

    if (scope !== null && skipsFile(scope, entry.name)) {
      skipped.push(relativePath);
      continue;
    }

    files.push(relativePath);
  }

  return { files, skipped };
};

const walkTarget = async (
  root: string,
  target: string,
  filter: WalkFilter,
  ignores: GitIgnores | null
): Promise<WalkResult> => {
  const stats = await stat(target).catch(() => undefined);

  if (stats === undefined) return NOTHING;

  if (stats.isFile()) {
    const relativePath = relative(root, target);

    return filter.accept(relativePath)
      ? { files: [relativePath], skipped: [] }
      : NOTHING;
  }

  const scope = await targetScope(root, target, ignores);

  return collect(target, root, target, filter, scope);
};

/** Lists each file the targets hold once, leaving out what Git ignores below a target Git does not ignore itself */
export const walkTargets = async (
  root: string,
  targets: readonly string[],
  filter: WalkFilter
): Promise<WalkResult> => {
  const ignores = await gitIgnoresOf(root);
  const walked = await Promise.all(
    targets.map((target) => walkTarget(root, target, filter, ignores))
  );

  return {
    files: sortedUnique(walked.flatMap(({ files }) => files)),
    skipped: sortedUnique(walked.flatMap(({ skipped }) => skipped)),
  };
};
