import type {
  DependencyEcosystem,
  PlacedReader,
} from '../../types/hooks/dependency.js';
import type { WalkFilter } from '../../types/scan.js';
import { deepFreeze } from '../../core/collections.js';
import {
  BASE_IGNORED_DIR_PATTERNS,
  BASE_IGNORED_DIRS,
} from '../../core/scan/filters.js';
import { DOTNET } from './dotnet/ecosystem.js';
import { GO } from './go/ecosystem.js';
import { JAVASCRIPT } from './javascript/ecosystem.js';
import { JVM } from './jvm/ecosystem.js';
import { PHP } from './php/ecosystem.js';
import { PYTHON } from './python/ecosystem.js';
import { RUBY } from './ruby/ecosystem.js';
import { RUST } from './rust/ecosystem.js';

/** Every ecosystem the checker reads, each a folder of its own beside the others */
const ECOSYSTEMS: readonly DependencyEcosystem[] = deepFreeze([
  JAVASCRIPT,
  PYTHON,
  RUST,
  GO,
  RUBY,
  PHP,
  DOTNET,
  JVM,
]);

export const placedReader = (
  file: string,
  has: (file: string) => boolean
): PlacedReader | null => {
  for (const ecosystem of ECOSYSTEMS) {
    const reader = ecosystem.readerOf(file, has);

    if (reader !== null) return { ecosystem, reader };
  }

  return null;
};

export const DEPENDENCY_FILTER: WalkFilter = deepFreeze({
  ignoredDirs: BASE_IGNORED_DIRS,
  ignoredDirPatterns: BASE_IGNORED_DIR_PATTERNS,
  accept: (relativePath: string) =>
    ECOSYSTEMS.some((ecosystem) => ecosystem.keeps(relativePath)),
});
