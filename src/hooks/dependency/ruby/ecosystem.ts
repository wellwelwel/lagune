import type {
  CoverageScope,
  DependencyEcosystem,
  DependencyReader,
} from '../../../types/hooks/dependency.js';
import { basename, dirname, join } from 'node:path';
import { deepFreeze } from '../../../core/collections.js';
import { readGemfile } from './gemfile.js';
import { readGemfileLock } from './lockfile.js';

const GEMFILE = 'Gemfile';

const GEMFILE_LOCK = 'Gemfile.lock';

const GEMS_RB = 'gems.rb';

const GEMS_LOCKED = 'gems.locked';

/** Each name Bundler reads a manifest from and the lockfile it pins that manifest with */
const LOCKFILES: ReadonlyMap<string, string> = new Map([
  [GEMFILE, GEMFILE_LOCK],
  [GEMS_RB, GEMS_LOCKED],
]);

const READERS: ReadonlyMap<string, DependencyReader> = new Map([
  [GEMFILE, readGemfile],
  [GEMS_RB, readGemfile],
  [GEMFILE_LOCK, readGemfileLock],
  [GEMS_LOCKED, readGemfileLock],
]);

/** Bundler, whose lockfile covers only the manifest beside it */
export const RUBY: DependencyEcosystem = deepFreeze({
  readerOf: (file: string) => READERS.get(basename(file)) ?? null,
  keeps: (file: string) => READERS.has(basename(file)),
  coveredBeside: async (manifest: string, scope: CoverageScope) => {
    const lockfile = LOCKFILES.get(basename(manifest));

    return (
      lockfile !== undefined && scope.has(join(dirname(manifest), lockfile))
    );
  },
  rootsWorkspace: async () => false,
});
