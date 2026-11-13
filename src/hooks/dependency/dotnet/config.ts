import type { DependencyRead } from '../../../types/hooks/dependency.js';
import { flagsRead } from '../read.js';
import { cannotJudge } from '../text.js';
import { plainUrlFlags } from '../transport.js';
import { xmlRootOf } from '../xml.js';

const CONFIGURATION = 'configuration';

const PACKAGE_SOURCES = 'packagesources';

const SOURCE = 'add';

const SOURCE_URL = 'value';

/** A nuget.config, read for every package source it lists, its elements named without regard to case */
export const readNugetConfig = (
  file: string,
  content: string
): DependencyRead => {
  const root = xmlRootOf(file, content);

  if (root.name.toLowerCase() !== CONFIGURATION)
    throw cannotJudge(
      file,
      `is not a NuGet configuration, whose root element is ${CONFIGURATION}`
    );

  const sources = root.children
    .filter(({ name }) => name.toLowerCase() === PACKAGE_SOURCES)
    .flatMap(({ children }) => children)
    .filter(({ name }) => name.toLowerCase() === SOURCE)
    .flatMap(({ attributes }) => attributes.get(SOURCE_URL) ?? []);

  return flagsRead(plainUrlFlags(sources));
};
