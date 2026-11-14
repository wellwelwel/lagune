import type {
  CoverageScope,
  JudgedFile,
  ManifestCoverage,
} from '../../types/hooks/dependency.js';
import { dirname } from 'node:path';
import { unlessUnjudged } from './text.js';

const foldersAbove = (folder: string): string[] => {
  const parent = dirname(folder);

  return parent === folder ? [] : [parent, ...foldersAbove(parent)];
};

const isCovered = async (
  { file, ecosystem }: JudgedFile,
  scope: CoverageScope
): Promise<boolean> => {
  if (await unlessUnjudged(ecosystem.coveredBeside(file, scope), false))
    return true;

  const roots = await Promise.all(
    foldersAbove(dirname(file)).map((folder) =>
      unlessUnjudged(ecosystem.rootsWorkspace(folder, scope, file), false)
    )
  );

  return roots.includes(true);
};

/** The files that declare dependencies, split by whether a lockfile covers them, beside them or at a workspace root above them */
export const coverageOf = async (
  judged: readonly JudgedFile[],
  scope: CoverageScope
): Promise<ManifestCoverage> => {
  const pending = judged.filter(({ read }) => read.needsLockfile);
  const covered = await Promise.all(
    pending.map((entry) => isCovered(entry, scope))
  );
  const filesWhere = (expected: boolean): Set<string> =>
    new Set(
      pending.flatMap(({ file }, index) =>
        covered[index] === expected ? [file] : []
      )
    );

  return { covered: filesWhere(true), uncovered: filesWhere(false) };
};
