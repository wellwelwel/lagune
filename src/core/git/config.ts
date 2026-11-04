const COMMENT_MARKS: ReadonlySet<string> = new Set(['#', ';']);

const ESCAPES: ReadonlyMap<string, string> = new Map([
  ['\\', '\\'],
  ['"', '"'],
  ['n', '\n'],
  ['t', '\t'],
  ['b', '\b'],
]);

const isBlank = (character: string): boolean =>
  character === ' ' || character === '\t';

const unquote = (raw: string): string | undefined => {
  let value = '';
  let pendingBlanks = '';
  let quoted = false;

  for (let index = 0; index < raw.length; index++) {
    const character = raw[index];

    if (!quoted && COMMENT_MARKS.has(character)) break;

    if (!quoted && isBlank(character)) {
      if (value !== '') pendingBlanks += character;
      continue;
    }

    const escaped = character === '\\' ? ESCAPES.get(raw[index + 1]) : null;

    if (escaped === undefined) return undefined;
    if (escaped !== null) index++;

    value += pendingBlanks + (character === '"' ? '' : (escaped ?? character));
    pendingBlanks = '';
    quoted = character === '"' ? !quoted : quoted;
  }

  return quoted ? undefined : value;
};

/** The last value a Git config text sets for a key in a section without a subsection, both named in lowercase */
export const configValue = (
  text: string,
  section: string,
  key: string
): string | undefined => {
  let inSection = false;
  let found: string | undefined;

  for (const rawLine of text.split('\n')) {
    let line = (rawLine.endsWith('\r') ? rawLine.slice(0, -1) : rawLine).trim();

    if (line.startsWith('[')) {
      const close = line.indexOf(']');

      if (close === -1) return undefined;

      inSection = line.slice(1, close).trim().toLowerCase() === section;
      line = line.slice(close + 1).trim();
    }

    if (!inSection || line === '' || COMMENT_MARKS.has(line[0])) continue;

    const separator = line.indexOf('=');
    const name = separator === -1 ? line : line.slice(0, separator);

    if (name.trim().toLowerCase() === key)
      found = separator === -1 ? undefined : unquote(line.slice(separator + 1));
  }

  return found;
};
