import type {
  CoverageScope,
  DependencyEcosystem,
  DependencyReader,
} from '../../../types/hooks/dependency.js';
import { basename, dirname, join } from 'node:path';
import { deepFreeze } from '../../../core/collections.js';
import { readPipConfig } from './pip-config.js';
import { readPipfile, readPipfileLock } from './pipenv.js';
import { readPoetryLock } from './poetry.js';
import { readPyproject } from './pyproject.js';
import { readRequirements } from './requirements.js';
import { readUvConfig, readUvLock } from './uv.js';

const PYPROJECT = 'pyproject.toml';

const PIPFILE = 'Pipfile';

const PIPFILE_LOCK = 'Pipfile.lock';

const POETRY_LOCK = 'poetry.lock';

const UV_LOCK = 'uv.lock';

const REQUIREMENTS = 'requirements';

const READERS: ReadonlyMap<string, DependencyReader> = new Map([
  [PYPROJECT, readPyproject],
  [PIPFILE, readPipfile],
  [PIPFILE_LOCK, readPipfileLock],
  [POETRY_LOCK, readPoetryLock],
  [UV_LOCK, readUvLock],
  ['uv.toml', readUvConfig],
  ['pip.conf', readPipConfig],
  ['pip.ini', readPipConfig],
]);

/** The lockfiles that pin a pyproject.toml beside them, including PDM's, whose entries the checker does not read */
const PROJECT_LOCKFILES: readonly string[] = deepFreeze([
  POETRY_LOCK,
  UV_LOCK,
  'pdm.lock',
]);

/** A PEP 751 lockfile, such as the one `pip lock` writes, which covers its folder without being read */
const PYLOCK = /^pylock\.(?:[\w-]{1,64}\.)?toml$/;

const NAME_SEPARATOR = /[-_.]/;

const TEXT_EXTENSION = '.txt';

/** A pip requirements file: a .txt whose name has the word requirements, or any .txt in a folder named requirements */
const isRequirementsFile = (file: string): boolean => {
  const name = basename(file).toLowerCase();

  if (!name.endsWith(TEXT_EXTENSION)) return false;

  return (
    name
      .slice(0, -TEXT_EXTENSION.length)
      .split(NAME_SEPARATOR)
      .includes(REQUIREMENTS) ||
    basename(dirname(file)).toLowerCase() === REQUIREMENTS
  );
};

const readerOf = (file: string): DependencyReader | null =>
  READERS.get(basename(file)) ??
  (isRequirementsFile(file) ? readRequirements : null);

const holdsPylock = (folder: string, scope: CoverageScope): boolean =>
  scope.filesIn(folder).some((file) => PYLOCK.test(basename(file)));

/** Whether a requirements file beside a project, or in its requirements folder, pins every version it installs */
const holdsPinnedRequirements = async (
  folder: string,
  scope: CoverageScope
): Promise<boolean> => {
  const candidates = [
    ...scope.filesIn(folder),
    ...scope.filesIn(join(folder, REQUIREMENTS)),
  ].filter(isRequirementsFile);
  const reads = await Promise.all(candidates.map((file) => scope.readAt(file)));

  return reads.some(({ pins }) => pins);
};

/** What pins each kind of manifest: a Pipfile only its Pipfile.lock, a requirements file only a PEP 751 lockfile, and a pyproject.toml any of the lockfiles its tools write or a pinned requirements file */
const coveredBeside = async (
  manifest: string,
  scope: CoverageScope
): Promise<boolean> => {
  const folder = dirname(manifest);
  const name = basename(manifest);

  if (name === PIPFILE) return scope.has(join(folder, PIPFILE_LOCK));
  if (holdsPylock(folder, scope)) return true;
  if (name !== PYPROJECT) return false;
  if (PROJECT_LOCKFILES.some((lockfile) => scope.has(join(folder, lockfile))))
    return true;

  return holdsPinnedRequirements(folder, scope);
};

/** pip, Poetry, Pipenv, and uv, plus the lockfiles of PDM and PEP 751, which cover a manifest without being read, and the uv workspaces, whose lockfile covers only the pyproject.toml files below it */
export const PYTHON: DependencyEcosystem = deepFreeze({
  readerOf,
  keeps: (file: string) => {
    const name = basename(file);

    return (
      readerOf(file) !== null ||
      PROJECT_LOCKFILES.includes(name) ||
      PYLOCK.test(name)
    );
  },
  coveredBeside,
  rootsWorkspace: async (
    folder: string,
    scope: CoverageScope,
    manifest: string
  ) => {
    const root = join(folder, PYPROJECT);

    return (
      basename(manifest) === PYPROJECT &&
      scope.has(join(folder, UV_LOCK)) &&
      scope.has(root) &&
      (await scope.readAt(root)).declaresWorkspace
    );
  },
});
