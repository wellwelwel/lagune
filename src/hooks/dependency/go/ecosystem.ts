import type {
  CoverageScope,
  DependencyEcosystem,
  DependencyFlag,
  DependencyReader,
} from '../../../types/hooks/dependency.js';
import { basename, dirname, join } from 'node:path';
import { deepFreeze } from '../../../core/collections.js';
import { readGoMod } from './module.js';
import { missingChecksumFlags, readGoSum } from './sum.js';

const MANIFEST = 'go.mod';

const CHECKSUMS = 'go.sum';

const READERS: ReadonlyMap<string, DependencyReader> = new Map([
  [MANIFEST, readGoMod],
  [CHECKSUMS, readGoSum],
]);

const flagsBeside = async (
  file: string,
  scope: CoverageScope
): Promise<DependencyFlag[]> => {
  if (basename(file) !== CHECKSUMS) return [];

  const manifest = join(dirname(file), MANIFEST);

  if (!scope.has(manifest)) return [];

  const [sumContent, modContent] = await Promise.all([
    scope.textAt(file),
    scope.textAt(manifest),
  ]);

  return missingChecksumFlags(file, sumContent, manifest, modContent);
};

/** Go modules, each judged as it builds on its own: its go.sum covers its go.mod and must check every module it fetches */
export const GO: DependencyEcosystem = deepFreeze({
  readerOf: (file: string) => READERS.get(basename(file)) ?? null,
  keeps: (file: string) => READERS.has(basename(file)),
  coveredBeside: async (manifest: string, scope: CoverageScope) =>
    scope.has(join(dirname(manifest), CHECKSUMS)),
  rootsWorkspace: async () => false,
  flagsBeside,
});
