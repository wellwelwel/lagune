import type {
  Lookahead,
  ScoreBundles,
  ScoreGroups,
  ScoreLayout,
  ScoreMoveTable,
  ScoreSegments,
  ScoreWalk,
} from '../../../types/hooks/regex.js';
import { lowerBound } from '../syntax/codeset.js';
import { NO_LOOP } from './layout.js';
import { movesOf, remembered, stateCountOf } from './moves.js';

const MULTIPLICITY_SLOTS = 2 ** 21;

export const SHIFT = 0;

const FAN = 1;

export const GAIN = 2;

export const MIRROR = 3;

/** Bundles the steps of every state by where they lead and how many of them lead there, listing the pieces each bundle reads */
const collectBundles = (
  layout: ScoreLayout,
  moves: ScoreMoveTable
): ScoreBundles => {
  const { order, loopIndex } = layout;
  const { entryOffsets, entryPieces, targetOffsets, targets } = moves;
  const bundles: ScoreBundles = {
    gains: [],
    sources: [],
    targets: [],
    multiplicities: [],
    pieces: [],
  };
  const bundleOf = new Map<number, number>();
  const owners: number[] = [];
  const stamps = new Int32Array(order.length + 1);
  const counts = new Int32Array(order.length + 1);
  const distinct: number[] = [];
  let generation = 0;

  for (let state = 0; state < stateCountOf(moves); state += 1) {
    const gain = loopIndex[state] !== NO_LOOP ? 1 : 0;
    const source = gain === 1 ? loopIndex[state] : order[state];

    for (
      let entry = entryOffsets[state];
      entry < entryOffsets[state + 1];
      entry += 1
    ) {
      const piece = entryPieces[entry];

      generation += 1;
      distinct.length = 0;

      for (
        let item = targetOffsets[entry];
        item < targetOffsets[entry + 1];
        item += 1
      ) {
        const slot = order[targets[item]] + 1;

        if (stamps[slot] !== generation) {
          stamps[slot] = generation;
          counts[slot] = 0;
          distinct.push(slot);
        }

        counts[slot] += 1;
      }

      for (const slot of distinct) {
        const key = (slot - 1) * MULTIPLICITY_SLOTS + counts[slot];
        let bundle = bundleOf.get(key) ?? -1;

        if (bundle === -1 || owners[bundle] !== state) {
          bundle = bundles.sources.length;
          bundleOf.set(key, bundle);
          owners.push(state);
          bundles.gains.push(gain);
          bundles.sources.push(source);
          bundles.targets.push(slot - 1);
          bundles.multiplicities.push(counts[slot]);
          bundles.pieces.push([]);
        }

        bundles.pieces[bundle].push(piece);
      }
    }
  }

  return bundles;
};

const streakLengths = (
  sorted: readonly number[],
  continues: (previous: number, edge: number) => boolean
): number[] => {
  const lengths: number[] = [];

  for (let index = 0; index < sorted.length; index += 1)
    if (index > 0 && continues(sorted[index - 1], sorted[index]))
      lengths[lengths.length - 1] += 1;
    else lengths.push(1);

  return lengths;
};

/** Bundles steps that move a range of states together, onto the next range, onto it in reverse, or into one shared state */
const groupBundles = (
  bundles: ScoreBundles,
  pieceIds: Int32Array
): ScoreGroups => {
  const { sources, targets, multiplicities } = bundles;
  const edges: number[] = [];
  const gains: number[] = [];

  for (let bundle = 0; bundle < sources.length; bundle += 1)
    if (bundles.gains[bundle] === 1) gains.push(bundle);
    else edges.push(bundle);

  const sameBundle = (previous: number, edge: number): boolean =>
    pieceIds[previous] === pieceIds[edge] &&
    multiplicities[previous] === multiplicities[edge] &&
    sources[edge] === sources[previous] + 1;
  const shifted = edges.toSorted(
    (left, right) =>
      pieceIds[left] - pieceIds[right] ||
      multiplicities[left] - multiplicities[right] ||
      targets[left] - sources[left] - (targets[right] - sources[right]) ||
      sources[left] - sources[right]
  );
  const shiftLengths = streakLengths(
    shifted,
    (previous, edge) =>
      sameBundle(previous, edge) && targets[edge] === targets[previous] + 1
  );
  const loose: number[] = [];
  let cursor = 0;

  for (const length of shiftLengths) {
    if (length === 1) loose.push(shifted[cursor]);

    cursor += length;
  }

  const fanned = loose.toSorted(
    (left, right) =>
      pieceIds[left] - pieceIds[right] ||
      multiplicities[left] - multiplicities[right] ||
      targets[left] - targets[right] ||
      sources[left] - sources[right]
  );
  const fanLengths = streakLengths(
    fanned,
    (previous, edge) =>
      sameBundle(previous, edge) && targets[edge] === targets[previous]
  );
  const singles: number[] = [];

  cursor = 0;

  for (const length of fanLengths) {
    if (length === 1) singles.push(fanned[cursor]);

    cursor += length;
  }

  const mirrored = singles.toSorted(
    (left, right) =>
      pieceIds[left] - pieceIds[right] ||
      multiplicities[left] - multiplicities[right] ||
      targets[left] + sources[left] - (targets[right] + sources[right]) ||
      sources[left] - sources[right]
  );
  const mirrorLengths = streakLengths(
    mirrored,
    (previous, edge) =>
      sameBundle(previous, edge) && targets[edge] === targets[previous] - 1
  );
  const runsOf = (lengths: readonly number[]): number =>
    lengths.reduce((total, length) => total + (length > 1 ? 1 : 0), 0);
  const count =
    runsOf(shiftLengths) +
    runsOf(fanLengths) +
    mirrorLengths.length +
    gains.length;
  const groups: ScoreGroups = {
    count,
    kinds: new Uint8Array(count),
    sources: new Int32Array(count),
    targets: new Int32Array(count),
    multiplicities: new Int32Array(count),
    pieces: new Int32Array(count),
    lengths: new Int32Array(count),
  };
  let group = 0;

  const place = (edge: number, kind: number, length: number): void => {
    groups.kinds[group] = kind;
    groups.sources[group] = sources[edge];
    groups.targets[group] =
      kind === MIRROR ? targets[edge] - length + 1 : targets[edge];
    groups.multiplicities[group] = multiplicities[edge];
    groups.pieces[group] = pieceIds[edge];
    groups.lengths[group] = length;
    group += 1;
  };

  const placeRuns = (
    sorted: readonly number[],
    lengths: readonly number[],
    kind: number,
    single: boolean
  ): void => {
    let start = 0;

    for (const length of lengths) {
      if (length > 1 !== single) place(sorted[start], kind, length);

      start += length;
    }
  };

  placeRuns(shifted, shiftLengths, SHIFT, false);
  placeRuns(fanned, fanLengths, FAN, false);
  placeRuns(mirrored, mirrorLengths, MIRROR, false);
  placeRuns(mirrored, mirrorLengths, FAN, true);

  for (const gain of gains) place(gain, GAIN, 1);

  return groups;
};

/** Splits one side of the steps into ranges that every group either covers whole or misses, each listing the groups that hold it */
const segmentsOf = (
  spanStarts: Int32Array,
  spanEnds: Int32Array,
  members: readonly number[]
): ScoreSegments => {
  const endpoints = new Int32Array(members.length * 2);

  members.forEach((member, index) => {
    endpoints[index * 2] = spanStarts[member];
    endpoints[index * 2 + 1] = spanEnds[member];
  });
  endpoints.sort();

  let boundCount = 0;

  for (let index = 0; index < endpoints.length; index += 1)
    if (boundCount === 0 || endpoints[boundCount - 1] !== endpoints[index]) {
      endpoints[boundCount] = endpoints[index];
      boundCount += 1;
    }

  const bounds = endpoints.subarray(0, boundCount);
  const covered = new Int32Array(boundCount);
  const segmentOf = new Int32Array(boundCount);

  for (const member of members)
    for (
      let index = lowerBound(bounds, spanStarts[member]);
      index < boundCount && bounds[index] < spanEnds[member];
      index += 1
    )
      covered[index] += 1;

  let count = 0;

  for (let index = 0; index < boundCount; index += 1) {
    segmentOf[index] = covered[index] > 0 ? count : -1;
    count += covered[index] > 0 ? 1 : 0;
  }

  const segments: ScoreSegments = {
    count,
    starts: new Int32Array(count),
    ends: new Int32Array(count),
    offsets: new Int32Array(count + 1),
    members: new Int32Array(0),
    openOffsets: new Int32Array(count + 1),
    openMembers: new Int32Array(members.length),
  };

  for (let index = 0; index < boundCount; index += 1) {
    const segment = segmentOf[index];

    if (segment === -1) continue;

    segments.starts[segment] = bounds[index];
    segments.ends[segment] = bounds[index + 1];
    segments.offsets[segment + 1] = segments.offsets[segment] + covered[index];
  }

  const cursor = segments.offsets.slice(0, count);

  segments.members = new Int32Array(segments.offsets[count]);

  for (const member of members)
    for (
      let index = lowerBound(bounds, spanStarts[member]);
      index < boundCount && bounds[index] < spanEnds[member];
      index += 1
    ) {
      segments.members[cursor[segmentOf[index]]] = member;
      cursor[segmentOf[index]] += 1;
    }

  const { openOffsets, openMembers } = segments;

  for (const member of members)
    openOffsets[segmentOf[lowerBound(bounds, spanStarts[member])] + 1] += 1;

  for (let segment = 0; segment < count; segment += 1)
    openOffsets[segment + 1] += openOffsets[segment];

  const opening = openOffsets.slice(0, count);

  for (const member of members) {
    const segment = segmentOf[lowerBound(bounds, spanStarts[member])];

    openMembers[opening[segment]] = member;
    opening[segment] += 1;
  }

  return segments;
};

const targetSegments = (groups: ScoreGroups): ScoreSegments => {
  const ends = new Int32Array(groups.count);
  const members: number[] = [];

  for (let group = 0; group < groups.count; group += 1) {
    ends[group] =
      groups.targets[group] +
      (groups.kinds[group] === SHIFT || groups.kinds[group] === MIRROR
        ? groups.lengths[group]
        : 1);
    members.push(group);
  }

  return segmentsOf(groups.targets, ends, members);
};

const sourceEnd = (groups: ScoreGroups, group: number): number =>
  groups.sources[group] + groups.lengths[group];

const sourceSegments = (groups: ScoreGroups): ScoreSegments => {
  const ends = new Int32Array(groups.count);
  const members: number[] = [];

  for (let group = 0; group < groups.count; group += 1) {
    if (groups.kinds[group] === GAIN) continue;

    ends[group] = sourceEnd(groups, group);
    members.push(group);
  }

  return segmentsOf(groups.sources, ends, members);
};

const refinePartition = (
  blocks: Int32Array,
  keys: ArrayLike<number>,
  width: number
): Int32Array => {
  const blocksByKey = new Map<number, number>();
  const refined = new Int32Array(blocks.length);

  for (let piece = 0; piece < blocks.length; piece += 1) {
    const key = blocks[piece] * width + keys[piece];
    let block = blocksByKey.get(key);

    if (block === undefined) {
      block = blocksByKey.size;
      blocksByKey.set(key, block);
    }

    refined[piece] = block;
  }

  return refined;
};

/** Bundles the steps that survive for one class of the input that follows, by the pieces they read */
const buildWalk = (
  layout: ScoreLayout,
  pieceCount: number,
  moves: ScoreMoveTable
): ScoreWalk => {
  const { loopIndex, loopStates } = layout;
  const loopCount = loopStates.length;
  const bundles = collectBundles(layout, moves);
  const pieceIds = new Int32Array(bundles.sources.length);
  const pieceKeys = new Map<string, number>();
  const pieceLists: (readonly number[])[] = [];

  bundles.pieces.forEach((pieces, bundle) => {
    const key = pieces.join(',');
    const known = pieceKeys.get(key);

    pieceIds[bundle] = known ?? pieceLists.length;

    if (known !== undefined) return;

    pieceKeys.set(key, pieceLists.length);
    pieceLists.push(pieces);
  });

  const groups = groupBundles(bundles, pieceIds);
  const pieceSets = new Uint8Array(pieceLists.length * pieceCount);
  const pieceOffsets = new Int32Array(pieceLists.length + 1);
  const loopNext = new Int32Array(pieceCount * loopCount).fill(NO_LOOP);
  const column = new Int32Array(pieceCount);
  let loopClasses: Int32Array = new Int32Array(pieceCount);

  pieceLists.forEach((pieces, pieceSet) => {
    pieceOffsets[pieceSet + 1] = pieceOffsets[pieceSet] + pieces.length;

    for (const piece of pieces) pieceSets[pieceSet * pieceCount + piece] = 1;
  });

  const pieceItems = Int32Array.from(pieceLists.flat());

  loopStates.forEach((state, loop) => {
    for (
      let entry = moves.loopOffsets[state];
      entry < moves.loopOffsets[state + 1];
      entry += 1
    )
      loopNext[moves.loopPieces[entry] * loopCount + loop] =
        loopIndex[moves.loopTargets[entry]];
  });

  for (let loop = 0; loop < loopCount; loop += 1) {
    for (let piece = 0; piece < pieceCount; piece += 1)
      column[piece] = loopNext[piece * loopCount + loop] + 1;

    loopClasses = refinePartition(loopClasses, column, loopCount + 1);
  }

  return {
    pieceCount,
    loopCount,
    groups,
    segments: targetSegments(groups),
    sources: sourceSegments(groups),
    pieceSets,
    pieceOffsets,
    pieceItems,
    loopClasses,
    loopClassCount:
      loopClasses.reduce((highest, klass) => Math.max(highest, klass), 0) + 1,
    loopNext,
  };
};

export const walkOf = (
  layout: ScoreLayout,
  lookahead: Lookahead,
  klass: number
): ScoreWalk =>
  remembered(layout.walks, lookahead, klass, () =>
    buildWalk(layout, lookahead.pieces, movesOf(layout, lookahead, klass))
  );

const isChain = (groups: ScoreGroups, group: number): boolean =>
  groups.kinds[group] === SHIFT &&
  groups.targets[group] === groups.sources[group] + 1;

const sharesPiece = (walk: ScoreWalk, left: number, right: number): boolean => {
  const { pieceSets, pieceCount } = walk;

  for (let piece = 0; piece < pieceCount; piece += 1)
    if (
      pieceSets[left * pieceCount + piece] === 1 &&
      pieceSets[right * pieceCount + piece] === 1
    )
      return true;

  return false;
};

const startsAttempt = (walk: ScoreWalk, pieces: number): boolean => {
  const { groups } = walk;

  for (let group = 0; group < groups.count; group += 1)
    if (
      groups.kinds[group] === GAIN &&
      sharesPiece(walk, groups.pieces[group], pieces)
    )
      return true;

  return false;
};

const splitsChain = (walk: ScoreWalk, chain: number): boolean => {
  const { groups } = walk;
  const first = groups.sources[chain];
  const last = first + groups.lengths[chain];

  for (let group = 0; group < groups.count; group += 1)
    if (
      group !== chain &&
      groups.kinds[group] !== GAIN &&
      groups.sources[group] <= last &&
      sourceEnd(groups, group) > first &&
      sharesPiece(walk, groups.pieces[group], groups.pieces[chain])
    )
      return true;

  return false;
};

export const chainRanges = (
  walk: ScoreWalk,
  keep: (group: number) => boolean
): number[] => {
  const { groups } = walk;
  const ranges: number[] = [];

  for (let group = 0; group < groups.count; group += 1)
    if (isChain(groups, group) && keep(group))
      ranges.push(
        groups.sources[group],
        groups.sources[group] + groups.lengths[group] + 1
      );

  return ranges;
};

/** Lists the runs of states that read one class in a row and that no new attempt can start within */
export const quietRanges = (walk: ScoreWalk): number[] =>
  chainRanges(walk, (group) => !startsAttempt(walk, walk.groups.pieces[group]));

/** Lists the runs of states that read one class in a row and never split on it */
export const steadyRanges = (walk: ScoreWalk): number[] =>
  chainRanges(walk, (group) => !splitsChain(walk, group));

/** The axis of a mirrored group: [low, high) on one side lands on [axis - high, axis - low) on the other */
export const mirrorAxis = (groups: ScoreGroups, group: number): number =>
  groups.sources[group] + groups.targets[group] + groups.lengths[group];
