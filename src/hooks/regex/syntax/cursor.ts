import type { ParseCursor } from '../../../types/hooks/regex.js';

const CONTROL_ESCAPES: Readonly<Record<string, number>> = {
  f: 0x0c,
  n: 0x0a,
  r: 0x0d,
  t: 0x09,
  v: 0x0b,
};

const isDigit = (char: string | undefined): boolean =>
  char !== undefined && char >= '0' && char <= '9';

const isOctal = (char: string | undefined): boolean =>
  char !== undefined && char >= '0' && char <= '7';

export const isAsciiLetter = (char: string | undefined): boolean =>
  char !== undefined && /^[A-Za-z]$/.test(char);

const isHex = (text: string): boolean => /^[0-9A-Fa-f]+$/.test(text);

export const peek = (cursor: ParseCursor, offset = 0): string | undefined =>
  cursor.source[cursor.position + offset];

export const startsWith = (cursor: ParseCursor, text: string): boolean =>
  cursor.source.startsWith(text, cursor.position);

export const readPoint = (cursor: ParseCursor): number => {
  const point = cursor.unicode
    ? (cursor.source.codePointAt(cursor.position) ?? 0)
    : cursor.source.charCodeAt(cursor.position);

  cursor.position += point > 0xffff ? 2 : 1;
  return point;
};

const readHex = (cursor: ParseCursor, length: number): number | null => {
  const text = cursor.source.slice(cursor.position, cursor.position + length);

  if (text.length !== length || !isHex(text)) return null;

  cursor.position += length;
  return Number.parseInt(text, 16);
};

const readUnicodeEscape = (cursor: ParseCursor): number | null => {
  if (cursor.unicode && peek(cursor) === '{') {
    const close = cursor.source.indexOf('}', cursor.position);
    const value = Number.parseInt(
      cursor.source.slice(cursor.position + 1, close),
      16
    );

    cursor.position = close + 1;
    return value;
  }

  const lead = readHex(cursor, 4);

  if (lead === null || !cursor.unicode || lead < 0xd800 || lead > 0xdbff)
    return lead;

  if (!startsWith(cursor, '\\u')) return lead;

  const save = cursor.position;

  cursor.position += 2;

  const trail = readHex(cursor, 4);

  if (trail !== null && trail >= 0xdc00 && trail <= 0xdfff)
    return 0x10000 + (lead - 0xd800) * 0x400 + (trail - 0xdc00);

  cursor.position = save;
  return lead;
};

const readOctal = (cursor: ParseCursor): number => {
  const first = peek(cursor) ?? '0';
  const limit = first <= '3' ? 3 : 2;
  let value = 0;
  let count = 0;

  while (count < limit && isOctal(peek(cursor))) {
    value = value * 8 + Number(peek(cursor));
    cursor.position += 1;
    count += 1;
  }

  return value;
};

export const readCharacterEscape = (cursor: ParseCursor): number => {
  const char = peek(cursor) ?? '';
  const control = CONTROL_ESCAPES[char];

  if (control !== undefined) {
    cursor.position += 1;
    return control;
  }

  if (char === 'c' && isAsciiLetter(peek(cursor, 1))) {
    cursor.position += 2;
    return cursor.source.charCodeAt(cursor.position - 1) % 32;
  }

  if (char === '0' && !isDigit(peek(cursor, 1))) {
    cursor.position += 1;
    return 0;
  }

  if (!cursor.unicode && isOctal(char)) return readOctal(cursor);

  if (char === 'x') {
    cursor.position += 1;

    const value = readHex(cursor, 2);

    if (value !== null) return value;

    return 0x78;
  }

  if (char === 'u') {
    cursor.position += 1;

    const value = readUnicodeEscape(cursor);

    if (value !== null) return value;

    return 0x75;
  }

  return readPoint(cursor);
};
