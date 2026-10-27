import type {
  AutomatonJob,
  Lookahead,
  OrderedState,
  ReverseReader,
  ScoreLayout,
} from '../../../types/hooks/regex.js';
import { compile } from '../automaton/compile.js';
import { readerOf, sureLookahead } from '../automaton/lookahead.js';
import {
  buildOrdered,
  consultedStates,
  sureStates,
} from '../automaton/ordered.js';

export const NO_LOOP = -1;

const isLoopState = (state: OrderedState): boolean => {
  for (const events of state.events.values())
    for (const event of events)
      if (event.type === 'move' && event.prefix) return true;

  return false;
};

const rawTargets = (state: OrderedState): number[] => {
  const pieces = [...state.events.keys()].sort((left, right) => left - right);
  const targets: number[] = [];

  for (const piece of pieces)
    for (const event of state.events.get(piece) ?? [])
      if (event.type === 'move' && !event.prefix) targets.push(event.target);

  return targets;
};

/** Numbers the states depth first along their preferred steps, giving the states of one bounded run consecutive numbers */
const renumber = (
  targets: readonly (readonly number[])[],
  loop: Uint8Array,
  roots: readonly number[]
): Int32Array => {
  const order = new Int32Array(targets.length).fill(-1);
  const stackStates = new Int32Array(targets.length);
  const stackIndices = new Int32Array(targets.length);
  let next = 0;

  const claim = (state: number): boolean => {
    if (loop[state] || order[state] !== -1) return false;

    order[state] = next;
    next += 1;
    return true;
  };

  const visit = (root: number): void => {
    if (!claim(root)) return;

    let depth = 1;

    stackStates[0] = root;
    stackIndices[0] = 0;

    while (depth > 0) {
      const list = targets[stackStates[depth - 1]];
      const index = stackIndices[depth - 1];

      if (index === list.length) {
        depth -= 1;
        continue;
      }

      stackIndices[depth - 1] = index + 1;

      if (!claim(list[index])) continue;

      stackStates[depth] = list[index];
      stackIndices[depth] = 0;
      depth += 1;
    }
  };

  for (const root of roots) visit(root);
  for (let state = 0; state < targets.length; state += 1) visit(state);

  return order;
};

/** Lays out the search automaton, numbering the states one attempt passes through apart from the search loop */
export const layoutOf = (job: AutomatonJob): ScoreLayout => {
  const { epsilon, alphabet, past } = compile(job, true);
  const ordered = buildOrdered(epsilon, alphabet, past, job.meter);
  const total = ordered.states.length;
  const targets = ordered.states.map(rawTargets);
  const loop = new Uint8Array(total);
  const loopIndex = new Int32Array(total).fill(NO_LOOP);
  const loopStates: number[] = [];
  const roots: number[] = [];
  const startLoops: number[] = [];
  const startStates: number[] = [];

  for (let state = 0; state < total; state += 1) {
    if (!isLoopState(ordered.states[state])) continue;

    loop[state] = 1;
    loopIndex[state] = loopStates.length;
    loopStates.push(state);
  }

  for (const state of loopStates)
    for (const target of targets[state]) roots.push(target);

  for (const state of ordered.starts) roots.push(state);

  const order = renumber(targets, loop, roots);

  for (const state of ordered.starts)
    if (loop[state]) startLoops.push(loopIndex[state]);
    else startStates.push(order[state]);

  return {
    ordered,
    alphabet,
    order,
    loopIndex,
    loopStates,
    stateCount: total - loopStates.length,
    startLoops,
    startStates,
    startOrder: Int32Array.from(startStates).sort(),
    moves: new WeakMap(),
    walks: new WeakMap(),
    consulted: undefined,
    reader: undefined,
  };
};

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

export const consultedFor = (layout: ScoreLayout): ReadonlySet<number> =>
  (layout.consulted ??= consultedStates(layout.ordered, () => true));

export const readerFor = (layout: ScoreLayout): ReverseReader =>
  (layout.reader ??= readerOf(
    layout.ordered,
    layout.alphabet,
    consultedFor(layout)
  ));

export const sureOf = (layout: ScoreLayout): Lookahead =>
  sureLookahead(
    layout.alphabet.pieceKinds.length,
    sureStates(layout.ordered, layout.alphabet)
  );
