import type { RepetitionScan } from '../types.ts';
import { fail } from '../fail.ts';

const MAX_PATTERN_LENGTH = 512;
const REPETITION_BOUND = 1000;
const OPEN_RANGE = /^\{(\d{1,6}),\}/;

const scanCharacter = (
  source: string,
  state: RepetitionScan,
  character: string,
  index: number
): RepetitionScan => {
  const append = (text: string): RepetitionScan => ({
    ...state,
    output: state.output + text,
  });

  if (state.skip > 0) return { ...state, skip: state.skip - 1 };
  if (state.escaped) return { ...append(character), escaped: false };
  if (character === '\\') return { ...append(character), escaped: true };
  if (state.inClass)
    return { ...append(character), inClass: character !== ']' };
  if (character === '[') return { ...append(character), inClass: true };
  if (character === '*') return append(`{0,${REPETITION_BOUND}}`);
  if (character === '+') return append(`{1,${REPETITION_BOUND}}`);

  const openRange =
    character === '{' ? OPEN_RANGE.exec(source.slice(index)) : null;

  if (openRange === null) return append(character);

  const minimum = Number(openRange[1]);

  return {
    ...append(`{${minimum},${Math.max(minimum, REPETITION_BOUND)}}`),
    skip: openRange[0].length - 1,
  };
};

const boundRepetitions = (source: string): string =>
  source
    .split('')
    .reduce<RepetitionScan>(
      (state, character, index) =>
        scanCharacter(source, state, character, index),
      { output: '', escaped: false, inClass: false, skip: 0 }
    ).output;

export const checkPatterns = (sources: string[]): string[] => {
  if (
    sources.some(
      (source) => source === '' || source.length > MAX_PATTERN_LENGTH
    )
  )
    fail(`every --pattern needs 1 to ${MAX_PATTERN_LENGTH} characters`);

  return sources.map(boundRepetitions);
};
