import type {
  CoverageScope,
  DependencyEcosystem,
  DependencyReader,
  LockedEntry,
} from '../../../types/hooks/dependency.js';
import { basename, dirname, join } from 'node:path';
import { deepFreeze } from '../../../core/collections.js';
import { flagsRead } from '../read.js';
import { lockedFlags } from './lockfile.js';
import { readManifest } from './manifest.js';
import { npmEntries } from './npm.js';
import { pnpmEntries } from './pnpm.js';
import { yarnEntries } from './yarn.js';

const MANIFEST = 'package.json';

const WORKSPACE_FILE = 'pnpm-workspace.yaml';

const lockfileReader =
  (
    entries: (file: string, content: string) => LockedEntry[]
  ): DependencyReader =>
  (file, content) =>
    flagsRead(lockedFlags(entries(file, content)));

const LOCKFILE_READERS: ReadonlyMap<string, DependencyReader> = new Map([
  ['package-lock.json', lockfileReader(npmEntries)],
  ['npm-shrinkwrap.json', lockfileReader(npmEntries)],
  ['pnpm-lock.yaml', lockfileReader(pnpmEntries)],
  ['yarn.lock', lockfileReader(yarnEntries)],
]);

const READERS: ReadonlyMap<string, DependencyReader> = new Map([
  [MANIFEST, readManifest],
  ...LOCKFILE_READERS,
]);

/** Every lockfile that covers the manifest beside it, including the ones whose entries the checker does not read */
const LOCKFILES: readonly string[] = deepFreeze([
  ...LOCKFILE_READERS.keys(),
  'bun.lock',
  'bun.lockb',
  'deno.lock',
]);

const KEPT: ReadonlySet<string> = new Set([
  MANIFEST,
  WORKSPACE_FILE,
  ...LOCKFILES,
]);

const holdsLockfile = (folder: string, scope: CoverageScope): boolean =>
  LOCKFILES.some((name) => scope.has(join(folder, name)));

/** npm, pnpm, Yarn, and the lockfiles of Bun and Deno, which cover a manifest without being read */
export const JAVASCRIPT: DependencyEcosystem = deepFreeze({
  readerOf: (file: string) => READERS.get(basename(file)) ?? null,
  keeps: (file: string) => KEPT.has(basename(file)),
  coveredBeside: async (manifest: string, scope: CoverageScope) =>
    holdsLockfile(dirname(manifest), scope),
  rootsWorkspace: async (folder: string, scope: CoverageScope) => {
    if (!holdsLockfile(folder, scope)) return false;
    if (scope.has(join(folder, WORKSPACE_FILE))) return true;

    const manifest = join(folder, MANIFEST);

    return (
      scope.has(manifest) && (await scope.readAt(manifest)).declaresWorkspace
    );
  },
});
