import type {
  DependencyRead,
  NpmrcSettings,
} from '../../../types/hooks/dependency.js';
import { flagsRead } from '../read.js';
import { plainUrlFlags } from '../transport.js';

const LINE_BREAKS = /[\r\n]+/;

const SKIPPED_LINE = /^\s*(?:[;#]|$)/;

const SECTION = /^\[[^\]]*\]\s*$/;

const REGISTRY_KEY = /^(?:@[^:]{1,214}:)?registry$/;

const QUOTES: ReadonlySet<string> = new Set(['"', "'"]);

const COMMENT_MARKS: ReadonlySet<string> = new Set([';', '#']);

const ESCAPABLE: ReadonlySet<string> = new Set(['\\', ';', '#']);

/** The replace-registry-host values under which npm keeps fetching a lockfile URL on the public registry from the registry it is configured with */
const SUBSTITUTING_VALUES: ReadonlySet<string> = new Set([
  'npmjs',
  'always',
  'registry.npmjs.org',
]);

const PUBLIC_REGISTRY = /^https?:\/\/registry\.npmjs\.org\/?$/i;

/** Whether a configuration key names the registry npm and Yarn 1 fetch from, for every package or for one scope */
export const isRegistryKey = (key: string): boolean => REGISTRY_KEY.test(key);

const isQuoted = (text: string): boolean =>
  text.length > 1 && QUOTES.has(text[0]) && text.endsWith(text[0]);

const decodedQuote = (text: string): string => {
  const inner = text[0] === "'" ? text.slice(1, -1) : text;

  try {
    const value: unknown = JSON.parse(inner);

    return typeof value === 'string' ? value : inner;
  } catch {
    return inner;
  }
};

/** An unquoted value up to its first unescaped ; or #, where a backslash keeps only the marks it escapes */
const uncommented = (text: string): string => {
  let value = '';
  let escaping = false;

  for (const character of text) {
    if (escaping) {
      value += ESCAPABLE.has(character) ? character : `\\${character}`;
      escaping = false;
      continue;
    }

    if (COMMENT_MARKS.has(character)) break;
    if (character === '\\') escaping = true;
    else value += character;
  }

  return (escaping ? `${value}\\` : value).trim();
};

/** A key or value as npm's ini parser reads it */
const iniText = (raw: string): string => {
  const text = raw.trim();

  return isQuoted(text) ? decodedQuote(text) : uncommented(text);
};

const entryOf = (line: string): [key: string, value: string] => {
  const equals = line.indexOf('=');

  return equals === -1
    ? [iniText(line), 'true']
    : [iniText(line.slice(0, equals)), iniText(line.slice(equals + 1))];
};

/** The settings an .npmrc gives npm, a bare key reading as true, the last of a repeated key winning, and every key after the first section belonging to that section instead */
const npmrcEntries = (content: string): Map<string, string> => {
  const lines = content.split(LINE_BREAKS);
  const firstSection = lines.findIndex((line) => SECTION.test(line));
  const topLevel = firstSection === -1 ? lines : lines.slice(0, firstSection);

  return new Map(
    topLevel.filter((line) => !SKIPPED_LINE.test(line)).map(entryOf)
  );
};

const substitutesPublicRegistry = (value: string | undefined): boolean =>
  value === undefined ||
  SUBSTITUTING_VALUES.has(value) ||
  PUBLIC_REGISTRY.test(value);

export const npmrcSettingsOf = (content: string): NpmrcSettings => {
  const entries = npmrcEntries(content);

  return {
    ignoresScripts: entries.get('ignore-scripts') === 'true',
    keepsLockedRegistryUrls: !substitutesPublicRegistry(
      entries.get('replace-registry-host')
    ),
  };
};

/** An .npmrc, which npm, pnpm, and Yarn 1 read for the registries they fetch from */
export const readNpmrc = (_file: string, content: string): DependencyRead =>
  flagsRead(
    plainUrlFlags(
      [...npmrcEntries(content)].flatMap(([key, value]) =>
        isRegistryKey(key) ? [value] : []
      )
    )
  );
