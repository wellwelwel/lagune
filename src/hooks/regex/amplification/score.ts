import type {
  Lookahead,
  ScoreLayout,
  ScoreNodes,
  ScoreState,
  ScoreSteps,
  ScoreWalk,
  WalkOptions,
  WalkOutcome,
  WorkMeter,
} from '../../../types/hooks/regex.js';
import { grownInt32, grownUint8 } from '../automaton/buffers.js';
import {
  addRuns,
  createRunTable,
  findRuns,
  hashRuns,
} from '../automaton/intern.js';
import { spend } from '../budget.js';
import { walkOf } from './groups.js';
import { NO_LOOP } from './layout.js';
import { createScratch, spreadInto } from './spread.js';
import {
  gainsInto,
  representativesInto,
  sortEvents,
  sweepPieces,
} from './sweep.js';
import {
  levelSlot,
  orderedRanges,
  quietenSlot,
  startValue,
} from './vectors.js';

const createNodes = (loops: number): ScoreNodes => ({
  table: createRunTable(),
  parents: new Int32Array(64),
  pieces: new Int32Array(64),
  stepStarts: new Int32Array(64),
  stepEnds: new Int32Array(64),
  expanded: new Uint8Array(64),
  values: new Int32Array(64 * loops),
  via: new Int32Array(64 * loops * 3).fill(-1),
});

const reserveNode = (nodes: ScoreNodes, loops: number): void => {
  const size = nodes.table.count + 1;

  if (size <= nodes.parents.length) return;

  nodes.parents = grownInt32(nodes.parents, size);
  nodes.pieces = grownInt32(nodes.pieces, size);
  nodes.stepStarts = grownInt32(nodes.stepStarts, size);
  nodes.stepEnds = grownInt32(nodes.stepEnds, size);
  nodes.expanded = grownUint8(nodes.expanded, size);
  nodes.values = grownInt32(nodes.values, nodes.parents.length * loops);
  nodes.via = grownInt32(nodes.via, nodes.parents.length * loops * 3, -1);
};

const createSteps = (loops: number): ScoreSteps => ({
  count: 0,
  targets: new Int32Array(256),
  pieces: new Int32Array(256),
  gains: new Int32Array(256 * loops),
});

const reserveStep = (steps: ScoreSteps, loops: number): number => {
  const step = steps.count;

  if (step < steps.targets.length) return step;

  steps.targets = grownInt32(steps.targets, step + 1);
  steps.pieces = grownInt32(steps.pieces, step + 1);
  steps.gains = grownInt32(steps.gains, steps.targets.length * loops);
  return step;
};

const scoreAt = (state: ScoreState, node: number): number => {
  const { layout, nodes, loops } = state;
  let score = 0;

  for (const loop of layout.startLoops)
    score = Math.max(score, nodes.values[node * loops + loop]);

  return Math.max(score, startValue(layout, nodes.table.runs[node]));
};

const recordBest = (state: ScoreState, node: number): void => {
  const score = scoreAt(state, node);

  if (score <= state.best) return;

  state.best = score;
  state.bestNode = node;
};

const internNode = (
  state: ScoreState,
  klass: number,
  runs: readonly number[],
  length: number,
  parent: number,
  piece: number
): number => {
  const { nodes } = state;
  const hash = hashRuns(klass, runs, length);
  const known = findRuns(nodes.table, klass, runs, length, hash);

  if (known !== -1) return known;

  reserveNode(nodes, state.loops);

  const node = addRuns(nodes.table, klass, runs, length, hash);

  nodes.parents[node] = parent;
  nodes.pieces[node] = piece;
  spend(state.meter, 1 + length);
  recordBest(state, node);
  return node;
};

const walkFor = (state: ScoreState, klass: number): ScoreWalk => {
  const known = state.walks[klass];

  if (known !== undefined) return known;

  const walk = walkOf(state.layout, state.lookahead, klass);

  spend(state.meter, state.layout.ordered.states.length);
  state.walks[klass] = walk;
  return walk;
};

const relax = (
  state: ScoreState,
  from: number,
  step: number,
  walk: ScoreWalk
): boolean => {
  const { nodes, steps, loops, cap } = state;
  const { values, via } = nodes;
  const target = steps.targets[step];
  const piece = steps.pieces[step];
  let changed = false;

  for (let loop = 0; loop < loops; loop += 1) {
    const next = walk.loopNext[piece * loops + loop];
    const carried = next === NO_LOOP ? 0 : values[from * loops + next];
    const value = Math.min(steps.gains[step * loops + loop] + carried, cap);
    const slot = target * loops + loop;

    if (value <= values[slot]) continue;

    values[slot] = value;
    via[slot * 3] = from;
    via[slot * 3 + 1] = next;
    via[slot * 3 + 2] = piece;
    changed = true;
  }

  return changed;
};

const propagate = (state: ScoreState, from: number, walk: ScoreWalk): void => {
  const { nodes, steps } = state;
  const last = nodes.stepEnds[from];

  for (let step = nodes.stepStarts[from]; step < last; step += 1) {
    spend(state.meter, 1);

    if (!relax(state, from, step, walk)) continue;

    const target = steps.targets[step];

    recordBest(state, target);

    if (nodes.expanded[target] === 1) state.dirty.push(target);
  }
};

const expand = (state: ScoreState, node: number): void => {
  const { lookahead, scratch, cap, loops, steps } = state;
  const klass = state.nodes.table.klasses[node];
  const walk = walkFor(state, klass);
  const priors = klass * lookahead.pieces;

  spreadInto(walk, state.nodes.table.runs[node], scratch);
  spend(state.meter, 1 + scratch.incidences);

  const events = sortEvents(scratch);
  const choice = representativesInto(
    walk,
    scratch,
    lookahead.back,
    priors,
    lookahead.classCount,
    klass
  );

  sweepPieces(scratch, walk, events, choice, cap);
  state.nodes.stepStarts[node] = steps.count;

  for (let index = 0; index < choice.pieces.length; index += 1) {
    const piece = choice.pieces[index];
    const step = reserveStep(steps, loops);

    gainsInto(scratch, walk, piece, cap, steps.gains, step * loops);

    const length = levelSlot(
      scratch,
      index,
      quietenSlot(scratch, index, scratch.runLengths[index], state.quiet),
      state.level,
      state.levelOrder
    );
    const target = internNode(
      state,
      lookahead.back[priors + piece],
      scratch.runs[index],
      length,
      node,
      piece
    );

    steps.targets[step] = target;
    steps.pieces[step] = piece;
    steps.count = step + 1;
  }

  state.nodes.stepEnds[node] = steps.count;
  state.nodes.expanded[node] = 1;
  propagate(state, node, walk);
};

/** Reads back the input whose attempts reach a node's count, from its first character to its last */
const witnessOf = (state: ScoreState, node: number): number[] => {
  const { nodes, loops, layout } = state;
  const pieces: number[] = [];
  const score = scoreAt(state, node);
  let loop = NO_LOOP;
  let current = node;

  for (const startLoop of layout.startLoops)
    if (nodes.values[node * loops + startLoop] === score) {
      loop = startLoop;
      break;
    }

  while (pieces.length <= nodes.table.count) {
    const slot = (current * loops + loop) * 3;
    const previous =
      loop === NO_LOOP ? nodes.parents[current] : nodes.via[slot];

    if (previous === -1) break;

    pieces.push(loop === NO_LOOP ? nodes.pieces[current] : nodes.via[slot + 2]);

    if (loop !== NO_LOOP) loop = nodes.via[slot + 1];

    current = previous;
  }

  return pieces;
};

/** Scores the most paths the attempts of a search pile up on one input, walking every input backward from its end */
export const walkScore = (
  layout: ScoreLayout,
  lookahead: Lookahead,
  cap: number,
  meter: WorkMeter,
  { limit, quiet, level }: WalkOptions
): WalkOutcome => {
  const loops = layout.loopStates.length;
  const state: ScoreState = {
    layout,
    lookahead,
    cap,
    meter,
    quiet,
    level,
    levelOrder: orderedRanges(level),
    loops,
    walks: Array.from({ length: lookahead.classCount }, () => undefined),
    nodes: createNodes(loops),
    steps: createSteps(loops),
    scratch: createScratch(),
    dirty: [],
    best: 0,
    bestNode: 0,
  };
  const full = layout.stateCount > 0 ? [0, layout.stateCount, 1] : [];

  for (let klass = 0; klass < lookahead.classCount; klass += 1) {
    const start = internNode(state, klass, full, full.length, -1, -1);

    state.nodes.values.fill(1, start * loops, (start + 1) * loops);
    recordBest(state, start);
  }

  for (
    let head = 0;
    head < state.nodes.table.count && state.best < cap;
    head += 1
  ) {
    if (state.nodes.table.count > limit)
      return {
        score: state.best,
        complete: false,
        witness: witnessOf(state, state.bestNode),
      };

    expand(state, head);

    for (
      let next = state.dirty.pop();
      next !== undefined && state.best < cap;
      next = state.dirty.pop()
    )
      propagate(state, next, walkFor(state, state.nodes.table.klasses[next]));
  }

  return {
    score: Math.min(state.best, cap),
    complete: state.best < cap,
    witness: witnessOf(state, state.bestNode),
  };
};
