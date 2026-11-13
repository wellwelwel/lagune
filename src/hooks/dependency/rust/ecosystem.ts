import type {
  CoverageScope,
  DependencyEcosystem,
  DependencyReader,
} from '../../../types/hooks/dependency.js';
import { basename, dirname, join } from 'node:path';
import { deepFreeze } from '../../../core/collections.js';
import { readCargoConfig } from './config.js';
import { readCargoLock } from './lockfile.js';
import { readCargoManifest } from './manifest.js';

const MANIFEST = 'Cargo.toml';

const LOCKFILE = 'Cargo.lock';

/** What `cargo vendor` writes beside each crate it copies, recording the checksum of every file in it */
const VENDORED = '.cargo-checksum.json';

const CONFIG_FOLDER = '.cargo';

/** The names Cargo reads its configuration from, config being the one older releases wrote */
const CONFIG_NAMES: ReadonlySet<string> = new Set(['config.toml', 'config']);

const READERS: ReadonlyMap<string, DependencyReader> = new Map([
  [MANIFEST, readCargoManifest],
  [LOCKFILE, readCargoLock],
]);

const isConfig = (file: string): boolean =>
  CONFIG_NAMES.has(basename(file)) && basename(dirname(file)) === CONFIG_FOLDER;

const readerOf = (file: string): DependencyReader | null =>
  READERS.get(basename(file)) ?? (isConfig(file) ? readCargoConfig : null);

/** Cargo, whose lockfile covers the manifest beside it and, at a workspace root, every manifest below it, and whose vendored crates need none */
export const RUST: DependencyEcosystem = deepFreeze({
  readerOf,
  keeps: (file: string) =>
    readerOf(file) !== null || basename(file) === VENDORED,
  coveredBeside: async (manifest: string, scope: CoverageScope) => {
    const folder = dirname(manifest);

    return (
      scope.has(join(folder, LOCKFILE)) || scope.has(join(folder, VENDORED))
    );
  },
  rootsWorkspace: async (folder: string, scope: CoverageScope) => {
    const root = join(folder, MANIFEST);

    return (
      scope.has(join(folder, LOCKFILE)) &&
      scope.has(root) &&
      (await scope.readAt(root)).declaresWorkspace
    );
  },
});
