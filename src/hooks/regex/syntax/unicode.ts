import type {
  CaseTable,
  CodeSet,
  Segment,
} from '../../../types/hooks/regex.js';
import { propertyRun } from '../../../core/dynamic-regex.js';
import {
  expandPoints,
  fromPoints,
  fromRanges,
  LEGACY_LIMIT,
  pointsWithin,
  rangeSet,
  UNICODE_LIMIT,
  union,
} from './codeset.js';

const CHUNK = 4096;

const UNICODE_SEGMENTS: readonly (readonly [number, number, number])[] = [
  [0, 0xd800, 1],
  [0xd800, 0xdc00, 1],
  [0xdc00, 0xe000, 1],
  [0xe000, 0x10000, 1],
  [0x10000, UNICODE_LIMIT, 2],
];

const FOLDING_PAIRS: readonly (readonly [number, number])[] = [
  [0x1fd3, 0x390],
  [0x1fe3, 0x3b0],
  [0xfb05, 0xfb06],
];

export const LINE_TERMINATORS: CodeSet = fromRanges([
  [0x0a, 0x0b],
  [0x0d, 0x0e],
  [0x2028, 0x202a],
]);

export const DIGITS: CodeSet = rangeSet(0x30, 0x3a);

export const BASIC_WORD: CodeSet = fromRanges([
  [0x30, 0x3a],
  [0x41, 0x5b],
  [0x5f, 0x60],
  [0x61, 0x7b],
]);

const CASE_CHANGING_RUN =
  /[\p{Changes_When_Casemapped}\p{Changes_When_Casefolded}]+/gu;

const SPACE_RUN = /\s+/gu;

const CASELESS_WORD_RUN = /\w+/giu;

const EMOJI_RUN = /[\p{Emoji}\p{Emoji_Component}\p{Extended_Pictographic}]+/gu;

const EMOJI_COMPONENT_RUN =
  /[\p{Emoji}\p{Emoji_Component}\p{Extended_Pictographic}\u200d\ufe0f\u20e3\u{e0020}-\u{e007f}]+/gu;

const CASELESS_REPEAT = /^(.)\1$/isu;

const STRING_PROPERTY_MATCHERS = new Map<string, RegExp>([
  ['Basic_Emoji', /^\p{Basic_Emoji}$/v],
  ['Emoji_Keycap_Sequence', /^\p{Emoji_Keycap_Sequence}$/v],
  ['RGI_Emoji_Modifier_Sequence', /^\p{RGI_Emoji_Modifier_Sequence}$/v],
  ['RGI_Emoji_Flag_Sequence', /^\p{RGI_Emoji_Flag_Sequence}$/v],
  ['RGI_Emoji_Tag_Sequence', /^\p{RGI_Emoji_Tag_Sequence}$/v],
  ['RGI_Emoji_ZWJ_Sequence', /^\p{RGI_Emoji_ZWJ_Sequence}$/v],
  ['RGI_Emoji', /^\p{RGI_Emoji}$/v],
]);

const nativeCache = new Map<string, CodeSet>();

const caseCache = new Map<boolean, CaseTable>();

let segments: readonly Segment[] | null = null;

/** Spells every code point of a range in order, writing an astral one as the surrogate pair that encodes it */
const segmentText = (start: number, end: number): string => {
  const parts: string[] = [];
  const units: number[] = [];

  for (let chunk = start; chunk < end; chunk += CHUNK) {
    const last = Math.min(chunk + CHUNK, end);

    units.length = 0;

    for (let point = chunk; point < last; point += 1)
      if (point < 0x10000) units.push(point);
      else
        units.push(
          0xd800 + ((point - 0x10000) >> 10),
          0xdc00 + ((point - 0x10000) & 0x3ff)
        );

    parts.push(String.fromCharCode.apply(null, units));
  }

  return parts.join('');
};

const unicodeSegments = (): readonly Segment[] => {
  segments ??= UNICODE_SEGMENTS.map(([start, end, width]) => ({
    start,
    width,
    text: segmentText(start, end),
  }));

  return segments;
};

const nativeSet = (matcher: RegExp): CodeSet => {
  const key = `${matcher.flags}/${matcher.source}`;
  const cached = nativeCache.get(key);

  if (cached) return cached;

  const set = fromRanges(
    unicodeSegments().flatMap(({ start, width, text }) =>
      Array.from(text.matchAll(matcher), (match) => [
        start + match.index / width,
        start + (match.index + match[0].length) / width,
      ])
    )
  );

  nativeCache.set(key, set);
  return set;
};

const legacyCanonical = (unit: number): number => {
  const upper = String.fromCharCode(unit).toUpperCase();

  if (upper.length !== 1) return unit;

  const canonical = upper.charCodeAt(0);

  return unit >= 128 && canonical < 128 ? unit : canonical;
};

const tableFromGroups = (groups: Map<number, number[]>): CaseTable => {
  const classes = new Map<number, readonly number[]>();

  for (const members of groups.values()) {
    if (members.length < 2) continue;

    const sorted = members.toSorted((left, right) => left - right);

    for (const member of sorted) classes.set(member, sorted);
  }

  return {
    points: [...classes.keys()].toSorted((left, right) => left - right),
    classes,
  };
};

const legacyTable = (): CaseTable => {
  const groups = new Map<number, number[]>();

  for (let unit = 0; unit < LEGACY_LIMIT; unit += 1) {
    const canonical = legacyCanonical(unit);
    const members = groups.get(canonical) ?? [];

    members.push(unit);
    groups.set(canonical, members);
  }

  return tableFromGroups(groups);
};

const findRoot = (parents: Map<number, number>, point: number): number => {
  let root = point;

  while ((parents.get(root) ?? root) !== root) root = parents.get(root) ?? root;

  parents.set(point, root);
  return root;
};

const singlePoint = (text: string): number | null => {
  const point = text.codePointAt(0);

  return point !== undefined && String.fromCodePoint(point) === text
    ? point
    : null;
};

const foldsTogether = (left: number, right: number): boolean =>
  CASELESS_REPEAT.test(String.fromCodePoint(left, right));

const unicodeLinks = (point: number): number[] => {
  const text = String.fromCodePoint(point);

  return [singlePoint(text.toLowerCase()), singlePoint(text.toUpperCase())]
    .filter((other): other is number => other !== null && other !== point)
    .filter((other) => foldsTogether(point, other));
};

const unicodeTable = (): CaseTable => {
  const parents = new Map<number, number>();
  const points = expandPoints(nativeSet(CASE_CHANGING_RUN));
  const links = [
    ...points.flatMap((point) =>
      unicodeLinks(point).map((other) => [point, other])
    ),
    ...FOLDING_PAIRS.filter(([left, right]) => foldsTogether(left, right)),
  ];

  for (const [left, right] of links)
    parents.set(findRoot(parents, left), findRoot(parents, right));

  const groups = new Map<number, number[]>();

  for (const point of parents.keys()) {
    const root = findRoot(parents, point);
    const members = groups.get(root) ?? [];

    members.push(point);
    groups.set(root, members);
  }

  return tableFromGroups(groups);
};

const caseTable = (unicode: boolean): CaseTable => {
  const cached = caseCache.get(unicode);

  if (cached) return cached;

  const table = unicode ? unicodeTable() : legacyTable();

  caseCache.set(unicode, table);
  return table;
};

/** Widens a set to every character the engine treats as the same letter when matching without case */
export const caseClosure = (set: CodeSet, unicode: boolean): CodeSet => {
  const table = caseTable(unicode);
  const extra = pointsWithin(set, table.points).flatMap(
    (point) => table.classes.get(point) ?? []
  );

  return extra.length === 0 ? set : union(set, fromPoints(extra));
};

/** Folds a character to the one member the engine compares when matching without case */
export const caseRepresentative = (point: number, unicode: boolean): number =>
  caseTable(unicode).classes.get(point)?.[0] ?? point;

export const spaceSet = (): CodeSet => nativeSet(SPACE_RUN);

export const wordSet = (ignoreCase: boolean, unicode: boolean): CodeSet =>
  ignoreCase && unicode ? nativeSet(CASELESS_WORD_RUN) : BASIC_WORD;

export const propertySet = (expression: string): CodeSet =>
  nativeSet(propertyRun(expression));

export const stringPropertySingles = (expression: string): CodeSet | null => {
  const matcher = STRING_PROPERTY_MATCHERS.get(expression);

  if (matcher === undefined) return null;

  return fromPoints(
    expandPoints(nativeSet(EMOJI_RUN)).filter((point) =>
      matcher.test(String.fromCodePoint(point))
    )
  );
};

export const emojiComponents = (): CodeSet => nativeSet(EMOJI_COMPONENT_RUN);

export const universeLimit = (unicode: boolean): number =>
  unicode ? UNICODE_LIMIT : LEGACY_LIMIT;
