import type { StaticLiteral } from '../../types/hooks/regex.js';
import type { LanguageId } from '../../types/scan.js';

export const QUOTES = new Set(["'", '"', '`']);

const PREFIX_LIMIT = 4;

const RAW_PREFIXES: Partial<Record<LanguageId, RegExp>> = {
  python: /(?:^|[^\w])(?:[rR][bB]?|[bB][rR])$/,
  rust: /(?:^|[^\w])r#*$/,
  csharp: /@\$?$|\$@$/,
  dart: /(?:^|[^\w])r$/,
};

const STATIC_PREFIXES: Partial<Record<LanguageId, RegExp>> = {
  python: /^(?:[rRbBuU]|[rR][bB]|[bB][rR])$/,
  rust: /^(?:b|b?r#*)$/,
  csharp: /^@$/,
  objc: /^@$/,
  dart: /^r$/,
};

const STRING_ESCAPES: Readonly<Record<string, string>> = {
  n: '\n',
  r: '\r',
  t: '\t',
  v: '\v',
  f: '\f',
  b: '\b',
  '0': '\0',
};

const isRawLiteral = (
  text: string,
  open: number,
  language: LanguageId
): boolean => {
  if (text[open] === '`') return language === 'go';

  return (
    RAW_PREFIXES[language]?.test(
      text.slice(Math.max(0, open - PREFIX_LIMIT), open)
    ) ?? false
  );
};

const hexAt = (body: string, from: number, length: number): string | null => {
  const digits = body.slice(from, from + length);

  return /^[0-9A-Fa-f]+$/.test(digits) && digits.length === length
    ? digits
    : null;
};

const decodeEscape = (
  body: string,
  index: number,
  language: LanguageId
): readonly [string, number] => {
  const next = body[index + 1] ?? '';

  if (language === 'php')
    return next === '\\' || next === "'" || next === '"'
      ? [next, 2]
      : [`\\${next}`, 2];

  const byte = next === 'x' ? hexAt(body, index + 2, 2) : null;
  const unit = next === 'u' ? hexAt(body, index + 2, 4) : null;

  if (byte !== null) return [String.fromCharCode(Number.parseInt(byte, 16)), 4];
  if (unit !== null) return [String.fromCharCode(Number.parseInt(unit, 16)), 6];
  if (STRING_ESCAPES[next] !== undefined) return [STRING_ESCAPES[next], 2];
  if ('\\\'"`/'.includes(next)) return [next, 2];
  if (next === '\n') return ['', 2];

  return language === 'javascript' ? [next, 2] : [`\\${next}`, 2];
};

/** Turns a string literal's body into the text the program holds at runtime, leaving raw literals as written */
export const decodeLiteral = (
  text: string,
  open: number,
  end: number,
  language: LanguageId
): string => {
  const body = text.slice(open + 1, end);

  if (isRawLiteral(text, open, language)) return body;

  let decoded = '';

  for (let index = 0; index < body.length;) {
    if (body[index] !== '\\') {
      decoded += body[index];
      index += 1;
      continue;
    }

    const [chunk, width] = decodeEscape(body, index, language);

    decoded += chunk;
    index += width;
  }

  return decoded;
};

export const isIdentifierChar = (char: string): boolean =>
  /[A-Za-z0-9_]/.test(char);

export const skipSpace = (text: string, from: number): number => {
  let index = from;

  while (index < text.length && (text[index] === ' ' || text[index] === '\t'))
    index += 1;

  return index;
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

/** Skips a `name:` label written before an argument's value */
export const skipLabel = (text: string, at: number): number => {
  let end = at;

  while (end < text.length && isIdentifierChar(text[end])) end += 1;

  const colon = skipSpace(text, end);

  if (end === at || text[colon] !== ':' || text[colon + 1] === ':') return at;

  return skipSpace(text, colon + 1);
};

const openingQuote = (
  text: string,
  at: number,
  language: LanguageId
): number => {
  if (QUOTES.has(text[at])) return at;

  let open = at;

  while (open - at < PREFIX_LIMIT && /[A-Za-z@#]/.test(text[open] ?? ''))
    open += 1;

  const prefix = text.slice(at, open);

  return QUOTES.has(text[open]) &&
    (STATIC_PREFIXES[language]?.test(prefix) ?? false)
    ? open
    : -1;
};

/** Locates the string literal an argument consists of, past its label and any prefix that keeps it free of interpolation */
export const staticLiteralAt = (
  text: string,
  start: number,
  language: LanguageId
): StaticLiteral | null => {
  const at = skipLabel(text, skipSpace(text, start));
  const open = openingQuote(text, at, language);

  if (open === -1) return null;

  const hashes = text.slice(at, open).split('#').length - 1;

  if (hashes > 0) {
    const close = text.indexOf(`"${'#'.repeat(hashes)}`, open + 1);

    return close === -1 ? null : { open, end: close, next: close + 1 + hashes };
  }

  const literal = readLiteral(text, open);

  if (literal === null || literal.interpolated) return null;

  return { open, end: literal.end, next: literal.end + 1 };
};
