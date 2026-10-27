import type { CodeSet } from '../../../types/hooks/regex.js';

export const EMPTY_SET: CodeSet = [];

export const LEGACY_LIMIT = 0x10000;

export const UNICODE_LIMIT = 0x110000;

const toggle = (boundaries: number[], point: number): void => {
  if (boundaries.at(-1) === point) boundaries.pop();
  else boundaries.push(point);
};

const combine = (
  left: CodeSet,
  right: CodeSet,
  keep: (inLeft: boolean, inRight: boolean) => boolean
): CodeSet => {
  const boundaries: number[] = [];
  let leftIndex = 0;
  let rightIndex = 0;
  let inLeft = false;
  let inRight = false;

  while (leftIndex < left.length || rightIndex < right.length) {
    const point = Math.min(
      left[leftIndex] ?? Infinity,
      right[rightIndex] ?? Infinity
    );

    if (left[leftIndex] === point) {
      inLeft = !inLeft;
      leftIndex += 1;
    }

    if (right[rightIndex] === point) {
      inRight = !inRight;
      rightIndex += 1;
    }

    if (keep(inLeft, inRight) !== (boundaries.length % 2 === 1))
      toggle(boundaries, point);
  }

  return boundaries;
};

export const rangeSet = (start: number, end: number): CodeSet =>
  start < end ? [start, end] : EMPTY_SET;

export const pointSet = (point: number): CodeSet => [point, point + 1];

export const union = (left: CodeSet, right: CodeSet): CodeSet =>
  combine(left, right, (inLeft, inRight) => inLeft || inRight);

export const intersect = (left: CodeSet, right: CodeSet): CodeSet =>
  combine(left, right, (inLeft, inRight) => inLeft && inRight);

export const subtract = (left: CodeSet, right: CodeSet): CodeSet =>
  combine(left, right, (inLeft, inRight) => inLeft && !inRight);

export const complement = (set: CodeSet, limit: number): CodeSet =>
  subtract(rangeSet(0, limit), set);

export const fromPoints = (points: readonly number[]): CodeSet => {
  const sorted = [...new Set(points)].toSorted((left, right) => left - right);
  const boundaries: number[] = [];

  for (const point of sorted) {
    toggle(boundaries, point);
    boundaries.push(point + 1);
  }

  return boundaries;
};

export const fromRanges = (ranges: readonly (readonly number[])[]): CodeSet =>
  ranges.map(([start, end]) => rangeSet(start, end)).reduce(union, EMPTY_SET);

export const isEmptySet = (set: CodeSet): boolean => set.length === 0;

export const overlaps = (left: CodeSet, right: CodeSet): boolean =>
  !isEmptySet(intersect(left, right));

export const setKey = (set: CodeSet): string => set.join(',');

export const expandPoints = (set: CodeSet): number[] => {
  const points: number[] = [];

  for (let index = 0; index < set.length; index += 2)
    for (let point = set[index]; point < set[index + 1]; point += 1)
      points.push(point);

  return points;
};

/** Finds the first position of a sorted list whose value is not below the given one */
export const lowerBound = (
  sorted: ArrayLike<number>,
  value: number
): number => {
  let low = 0;
  let high = sorted.length;

  while (low < high) {
    const middle = (low + high) >> 1;

    if (sorted[middle] < value) low = middle + 1;
    else high = middle;
  }

  return low;
};

export const pointsWithin = (
  set: CodeSet,
  sortedPoints: readonly number[]
): number[] => {
  const found: number[] = [];

  for (let index = 0; index < set.length; index += 2)
    for (
      let position = lowerBound(sortedPoints, set[index]);
      position < sortedPoints.length && sortedPoints[position] < set[index + 1];
      position += 1
    )
      found.push(sortedPoints[position]);

  return found;
};
