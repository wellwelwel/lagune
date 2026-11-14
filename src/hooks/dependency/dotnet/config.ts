import type {
  DependencyRead,
  XmlElement,
} from '../../../types/hooks/dependency.js';
import { flagsRead } from '../read.js';
import { cannotJudge } from '../text.js';
import { plainUrlFlags } from '../transport.js';
import { xmlRootOf } from '../xml.js';

const CONFIGURATION = 'configuration';

const PACKAGE_SOURCES = 'packagesources';

const DISABLED_SOURCES = 'disabledpackagesources';

const ADD = 'add';

const REMOVE = 'remove';

const CLEAR = 'clear';

/** The entries a NuGet list keeps, by lowercased key, applying each add, remove, and clear in the order NuGet reads them */
const listedEntries = (root: XmlElement, list: string): Map<string, string> => {
  const entries = new Map<string, string>();
  const steps = root.children
    .filter(({ name }) => name.toLowerCase() === list)
    .flatMap(({ children }) => children);

  for (const { name, attributes } of steps) {
    const step = name.toLowerCase();
    const key = (attributes.get('key') ?? '').toLowerCase();

    if (step === CLEAR) entries.clear();
    else if (step === REMOVE) entries.delete(key);
    else if (step === ADD) entries.set(key, attributes.get('value') ?? '');
  }

  return entries;
};

/** A nuget.config, read for every package source it lists and leaves enabled, its elements named without regard to case */
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

  const disabled = listedEntries(root, DISABLED_SOURCES);

  return flagsRead(
    plainUrlFlags(
      [...listedEntries(root, PACKAGE_SOURCES)].flatMap(([key, url]) =>
        disabled.get(key)?.trim().toLowerCase() === 'true' ? [] : [url]
      )
    )
  );
};
