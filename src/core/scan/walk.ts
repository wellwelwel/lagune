import type { CheckerSettings } from '../../types/checkers.js';
import type { GitIgnores, GitScope, IgnoreRule } from '../../types/git.js';
import type {
  ConfigIgnores,
  SkippedCounts,
  SkippedPaths,
  WalkContext,
  WalkFilter,
  WalkResult,
} from '../../types/scan.js';
import { readdir, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { costlyPatterns, readIgnorePattern } from '../checkers.js';
import { deepFreeze } from '../collections.js';
import { isIgnored, MATCH_STEPS } from '../git/pattern.js';
import { gitIgnoresOf } from '../git/repository.js';
import { skipsFile, subfolderScope, targetScope } from '../git/scope.js';

const NOTHING: WalkResult = deepFreeze({
  files: [],
  skipped: { git: [], configs: [] },
});

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

const segmentsOf = (relativePath: string): string[] =>
  relativePath.split(sep).filter((segment) => segment !== '');

const matchesConfig = (
  ignores: ConfigIgnores,
  segments: readonly string[],
  isDirectory: boolean
): boolean => {
  const matched = isIgnored(
    ignores.lists,
    segments,
    isDirectory,
    ignores.budget
  );

  if (ignores.budget.remaining <= 0) throw costlyPatterns();

  return matched;
};

const isExcluded = (
  context: WalkContext,
  relativePath: string,
  isDirectory: boolean
): boolean =>
  context.configIgnores !== null &&
  matchesConfig(context.configIgnores, segmentsOf(relativePath), isDirectory);

const collect = async (
  context: WalkContext,
  current: string,
  scope: GitScope | null
): Promise<WalkResult> => {
  let entries;

  try {
    entries = await readdir(current, { withFileTypes: true });
  } catch {
    return NOTHING;
  }

  const files: string[] = [];
  const git: string[] = [];
  const configs: string[] = [];

  for (const entry of entries.toSorted((left, right) =>
    left.name.localeCompare(right.name)
  )) {
    const path = join(current, entry.name);
    const relativePath = relative(context.displayRoot, path);

    if (entry.isDirectory()) {
      if (isIgnoredDir(context.filter, context.scanRoot, path, entry.name))
        continue;

      if (isExcluded(context, relativePath, true)) {
        configs.push(relativePath);
        continue;
      }

      const inner =
        scope === null ? null : await subfolderScope(scope, entry.name, path);

      if (inner === 'skipped') {
        git.push(relativePath);
        continue;
      }

      const walked = await collect(context, path, inner);

      files.push(...walked.files);
      git.push(...walked.skipped.git);
      configs.push(...walked.skipped.configs);
      continue;
    }

    if (!entry.isFile() || !context.filter.accept(relativePath)) continue;

    if (isExcluded(context, relativePath, false)) {
      configs.push(relativePath);
      continue;
    }

    if (scope !== null && skipsFile(scope, entry.name)) {
      git.push(relativePath);
      continue;
    }

    files.push(relativePath);
  }

  return { files, skipped: { git, configs } };
};

const ruleOf = (pattern: string): IgnoreRule => {
  const read = readIgnorePattern(pattern);

  if ('problem' in read)
    throw new Error(
      `The ignore pattern ${JSON.stringify(pattern)} ${read.problem}.`
    );

  return read.rule;
};

const configIgnoresOf = (patterns: readonly string[]): ConfigIgnores | null =>
  patterns.length === 0
    ? null
    : {
        lists: [{ base: [], rules: patterns.map(ruleOf) }],
        budget: { remaining: MATCH_STEPS },
      };

const excludesTarget = (
  ignores: ConfigIgnores,
  segments: readonly string[]
): boolean =>
  segments.some((_segment, index) =>
    matchesConfig(ignores, segments.slice(0, index + 1), true)
  );

const walkTarget = async (
  root: string,
  target: string,
  filter: WalkFilter,
  ignores: GitIgnores | null,
  patterns: readonly string[]
): Promise<WalkResult> => {
  const stats = await stat(target).catch(() => undefined);

  if (stats === undefined) return NOTHING;

  const relativePath = relative(root, target);

  if (stats.isFile())
    return filter.accept(relativePath)
      ? { files: [relativePath], skipped: NOTHING.skipped }
      : NOTHING;

  const configIgnores = configIgnoresOf(patterns);
  const targetExcluded =
    configIgnores !== null &&
    excludesTarget(configIgnores, segmentsOf(relativePath));
  const context: WalkContext = {
    scanRoot: target,
    displayRoot: root,
    filter,
    configIgnores: targetExcluded ? null : configIgnores,
  };

  return collect(context, target, await targetScope(root, target, ignores));
};

/** Lists each file the targets hold once, leaving out what Git or the checker's settings ignore below a target they do not ignore themselves */
export const walkTargets = async (
  root: string,
  targets: readonly string[],
  filter: WalkFilter,
  settings: CheckerSettings
): Promise<WalkResult> => {
  const ignores = settings.gitignore ? await gitIgnoresOf(root) : null;
  const walked = await Promise.all(
    targets.map((target) =>
      walkTarget(root, target, filter, ignores, settings.ignore)
    )
  );
  const skipped = (origin: keyof SkippedPaths): string[] =>
    sortedUnique(walked.flatMap((result) => result.skipped[origin]));

  return {
    files: sortedUnique(walked.flatMap(({ files }) => files)),
    skipped: { git: skipped('git'), configs: skipped('configs') },
  };
};

export const skippedCounts = ({
  git,
  configs,
}: SkippedPaths): SkippedCounts => ({
  git: git.length,
  configs: configs.length,
});
