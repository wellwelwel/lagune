import type {
  CodeSet,
  MatchMode,
  ParseCursor,
  ParsedAtomNode,
  ParsedPattern,
  PatternFlags,
  Quantifier,
  RegexNode,
} from '../../../types/hooks/regex.js';
import { reachCap } from '../budget.js';
import {
  closeOver,
  parseLegacyClass,
  parseSetClass,
  readAtomEscape,
  valueNode,
} from './classes.js';
import { pointSet, rangeSet, subtract } from './codeset.js';
import { peek, readPoint, startsWith } from './cursor.js';
import { alternationOf, charNode, EMPTY_NODE } from './tree.js';
import { LINE_TERMINATORS, universeLimit } from './unicode.js';

const NESTING_LIMIT = 512;

const SHORTHAND_BOUNDS: ReadonlyMap<string, readonly [number, number]> =
  new Map([
    ['*', [0, Infinity]],
    ['+', [1, Infinity]],
    ['?', [0, 1]],
  ]);

const decodeName = (raw: string): string =>
  raw.replace(
    /\\u\{([0-9A-Fa-f]+)\}|\\u([0-9A-Fa-f]{4})/g,
    (_, braced: string | undefined, plain: string | undefined) =>
      braced
        ? String.fromCodePoint(Number.parseInt(braced, 16))
        : String.fromCharCode(Number.parseInt(plain ?? '0', 16))
  );

const skipClass = (source: string, open: number, sets: boolean): number => {
  let depth = 0;
  let index = open;

  while (index < source.length) {
    const char = source[index];

    if (char === '\\') {
      index += 2;
      continue;
    }

    index += 1;

    if (char === '[' && (sets || depth === 0)) {
      depth += 1;

      if (depth > NESTING_LIMIT) reachCap();
      continue;
    }

    if (char === ']') {
      depth -= 1;

      if (depth === 0) return index;
    }
  }

  return index;
};

const prescan = (
  source: string,
  sets: boolean
): { total: number; names: Map<string, number[]> } => {
  const names = new Map<string, number[]>();
  let total = 0;
  let depth = 0;
  let index = 0;

  while (index < source.length) {
    const char = source[index];

    if (char === '\\') {
      index += 2;
      continue;
    }

    if (char === '[') {
      index = skipClass(source, index, sets);
      continue;
    }

    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;

    if (depth > NESTING_LIMIT) reachCap();

    if (char === '(' && source[index + 1] !== '?') total += 1;

    if (
      char === '(' &&
      source.startsWith('(?<', index) &&
      source[index + 3] !== '=' &&
      source[index + 3] !== '!'
    ) {
      const close = source.indexOf('>', index + 3);
      const name = decodeName(source.slice(index + 3, close));

      total += 1;
      names.set(name, [...(names.get(name) ?? []), total]);
    }

    index += 1;
  }

  return { total, names };
};

const dotSet = (mode: MatchMode, unicode: boolean): CodeSet => {
  const all = rangeSet(0, universeLimit(unicode));

  return mode.dotAll ? all : subtract(all, LINE_TERMINATORS);
};

const readBracedBounds = (
  cursor: ParseCursor
): readonly [number, number] | null => {
  const braced = /^\{(\d+)(?:,(\d*))?\}/.exec(
    cursor.source.slice(cursor.position)
  );

  if (!braced) return null;

  cursor.position += braced[0].length;
  return [
    Number(braced[1]),
    braced[2] === '' ? Infinity : Number(braced[2] ?? braced[1]),
  ];
};

const readBounds = (cursor: ParseCursor): readonly [number, number] | null => {
  const shorthand = SHORTHAND_BOUNDS.get(peek(cursor) ?? '');

  if (shorthand) {
    cursor.position += 1;
    return shorthand;
  }

  return peek(cursor) === '{' ? readBracedBounds(cursor) : null;
};

const readQuantifier = (cursor: ParseCursor): Quantifier | null => {
  const bounds = readBounds(cursor);

  if (!bounds) return null;

  const lazy = peek(cursor) === '?';

  if (lazy) cursor.position += 1;

  return { min: bounds[0], max: bounds[1], lazy };
};

const backreference = (
  cursor: ParseCursor,
  indices: readonly number[]
): RegexNode => {
  const captures = indices.filter((index) => !cursor.open.includes(index));

  return captures.length === 0
    ? EMPTY_NODE
    : { kind: 'backreference', captures };
};

const readDecimalEscape = (cursor: ParseCursor): RegexNode | null => {
  const digits = /^[1-9]\d*/.exec(cursor.source.slice(cursor.position + 1));

  if (!digits) return null;

  const index = Number(digits[0]);

  if (!cursor.unicode && index > cursor.captureTotal) return null;

  cursor.position += 1 + digits[0].length;
  return backreference(cursor, [index]);
};

const readNamedReference = (cursor: ParseCursor): RegexNode => {
  const close = cursor.source.indexOf('>', cursor.position);
  const name = decodeName(cursor.source.slice(cursor.position + 3, close));

  cursor.position = close + 1;
  return backreference(cursor, cursor.names.get(name) ?? []);
};

const parseEscape = (cursor: ParseCursor, mode: MatchMode): RegexNode => {
  const char = peek(cursor, 1);

  if (char === 'b' || char === 'B') {
    cursor.position += 2;
    return {
      kind: 'assertion',
      test: char === 'b' ? 'word' : 'notWord',
      multiline: mode.multiline,
      unicodeWord: mode.ignoreCase && cursor.unicode,
    };
  }

  if (char === 'k' && cursor.namedGroups) return readNamedReference(cursor);

  const reference = readDecimalEscape(cursor);

  if (reference) return reference;

  if (!cursor.unicode && (char === '8' || char === '9')) {
    cursor.position += 2;
    return charNode(pointSet(char.charCodeAt(0)));
  }

  const { value } = readAtomEscape(cursor, mode, false);

  return valueNode(
    { ...value, chars: closeOver(value.chars, mode, cursor.unicode) },
    mode
  );
};

const readModifiers = (cursor: ParseCursor, mode: MatchMode): MatchMode => {
  const close = cursor.source.indexOf(':', cursor.position);
  const [enable = '', disable = ''] = cursor.source
    .slice(cursor.position + 2, close)
    .split('-');

  const flag = (letter: string, current: boolean): boolean =>
    enable.includes(letter) || (current && !disable.includes(letter));

  cursor.position = close + 1;
  return {
    ignoreCase: flag('i', mode.ignoreCase),
    multiline: flag('m', mode.multiline),
    dotAll: flag('s', mode.dotAll),
  };
};

const parseGroupBody = (
  cursor: ParseCursor,
  mode: MatchMode,
  capture: number | null
): RegexNode => {
  if (capture !== null) cursor.open.push(capture);

  const body = parseDisjunction(cursor, mode);

  cursor.position += 1;

  if (capture === null) return body;

  cursor.open.pop();
  cursor.captures.set(capture, body);
  return body;
};

const parseParen = (cursor: ParseCursor, mode: MatchMode): ParsedAtomNode => {
  const lookaround = /^\(\?(<?)([=!])/.exec(
    cursor.source.slice(cursor.position, cursor.position + 4)
  );

  if (lookaround) {
    const behind = lookaround[1] === '<';

    cursor.position += lookaround[0].length;
    return {
      node: {
        kind: 'look',
        behind,
        negative: lookaround[2] === '!',
        body: parseGroupBody(cursor, mode, null),
      },
      quantifiable: !behind && !cursor.unicode,
    };
  }

  if (startsWith(cursor, '(?:')) {
    cursor.position += 3;
    return { node: parseGroupBody(cursor, mode, null), quantifiable: true };
  }

  if (startsWith(cursor, '(?<')) {
    cursor.position = cursor.source.indexOf('>', cursor.position) + 1;
    cursor.nextCapture += 1;
    return {
      node: parseGroupBody(cursor, mode, cursor.nextCapture),
      quantifiable: true,
    };
  }

  if (startsWith(cursor, '(?')) {
    const inner = readModifiers(cursor, mode);

    return { node: parseGroupBody(cursor, inner, null), quantifiable: true };
  }

  cursor.position += 1;
  cursor.nextCapture += 1;
  return {
    node: parseGroupBody(cursor, mode, cursor.nextCapture),
    quantifiable: true,
  };
};

const parseAtom = (cursor: ParseCursor, mode: MatchMode): ParsedAtomNode => {
  const char = peek(cursor);

  if (char === '^' || char === '$') {
    cursor.position += 1;
    return {
      node: {
        kind: 'assertion',
        test: char === '^' ? 'begin' : 'end',
        multiline: mode.multiline,
        unicodeWord: false,
      },
      quantifiable: false,
    };
  }

  if (char === '(') return parseParen(cursor, mode);

  if (char === '.') {
    cursor.position += 1;
    return { node: charNode(dotSet(mode, cursor.unicode)), quantifiable: true };
  }

  if (char === '[') {
    const node = cursor.sets
      ? valueNode(parseSetClass(cursor, mode), mode)
      : charNode(parseLegacyClass(cursor, mode));

    return { node, quantifiable: true };
  }

  if (char === '\\') {
    const node = parseEscape(cursor, mode);

    return { node, quantifiable: node.kind !== 'assertion' };
  }

  return {
    node: charNode(
      closeOver(pointSet(readPoint(cursor)), mode, cursor.unicode)
    ),
    quantifiable: true,
  };
};

const parseTerm = (cursor: ParseCursor, mode: MatchMode): RegexNode => {
  const { node, quantifiable } = parseAtom(cursor, mode);

  if (!quantifiable) return node;

  const quantifier = readQuantifier(cursor);

  if (!quantifier) return node;

  cursor.quantifiers += 1;
  return { kind: 'repeat', body: node, ...quantifier };
};

const parseAlternative = (cursor: ParseCursor, mode: MatchMode): RegexNode => {
  const items: RegexNode[] = [];

  while (
    cursor.position < cursor.source.length &&
    peek(cursor) !== '|' &&
    peek(cursor) !== ')'
  )
    items.push(parseTerm(cursor, mode));

  if (items.length === 0) return EMPTY_NODE;

  return items.length === 1 ? items[0] : { kind: 'sequence', items };
};

const parseDisjunction = (cursor: ParseCursor, mode: MatchMode): RegexNode => {
  const branches = [parseAlternative(cursor, mode)];

  while (peek(cursor) === '|') {
    cursor.position += 1;
    branches.push(parseAlternative(cursor, mode));
  }

  return alternationOf(branches);
};

const readFlags = (flags: string): PatternFlags => ({
  ignoreCase: flags.includes('i'),
  multiline: flags.includes('m'),
  dotAll: flags.includes('s'),
  unicode: flags.includes('u') || flags.includes('v'),
  sets: flags.includes('v'),
  sticky: flags.includes('y'),
});

/** Parses a pattern the engine already accepted into a tree whose atoms carry their exact character sets */
export const parsePattern = (source: string, flags: string): ParsedPattern => {
  const patternFlags = readFlags(flags);
  const { total, names } = prescan(source, patternFlags.sets);
  const cursor: ParseCursor = {
    source,
    position: 0,
    unicode: patternFlags.unicode,
    sets: patternFlags.sets,
    namedGroups: patternFlags.unicode || names.size > 0,
    captureTotal: total,
    nextCapture: 0,
    names,
    open: [],
    captures: new Map(),
    quantifiers: 0,
  };
  const root = parseDisjunction(cursor, {
    ignoreCase: patternFlags.ignoreCase,
    multiline: patternFlags.multiline,
    dotAll: patternFlags.dotAll,
  });

  return {
    root,
    captures: cursor.captures,
    flags: patternFlags,
    quantifiers: cursor.quantifiers,
  };
};
