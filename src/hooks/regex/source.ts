import type {
  Interpolation,
  SourceReading,
  SourceToken,
  SourceTokenKind,
} from '../../types/hooks/regex.js';
import type { CommentSpec, LanguageId } from '../../types/scan.js';
import { commentSpec } from '../../core/scan/lines.js';
import { QUOTES, readLiteral } from './lexer.js';

const JAVASCRIPT_FLAGS = 'dgimsuvy';

const BLANKED = /[^\n]/g;

const LINE_COMMENT_LENGTH = 1000;

const SLASH_LITERAL_LANGUAGES: ReadonlySet<LanguageId> = new Set([
  'javascript',
  'ruby',
  'elixir',
  'crystal',
  'perl',
]);

const TRIPLE_QUOTED: ReadonlySet<LanguageId> = new Set([
  'python',
  'kotlin',
  'swift',
  'java',
  'scala',
  'elixir',
  'julia',
  'nim',
  'dart',
  'csharp',
]);

const INTERPOLATIONS: Partial<Record<LanguageId, Interpolation>> = {
  ruby: { opener: '#{', quotes: new Set(['"', '`']) },
  crystal: { opener: '#{', quotes: new Set(['"', '`']) },
  elixir: { opener: '#{', quotes: new Set(['"', "'"]) },
};

const JAVASCRIPT_REGEX_OPENERS = new Set([
  '(',
  ',',
  '=',
  ':',
  '!',
  '&',
  '|',
  '?',
  '{',
  ';',
  '[',
  '>',
  '\n',
]);

const SPACES = new Set([undefined, ' ', '\t', '\n', '\r']);

const BRACES = new Set(['{', '}']);

const token = (
  kind: SourceTokenKind,
  open: number,
  end: number,
  interpolated = false,
  flags = ''
): SourceToken => ({ kind, open, end, interpolated, flags });

const opensJavaScriptRegex = (text: string, slash: number): boolean => {
  let index = slash - 1;

  while (index >= 0 && (text[index] === ' ' || text[index] === '\t'))
    index -= 1;

  return index < 0 || JAVASCRIPT_REGEX_OPENERS.has(text[index]);
};

/** Where the slash-delimited literal opened at `open` closes on its own line, or -1 */
export const slashLiteralEnd = (text: string, open: number): number => {
  for (let index = open + 1; index < text.length; index += 1) {
    const char = text[index];

    if (char === '\\') {
      index += 1;
      continue;
    }

    if (char === '/') return index;
    if (char === '\n') return -1;
  }

  return -1;
};

const readFlags = (text: string, from: number): string => {
  let end = from;

  while (end < text.length && JAVASCRIPT_FLAGS.includes(text[end])) end += 1;

  return text.slice(from, end);
};

/** Where the part of a string that starts at an index stops on its own line: at its closing quote or at the next interpolation, or -1 */
const chunkEnd = (
  text: string,
  from: number,
  quote: string,
  opener: string
): number => {
  for (let index = from; index < text.length; index += 1) {
    const char = text[index];

    if (char === '\\') {
      index += 1;
      continue;
    }

    if (char === quote || text.startsWith(opener, index)) return index;
    if (char === '\n') return -1;
  }

  return -1;
};

/** Reads each string one piece at a time around the code it interpolates, which stays code */
const stringReader = (text: string, interpolation?: Interpolation) => {
  const quotes: string[] = [];
  const depths: number[] = [];

  const chunkAt = (open: number, quote: string): SourceToken | null => {
    const end = chunkEnd(text, open + 1, quote, interpolation?.opener ?? quote);

    if (end === -1) {
      quotes.length = 0;
      depths.length = 0;
      return null;
    }

    if (text[end] !== quote) {
      quotes.push(quote);
      depths.push(0);
    }

    return token('string', open, end, true);
  };

  return {
    stringAt: (open: number): SourceToken | null => {
      const literal = readLiteral(text, open);

      if (literal === null) return null;

      return literal.interpolated && interpolation?.quotes.has(text[open])
        ? chunkAt(open, text[open])
        : token('string', open, literal.end, literal.interpolated);
    },
    braceAt: (index: number): SourceToken | null => {
      const last = depths.length - 1;

      if (last === -1) return null;

      depths[last] += text[index] === '{' ? 1 : -1;

      if (depths[last] > 0) return null;

      depths.pop();

      return chunkAt(index, quotes.pop() ?? '');
    },
  };
};

const blockDelimiterAt = (
  text: string,
  index: number,
  language: LanguageId
): string => {
  const quote = text[index];

  if (quote === '`') return language === 'go' ? quote : '';

  const triple = quote.repeat(3);

  return TRIPLE_QUOTED.has(language) && text.startsWith(triple, index)
    ? triple
    : '';
};

/** Reads the slash-delimited literal opened at an index, or null where the slash opens none */
export const slashAt = (
  text: string,
  open: number,
  language: LanguageId
): SourceToken | null => {
  if (language === 'javascript' && !opensJavaScriptRegex(text, open))
    return null;

  const end = slashLiteralEnd(text, open);

  if (end === -1) return null;

  return token(
    'slash',
    open,
    end,
    false,
    language === 'javascript' ? readFlags(text, end + 1) : ''
  );
};

const opensLineComment = (
  text: string,
  index: number,
  leader: string
): boolean =>
  text.startsWith(leader, index) &&
  (leader.length > 1 || SPACES.has(text[index - 1])) &&
  !(leader === '#' && text[index + 1] === '[');

const nextFinder = (text: string, closer: string) => {
  let searched = false;
  let found = -1;

  return (from: number): number => {
    if (!searched || (found !== -1 && found < from)) {
      found = text.indexOf(closer, from);
      searched = true;
    }

    return found;
  };
};

/**
 * Where the comment opened at an index ends, or -1.
 *
 * - A glob inside a multi-line string reads as a block opener, the one case of a block that never closes or that holds another opener.
 * - A bundle on a single line holds line leaders inside strings the scan cannot always pair.
 */
const commentFinder = (
  text: string,
  { line, block }: CommentSpec,
  newlineFrom: (from: number) => number
) => {
  const [opener, closer] = block ?? ['', ''];
  const closerFrom = nextFinder(text, closer);
  let judged = -1;
  let lastOpener = -1;

  const blockEnd = (index: number): number => {
    if (block === undefined || !text.startsWith(opener, index)) return -1;

    const body = index + opener.length;
    const close = closerFrom(body);

    if (close === -1) return -1;

    if (close !== judged) {
      lastOpener = text.lastIndexOf(opener, close - opener.length);
      judged = close;
    }

    return lastOpener >= body ? -1 : close + closer.length - 1;
  };

  return (index: number): number => {
    const end = blockEnd(index);

    if (end !== -1) return end;

    if (!line.some((leader) => opensLineComment(text, index, leader)))
      return -1;

    const newline = newlineFrom(index);
    const last = (newline === -1 ? text.length : newline) - 1;

    return last - index > LINE_COMMENT_LENGTH ? -1 : last;
  };
};

/** Finds the string opened at an index that runs past its own line, which holds text, never code */
const textFinder = (
  text: string,
  language: LanguageId,
  newlineFrom: (from: number) => number
) => {
  return (open: number): SourceToken | null => {
    const delimiter = blockDelimiterAt(text, open, language);

    if (delimiter === '') return null;

    const close = text.indexOf(delimiter, open + delimiter.length);
    const newline = newlineFrom(open);

    return close === -1 || newline === -1 || newline > close
      ? null
      : token('text', open, close + delimiter.length - 1);
  };
};

const starters = (
  { line, block }: CommentSpec,
  readsSlashes: boolean,
  interpolates: boolean
): ReadonlySet<string> =>
  new Set([
    ...QUOTES,
    ...line.map((leader) => leader[0]),
    ...(block === undefined ? [] : [block[0][0]]),
    ...(readsSlashes ? ['/'] : []),
    ...(interpolates ? BRACES : []),
  ]);

const tokensOf = (text: string, language: LanguageId): SourceToken[] => {
  const spec = commentSpec(language);
  const readsSlashes = SLASH_LITERAL_LANGUAGES.has(language);
  const interpolation = INTERPOLATIONS[language];
  const starts = starters(spec, readsSlashes, interpolation !== undefined);
  const newlineFrom = nextFinder(text, '\n');
  const commentEnd = commentFinder(text, spec, newlineFrom);
  const textAt = textFinder(text, language, newlineFrom);
  const { stringAt, braceAt } = stringReader(text, interpolation);
  const tokens: SourceToken[] = [];

  const tokenAt = (index: number): SourceToken | null => {
    if (QUOTES.has(text[index])) return textAt(index) ?? stringAt(index);
    if (BRACES.has(text[index])) return braceAt(index);

    const end = commentEnd(index);

    if (end !== -1) return token('comment', index, end);

    return readsSlashes && text[index] === '/'
      ? slashAt(text, index, language)
      : null;
  };

  for (let index = 0; index < text.length; index += 1) {
    if (!starts.has(text[index])) continue;

    const found = tokenAt(index);

    if (found === null) continue;

    tokens.push(found);
    index = found.end + found.flags.length;
  }

  return tokens;
};

const blank = (text: string, from: number, to: number): string =>
  text.slice(from, to).replace(BLANKED, ' ');

const blankedSpan = (
  text: string,
  { kind, open, end }: SourceToken
): readonly [from: number, to: number] => {
  if (kind === 'comment') return [open, end + 1];
  if (kind === 'string') return [open + 1, end];

  const edge = text[open] === '`' ? 1 : 3;

  return [open + edge, end + 1 - edge];
};

const views = (
  text: string,
  tokens: readonly SourceToken[]
): Pick<SourceReading, 'code' | 'bare'> => {
  const code: string[] = [];
  const bare: string[] = [];
  let codeFrom = 0;
  let bareFrom = 0;

  for (const found of tokens) {
    if (found.kind === 'slash') continue;

    const [from, to] = blankedSpan(text, found);
    const blanked = blank(text, from, to);

    bare.push(text.slice(bareFrom, from), blanked);
    bareFrom = to;

    if (found.kind === 'string') continue;

    code.push(text.slice(codeFrom, from), blanked);
    codeFrom = to;
  }

  return {
    code: code.join('') + text.slice(codeFrom),
    bare: bare.join('') + text.slice(bareFrom),
  };
};

/** Reads a file into its strings, comments, and slash-delimited literals, with one view that blanks the comments and the strings that run across lines, and one that also blanks what every other string holds. Both keep every offset and line */
export const readSource = (
  text: string,
  language: LanguageId
): SourceReading => {
  const tokens = tokensOf(text, language);

  return { language, text, tokens, ...views(text, tokens) };
};
