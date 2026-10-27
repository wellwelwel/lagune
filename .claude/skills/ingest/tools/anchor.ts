import type { Anchor, Range } from './types.ts';

const RANGE = /^(\d{1,7})(?:[:-](\d{1,7}))?$/;
const ANCHOR = /^([^\s:]{1,512}):([\d:-]{1,15})$/;

export const parseRange = (text: string): Range | null => {
  const match = RANGE.exec(text);

  if (match === null) return null;

  const start = Number(match[1]);
  const end = match[2] === undefined ? null : Number(match[2]);

  return start < 1 || (end !== null && end < start) ? null : { start, end };
};

export const parseAnchor = (text: string): Anchor | null => {
  const match = ANCHOR.exec(text);

  if (match === null) return null;

  const range = parseRange(match[2]);

  return range === null ? null : { path: match[1], range };
};
