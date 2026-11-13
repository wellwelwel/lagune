import type {
  CoverageScope,
  DependencyEcosystem,
  DependencyReader,
} from '../../../types/hooks/dependency.js';
import { basename, dirname, extname, join } from 'node:path';
import { deepFreeze } from '../../../core/collections.js';
import { readNugetConfig } from './config.js';
import { readNugetLock } from './lockfile.js';
import { readMsbuildImport, readProjectFile } from './project.js';

const LOCKFILE = 'packages.lock.json';

/** The lockfile of one project among several in a folder, named after the project as packages.<project>.lock.json */
const PROJECT_LOCKFILE_PREFIX = 'packages.';

const PROJECT_LOCKFILE_SUFFIX = '.lock.json';

const NUGET_CONFIG = 'nuget.config';

const PROJECT_EXTENSIONS: ReadonlySet<string> = new Set([
  '.csproj',
  '.fsproj',
  '.vbproj',
]);

/** The files MSBuild imports into every project below them */
const IMPORTS: ReadonlySet<string> = new Set([
  'Directory.Build.props',
  'Directory.Build.targets',
  'Directory.Packages.props',
]);

const SPACE = / /g;

const isLockfile = (name: string): boolean =>
  name === LOCKFILE ||
  (name.startsWith(PROJECT_LOCKFILE_PREFIX) &&
    name.endsWith(PROJECT_LOCKFILE_SUFFIX) &&
    name.length >
      PROJECT_LOCKFILE_PREFIX.length + PROJECT_LOCKFILE_SUFFIX.length);

/** The reader of each file NuGet restores from, its configuration named without regard to case, as NuGet spells it both nuget.config and NuGet.Config */
const readerOf = (file: string): DependencyReader | null => {
  const name = basename(file);

  if (PROJECT_EXTENSIONS.has(extname(name))) return readProjectFile;
  if (IMPORTS.has(name)) return readMsbuildImport;
  if (name.toLowerCase() === NUGET_CONFIG) return readNugetConfig;

  return isLockfile(name) ? readNugetLock : null;
};

/** The lockfiles NuGet reads for a project, its own named after it, with every space as an underscore, before the folder's */
const lockfilesOf = (project: string): string[] => {
  const folder = dirname(project);
  const name = basename(project, extname(project)).replace(SPACE, '_');

  return [
    join(folder, `${PROJECT_LOCKFILE_PREFIX}${name}${PROJECT_LOCKFILE_SUFFIX}`),
    join(folder, LOCKFILE),
  ];
};

/** NuGet, whose lockfile covers only the project beside it */
export const DOTNET: DependencyEcosystem = deepFreeze({
  readerOf,
  keeps: (file: string) => readerOf(file) !== null,
  coveredBeside: async (project: string, scope: CoverageScope) =>
    lockfilesOf(project).some((lockfile) => scope.has(lockfile)),
  rootsWorkspace: async () => false,
});
