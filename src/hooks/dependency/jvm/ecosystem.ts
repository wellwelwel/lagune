import type {
  CoverageScope,
  DependencyEcosystem,
  DependencyReader,
} from '../../../types/hooks/dependency.js';
import { basename, dirname, join } from 'node:path';
import { deepFreeze } from '../../../core/collections.js';
import { readGradleLockfile, readGradleScript } from './gradle.js';
import { readMavenSettings, readPom } from './maven.js';
import { readWrapperProperties } from './wrapper.js';

const GRADLE_LOCKFILE = 'gradle.lockfile';

const POM = 'pom.xml';

const MAVEN_SETTINGS = 'settings.xml';

/** The folders a project keeps its Maven settings in */
const SETTINGS_FOLDERS: ReadonlySet<string> = new Set(['.mvn', '.m2']);

const SCRIPT_EXTENSIONS: readonly string[] = deepFreeze([
  '.gradle',
  '.gradle.kts',
]);

const READERS: ReadonlyMap<string, DependencyReader> = new Map([
  [POM, readPom],
  ['maven-wrapper.properties', readWrapperProperties],
  ['gradle-wrapper.properties', readWrapperProperties],
  [GRADLE_LOCKFILE, readGradleLockfile],
]);

/** A Groovy or Kotlin script Gradle runs, such as a build, a settings, or an applied script, whose name is more than its extension */
const isGradleScript = (name: string): boolean =>
  SCRIPT_EXTENSIONS.some(
    (extension) => name.endsWith(extension) && name.length > extension.length
  );

/** A settings.xml where Maven looks for one in a project, in .mvn or .m2, or beside the pom.xml that passes it with -s, never one another tool keeps under the same name */
const isMavenSettings = (
  file: string,
  has: (file: string) => boolean
): boolean => {
  const folder = dirname(file);

  return SETTINGS_FOLDERS.has(basename(folder)) || has(join(folder, POM));
};

const readerOf = (
  file: string,
  has: (file: string) => boolean
): DependencyReader | null => {
  const name = basename(file);

  if (name === MAVEN_SETTINGS)
    return isMavenSettings(file, has) ? readMavenSettings : null;

  return READERS.get(name) ?? (isGradleScript(name) ? readGradleScript : null);
};

/** Gradle and Maven, where only Gradle locks dependencies, in a gradle.lockfile that covers the build script beside it */
export const JVM: DependencyEcosystem = deepFreeze({
  readerOf,
  keeps: (file: string) => {
    const name = basename(file);

    return name === MAVEN_SETTINGS || READERS.has(name) || isGradleScript(name);
  },
  coveredBeside: async (manifest: string, scope: CoverageScope) =>
    scope.has(join(dirname(manifest), GRADLE_LOCKFILE)),
  rootsWorkspace: async () => false,
});
