import type {
  ScoreScratch,
  ScoreSegments,
  ScoreWalk,
} from '../../../types/hooks/regex.js';
import { grownFloat64, grownInt32 } from '../automaton/buffers.js';
import { createRunTable } from '../automaton/intern.js';
import { GAIN, MIRROR, mirrorAxis, SHIFT } from './groups.js';

const EXACT_SUMS = 2 ** 53;

export const createScratch = (): ScoreScratch => ({
  incidences: 0,
  pathCount: 0,
  pathPieces: new Int32Array(64),
  pathStarts: new Int32Array(64),
  pathEnds: new Int32Array(64),
  pathValues: new Float64Array(64),
  gainCount: 0,
  gainPieces: new Int32Array(16),
  gainLoops: new Int32Array(16),
  gainValues: new Float64Array(16),
  eventKeys: new Float64Array(128),
  eventPieces: new Int32Array(128),
  eventPositions: new Int32Array(128),
  eventDeltas: new Float64Array(128),
  positionSlots: new Int32Array(256),
  runs: [],
  runLengths: new Int32Array(32),
  levels: new Float64Array(32),
  previous: new Int32Array(32),
  readers: new Int32Array(64),
  spare: [],
  labels: new Int32Array(64),
  splitStamps: new Int32Array(64),
  splitTargets: new Int32Array(64),
  touchedStamps: new Int32Array(64),
  touched: [],
  touchedCount: 0,
  choiceTable: createRunTable(),
  choices: [],
  classStamps: new Int32Array(64),
  classLabels: new Int32Array(64),
  generation: 0,
  representatives: new Int32Array(64),
});

export const pushPath = (
  scratch: ScoreScratch,
  pieces: number,
  start: number,
  end: number,
  value: number
): void => {
  const path = scratch.pathCount;

  if (path === scratch.pathPieces.length) {
    scratch.pathPieces = grownInt32(scratch.pathPieces, path + 1);
    scratch.pathStarts = grownInt32(scratch.pathStarts, path + 1);
    scratch.pathEnds = grownInt32(scratch.pathEnds, path + 1);
    scratch.pathValues = grownFloat64(scratch.pathValues, path + 1);
  }

  scratch.pathPieces[path] = pieces;
  scratch.pathStarts[path] = start;
  scratch.pathEnds[path] = end;
  scratch.pathValues[path] = value;
  scratch.pathCount = path + 1;
};

const pushGain = (
  scratch: ScoreScratch,
  pieces: number,
  loop: number,
  value: number
): void => {
  const gain = scratch.gainCount;

  if (gain === scratch.gainPieces.length) {
    scratch.gainPieces = grownInt32(scratch.gainPieces, gain + 1);
    scratch.gainLoops = grownInt32(scratch.gainLoops, gain + 1);
    scratch.gainValues = grownFloat64(scratch.gainValues, gain + 1);
  }

  scratch.gainPieces[gain] = pieces;
  scratch.gainLoops[gain] = loop;
  scratch.gainValues[gain] = value;
  scratch.gainCount = gain + 1;
};

const firstSegment = (segments: ScoreSegments, position: number): number => {
  let low = 0;
  let high = segments.count;

  while (low < high) {
    const middle = (low + high) >> 1;

    if (segments.ends[middle] <= position) low = middle + 1;
    else high = middle;
  }

  return low;
};

const openingSlot = (
  segments: ScoreSegments,
  index: number,
  first: number
): number =>
  index === first ? segments.offsets[index] : segments.openOffsets[index];

const closingSlot = (
  segments: ScoreSegments,
  index: number,
  first: number
): number =>
  index === first
    ? segments.offsets[index + 1]
    : segments.openOffsets[index + 1];

const memberAt = (
  segments: ScoreSegments,
  index: number,
  first: number,
  slot: number
): number =>
  index === first ? segments.members[slot] : segments.openMembers[slot];

const reservePaths = (scratch: ScoreScratch, extra: number): void => {
  const size = scratch.pathCount + extra;

  if (size <= scratch.pathPieces.length) return;

  scratch.pathPieces = grownInt32(scratch.pathPieces, size);
  scratch.pathStarts = grownInt32(scratch.pathStarts, size);
  scratch.pathEnds = grownInt32(scratch.pathEnds, size);
  scratch.pathValues = grownFloat64(scratch.pathValues, size);
};

/** Spreads a vector back one group per run, telling whether its sums match the segment by segment spread */
const spreadMerged = (
  walk: ScoreWalk,
  runs: readonly number[],
  scratch: ScoreScratch
): boolean => {
  const { segments } = walk;
  const { kinds, sources, targets, multiplicities, pieces, lengths } =
    walk.groups;
  let largest = 0;
  let incidences = 0;

  scratch.pathCount = 0;
  scratch.gainCount = 0;

  for (let run = 0; run < runs.length; run += 3) {
    const start = runs[run];
    const end = runs[run + 1];
    const value = runs[run + 2];
    const first = firstSegment(segments, start);

    for (
      let index = first;
      index < segments.count && segments.starts[index] < end;
      index += 1
    ) {
      const last = closingSlot(segments, index, first);
      const opening = openingSlot(segments, index, first);

      incidences += segments.offsets[index + 1] - segments.offsets[index];
      reservePaths(scratch, last - opening);

      const { pathPieces, pathStarts, pathEnds, pathValues } = scratch;
      let path = scratch.pathCount;

      for (let slot = opening; slot < last; slot += 1) {
        const group = memberAt(segments, index, first, slot);
        const amount = value * multiplicities[group];
        const source = sources[group];

        if (kinds[group] === GAIN) {
          pushGain(scratch, pieces[group], source, amount);
          continue;
        }

        largest = Math.max(largest, amount);
        pathPieces[path] = pieces[group];
        pathValues[path] = amount;

        if (kinds[group] === SHIFT) {
          pathStarts[path] =
            Math.max(start, targets[group]) + source - targets[group];
          pathEnds[path] =
            Math.min(end, targets[group] + lengths[group]) +
            source -
            targets[group];
        } else if (kinds[group] === MIRROR) {
          const axis = mirrorAxis(walk.groups, group);

          pathStarts[path] =
            axis - Math.min(end, targets[group] + lengths[group]);
          pathEnds[path] = axis - Math.max(start, targets[group]);
        } else {
          pathStarts[path] = source;
          pathEnds[path] = source + lengths[group];
        }

        path += 1;
      }

      scratch.pathCount = path;
    }
  }

  scratch.incidences = incidences;
  return 2 * incidences * largest < EXACT_SUMS;
};

/** Spreads what each state of a vector reads back to the states and search positions whose steps lead to it */
const spreadSegments = (
  walk: ScoreWalk,
  runs: readonly number[],
  scratch: ScoreScratch
): void => {
  const { groups, segments } = walk;

  scratch.pathCount = 0;
  scratch.gainCount = 0;

  for (let run = 0; run < runs.length; run += 3) {
    const start = runs[run];
    const end = runs[run + 1];
    const value = runs[run + 2];

    for (
      let index = firstSegment(segments, start);
      index < segments.count && segments.starts[index] < end;
      index += 1
    ) {
      const low = Math.max(start, segments.starts[index]);
      const high = Math.min(end, segments.ends[index]);

      for (
        let slot = segments.offsets[index];
        slot < segments.offsets[index + 1];
        slot += 1
      ) {
        const group = segments.members[slot];
        const amount = value * groups.multiplicities[group];
        const kind = groups.kinds[group];
        const source = groups.sources[group];

        if (kind === GAIN) {
          pushGain(scratch, groups.pieces[group], source, amount);
          continue;
        }

        const offset = source - groups.targets[group];
        const axis = mirrorAxis(groups, group);

        if (kind === SHIFT)
          pushPath(
            scratch,
            groups.pieces[group],
            low + offset,
            high + offset,
            amount
          );
        else if (kind === MIRROR)
          pushPath(
            scratch,
            groups.pieces[group],
            axis - high,
            axis - low,
            amount
          );
        else
          pushPath(
            scratch,
            groups.pieces[group],
            source,
            source + groups.lengths[group],
            amount
          );
      }
    }
  }

  scratch.incidences = scratch.pathCount + scratch.gainCount;
};

export const spreadInto = (
  walk: ScoreWalk,
  runs: readonly number[],
  scratch: ScoreScratch
): void => {
  if (spreadMerged(walk, runs, scratch)) return;

  spreadSegments(walk, runs, scratch);
};

/** Advances a frontier one group per run, telling whether its sums match the segment by segment advance */
const advanceMerged = (
  walk: ScoreWalk,
  runs: readonly number[],
  scratch: ScoreScratch
): boolean => {
  const { groups, sources } = walk;
  let largest = 0;

  scratch.pathCount = 0;
  scratch.gainCount = 0;
  scratch.incidences = 0;

  for (let run = 0; run < runs.length; run += 3) {
    const start = runs[run];
    const end = runs[run + 1];
    const value = runs[run + 2];
    const first = firstSegment(sources, start);

    for (
      let index = first;
      index < sources.count && sources.starts[index] < end;
      index += 1
    ) {
      const last = closingSlot(sources, index, first);

      scratch.incidences += sources.offsets[index + 1] - sources.offsets[index];

      for (
        let slot = openingSlot(sources, index, first);
        slot < last;
        slot += 1
      ) {
        const group = memberAt(sources, index, first, slot);
        const amount = value * groups.multiplicities[group];
        const source = groups.sources[group];
        const target = groups.targets[group];

        if (groups.kinds[group] === SHIFT) {
          largest = Math.max(largest, amount);
          pushPath(
            scratch,
            groups.pieces[group],
            Math.max(start, source) + target - source,
            Math.min(end, source + groups.lengths[group]) + target - source,
            amount
          );
          continue;
        }

        if (groups.kinds[group] === MIRROR) {
          const axis = mirrorAxis(groups, group);

          largest = Math.max(largest, amount);
          pushPath(
            scratch,
            groups.pieces[group],
            axis - Math.min(end, source + groups.lengths[group]),
            axis - Math.max(start, source),
            amount
          );
          continue;
        }

        const reach = source + groups.lengths[group];
        const total = amount * (Math.min(end, reach) - Math.max(start, source));

        largest = Math.max(largest, total);
        pushPath(scratch, groups.pieces[group], target, target + 1, total);
      }
    }
  }

  return 2 * scratch.incidences * largest < EXACT_SUMS;
};

/** Moves what each state of a frontier holds onto the states its steps lead to, the forward twin of the spread */
const advanceSegments = (
  walk: ScoreWalk,
  runs: readonly number[],
  scratch: ScoreScratch
): void => {
  const { groups, sources } = walk;

  scratch.pathCount = 0;
  scratch.gainCount = 0;

  for (let run = 0; run < runs.length; run += 3) {
    const start = runs[run];
    const end = runs[run + 1];
    const value = runs[run + 2];

    for (
      let index = firstSegment(sources, start);
      index < sources.count && sources.starts[index] < end;
      index += 1
    ) {
      const low = Math.max(start, sources.starts[index]);
      const high = Math.min(end, sources.ends[index]);

      for (
        let slot = sources.offsets[index];
        slot < sources.offsets[index + 1];
        slot += 1
      ) {
        const group = sources.members[slot];
        const amount = value * groups.multiplicities[group];
        const target = groups.targets[group];
        const offset = target - groups.sources[group];
        const axis = mirrorAxis(groups, group);

        if (groups.kinds[group] === SHIFT)
          pushPath(
            scratch,
            groups.pieces[group],
            low + offset,
            high + offset,
            amount
          );
        else if (groups.kinds[group] === MIRROR)
          pushPath(
            scratch,
            groups.pieces[group],
            axis - high,
            axis - low,
            amount
          );
        else
          pushPath(
            scratch,
            groups.pieces[group],
            target,
            target + 1,
            amount * (high - low)
          );
      }
    }
  }

  scratch.incidences = scratch.pathCount;
};

export const advanceInto = (
  walk: ScoreWalk,
  runs: readonly number[],
  scratch: ScoreScratch
): void => {
  if (advanceMerged(walk, runs, scratch)) return;

  advanceSegments(walk, runs, scratch);
};
