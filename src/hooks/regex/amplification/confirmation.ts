import type { ScoreLayout, WorkMeter } from '../../../types/hooks/regex.js';
import { lookaheadAlong, runsInOrder } from '../automaton/lookahead.js';
import { spend } from '../budget.js';
import { readerFor } from './layout.js';

/** Counts the paths that read one concrete input to its end in backtracking order */
const countAlong = (
  layout: ScoreLayout,
  input: readonly number[],
  length: number,
  cap: number,
  meter: WorkMeter
): number => {
  const { ordered } = layout;
  const lookahead = lookaheadAlong(ordered, readerFor(layout), input, meter);
  const blocked: number[] = [];
  let frontier = new Map(ordered.starts.map((state) => [state, 1]));

  for (let index = 0; index < length; index += 1) {
    const next = new Map<number, number>();

    spend(meter, frontier.size + 1);

    for (const [state, count] of frontier) {
      blocked.length = 0;

      for (const event of ordered.states[state].events.get(input[index]) ?? [])
        if (runsInOrder(event, lookahead, index, index + 1, blocked))
          next.set(
            event.target,
            Math.min((next.get(event.target) ?? 0) + count, cap)
          );
    }

    frontier = next;
  }

  let total = 0;

  for (const count of frontier.values()) total += count;

  return Math.min(total, cap);
};

/** Confirms a witness on the real engine order, trying an end of input and one character of each kind after it */
export const confirms = (
  layout: ScoreLayout,
  witness: readonly number[],
  ceiling: number,
  meter: WorkMeter
): boolean => {
  const kinds = layout.alphabet.pieceKinds;
  const followers = [
    [],
    ...[...new Set(kinds)].map((kind) => [kinds.indexOf(kind)]),
  ];

  return followers.some(
    (follower) =>
      countAlong(
        layout,
        [...witness, ...follower],
        witness.length,
        ceiling + 1,
        meter
      ) > ceiling
  );
};
