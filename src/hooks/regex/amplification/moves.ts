import type {
  Lookahead,
  OrderedState,
  ScoreLayout,
  ScoreMoveTable,
} from '../../../types/hooks/regex.js';
import { runsInOrder } from '../automaton/lookahead.js';
import { NO_LOOP } from './layout.js';

export const remembered = <Value>(
  cache: WeakMap<Lookahead, Map<number, Value>>,
  lookahead: Lookahead,
  klass: number,
  build: () => Value
): Value => {
  let byClass = cache.get(lookahead);

  if (byClass === undefined) {
    byClass = new Map();
    cache.set(lookahead, byClass);
  }

  const known = byClass.get(klass);

  if (known !== undefined) return known;

  const value = build();

  byClass.set(klass, value);
  return value;
};

/** Lists where the surviving steps of every state lead for one class of the input that follows, the search loop's own step apart */
const tableOf = (
  states: readonly OrderedState[],
  lookahead: Lookahead,
  klass: number
): ScoreMoveTable => {
  const entryOffsets = new Int32Array(states.length + 1);
  const loopOffsets = new Int32Array(states.length + 1);
  const entryPieces: number[] = [];
  const targetOffsets: number[] = [0];
  const targets: number[] = [];
  const loopPieces: number[] = [];
  const loopTargets: number[] = [];
  const blocked: number[] = [];

  states.forEach((state, index) => {
    for (const [piece, events] of state.events) {
      const current = lookahead.back[klass * lookahead.pieces + piece];
      const first = targets.length;
      let loop = NO_LOOP;

      blocked.length = 0;

      for (const event of events) {
        if (!runsInOrder(event, lookahead, current, klass, blocked)) continue;
        if (!event.prefix) targets.push(event.target);
        else if (loop === NO_LOOP) loop = event.target;
      }

      if (targets.length > first) {
        entryPieces.push(piece);
        targetOffsets.push(targets.length);
      }

      if (loop !== NO_LOOP) {
        loopPieces.push(piece);
        loopTargets.push(loop);
      }
    }

    entryOffsets[index + 1] = entryPieces.length;
    loopOffsets[index + 1] = loopPieces.length;
  });

  return {
    entryOffsets,
    entryPieces: Int32Array.from(entryPieces),
    targetOffsets: Int32Array.from(targetOffsets),
    targets: Int32Array.from(targets),
    loopOffsets,
    loopPieces: Int32Array.from(loopPieces),
    loopTargets: Int32Array.from(loopTargets),
  };
};

export const movesOf = (
  layout: ScoreLayout,
  lookahead: Lookahead,
  klass: number
): ScoreMoveTable =>
  remembered(layout.moves, lookahead, klass, () =>
    tableOf(layout.ordered.states, lookahead, klass)
  );

export const stateCountOf = (moves: ScoreMoveTable): number =>
  moves.entryOffsets.length - 1;

export const targetsStart = (moves: ScoreMoveTable, state: number): number =>
  moves.targetOffsets[moves.entryOffsets[state]];

export const targetsEnd = (moves: ScoreMoveTable, state: number): number =>
  moves.targetOffsets[moves.entryOffsets[state + 1]];

export const entryOf = (
  moves: ScoreMoveTable,
  state: number,
  piece: number
): number => {
  for (
    let entry = moves.entryOffsets[state];
    entry < moves.entryOffsets[state + 1];
    entry += 1
  )
    if (moves.entryPieces[entry] === piece) return entry;

  return -1;
};
