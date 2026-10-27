import type { CallSite, RegexCandidate } from '../../types/hooks/regex.js';
import type { LanguageId } from '../../types/scan.js';
import { callsOf, patternArgumentStarts } from './calls.js';
import { decodeLiteral, readLiteral, staticLiteralAt } from './lexer.js';

const METACHARACTERS = /[.*+?^${}()|[\]\\]/;

const REGEX_TOKENS =
  /\\[dwsbDWSB]|\[[^\]]{1,200}\]|[*+?]|\{\d{1,9}(,\d{0,9})?\}|\|/;

const MIN_LENGTH = 3;

const JS_FLAGS = 'dgimsuvy';

const SLASH_LITERAL_LANGUAGES: ReadonlySet<LanguageId> = new Set([
  'javascript',
  'ruby',
  'php',
  'elixir',
  'crystal',
  'perl',
]);

const JS_STRING_METHODS: readonly CallSite[] = [
  { name: '.match', argumentIndex: 0 },
  { name: '.matchAll', argumentIndex: 0 },
  { name: '.search', argumentIndex: 0 },
];

const JS_REGEX_OPENERS = new Set([
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

const looksLikeRegex = (source: string): boolean =>
  source.length >= MIN_LENGTH &&
  METACHARACTERS.test(source) &&
  REGEX_TOKENS.test(source);

const opensJsRegex = (text: string, slash: number): boolean => {
  let index = slash - 1;

  while (index >= 0 && (text[index] === ' ' || text[index] === '\t'))
    index -= 1;

  return index < 0 || JS_REGEX_OPENERS.has(text[index]);
};

const slashLiteralEnd = (text: string, open: number): number => {
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

  while (end < text.length && JS_FLAGS.includes(text[end])) end += 1;

  return text.slice(from, end);
};

const skipComment = (text: string, start: number): number => {
  if (text[start + 1] === '/') {
    const newline = text.indexOf('\n', start + 2);

    return newline === -1 ? text.length : newline;
  }

  const close = text.indexOf('*/', start + 2);

  return close === -1 ? text.length : close + 1;
};

export const readingKey = ({ source, flags }: RegexCandidate): string =>
  `${flags}/${source}`;

const keep = (
  out: Map<string, RegexCandidate>,
  source: string,
  flags: string
): void => {
  if (looksLikeRegex(source))
    out.set(readingKey({ source, flags }), { source, flags });
};

const collectSlashLiterals = (
  text: string,
  language: LanguageId,
  out: Map<string, RegexCandidate>
): void => {
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] !== '/') continue;

    const next = text[index + 1];

    if (next === '/' || next === '*') {
      index = skipComment(text, index);
      continue;
    }

    if (language === 'javascript' && !opensJsRegex(text, index)) continue;

    const end = slashLiteralEnd(text, index);

    if (end === -1) continue;

    const flags = language === 'javascript' ? readFlags(text, end + 1) : '';

    keep(out, text.slice(index + 1, end), flags);
    index = end + flags.length;
  }
};

const collectCallArguments = (
  text: string,
  language: LanguageId,
  calls: readonly CallSite[],
  out: Map<string, RegexCandidate>
): void => {
  for (const call of calls)
    for (const start of patternArgumentStarts(text, call)) {
      const literal = staticLiteralAt(text, start, language);

      if (literal !== null)
        keep(out, decodeLiteral(text, literal.open, literal.end, language), '');
    }
};

const collectQuotedFallback = (
  text: string,
  language: LanguageId,
  out: Map<string, RegexCandidate>
): void => {
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] !== "'" && text[index] !== '"') continue;

    const literal = readLiteral(text, index);

    if (literal === null) continue;

    if (!literal.interpolated)
      keep(out, decodeLiteral(text, index, literal.end, language), '');

    index = literal.end;
  }
};

/** Pulls ReDoS-checkable regexes from a file as the program holds them, with the flags a JavaScript literal carries */
export const extractPatterns = (
  text: string,
  language: LanguageId
): RegexCandidate[] => {
  const out = new Map<string, RegexCandidate>();

  if (SLASH_LITERAL_LANGUAGES.has(language))
    collectSlashLiterals(text, language, out);

  collectCallArguments(text, language, callsOf(language), out);

  if (language === 'javascript')
    collectCallArguments(text, language, JS_STRING_METHODS, out);
  else collectQuotedFallback(text, language, out);

  return [...out.values()];
};

/** Pulls the distinct regex sources from a file, gated to its language */
export const extractSources = (
  text: string,
  language: LanguageId
): string[] => [
  ...new Set(extractPatterns(text, language).map(({ source }) => source)),
];
