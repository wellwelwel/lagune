import type { AssertionTest } from '../../../types/hooks/regex.js';

export const BOUNDARY = 0;

export const LINE = 1;

export const WORD = 2;

export const EXTRA_WORD = 3;

export const OTHER = 4;

export const KIND_COUNT = 5;

export const KINDS: readonly number[] = Array.from(
  { length: KIND_COUNT },
  (_, kind) => kind
);

export const ALL_KINDS = (1 << KIND_COUNT) - 1;

export const maskOf = (kind: number): number => 1 << kind;

export const isLineTest = (test: AssertionTest): boolean =>
  test === 'begin' || test === 'end';

const wordMask = (unicodeWord: boolean): number =>
  maskOf(WORD) | (unicodeWord ? maskOf(EXTRA_WORD) : 0);

/** Lists which kinds the next character may have once an assertion holds after a character of the given kind */
export const allowedAfter = (
  test: AssertionTest,
  multiline: boolean,
  unicodeWord: boolean,
  previous: number
): number => {
  if (test === 'begin') {
    const atLineStart =
      previous === BOUNDARY || (multiline && previous === LINE);

    return atLineStart ? ALL_KINDS : 0;
  }

  if (test === 'end') return maskOf(BOUNDARY) | (multiline ? maskOf(LINE) : 0);

  const words = wordMask(unicodeWord);
  const afterWord = (words & maskOf(previous)) !== 0;
  const sameSide = afterWord ? words : ALL_KINDS & ~words;
  const otherSide = afterWord ? ALL_KINDS & ~words : words;

  return test === 'word' ? otherSide : sameSide;
};
