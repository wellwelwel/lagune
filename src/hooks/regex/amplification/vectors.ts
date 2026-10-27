import type { ScoreLayout, ScoreScratch } from '../../../types/hooks/regex.js';

export const emitRun = (
  runs: number[],
  length: number,
  start: number,
  end: number,
  value: number
): number => {
  if (length > 0 && runs[length - 2] === start && runs[length - 1] === value) {
    runs[length - 2] = end;
    return length;
  }

  runs[length] = start;
  runs[length + 1] = end;
  runs[length + 2] = value;
  return length + 3;
};

/** Finds the first run of a canonical vector that ends after the position, or the vector's length */
const firstRunAfter = (
  runs: readonly number[],
  size: number,
  position: number
): number => {
  let low = 0;
  let high = size / 3;

  while (low < high) {
    const middle = (low + high) >> 1;

    if (runs[middle * 3 + 1] <= position) low = middle + 1;
    else high = middle;
  }

  return low * 3;
};

/** Tells whether raising [low, high) to its peak leaves a canonical vector as it is */
const raisesNothing = (
  runs: readonly number[],
  first: number,
  last: number,
  low: number,
  high: number
): boolean => first === last && runs[first] <= low && runs[first + 1] >= high;

/** Rewrites a vector so every state from low to high holds the peak, keeping the runs on either side */
const raiseSpan = (
  scratch: ScoreScratch,
  slot: number,
  size: number,
  low: number,
  high: number,
  peak: number
): number => {
  const current = scratch.runs[slot];
  const out = scratch.spare;
  let written = 0;

  for (let run = 0; run < size && current[run] < low; run += 3)
    written = emitRun(
      out,
      written,
      current[run],
      Math.min(current[run + 1], low),
      current[run + 2]
    );

  written = emitRun(out, written, low, high, peak);

  for (let run = firstRunAfter(current, size, high); run < size; run += 3)
    written = emitRun(
      out,
      written,
      Math.max(current[run], high),
      current[run + 1],
      current[run + 2]
    );

  scratch.spare = current;
  scratch.runs[slot] = out;
  return written;
};

/** Raises every state of a quiet run to the most any of them holds, forgetting how much of the run is left */
export const quietenSlot = (
  scratch: ScoreScratch,
  slot: number,
  length: number,
  quiet: readonly number[]
): number => {
  let size = length;

  for (let range = 0; range < quiet.length; range += 2) {
    const start = quiet[range];
    const end = quiet[range + 1];
    const current = scratch.runs[slot];
    const first = firstRunAfter(current, size, start);
    let last = first;
    let peak = 0;

    for (let run = first; run < size && current[run] < end; run += 3) {
      peak = Math.max(peak, current[run + 2]);
      last = run;
    }

    if (!(peak > 0) || raisesNothing(current, first, last, start, end))
      continue;

    size = raiseSpan(scratch, slot, size, start, end, peak);
  }

  return size;
};

/** Tells whether some range, the ranges ordered by where they start, meets two runs of a canonical vector */
const meetsTwoRuns = (
  runs: readonly number[],
  size: number,
  ranges: readonly number[]
): boolean => {
  if (size <= 3) return false;

  let run = 0;

  for (let range = 0; range < ranges.length; range += 2) {
    const end = ranges[range + 1];

    while (run < size && runs[run + 1] <= ranges[range]) run += 3;

    if (run + 3 < size && runs[run] < end && runs[run + 3] < end) return true;
  }

  return false;
};

export const orderedRanges = (ranges: readonly number[]): number[] => {
  const pairs: number[][] = [];

  for (let range = 0; range < ranges.length; range += 2)
    pairs.push([ranges[range], ranges[range + 1]]);

  return pairs.toSorted((left, right) => left[0] - right[0]).flat();
};

/** Raises the states of a steady run that still read the input to the most any of them holds, keeping how much of the run is left */
export const levelSlot = (
  scratch: ScoreScratch,
  slot: number,
  length: number,
  level: readonly number[],
  ordered: readonly number[]
): number => {
  if (!meetsTwoRuns(scratch.runs[slot], length, ordered)) return length;

  let size = length;

  for (let range = 0; range < level.length; range += 2) {
    const start = level[range];
    const end = level[range + 1];
    const current = scratch.runs[slot];
    const first = firstRunAfter(current, size, start);
    let last = first;
    let high = start;
    let peak = 0;

    for (let run = first; run < size && current[run] < end; run += 3) {
      high = Math.min(current[run + 1], end);
      peak = Math.max(peak, current[run + 2]);
      last = run;
    }

    if (!(peak > 0)) continue;

    const low = Math.max(current[first], start);

    if (raisesNothing(current, first, last, low, high)) continue;

    size = raiseSpan(scratch, slot, size, low, high, peak);
  }

  return size;
};

export const startValue = (
  layout: ScoreLayout,
  runs: readonly number[]
): number => {
  const { startOrder } = layout;
  let best = 0;
  let run = 0;

  for (const state of startOrder) {
    while (run < runs.length && runs[run + 1] <= state) run += 3;

    if (run < runs.length && runs[run] <= state)
      best = Math.max(best, runs[run + 2]);
  }

  return best;
};

export const totalOf = (runs: readonly number[]): number => {
  let total = 0;

  for (let run = 0; run < runs.length; run += 3)
    total += (runs[run + 1] - runs[run]) * runs[run + 2];

  return total;
};
