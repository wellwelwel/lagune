import { cannotJudge } from '../text.js';

const NATURAL_LINE = /\r\n|\r|\n/;

const LEADING_SPACE = /^[ \t\f]+/;

const COMMENT_MARKS: ReadonlySet<string> = new Set(['#', '!']);

/** A logical line split into its key, up to the first unescaped separator or whitespace, and its value */
const ENTRY =
  /^((?:\\[\s\S]|[^\\=: \t\f])*)[ \t\f]*(?:[=:][ \t\f]*)?([\s\S]*)$/;

/** An escape: a \u that must hold four hexadecimal digits, or a backslash before any other character */
const ESCAPE = /\\(?:u([\da-fA-F]{0,4})|([^u]))/g;

const UNICODE_DIGITS = 4;

const HEXADECIMAL = 16;

const CONTROL_ESCAPES: ReadonlyMap<string, string> = new Map([
  ['t', '\t'],
  ['n', '\n'],
  ['r', '\r'],
  ['f', '\f'],
]);

const BACKSLASH = '\\';

const trailingBackslashes = (line: string): number => {
  let count = 0;

  while (count < line.length && line[line.length - 1 - count] === BACKSLASH)
    count += 1;

  return count;
};

/** The logical lines of a properties file: a line ending in an unescaped backslash goes on in the next, and a comment or a blank line holds none */
const logicalLines = (content: string): string[] => {
  const lines: string[] = [];
  let pending: string | null = null;

  for (const natural of content.split(NATURAL_LINE)) {
    const line = natural.replace(LEADING_SPACE, '');

    if (pending === null && (line === '' || COMMENT_MARKS.has(line[0])))
      continue;

    const joined: string = `${pending ?? ''}${line}`;

    if (trailingBackslashes(line) % 2 === 1) {
      pending = joined.slice(0, -1);
      continue;
    }

    lines.push(joined);
    pending = null;
  }

  if (pending !== null) lines.push(pending);

  return lines;
};

const unescaped = (file: string, text: string): string =>
  text.replace(ESCAPE, (_escape, digits?: string, character?: string) => {
    if (digits === undefined)
      return CONTROL_ESCAPES.get(character ?? '') ?? character ?? '';
    if (digits.length !== UNICODE_DIGITS)
      throw cannotJudge(
        file,
        'holds a \\u escape that is not followed by four hexadecimal digits'
      );

    return String.fromCharCode(Number.parseInt(digits, HEXADECIMAL));
  });

/** The keys and values of a .properties file, read the way Java's Properties reads them, the last value of a repeated key winning */
export const propertiesOf = (
  file: string,
  content: string
): Map<string, string> =>
  new Map(
    logicalLines(content).map((line): [string, string] => {
      const [, key = '', value = ''] = ENTRY.exec(line) ?? [];

      return [unescaped(file, key), unescaped(file, value)];
    })
  );
