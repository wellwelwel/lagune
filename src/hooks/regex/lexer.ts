import type { CallOpener } from '../../types/hooks/regex.js';

export const QUOTES = new Set(["'", '"', '`']);

export const isIdentChar = (char: string): boolean => /[A-Za-z0-9_]/.test(char);

export const skipSpace = (text: string, from: number): number => {
  let index = from;

  while (index < text.length && (text[index] === ' ' || text[index] === '\t'))
    index += 1;

  return index;
};

export const skipDeclarator = (text: string, from: number): number => {
  let index = skipSpace(text, from);

  while (index < text.length && isIdentChar(text[index])) index += 1;

  return skipSpace(text, index);
};

export const readLiteral = (
  text: string,
  open: number
): { interpolated: boolean; end: number } | null => {
  const quote = text[open];
  let interpolated = false;

  for (let index = open + 1; index < text.length; index += 1) {
    const char = text[index];

    if (char === '\\') {
      index += 1;
      continue;
    }

    if ((char === '$' || char === '#') && text[index + 1] === '{')
      interpolated = true;

    if (char === quote) return { interpolated, end: index };
    if (char === '\n') return null;
  }

  return null;
};

export const isWordBoundaryMatch = (
  text: string,
  at: number,
  name: string
): boolean => {
  const before = at === 0 ? '' : text[at - 1];

  if (before !== '' && isIdentChar(before)) return false;

  const after = text[at + name.length] ?? '';

  return !isIdentChar(after);
};

export const skipArguments = (
  text: string,
  afterParen: number,
  count: number
): number => {
  let index = afterParen;
  let depth = 0;
  let skipped = 0;

  while (index < text.length && skipped < count) {
    const char = text[index];

    if (QUOTES.has(char)) {
      const literal = readLiteral(text, index);

      if (literal === null) return -1;

      index = literal.end + 1;
      continue;
    }

    if (char === '(' || char === '[' || char === '{') depth += 1;
    else if (char === ')' || char === ']' || char === '}') {
      if (depth === 0) return -1;

      depth -= 1;
    } else if (char === ',' && depth === 0) skipped += 1;

    index += 1;
  }

  return skipped === count ? index : -1;
};

export const argumentStart = (
  text: string,
  afterName: number,
  opener: CallOpener,
  argIndex: number
): number => {
  if (opener === 'colon') {
    const colon = skipSpace(text, afterName);

    return text[colon] === ':' ? colon + 1 : -1;
  }

  if (opener === 'space') {
    const space = afterName;

    return text[space] === ' ' || text[space] === '\t'
      ? skipSpace(text, space)
      : -1;
  }

  const paren = skipDeclarator(text, afterName);

  return text[paren] === '(' ? skipArguments(text, paren + 1, argIndex) : -1;
};
