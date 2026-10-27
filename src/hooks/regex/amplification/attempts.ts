import type {
  Lookahead,
  ScoreLayout,
  ScoreMoveTable,
  ScoreScratch,
  ScoreWalk,
  WorkMeter,
} from '../../../types/hooks/regex.js';
import {
  addRuns,
  createRunTable,
  findRuns,
  hashRuns,
} from '../automaton/intern.js';
import { KIND_COUNT } from '../automaton/kinds.js';
import { spend } from '../budget.js';
import { chainRanges, GAIN, walkOf } from './groups.js';
import {
  entryOf,
  movesOf,
  stateCountOf,
  targetsEnd,
  targetsStart,
} from './moves.js';
import { createPairs, livesOf, outlives } from './pairs.js';
import { advanceInto, createScratch, pushPath, spreadInto } from './spread.js';
import {
  gainsInto,
  NO_PRIORS,
  representativesInto,
  resetSlots,
  sortEvents,
  sweepEvery,
  sweepPieces,
} from './sweep.js';
import { quietenSlot, startValue, totalOf } from './vectors.js';

const ATTEMPT_FRONTIERS = 20_000;

const HORIZON = 64;

const depthsOf = (
  moves: ScoreMoveTable,
  roots: readonly number[]
): Int32Array | null => {
  const { targets } = moves;
  const size = stateCountOf(moves);
  const depth = new Int32Array(size).fill(-1);
  const open = new Uint8Array(size);
  const stackStates = new Int32Array(size);
  const stackSlots = new Int32Array(size);

  for (const root of roots) {
    if (depth[root] !== -1) continue;

    let height = 1;

    stackStates[0] = root;
    stackSlots[0] = targetsStart(moves, root);
    open[root] = 1;

    while (height > 0) {
      const state = stackStates[height - 1];
      const slot = stackSlots[height - 1];

      if (slot < targetsEnd(moves, state)) {
        const target = targets[slot];

        stackSlots[height - 1] = slot + 1;

        if (open[target]) return null;
        if (depth[target] !== -1) continue;

        open[target] = 1;
        stackStates[height] = target;
        stackSlots[height] = targetsStart(moves, target);
        height += 1;
        continue;
      }

      let deepest = 0;

      for (
        let edge = targetsStart(moves, state);
        edge < targetsEnd(moves, state);
        edge += 1
      )
        deepest = Math.max(deepest, depth[targets[edge]] + 1);

      depth[state] = deepest;
      open[state] = 0;
      height -= 1;
    }
  }

  return depth;
};

const mergeTargets = (
  opening: Map<number, number[]>,
  piece: number,
  targets: Iterable<number>
): void => {
  opening.set(piece, [...new Set([...(opening.get(piece) ?? []), ...targets])]);
};

/** Reads, for each distance between two starts up to the first that reaches the horizon, how many characters the two attempts can read together */
const lifetimesOf = (
  layout: ScoreLayout,
  moves: ScoreMoveTable,
  firstStates: readonly number[],
  length: number,
  meter: WorkMeter
): Int32Array => {
  const { entryOffsets, entryPieces, targetOffsets, targets } = moves;
  const size = stateCountOf(moves);
  const kinds = layout.alphabet.pieceKinds;
  const entryMasks = new Uint8Array(size);
  const entryCounts = new Uint8Array(size);
  const entryKinds = new Uint8Array(size * KIND_COUNT);
  const openings = new Map<number, Map<number, number[]>>();

  for (let entry = 0; entry < entryPieces.length; entry += 1)
    for (
      let item = targetOffsets[entry];
      item < targetOffsets[entry + 1];
      item += 1
    ) {
      const target = targets[item];
      const kind = kinds[entryPieces[entry]];

      if ((entryMasks[target] & (1 << kind)) !== 0) continue;

      entryMasks[target] |= 1 << kind;
      entryKinds[target * KIND_COUNT + entryCounts[target]] = kind;
      entryCounts[target] += 1;
    }

  for (const state of layout.loopStates)
    for (
      let loop = moves.loopOffsets[state];
      loop < moves.loopOffsets[state + 1];
      loop += 1
    ) {
      const kind = kinds[moves.loopPieces[loop]];
      const target = moves.loopTargets[loop];
      const opening = openings.get(kind) ?? new Map<number, number[]>();

      for (
        let entry = entryOffsets[target];
        entry < entryOffsets[target + 1];
        entry += 1
      )
        mergeTargets(
          opening,
          entryPieces[entry],
          targets.subarray(targetOffsets[entry], targetOffsets[entry + 1])
        );

      openings.set(kind, opening);
    }

  const openingOf = (older: number): Map<number, number[]> => {
    const opening = new Map<number, number[]>();

    for (let entry = 0; entry < entryCounts[older]; entry += 1)
      for (const [piece, targets] of openings.get(
        entryKinds[older * KIND_COUNT + entry]
      ) ?? [])
        mergeTargets(opening, piece, targets);

    return opening;
  };

  const pairs = createPairs();
  const longest = new Int32Array(size).fill(-1);
  const lifetimes = new Int32Array(length);
  const stamps = new Int32Array(size);
  let layer: number[] = [...firstStates];
  let next: number[] = [];

  const longestFrom = (older: number): number => {
    if (longest[older] !== -1) return longest[older];

    let best = 0;

    for (const [piece, youngTargets] of openingOf(older)) {
      const old = entryOf(moves, older, piece);

      if (old === -1) continue;

      for (
        let item = targetOffsets[old];
        item < targetOffsets[old + 1];
        item += 1
      )
        for (const youngTarget of youngTargets)
          best = Math.max(
            best,
            outlives(moves, pairs, targets[item], youngTarget, HORIZON, meter)
              ? HORIZON
              : livesOf(pairs, targets[item], youngTarget)
          );
    }

    longest[older] = best;
    return best;
  };

  for (let distance = 1; distance < length && layer.length > 0; distance += 1) {
    for (const older of layer)
      lifetimes[distance] = Math.max(lifetimes[distance], longestFrom(older));

    if (lifetimes[distance] === HORIZON) break;

    spend(meter, layer.length);
    next.length = 0;

    for (const state of layer)
      for (
        let edge = targetsStart(moves, state);
        edge < targetsEnd(moves, state);
        edge += 1
      ) {
        if (stamps[targets[edge]] === distance) continue;

        stamps[targets[edge]] = distance;
        next.push(targets[edge]);
      }

    const current = layer;

    layer = next;
    next = current;
  }

  return lifetimes;
};

/** Counts the most attempts alive at once, given how far apart two attempts must start to read a length together */
const packedAttempts = (lifetimes: Int32Array, length: number): number => {
  const spacing = new Array<number>(HORIZON + 1).fill(Infinity);

  for (let distance = lifetimes.length - 1; distance > 0; distance -= 1)
    for (let shared = 1; shared <= lifetimes[distance]; shared += 1)
      spacing[shared] = distance;

  let attempts = 0;

  for (
    let depth = 1;
    depth <= length;
    depth += spacing[Math.min(depth, HORIZON)]
  )
    attempts += 1;

  return attempts;
};

/** Opens the frontiers of one attempt: its first steps from the search loop, or the start when nothing searches */
const openFrontiers = (
  layout: ScoreLayout,
  walk: ScoreWalk,
  cap: number,
  scratch: ScoreScratch,
  visit: (slot: number, length: number) => void
): void => {
  const { groups } = walk;

  scratch.gainCount = 0;

  if (layout.loopStates.length === 0) {
    scratch.pathCount = 0;

    for (const state of layout.startStates)
      pushPath(scratch, -1, state, state + 1, 1);

    sweepEvery(scratch, sortEvents(scratch), cap);
    visit(0, scratch.runLengths[0]);
    return;
  }

  for (let loop = 0; loop < layout.loopStates.length; loop += 1) {
    scratch.pathCount = 0;

    for (let group = 0; group < groups.count; group += 1)
      if (groups.kinds[group] === GAIN && groups.sources[group] === loop)
        pushPath(
          scratch,
          groups.pieces[group],
          groups.targets[group],
          groups.targets[group] + 1,
          groups.multiplicities[group]
        );

    const events = sortEvents(scratch);
    const choice = representativesInto(walk, scratch, NO_PRIORS, 0, 1, 0);

    sweepPieces(scratch, walk, events, choice, cap);

    for (let index = 0; index < choice.pieces.length; index += 1)
      visit(index, scratch.runLengths[index]);
  }
};

/** Finds the most paths one attempt holds at once, following every input until the frontiers repeat */
const attemptPaths = (
  layout: ScoreLayout,
  walk: ScoreWalk,
  cap: number,
  meter: WorkMeter
): number => {
  const scratch = createScratch();
  const seen = createRunTable();
  let most = 0;

  const visit = (slot: number, length: number): void => {
    if (length === 0) return;

    const runs = scratch.runs[slot];
    const hash = hashRuns(0, runs, length);

    if (findRuns(seen, 0, runs, length, hash) !== -1) return;

    most = Math.max(
      most,
      totalOf(seen.runs[addRuns(seen, 0, runs, length, hash)])
    );
  };

  openFrontiers(layout, walk, cap, scratch, visit);

  for (let head = 0; head < seen.count && most < cap; head += 1) {
    if (seen.count > ATTEMPT_FRONTIERS) return Infinity;

    advanceInto(walk, seen.runs[head], scratch);
    spend(meter, 1 + scratch.incidences);

    const events = sortEvents(scratch);
    const choice = representativesInto(walk, scratch, NO_PRIORS, 0, 1, 0);

    sweepPieces(scratch, walk, events, choice, cap);

    for (let index = 0; index < choice.pieces.length; index += 1)
      visit(index, scratch.runLengths[index]);
  }

  return Math.min(most, cap);
};

/** Bounds the paths one attempt holds at once by forgetting how much of every run is left */
const loosePaths = (
  layout: ScoreLayout,
  lookahead: Lookahead,
  cap: number,
  meter: WorkMeter
): number => {
  const walk = walkOf(layout, lookahead, 0);
  const quiet = chainRanges(walk, () => true);
  const scratch = createScratch();
  const seen = createRunTable();
  const gains = new Int32Array(walk.loopCount);
  let most = 0;

  const visit = (slot: number, length: number): void => {
    const runs = scratch.runs[slot];
    const hash = hashRuns(0, runs, length);

    if (findRuns(seen, 0, runs, length, hash) !== -1) return;

    most = Math.max(
      most,
      startValue(layout, seen.runs[addRuns(seen, 0, runs, length, hash)])
    );
  };

  resetSlots(scratch, 1);
  scratch.runs[0][0] = 0;
  scratch.runs[0][1] = layout.stateCount;
  scratch.runs[0][2] = 1;
  visit(0, quietenSlot(scratch, 0, 3, quiet));

  for (let head = 0; head < seen.count && most < cap; head += 1) {
    if (seen.count > ATTEMPT_FRONTIERS) return Infinity;

    spreadInto(walk, seen.runs[head], scratch);
    spend(meter, 1 + scratch.incidences);

    const events = sortEvents(scratch);
    const choice = representativesInto(walk, scratch, NO_PRIORS, 0, 1, 0);

    sweepPieces(scratch, walk, events, choice, cap);

    for (let index = 0; index < choice.pieces.length; index += 1) {
      gainsInto(scratch, walk, choice.pieces[index], cap, gains, 0);

      for (let loop = 0; loop < walk.loopCount; loop += 1)
        most = Math.max(most, gains[loop]);

      visit(
        index,
        quietenSlot(scratch, index, scratch.runLengths[index], quiet)
      );
    }
  }

  return Math.min(most, cap);
};

const firstStatesOf = (
  layout: ScoreLayout,
  moves: ScoreMoveTable
): number[] => {
  if (layout.loopStates.length === 0)
    return [...new Set(layout.ordered.starts)];

  const firstStates = new Set<number>();

  for (const state of layout.loopStates)
    for (
      let item = targetsStart(moves, state);
      item < targetsEnd(moves, state);
      item += 1
    )
      firstStates.add(moves.targets[item]);

  return [...firstStates];
};

/** Bounds the score by the attempts that fit at once times the paths one attempt holds */
export const attemptBound = (
  layout: ScoreLayout,
  lookahead: Lookahead,
  cap: number,
  meter: WorkMeter
): number => {
  const moves = movesOf(layout, lookahead, 0);
  const searching = layout.loopStates.length > 0;
  const firstStates = firstStatesOf(layout, moves);
  const depths = depthsOf(moves, firstStates);

  if (depths === null) return Infinity;

  const strict = attemptPaths(layout, walkOf(layout, lookahead, 0), cap, meter);
  const paths =
    strict === Infinity ? loosePaths(layout, lookahead, cap, meter) : strict;

  if (!searching) return paths;

  let deepest = 0;

  for (const state of firstStates) deepest = Math.max(deepest, depths[state]);

  return (
    1 +
    packedAttempts(
      lifetimesOf(layout, moves, firstStates, 1 + deepest, meter),
      1 + deepest
    ) *
      paths
  );
};
