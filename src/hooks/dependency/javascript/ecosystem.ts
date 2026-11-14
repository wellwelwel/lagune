import type {
  CoverageScope,
  DependencyEcosystem,
  DependencyFlag,
  DependencyReader,
  LockedEntry,
} from '../../../types/hooks/dependency.js';
import { basename, dirname, join } from 'node:path';
import {
  deepFreeze,
  isPlainRecord,
  ownValue,
} from '../../../core/collections.js';
import { parseJsonObject } from '../../../core/json.js';
import { tableOrEmptyAt } from '../fields.js';
import { flagsRead } from '../read.js';
import { cannotJudge } from '../text.js';
import { lockedFlags } from './lockfile.js';
import { readManifest } from './manifest.js';
import { npmEntries } from './npm.js';
import { npmrcSettingsOf, readNpmrc } from './npmrc.js';
import { pnpmEntries } from './pnpm.js';
import { readYarnrc, readYarnrcYml } from './yarn-config.js';
import { yarnEntries } from './yarn.js';

const MANIFEST = 'package.json';

const WORKSPACE_FILE = 'pnpm-workspace.yaml';

const NPMRC = '.npmrc';

/** Angular's workspace file, which lists the root of each project it builds from the one install at its folder */
const ANGULAR_WORKSPACE = 'angular.json';

/** Nx's workspace file and the file that makes a folder one of its projects, built from the one install at the workspace's folder */
const NX_WORKSPACE = 'nx.json';

const NX_PROJECT = 'project.json';

const NPM_LOCKFILES: ReadonlySet<string> = new Set([
  'package-lock.json',
  'npm-shrinkwrap.json',
]);

/** The lockfiles whose install scripts an .npmrc beside them can switch off */
const SCRIPTED_LOCKFILES: ReadonlySet<string> = new Set([
  ...NPM_LOCKFILES,
  'pnpm-lock.yaml',
]);

const lockfileReader =
  (
    entries: (file: string, content: string) => LockedEntry[]
  ): DependencyReader =>
  (file, content) =>
    flagsRead(lockedFlags(entries(file, content)));

const LOCKFILE_READERS: ReadonlyMap<string, DependencyReader> = new Map([
  ...[...NPM_LOCKFILES].map((name): [string, DependencyReader] => [
    name,
    lockfileReader(npmEntries),
  ]),
  ['pnpm-lock.yaml', lockfileReader(pnpmEntries)],
  ['yarn.lock', lockfileReader(yarnEntries)],
]);

const READERS: ReadonlyMap<string, DependencyReader> = new Map([
  [MANIFEST, readManifest],
  [NPMRC, readNpmrc],
  ['.yarnrc', readYarnrc],
  ['.yarnrc.yml', readYarnrcYml],
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
  ...READERS.keys(),
  ...LOCKFILES,
  WORKSPACE_FILE,
  ANGULAR_WORKSPACE,
  NX_WORKSPACE,
  NX_PROJECT,
]);

const holdsLockfile = (folder: string, scope: CoverageScope): boolean =>
  LOCKFILES.some((name) => scope.has(join(folder, name)));

/** Whether the angular.json in a folder builds a project from the manifest's folder */
const isAngularProject = async (
  folder: string,
  scope: CoverageScope,
  manifest: string
): Promise<boolean> => {
  const workspace = join(folder, ANGULAR_WORKSPACE);

  if (!scope.has(workspace)) return false;

  const projects = tableOrEmptyAt(
    workspace,
    parseJsonObject(await scope.textAt(workspace), workspace, cannotJudge),
    'projects',
    ''
  );

  return Object.values(projects).some((project) => {
    const root = isPlainRecord(project) ? ownValue(project, 'root') : undefined;

    return (
      typeof root === 'string' && join(folder, root, MANIFEST) === manifest
    );
  });
};

const isNxProject = (
  folder: string,
  scope: CoverageScope,
  manifest: string
): boolean =>
  scope.has(join(folder, NX_WORKSPACE)) &&
  scope.has(join(dirname(manifest), NX_PROJECT));

/** The flags of a lockfile once the .npmrc beside it is read, which can switch install scripts off or keep a URL on the public registry as written */
const resolveBeside = async (
  file: string,
  flags: readonly DependencyFlag[],
  scope: CoverageScope
): Promise<readonly DependencyFlag[]> => {
  const lockfile = basename(file);

  if (!SCRIPTED_LOCKFILES.has(lockfile)) return flags;

  const npmrc = join(dirname(file), NPMRC);

  if (!scope.has(npmrc)) return flags;

  const settings = npmrcSettingsOf(await scope.textAt(npmrc));
  const resolved =
    NPM_LOCKFILES.has(lockfile) && settings.keepsLockedRegistryUrls
      ? lockedFlags(npmEntries(file, await scope.textAt(file), true))
      : flags;

  return settings.ignoresScripts
    ? resolved.filter(({ verdict }) => verdict !== 'install-script')
    : resolved;
};

/** npm, pnpm, Yarn, and the lockfiles of Bun and Deno, which cover a manifest without being read, where a workspace root also covers the projects Angular and Nx build from its one install */
export const JAVASCRIPT: DependencyEcosystem = deepFreeze({
  readerOf: (file: string) => READERS.get(basename(file)) ?? null,
  keeps: (file: string) => KEPT.has(basename(file)),
  coveredBeside: async (manifest: string, scope: CoverageScope) =>
    holdsLockfile(dirname(manifest), scope),
  rootsWorkspace: async (
    folder: string,
    scope: CoverageScope,
    manifest: string
  ) => {
    if (!holdsLockfile(folder, scope)) return false;
    if (scope.has(join(folder, WORKSPACE_FILE))) return true;
    if (isNxProject(folder, scope, manifest)) return true;

    const root = join(folder, MANIFEST);

    if (scope.has(root) && (await scope.readAt(root)).declaresWorkspace)
      return true;

    return isAngularProject(folder, scope, manifest);
  },
  resolveBeside,
});
