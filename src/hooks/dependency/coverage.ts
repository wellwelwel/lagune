import type {
  CoverageScope,
  JudgedFile,
} from '../../types/hooks/dependency.js';
import { dirname } from 'node:path';

const foldersAbove = (folder: string): string[] => {
  const parent = dirname(folder);

  return parent === folder ? [] : [parent, ...foldersAbove(parent)];
};

const isCovered = async (
  { file, ecosystem }: JudgedFile,
  scope: CoverageScope
): Promise<boolean> => {
  if (await ecosystem.coveredBeside(file, scope)) return true;

  const roots = await Promise.all(
    foldersAbove(dirname(file)).map((folder) =>
      ecosystem.rootsWorkspace(folder, scope, file)
    )
  );

  return roots.includes(true);
};

/** The files that declare dependencies with nothing to pin them, neither beside them nor at a workspace root above them */
export const uncoveredManifests = async (
  judged: readonly JudgedFile[],
  scope: CoverageScope
): Promise<Set<string>> => {
  const pending = judged.filter(({ read }) => read.needsLockfile);
  const covered = await Promise.all(
    pending.map((entry) => isCovered(entry, scope))
  );

  return new Set(
    pending.flatMap(({ file }, index) => (covered[index] ? [] : [file]))
  );
};
