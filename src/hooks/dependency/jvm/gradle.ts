import type { DependencyRead } from '../../../types/hooks/dependency.js';
import { basename } from 'node:path';
import { flagsRead } from '../read.js';
import { cannotJudge } from '../text.js';
import { plainUrlFlags } from '../transport.js';
import { gradleScanOf } from './script.js';

/** The scripts that build a project, as opposed to its settings or a script another one applies */
const BUILD_SCRIPTS: ReadonlySet<string> = new Set([
  'build.gradle',
  'build.gradle.kts',
]);

const LINE_BREAKS = /\r?\n/;

const COMMENT = '#';

/** The marker of the configurations that lock no module */
const EMPTY = 'empty';

const ASSIGNMENT = '=';

const COORDINATE_SEPARATOR = ':';

/** The parts of a module coordinate Gradle locks: its group, its name, and its version */
const COORDINATE_PARTS = 3;

const WHITESPACE = /\s/;

const isLockedModule = (module: string): boolean => {
  const parts = module.split(COORDINATE_SEPARATOR);

  return (
    parts.length === COORDINATE_PARTS &&
    parts.every((part) => part !== '' && !WHITESPACE.test(part))
  );
};

const isLockfileEntry = (text: string): boolean => {
  const assignment = text.indexOf(ASSIGNMENT);

  if (assignment === -1) return false;

  const module = text.slice(0, assignment);

  return module === EMPTY || isLockedModule(module);
};

/** A Gradle build script, settings script, or a script another one applies, written in Groovy or Kotlin, where a URL written as a string inside a block that names repositories is a source */
export const readGradleScript = (
  file: string,
  content: string
): DependencyRead => {
  const { sources, declaresDependencies } = gradleScanOf(file, content);

  return {
    flags: plainUrlFlags(sources),
    needsLockfile: BUILD_SCRIPTS.has(basename(file)) && declaresDependencies,
    pins: false,
    declaresWorkspace: false,
  };
};

/** A gradle.lockfile, which records no source or checksum to flag */
export const readGradleLockfile = (
  file: string,
  content: string
): DependencyRead => {
  for (const [index, raw] of content.split(LINE_BREAKS).entries()) {
    const text = raw.trim();

    if (text === '' || text.startsWith(COMMENT)) continue;
    if (!isLockfileEntry(text))
      throw cannotJudge(
        file,
        `holds line ${index + 1}, which is not a module locked to a version or the configurations that lock none`
      );
  }

  return flagsRead([]);
};
