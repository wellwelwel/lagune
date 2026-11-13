import type {
  DependencyRead,
  XmlElement,
} from '../../../types/hooks/dependency.js';
import { flagsRead } from '../read.js';
import { cannotJudge } from '../text.js';
import { plainUrlFlags } from '../transport.js';
import { xmlRootOf } from '../xml.js';

const PROJECT = 'Project';

/** The properties that add package sources to a restore, which MSBuild names without regard to case */
const SOURCE_PROPERTIES: ReadonlySet<string> = new Set([
  'restoresources',
  'restoreadditionalprojectsources',
]);

/** The item that adds a package, which MSBuild names without regard to case */
const PACKAGE_REFERENCE = 'packagereference';

const INCLUDE = 'Include';

const SOURCE_SEPARATOR = ';';

const descendantsOf = (element: XmlElement): XmlElement[] =>
  element.children.flatMap((child) => [child, ...descendantsOf(child)]);

const msbuildElementsOf = (file: string, content: string): XmlElement[] => {
  const root = xmlRootOf(file, content);

  if (root.name !== PROJECT)
    throw cannotJudge(
      file,
      `is not an MSBuild file, whose root element is ${PROJECT}`
    );

  return descendantsOf(root);
};

/** The package sources an MSBuild file's properties add to a restore */
const restoreSources = (elements: readonly XmlElement[]): string[] =>
  elements
    .filter(({ name }) => SOURCE_PROPERTIES.has(name.toLowerCase()))
    .flatMap(({ text }) => text.split(SOURCE_SEPARATOR))
    .map((source) => source.trim());

const isPackageReference = ({ name, attributes }: XmlElement): boolean =>
  name.toLowerCase() === PACKAGE_REFERENCE &&
  (attributes.get(INCLUDE) ?? '').trim() !== '';

/** A file MSBuild imports into every project below it, such as Directory.Build.props */
export const readMsbuildImport = (
  file: string,
  content: string
): DependencyRead =>
  flagsRead(plainUrlFlags(restoreSources(msbuildElementsOf(file, content))));

/** A .NET project file, such as a .csproj, which declares dependencies once it references a package */
export const readProjectFile = (
  file: string,
  content: string
): DependencyRead => {
  const elements = msbuildElementsOf(file, content);

  return {
    flags: plainUrlFlags(restoreSources(elements)),
    needsLockfile: elements.some(isPackageReference),
    pins: false,
    declaresWorkspace: false,
  };
};
