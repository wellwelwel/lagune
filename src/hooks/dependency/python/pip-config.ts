import type {
  DependencyRead,
  IniSections,
} from '../../../types/hooks/dependency.js';
import { quotedExcerpt } from '../../../core/errors.js';
import { flagsRead } from '../read.js';
import { cannotJudge } from '../text.js';
import { plainUrlFlags } from '../transport.js';
import { extraIndexFlags } from './source.js';

const LINE_BREAKS = /\r?\n/;

const SECTION = /^\[(.+)\]/;

const WHITESPACE_RUN = /\s+/;

const FETCHED_KEYS: ReadonlySet<string> = new Set([
  'index-url',
  'extra-index-url',
  'find-links',
]);

const EXTRA_INDEX_KEYS: ReadonlySet<string> = new Set(['extra-index-url']);

const indentOf = (line: string): number =>
  line.length - line.trimStart().length;

const delimiterOf = (text: string): number => {
  const equals = text.indexOf('=');
  const colon = text.indexOf(':');

  if (equals === -1) return colon;
  if (colon === -1) return equals;

  return Math.min(equals, colon);
};

/** The sections of an INI file read the way Python's configparser reads pip's configuration, refusing a duplicate as it does */
const iniSectionsOf = (file: string, content: string): IniSections => {
  const sections: IniSections = new Map();
  let section: Map<string, string[]> | null = null;
  let values: string[] | null = null;
  let indent = 0;

  for (const [index, line] of content.split(LINE_BREAKS).entries()) {
    const text = line.trim();

    if (text === '' || text.startsWith('#') || text.startsWith(';')) continue;

    if (values !== null && indentOf(line) > indent) {
      values.push(text);
      continue;
    }

    indent = indentOf(line);
    values = null;

    const header = SECTION.exec(text);

    if (header !== null) {
      if (sections.has(header[1]))
        throw cannotJudge(
          file,
          `opens the section ${quotedExcerpt(header[1])} twice`
        );

      section = new Map();
      sections.set(header[1], section);
      continue;
    }

    const delimiter = delimiterOf(text);
    const key = text.slice(0, Math.max(delimiter, 0)).trim().toLowerCase();

    if (section === null || delimiter === -1 || key === '')
      throw cannotJudge(
        file,
        `holds line ${index + 1}, which is not a section or a key and a value`
      );

    if (section.has(key))
      throw cannotJudge(file, `sets ${quotedExcerpt(key)} twice in a section`);

    values = [text.slice(delimiter + 1).trim()];
    section.set(key, values);
  }

  return sections;
};

/** The name pip gives a configuration key, such as `extra-index-url` for `extra_index_url` */
const pipKeyOf = (key: string): string => {
  const dashed = key.replaceAll('_', '-');

  return dashed.startsWith('--') ? dashed.slice(2) : dashed;
};

const pipValues = (
  sections: IniSections,
  keys: ReadonlySet<string>
): string[] =>
  [...sections.values()].flatMap((entries) =>
    [...entries].flatMap(([key, lines]) =>
      keys.has(pipKeyOf(key))
        ? lines
            .flatMap((line) => line.split(WHITESPACE_RUN))
            .filter((url) => url !== '')
        : []
    )
  );

/** A pip.conf or pip.ini, whose every section can set the indexes pip searches */
export const readPipConfig = (
  file: string,
  content: string
): DependencyRead => {
  const sections = iniSectionsOf(file, content);

  return flagsRead([
    ...plainUrlFlags(pipValues(sections, FETCHED_KEYS)),
    ...extraIndexFlags(pipValues(sections, EXTRA_INDEX_KEYS)),
  ]);
};
