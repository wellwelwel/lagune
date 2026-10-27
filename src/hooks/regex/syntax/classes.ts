import type {
  ClassValue,
  CodeSet,
  MatchMode,
  ParseCursor,
  ParsedAtom,
  RegexNode,
} from '../../../types/hooks/regex.js';
import {
  complement,
  EMPTY_SET,
  fromPoints,
  intersect,
  isEmptySet,
  pointSet,
  rangeSet,
  subtract,
  union,
} from './codeset.js';
import {
  isAsciiLetter,
  peek,
  readCharacterEscape,
  readPoint,
  startsWith,
} from './cursor.js';
import { alternationOf, charNode, EMPTY_NODE } from './tree.js';
import {
  caseClosure,
  caseRepresentative,
  DIGITS,
  emojiComponents,
  propertySet,
  spaceSet,
  stringPropertySingles,
  universeLimit,
  wordSet,
} from './unicode.js';

const MAX_EMOJI_LENGTH = 16;

export const closeOver = (
  set: CodeSet,
  mode: MatchMode,
  unicode: boolean
): CodeSet => (mode.ignoreCase ? caseClosure(set, unicode) : set);

const escapeClassSet = (
  letter: string,
  mode: MatchMode,
  cursor: ParseCursor
): CodeSet => {
  const lower = letter.toLowerCase();
  const base =
    lower === 'd'
      ? DIGITS
      : lower === 's'
        ? spaceSet()
        : wordSet(mode.ignoreCase, cursor.unicode);
  const folded = cursor.sets ? closeOver(base, mode, true) : base;

  return letter === lower
    ? folded
    : complement(folded, universeLimit(cursor.unicode));
};

const readPropertyExpression = (cursor: ParseCursor): string => {
  const close = cursor.source.indexOf('}', cursor.position);
  const expression = cursor.source.slice(cursor.position + 1, close);

  cursor.position = close + 1;
  return expression;
};

const propertyValue = (
  negated: boolean,
  expression: string,
  mode: MatchMode,
  cursor: ParseCursor
): ClassValue => {
  const singles = stringPropertySingles(expression);

  if (singles !== null)
    return { chars: singles, strings: [], approximate: true };

  const base = propertySet(expression);
  const folded = cursor.sets ? closeOver(base, mode, true) : base;

  return {
    chars: negated ? complement(folded, universeLimit(true)) : folded,
    strings: [],
    approximate: false,
  };
};

const charValue = (chars: CodeSet): ClassValue => ({
  chars,
  strings: [],
  approximate: false,
});

export const readAtomEscape = (
  cursor: ParseCursor,
  mode: MatchMode,
  inClass: boolean
): ParsedAtom => {
  const char = peek(cursor, 1) ?? '';

  if (char === 'c' && !isAsciiLetter(peek(cursor, 2))) {
    const controlled =
      inClass && !cursor.unicode && /^[0-9_]$/.test(peek(cursor, 2) ?? '');
    const point = controlled
      ? cursor.source.charCodeAt(cursor.position + 2) % 32
      : 0x5c;

    cursor.position += controlled ? 3 : 1;
    return { value: charValue(pointSet(point)), point };
  }

  if ('dDsSwW'.includes(char) && char !== '') {
    cursor.position += 2;
    return {
      value: charValue(escapeClassSet(char, mode, cursor)),
      point: null,
    };
  }

  if ((char === 'p' || char === 'P') && cursor.unicode) {
    cursor.position += 2;
    return {
      value: propertyValue(
        char === 'P',
        readPropertyExpression(cursor),
        mode,
        cursor
      ),
      point: null,
    };
  }

  if (inClass && char === 'b') {
    cursor.position += 2;
    return { value: charValue(pointSet(0x08)), point: 0x08 };
  }

  if (inClass && char === '-') {
    cursor.position += 2;
    return { value: charValue(pointSet(0x2d)), point: 0x2d };
  }

  cursor.position += 1;

  const point = readCharacterEscape(cursor);

  return { value: charValue(pointSet(point)), point };
};

const readClassAtom = (cursor: ParseCursor, mode: MatchMode): ParsedAtom => {
  if (peek(cursor) === '\\') return readAtomEscape(cursor, mode, true);

  const point = readPoint(cursor);

  return { value: charValue(pointSet(point)), point };
};

export const parseLegacyClass = (
  cursor: ParseCursor,
  mode: MatchMode
): CodeSet => {
  cursor.position += 1;

  const negated = peek(cursor) === '^';
  let set = EMPTY_SET;

  if (negated) cursor.position += 1;

  while (cursor.position < cursor.source.length && peek(cursor) !== ']') {
    const left = readClassAtom(cursor, mode);
    const ranged =
      peek(cursor) === '-' &&
      peek(cursor, 1) !== ']' &&
      peek(cursor, 1) !== undefined;

    if (!ranged) {
      set = union(set, left.value.chars);
      continue;
    }

    cursor.position += 1;

    const right = readClassAtom(cursor, mode);

    set =
      left.point !== null && right.point !== null
        ? union(set, rangeSet(left.point, right.point + 1))
        : union(
            union(set, left.value.chars),
            union(pointSet(0x2d), right.value.chars)
          );
  }

  cursor.position += 1;

  const closed = closeOver(set, mode, cursor.unicode);

  return negated ? complement(closed, universeLimit(cursor.unicode)) : closed;
};

const foldString = (
  points: readonly number[],
  mode: MatchMode
): readonly number[] =>
  mode.ignoreCase
    ? points.map((point) => caseRepresentative(point, true))
    : points;

const uniqueStrings = (
  strings: readonly (readonly number[])[]
): (readonly number[])[] => {
  const seen = new Map<string, readonly number[]>();

  for (const string of strings) seen.set(string.join(','), string);

  return [...seen.values()];
};

const unionValues = (left: ClassValue, right: ClassValue): ClassValue => ({
  chars: union(left.chars, right.chars),
  strings: uniqueStrings([...left.strings, ...right.strings]),
  approximate: left.approximate || right.approximate,
});

const intersectValues = (left: ClassValue, right: ClassValue): ClassValue => {
  const rightKeys = new Set(right.strings.map((string) => string.join(',')));

  return {
    chars: intersect(left.chars, right.chars),
    strings: uniqueStrings([
      ...left.strings.filter(
        (string) => right.approximate || rightKeys.has(string.join(','))
      ),
      ...(left.approximate ? right.strings : []),
    ]),
    approximate: left.approximate && right.approximate,
  };
};

const subtractValues = (left: ClassValue, right: ClassValue): ClassValue => {
  const rightKeys = new Set(right.strings.map((string) => string.join(',')));

  return {
    chars: subtract(left.chars, right.chars),
    strings: left.strings.filter((string) => !rightKeys.has(string.join(','))),
    approximate: left.approximate,
  };
};

const readSetCharacter = (cursor: ParseCursor): number => {
  if (peek(cursor) !== '\\') return readPoint(cursor);

  const char = peek(cursor, 1) ?? '';

  if (char === 'b') {
    cursor.position += 2;
    return 0x08;
  }

  cursor.position += 1;
  return readCharacterEscape(cursor);
};

const readStringDisjunction = (
  cursor: ParseCursor,
  mode: MatchMode
): ClassValue => {
  const strings: (readonly number[])[] = [];
  let current: number[] = [];

  cursor.position += 3;

  while (cursor.position < cursor.source.length && peek(cursor) !== '}') {
    if (peek(cursor) === '|') {
      strings.push(current);
      current = [];
      cursor.position += 1;
      continue;
    }

    current.push(readSetCharacter(cursor));
  }

  strings.push(current);
  cursor.position += 1;

  const singles = strings.filter((string) => string.length === 1);
  const chars = closeOver(
    fromPoints(singles.map(([point]) => point)),
    mode,
    true
  );

  return {
    chars,
    strings: uniqueStrings(
      strings
        .filter((string) => string.length !== 1)
        .map((string) => foldString(string, mode))
    ),
    approximate: false,
  };
};

const parseSetOperand = (cursor: ParseCursor, mode: MatchMode): ClassValue => {
  if (peek(cursor) === '[') return parseSetClass(cursor, mode);
  if (startsWith(cursor, '\\q{')) return readStringDisjunction(cursor, mode);

  if (peek(cursor) === '\\' && 'dDsSwWpP'.includes(peek(cursor, 1) ?? ' '))
    return readAtomEscape(cursor, mode, true).value;

  const start = readSetCharacter(cursor);

  if (peek(cursor) !== '-' || peek(cursor, 1) === '-')
    return charValue(closeOver(pointSet(start), mode, true));

  cursor.position += 1;

  const end = readSetCharacter(cursor);

  return charValue(closeOver(rangeSet(start, end + 1), mode, true));
};

export const parseSetClass = (
  cursor: ParseCursor,
  mode: MatchMode
): ClassValue => {
  cursor.position += 1;

  const negated = peek(cursor) === '^';

  if (negated) cursor.position += 1;

  let value: ClassValue = charValue(EMPTY_SET);

  if (peek(cursor) !== ']') {
    value = parseSetOperand(cursor, mode);

    if (startsWith(cursor, '&&'))
      while (startsWith(cursor, '&&')) {
        cursor.position += 2;
        value = intersectValues(value, parseSetOperand(cursor, mode));
      }
    else if (startsWith(cursor, '--'))
      while (startsWith(cursor, '--')) {
        cursor.position += 2;
        value = subtractValues(value, parseSetOperand(cursor, mode));
      }
    else
      while (cursor.position < cursor.source.length && peek(cursor) !== ']')
        value = unionValues(value, parseSetOperand(cursor, mode));
  }

  cursor.position += 1;

  return negated
    ? charValue(complement(value.chars, universeLimit(true)))
    : value;
};

const stringNode = (points: readonly number[], mode: MatchMode): RegexNode => ({
  kind: 'sequence',
  items: points.map((point) =>
    charNode(closeOver(pointSet(point), mode, true))
  ),
});

export const valueNode = (value: ClassValue, mode: MatchMode): RegexNode => {
  if (value.strings.length === 0 && !value.approximate)
    return charNode(value.chars);

  const longest = value.strings
    .filter((string) => string.length > 1)
    .toSorted((left, right) => right.length - left.length);
  const approximated: RegexNode[] = value.approximate
    ? [
        {
          kind: 'uncertain',
          body: {
            kind: 'repeat',
            body: charNode(emojiComponents()),
            min: 2,
            max: MAX_EMOJI_LENGTH,
            lazy: false,
          },
        },
      ]
    : [];
  const chars = isEmptySet(value.chars) ? [] : [charNode(value.chars)];
  const empty = value.strings.some((string) => string.length === 0)
    ? [EMPTY_NODE]
    : [];
  const branches = [
    ...approximated,
    ...longest.map((string) => stringNode(string, mode)),
    ...chars,
    ...empty,
  ];

  return alternationOf(branches);
};
