import type {
  DependencyRead,
  XmlElement,
  XmlList,
} from '../../../types/hooks/dependency.js';
import { deepFreeze } from '../../../core/collections.js';
import { flagsRead } from '../read.js';
import { cannotJudge } from '../text.js';
import { plainUrlFlags } from '../transport.js';
import { childTexts, listedElements, xmlRootOf } from '../xml.js';

const PROJECT = 'project';

const SETTINGS = 'settings';

/** The lists a POM or a profile names its repositories in, each with the element of one repository */
const REPOSITORY_LISTS: readonly XmlList[] = deepFreeze([
  ['repositories', 'repository'],
  ['pluginRepositories', 'pluginRepository'],
]);

/** Maven's settings add the mirrors that stand in for a repository */
const SETTINGS_LISTS: readonly XmlList[] = deepFreeze([
  ...REPOSITORY_LISTS,
  ['mirrors', 'mirror'],
]);

const URL_ELEMENT = 'url';

const listedUrls = (root: XmlElement, lists: readonly XmlList[]): string[] =>
  lists.flatMap((names) =>
    listedElements(root, names).flatMap((element) =>
      childTexts(element, URL_ELEMENT)
    )
  );

/** A pom.xml, read for the repositories it and its profiles fetch dependencies and plugins from, never the one it deploys to */
export const readPom = (file: string, content: string): DependencyRead => {
  const root = xmlRootOf(file, content);

  if (root.name !== PROJECT)
    throw cannotJudge(
      file,
      `is not a Maven POM, whose root element is ${PROJECT}`
    );

  return flagsRead(plainUrlFlags(listedUrls(root, REPOSITORY_LISTS)));
};

/** A Maven settings.xml, read for its mirrors and the repositories its profiles add, a settings.xml of another tool flagging nothing */
export const readMavenSettings = (
  file: string,
  content: string
): DependencyRead => {
  const root = xmlRootOf(file, content);

  return flagsRead(
    root.name === SETTINGS
      ? plainUrlFlags(listedUrls(root, SETTINGS_LISTS))
      : []
  );
};
