import type {
  PairTable,
  ScoreMoveTable,
  WorkMeter,
} from '../../../types/hooks/regex.js';
import { grownInt32, grownUint8 } from '../automaton/buffers.js';
import { spend } from '../budget.js';
import { entryOf } from './moves.js';

export const createPairs = (): PairTable => ({
  count: 0,
  olders: new Int32Array(256),
  youngers: new Int32Array(256),
  lives: new Int32Array(256),
  settled: new Uint8Array(256),
  slots: new Int32Array(512),
});

const pairHash = (older: number, younger: number): number =>
  Math.imul(older ^ 0x5bd1e995, 0x9e3779b1) ^ Math.imul(younger, 0x85ebca6b);

const findPair = (pairs: PairTable, older: number, younger: number): number => {
  const mask = pairs.slots.length - 1;

  for (let slot = pairHash(older, younger) & mask; ; slot = (slot + 1) & mask) {
    const entry = pairs.slots[slot];

    if (entry === 0) return -1;
    if (
      pairs.olders[entry - 1] === older &&
      pairs.youngers[entry - 1] === younger
    )
      return entry - 1;
  }
};

const placePair = (pairs: PairTable, entry: number): void => {
  const mask = pairs.slots.length - 1;
  let slot = pairHash(pairs.olders[entry], pairs.youngers[entry]) & mask;

  while (pairs.slots[slot] !== 0) slot = (slot + 1) & mask;

  pairs.slots[slot] = entry + 1;
};

const pairOf = (pairs: PairTable, older: number, younger: number): number => {
  const known = findPair(pairs, older, younger);

  if (known !== -1) return known;

  const entry = pairs.count;

  pairs.olders = grownInt32(pairs.olders, entry + 1);
  pairs.youngers = grownInt32(pairs.youngers, entry + 1);
  pairs.lives = grownInt32(pairs.lives, entry + 1);
  pairs.settled = grownUint8(pairs.settled, entry + 1);
  pairs.olders[entry] = older;
  pairs.youngers[entry] = younger;
  pairs.lives[entry] = 1;
  pairs.count = entry + 1;

  if (pairs.count * 2 <= pairs.slots.length) {
    placePair(pairs, entry);
    return entry;
  }

  pairs.slots = new Int32Array(pairs.slots.length * 2);

  for (let known = 0; known < pairs.count; known += 1) placePair(pairs, known);

  return entry;
};

export const livesOf = (
  pairs: PairTable,
  older: number,
  younger: number
): number => {
  const entry = findPair(pairs, older, younger);

  return entry === -1 ? 1 : pairs.lives[entry];
};

/** Tells whether two attempts in a pair of states can read at least the given number of characters together */
export const outlives = (
  moves: ScoreMoveTable,
  pairs: PairTable,
  older: number,
  younger: number,
  required: number,
  meter: WorkMeter
): boolean => {
  const entry = findPair(pairs, older, younger);

  if (entry !== -1 && pairs.lives[entry] >= required) return true;
  if (entry === -1 && required <= 1) return true;
  if (entry !== -1 && pairs.settled[entry] === 1) return false;

  const { entryOffsets, entryPieces, targetOffsets, targets } = moves;
  const first = entryOffsets[younger];
  const last = entryOffsets[younger + 1];
  let children = 0;

  for (let young = first; young < last; young += 1) {
    const old = entryOf(moves, older, entryPieces[young]);

    if (old !== -1)
      children +=
        (targetOffsets[old + 1] - targetOffsets[old]) *
        (targetOffsets[young + 1] - targetOffsets[young]);
  }

  spend(meter, 1 + children);

  for (let young = first; young < last; young += 1) {
    const old = entryOf(moves, older, entryPieces[young]);

    if (old === -1) continue;

    for (
      let oldItem = targetOffsets[old];
      oldItem < targetOffsets[old + 1];
      oldItem += 1
    )
      for (
        let youngItem = targetOffsets[young];
        youngItem < targetOffsets[young + 1];
        youngItem += 1
      )
        if (
          outlives(
            moves,
            pairs,
            targets[oldItem],
            targets[youngItem],
            required - 1,
            meter
          )
        ) {
          pairs.lives[pairOf(pairs, older, younger)] = required;
          return true;
        }
  }

  let longest = 0;

  for (let young = first; young < last; young += 1) {
    const old = entryOf(moves, older, entryPieces[young]);

    if (old === -1) continue;

    for (
      let oldItem = targetOffsets[old];
      oldItem < targetOffsets[old + 1];
      oldItem += 1
    )
      for (
        let youngItem = targetOffsets[young];
        youngItem < targetOffsets[young + 1];
        youngItem += 1
      )
        longest = Math.max(
          longest,
          livesOf(pairs, targets[oldItem], targets[youngItem])
        );
  }

  const settledEntry = pairOf(pairs, older, younger);

  pairs.lives[settledEntry] = 1 + longest;
  pairs.settled[settledEntry] = 1;
  return false;
};
