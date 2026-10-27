import type {
  ScoreChoice,
  ScoreScratch,
  ScoreWalk,
} from '../../../types/hooks/regex.js';
import { grownFloat64, grownInt32 } from '../automaton/buffers.js';
import { addRuns, findRuns, hashRuns } from '../automaton/intern.js';
import { emitRun } from './vectors.js';

const BOUNDARY_SLOTS = 2 ** 24;

const GENERATION_LIMIT = 2 ** 31 - 1;

const INSERTION_LIMIT = 24;

const DENSE_FACTOR = 8;

const MASK_WIDTH = 32;

const NO_PRIORS = new Int32Array(0);

const placeEvent = (
  scratch: ScoreScratch,
  event: number,
  position: number,
  path: number,
  delta: number
): void => {
  scratch.eventPositions[event] = position;
  scratch.eventPieces[event] = scratch.pathPieces[path];
  scratch.eventDeltas[event] = delta;
};

/** Orders the boundaries by position, keeping the paths in their order within a position */
const countingSortEvents = (
  scratch: ScoreScratch,
  low: number,
  high: number
): void => {
  const { pathStarts, pathEnds, pathValues } = scratch;

  scratch.positionSlots = grownInt32(scratch.positionSlots, high - low + 2);

  const slots = scratch.positionSlots;

  slots.fill(0, 0, high - low + 2);

  for (let path = 0; path < scratch.pathCount; path += 1) {
    slots[pathStarts[path] - low + 1] += 1;
    slots[pathEnds[path] - low + 1] += 1;
  }

  for (let position = 1; position <= high - low + 1; position += 1)
    slots[position] += slots[position - 1];

  for (let path = 0; path < scratch.pathCount; path += 1) {
    placeEvent(
      scratch,
      slots[pathStarts[path] - low],
      pathStarts[path],
      path,
      pathValues[path]
    );
    slots[pathStarts[path] - low] += 1;
    placeEvent(
      scratch,
      slots[pathEnds[path] - low],
      pathEnds[path],
      path,
      -pathValues[path]
    );
    slots[pathEnds[path] - low] += 1;
  }
};

const insertionSort = (keys: Float64Array, count: number): void => {
  for (let index = 1; index < count; index += 1) {
    const key = keys[index];
    let cursor = index - 1;

    while (cursor >= 0 && keys[cursor] > key) {
      keys[cursor + 1] = keys[cursor];
      cursor -= 1;
    }

    keys[cursor + 1] = key;
  }
};

/** Orders the boundaries of every spread path by position, then by path, the order a sweep sums them in */
export const sortEvents = (scratch: ScoreScratch): number => {
  const count = scratch.pathCount * 2;

  if (count > scratch.eventKeys.length) {
    scratch.eventKeys = grownFloat64(scratch.eventKeys, count);
    scratch.eventPieces = grownInt32(scratch.eventPieces, count);
    scratch.eventPositions = grownInt32(scratch.eventPositions, count);
    scratch.eventDeltas = grownFloat64(scratch.eventDeltas, count);
  }

  if (count === 0) return 0;

  const { eventKeys, pathStarts, pathEnds, pathValues } = scratch;
  let low = pathStarts[0];
  let high = pathEnds[0];

  for (let path = 1; path < scratch.pathCount; path += 1) {
    low = Math.min(low, pathStarts[path]);
    high = Math.max(high, pathEnds[path]);
  }

  if (count > INSERTION_LIMIT && high - low <= count * DENSE_FACTOR) {
    countingSortEvents(scratch, low, high);
    return count;
  }

  for (let path = 0; path < scratch.pathCount; path += 1) {
    eventKeys[path * 2] = pathStarts[path] * BOUNDARY_SLOTS + path * 2;
    eventKeys[path * 2 + 1] = pathEnds[path] * BOUNDARY_SLOTS + path * 2 + 1;
  }

  if (count <= INSERTION_LIMIT) insertionSort(eventKeys, count);
  else eventKeys.subarray(0, count).sort();

  for (let event = 0; event < count; event += 1) {
    const position = Math.floor(eventKeys[event] / BOUNDARY_SLOTS);
    const slot = eventKeys[event] - position * BOUNDARY_SLOTS;
    const path = slot >> 1;

    placeEvent(
      scratch,
      event,
      position,
      path,
      (slot & 1) === 0 ? pathValues[path] : -pathValues[path]
    );
  }

  return count;
};

const reserveGenerations = (scratch: ScoreScratch, needed: number): void => {
  if (scratch.generation + needed < GENERATION_LIMIT) return;

  scratch.splitStamps.fill(0);
  scratch.touchedStamps.fill(0);
  scratch.classStamps.fill(0);
  scratch.generation = 0;
};

const nextGeneration = (scratch: ScoreScratch): number => {
  scratch.generation += 1;
  return scratch.generation;
};

/** Labels each piece by the loop moves it shares, and by the class it leaves behind when the lookahead tells classes apart */
const baseLabels = (
  walk: ScoreWalk,
  scratch: ScoreScratch,
  priors: ArrayLike<number>,
  offset: number,
  classCount: number
): number => {
  const { pieceCount, loopClasses, loopClassCount } = walk;
  const { labels } = scratch;

  if (classCount === 1) {
    for (let piece = 0; piece < pieceCount; piece += 1)
      labels[piece] = loopClasses[piece];

    return loopClassCount;
  }

  const span = loopClassCount * classCount;

  scratch.classStamps = grownInt32(scratch.classStamps, span);
  scratch.classLabels = grownInt32(scratch.classLabels, span);

  const generation = nextGeneration(scratch);
  let count = 0;

  for (let piece = 0; piece < pieceCount; piece += 1) {
    const key = loopClasses[piece] * classCount + priors[offset + piece];

    if (scratch.classStamps[key] !== generation) {
      scratch.classStamps[key] = generation;
      scratch.classLabels[key] = count;
      count += 1;
    }

    labels[piece] = scratch.classLabels[key];
  }

  return count;
};

const splitBy = (
  walk: ScoreWalk,
  scratch: ScoreScratch,
  pieces: number,
  next: number
): number => {
  const start = walk.pieceOffsets[pieces];
  const end = walk.pieceOffsets[pieces + 1];

  scratch.splitStamps = grownInt32(scratch.splitStamps, next + end - start);
  scratch.splitTargets = grownInt32(scratch.splitTargets, next + end - start);

  const generation = nextGeneration(scratch);
  const { labels, splitStamps, splitTargets } = scratch;
  let fresh = next;

  for (let item = start; item < end; item += 1) {
    const piece = walk.pieceItems[item];
    const old = labels[piece];

    if (splitStamps[old] !== generation) {
      splitStamps[old] = generation;
      splitTargets[old] = fresh;
      fresh += 1;
    }

    labels[piece] = splitTargets[old];
  }

  return fresh;
};

/** Lists, sorted, the piece sets the spread paths and gains read */
const touchedInto = (walk: ScoreWalk, scratch: ScoreScratch): void => {
  scratch.touchedStamps = grownInt32(
    scratch.touchedStamps,
    walk.pieceOffsets.length - 1
  );

  const { touched, touchedStamps } = scratch;
  const stamp = nextGeneration(scratch);
  let count = 0;

  for (let path = 0; path < scratch.pathCount; path += 1) {
    if (touchedStamps[scratch.pathPieces[path]] === stamp) continue;

    touchedStamps[scratch.pathPieces[path]] = stamp;
    touched[count] = scratch.pathPieces[path];
    count += 1;
  }

  for (let gain = 0; gain < scratch.gainCount; gain += 1) {
    if (touchedStamps[scratch.gainPieces[gain]] === stamp) continue;

    touchedStamps[scratch.gainPieces[gain]] = stamp;
    touched[count] = scratch.gainPieces[gain];
    count += 1;
  }

  for (let index = 1; index < count; index += 1) {
    const pieces = touched[index];
    let cursor = index - 1;

    while (cursor >= 0 && touched[cursor] > pieces) {
      touched[cursor + 1] = touched[cursor];
      cursor -= 1;
    }

    touched[cursor + 1] = pieces;
  }

  scratch.touchedCount = count;
};

/** Tells, for each piece set the spread reads, which representatives read it, one bit per representative */
const masksOf = (
  walk: ScoreWalk,
  scratch: ScoreScratch,
  pieces: Int32Array
): Int32Array => {
  const { pieceSets, pieceCount } = walk;
  const { touched, touchedCount } = scratch;
  const masks = new Int32Array(
    Math.ceil(pieces.length / MASK_WIDTH) * touchedCount
  );

  for (let chunk = 0; chunk * MASK_WIDTH < pieces.length; chunk += 1)
    for (let index = 0; index < touchedCount; index += 1) {
      const row = touched[index] * pieceCount;
      const width = Math.min(MASK_WIDTH, pieces.length - chunk * MASK_WIDTH);
      let mask = 0;

      for (let bit = 0; bit < width; bit += 1)
        if (pieceSets[row + pieces[chunk * MASK_WIDTH + bit]] === 1)
          mask |= 1 << bit;

      masks[chunk * touchedCount + index] = mask;
    }

  return masks;
};

/** Picks the first piece of each group of input pieces that act alike on what a vector holds */
export const representativesInto = (
  walk: ScoreWalk,
  scratch: ScoreScratch,
  priors: ArrayLike<number>,
  offset: number,
  classCount: number,
  klass: number
): ScoreChoice => {
  const { pieceCount } = walk;

  reserveGenerations(scratch, scratch.pathCount + scratch.gainCount + 4);
  touchedInto(walk, scratch);

  const { touched, touchedCount, choiceTable } = scratch;
  const hash = hashRuns(klass, touched, touchedCount);
  const known = findRuns(choiceTable, klass, touched, touchedCount, hash);

  if (known !== -1) return scratch.choices[known];

  scratch.labels = grownInt32(scratch.labels, pieceCount);
  scratch.representatives = grownInt32(scratch.representatives, pieceCount);

  let next = baseLabels(walk, scratch, priors, offset, classCount);

  for (let index = 0; index < touchedCount; index += 1)
    next = splitBy(walk, scratch, touched[index], next);

  scratch.splitStamps = grownInt32(scratch.splitStamps, next);

  const generation = nextGeneration(scratch);
  const { labels, splitStamps, representatives } = scratch;
  let count = 0;

  for (let piece = 0; piece < pieceCount; piece += 1) {
    if (splitStamps[labels[piece]] === generation) continue;

    splitStamps[labels[piece]] = generation;
    representatives[count] = piece;
    count += 1;
  }

  const pieces = representatives.slice(0, count);
  const choice: ScoreChoice = {
    pieces,
    masks: masksOf(walk, scratch, pieces),
  };

  addRuns(choiceTable, klass, touched, touchedCount, hash);
  scratch.choices.push(choice);
  return choice;
};

/** Picks the representatives for a walk whose lookahead tells no classes of the input apart */
export const blindRepresentativesInto = (
  walk: ScoreWalk,
  scratch: ScoreScratch
): ScoreChoice => representativesInto(walk, scratch, NO_PRIORS, 0, 1, 0);

export const resetSlots = (scratch: ScoreScratch, count: number): void => {
  if (count > scratch.levels.length) {
    scratch.runLengths = grownInt32(scratch.runLengths, count);
    scratch.levels = grownFloat64(scratch.levels, count);
    scratch.previous = grownInt32(scratch.previous, count);
  }

  while (scratch.runs.length < count) scratch.runs.push([]);

  scratch.runLengths.fill(0, 0, count);
  scratch.levels.fill(0, 0, count);
};

/** Adds one boundary to the vector a slot sums, capping what it emits */
const addBoundary = (
  runs: number[][],
  runLengths: Int32Array,
  levels: Float64Array,
  previous: Int32Array,
  slot: number,
  position: number,
  delta: number,
  cap: number
): void => {
  const level = levels[slot];

  if (level > 0 && position !== previous[slot])
    runLengths[slot] = emitRun(
      runs[slot],
      runLengths[slot],
      previous[slot],
      position,
      Math.min(level, cap)
    );

  levels[slot] = level + delta;
  previous[slot] = position;
};

/** Sums the sorted boundaries into one canonical vector per representative piece, each reading only the paths that hold it */
export const sweepPieces = (
  scratch: ScoreScratch,
  walk: ScoreWalk,
  eventCount: number,
  choice: ScoreChoice,
  cap: number
): void => {
  const count = choice.pieces.length;

  resetSlots(scratch, count);
  scratch.readers = grownInt32(scratch.readers, walk.pieceOffsets.length - 1);

  const { eventPieces, eventPositions, eventDeltas, readers } = scratch;
  const { runs, runLengths, levels, previous, touched, touchedCount } = scratch;

  for (let chunk = 0; chunk * MASK_WIDTH < count; chunk += 1) {
    for (let index = 0; index < touchedCount; index += 1)
      readers[touched[index]] = choice.masks[chunk * touchedCount + index];

    for (let event = 0; event < eventCount; event += 1) {
      const position = eventPositions[event];
      const delta = eventDeltas[event];

      for (let mask = readers[eventPieces[event]]; mask !== 0; mask &= mask - 1)
        addBoundary(
          runs,
          runLengths,
          levels,
          previous,
          chunk * MASK_WIDTH + 31 - Math.clz32(mask & -mask),
          position,
          delta,
          cap
        );
    }
  }
};

export const sweepEvery = (
  scratch: ScoreScratch,
  eventCount: number,
  cap: number
): void => {
  resetSlots(scratch, 1);

  const { runs, runLengths, levels, previous } = scratch;

  for (let event = 0; event < eventCount; event += 1)
    addBoundary(
      runs,
      runLengths,
      levels,
      previous,
      0,
      scratch.eventPositions[event],
      scratch.eventDeltas[event],
      cap
    );
};

export const gainsInto = (
  scratch: ScoreScratch,
  walk: ScoreWalk,
  piece: number,
  cap: number,
  gains: Int32Array,
  offset: number
): void => {
  const { pieceSets, pieceCount, loopCount } = walk;

  for (let loop = 0; loop < loopCount; loop += 1) gains[offset + loop] = 0;

  for (let gain = 0; gain < scratch.gainCount; gain += 1) {
    if (pieceSets[scratch.gainPieces[gain] * pieceCount + piece] === 0)
      continue;

    const slot = offset + scratch.gainLoops[gain];

    gains[slot] = Math.min(gains[slot] + scratch.gainValues[gain], cap);
  }
};
