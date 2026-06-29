import type { LanguageId } from '../../types/hooks/regex.js';
import { carriersOf } from './language.js';
import {
  argumentStart,
  isIdentChar,
  isWordBoundaryMatch,
  QUOTES,
  readLiteral,
  skipSpace,
} from './lexer.js';

const METACHARACTERS = /[.*+?^${}()|[\]\\]/;

const REGEX_TOKENS =
  /\\[dwsbDWSB]|\[[^\]]{1,200}\]|[*+?]|\{\d{1,9}(,\d{0,9})?\}|\|/;

const MIN_LENGTH = 3;

const looksLikeRegex = (source: string): boolean =>
  source.length >= MIN_LENGTH &&
  METACHARACTERS.test(source) &&
  REGEX_TOKENS.test(source);

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

const opensJsRegex = (text: string, slash: number): boolean => {
  let index = slash - 1;

  while (index >= 0 && (text[index] === ' ' || text[index] === '\t'))
    index -= 1;

  return index < 0 || JS_REGEX_OPENERS.has(text[index]);
};

const readSlashLiteral = (
  text: string,
  open: number
): { value: string; end: number } | null => {
  let value = '';

  for (let index = open + 1; index < text.length; index += 1) {
    const char = text[index];

    if (char === '\\') {
      value += char + (text[index + 1] ?? '');
      index += 1;
      continue;
    }

    if (char === '/') return { value, end: index };
    if (char === '\n') return null;

    value += char;
  }

  return null;
};

const skipComment = (text: string, start: number): number => {
  if (text[start + 1] === '/') {
    const newline = text.indexOf('\n', start + 2);

    return newline === -1 ? text.length : newline;
  }

  const close = text.indexOf('*/', start + 2);

  return close === -1 ? text.length : close + 1;
};

const collectSlashLiterals = (
  text: string,
  language: LanguageId,
  out: Set<string>
): void => {
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] !== '/') continue;

    const next = text[index + 1];

    if (next === '/' || next === '*') {
      index = skipComment(text, index);
      continue;
    }

    if (language === 'javascript' && !opensJsRegex(text, index)) continue;

    const literal = readSlashLiteral(text, index);

    if (literal === null) continue;

    if (looksLikeRegex(literal.value)) out.add(literal.value);

    index = literal.end;
  }
};

const isLiteralArgument = (text: string, afterName: number): string | null => {
  const start = argumentStart(text, afterName, 'paren', 0);

  if (start === -1) return null;

  const at = skipSpace(text, start);

  if (!QUOTES.has(text[at])) return null;

  const literal = readLiteral(text, at);

  if (literal === null || literal.interpolated) return null;

  return text.slice(at + 1, literal.end);
};

const collectApiArguments = (
  text: string,
  apis: readonly string[],
  methods: boolean,
  out: Set<string>
): void => {
  for (const name of apis) {
    let from = 0;

    for (;;) {
      const at = text.indexOf(name, from);

      if (at === -1) break;

      from = at + name.length;

      if (!methods && !isWordBoundaryMatch(text, at, name)) continue;
      if (isIdentChar(text[at + name.length] ?? '')) continue;

      const body = isLiteralArgument(text, at + name.length);

      if (body !== null && looksLikeRegex(body)) out.add(body);
    }
  }
};

const collectQuotedFallback = (text: string, out: Set<string>): void => {
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] !== "'" && text[index] !== '"') continue;

    const literal = readLiteral(text, index);

    if (literal === null) {
      continue;
    }

    if (!literal.interpolated) {
      const body = text.slice(index + 1, literal.end);

      if (looksLikeRegex(body)) out.add(body);
    }

    index = literal.end;
  }
};

/** Pulls ReDoS-checkable regex literals from a file, gated to its language */
export const extractCandidates = (
  text: string,
  language: LanguageId
): string[] => {
  const carriers = carriersOf(language);
  const out = new Set<string>();

  if (carriers.slashLiteral) collectSlashLiterals(text, language, out);

  collectApiArguments(text, carriers.quoteApis, false, out);
  collectApiArguments(text, carriers.stringApis, true, out);

  if (language !== 'javascript') collectQuotedFallback(text, out);

  return [...out];
};
