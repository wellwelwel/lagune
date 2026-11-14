import type {
  DependencyFlag,
  DependencyRead,
} from '../../../types/hooks/dependency.js';
import { flagsRead } from '../read.js';
import { cannotJudge } from '../text.js';
import { checksumKey, fetchedModules, goModuleOf } from './module.js';

const WHITESPACE_RUN = /\s+/;

/** The suffix of a version whose line checks the module's go.mod alone */
const GO_MOD_SUFFIX = '/go.mod';

/** The module versions a go.sum records a checksum for, of the whole module or of its go.mod alone */
const goChecksumsOf = (file: string, content: string): Set<string> =>
  new Set(
    content.split('\n').flatMap((raw, index) => {
      const text = raw.trim();

      if (text === '') return [];

      const [path, version, ...rest] = text.split(WHITESPACE_RUN);

      if (rest.length !== 1)
        throw cannotJudge(
          file,
          `holds line ${index + 1}, which is not a module path, a version, and a checksum`
        );

      return [
        checksumKey({
          path,
          version: version.endsWith(GO_MOD_SUFFIX)
            ? version.slice(0, -GO_MOD_SUFFIX.length)
            : version,
        }),
      ];
    })
  );

/** A go.sum, whose missing checksums are flagged beside its go.mod, never on its own */
export const readGoSum = (file: string, content: string): DependencyRead => {
  goChecksumsOf(file, content);

  return flagsRead([]);
};

/** The modules the go.mod requires, once its replace directives apply, that the go.sum beside it records no checksum for */
export const missingChecksumFlags = (
  sumFile: string,
  sumContent: string,
  modFile: string,
  modContent: string
): DependencyFlag[] => {
  const recorded = goChecksumsOf(sumFile, sumContent);

  return fetchedModules(goModuleOf(modFile, modContent))
    .filter((fetched) => !recorded.has(checksumKey(fetched)))
    .map(({ path, version }) => ({
      verdict: 'unrecorded-checksum',
      name: `${path}@${version}`,
    }));
};
