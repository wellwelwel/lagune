import type { KeyIndex, RunTable } from '../../../types/hooks/regex.js';
import { grownInt32 } from './buffers.js';

const UINT32_SPAN = 2 ** 32;

export const createRunTable = (): RunTable => ({
  count: 0,
  klasses: new Int32Array(64),
  hashes: new Int32Array(64),
  runs: [],
  slots: new Int32Array(128),
});

export const hashRuns = (
  klass: number,
  runs: readonly number[],
  length: number
): number => {
  let hash = Math.imul(klass ^ 0x2545f491, 0x9e3779b1) ^ length;

  for (let index = 0; index < length; index += 1) {
    hash = Math.imul(hash ^ runs[index], 0x85ebca6b);
    hash ^= hash >>> 13;
  }

  return hash;
};

const sameRuns = (
  stored: readonly number[],
  runs: readonly number[],
  length: number
): boolean => {
  if (stored.length !== length) return false;

  for (let index = 0; index < length; index += 1)
    if (stored[index] !== runs[index]) return false;

  return true;
};

/** Finds the entry holding the same class and list, or -1 */
export const findRuns = (
  table: RunTable,
  klass: number,
  runs: readonly number[],
  length: number,
  hash: number
): number => {
  const mask = table.slots.length - 1;

  for (let slot = hash & mask; ; slot = (slot + 1) & mask) {
    const entry = table.slots[slot];

    if (entry === 0) return -1;

    const id = entry - 1;

    if (
      table.hashes[id] === hash &&
      table.klasses[id] === klass &&
      sameRuns(table.runs[id], runs, length)
    )
      return id;
  }
};

const placeSlot = (slots: Int32Array, hash: number, id: number): void => {
  const mask = slots.length - 1;
  let slot = hash & mask;

  while (slots[slot] !== 0) slot = (slot + 1) & mask;

  slots[slot] = id + 1;
};

/** Stores a copy of the list as the next entry, numbered in the order entries arrive */
export const addRuns = (
  table: RunTable,
  klass: number,
  runs: readonly number[],
  length: number,
  hash: number
): number => {
  const id = table.count;

  table.klasses = grownInt32(table.klasses, id + 1);
  table.hashes = grownInt32(table.hashes, id + 1);
  table.klasses[id] = klass;
  table.hashes[id] = hash;
  table.runs.push(runs.slice(0, length));
  table.count = id + 1;

  if (table.count * 2 <= table.slots.length) {
    placeSlot(table.slots, hash, id);
    return id;
  }

  table.slots = new Int32Array(table.slots.length * 2);

  for (let known = 0; known < table.count; known += 1)
    placeSlot(table.slots, table.hashes[known], known);

  return id;
};

export const createKeyIndex = (): KeyIndex => ({
  count: 0,
  keys: new Float64Array(256),
  slots: new Float64Array(1024),
});

const keyHash = (key: number): number =>
  Math.imul(
    (key >>> 0) ^ Math.imul((key / UINT32_SPAN) >>> 0, 0x9e3779b1),
    0x85ebca6b
  );

/** Finds the slot holding a key, or the empty slot where it belongs */
const slotOf = (slots: Float64Array, key: number): number => {
  const mask = (slots.length >> 1) - 1;
  let slot = keyHash(key) & mask;

  while (slots[slot * 2 + 1] !== 0 && slots[slot * 2] !== key)
    slot = (slot + 1) & mask;

  return slot;
};

const growKeys = (index: KeyIndex): void => {
  const keys = new Float64Array(index.keys.length * 2);
  const slots = new Float64Array(index.slots.length * 2);

  keys.set(index.keys);

  for (let entry = 0; entry < index.count; entry += 1) {
    const slot = slotOf(slots, keys[entry]);

    slots[slot * 2] = keys[entry];
    slots[slot * 2 + 1] = entry + 1;
  }

  index.keys = keys;
  index.slots = slots;
};

export const keyOf = (index: KeyIndex, key: number): number =>
  index.slots[slotOf(index.slots, key) * 2 + 1] - 1;

/** Numbers a key the first time it is seen, in the order keys arrive */
export const internKey = (index: KeyIndex, key: number): number => {
  let slot = slotOf(index.slots, key);

  if (index.slots[slot * 2 + 1] !== 0) return index.slots[slot * 2 + 1] - 1;

  if (index.count === index.keys.length) {
    growKeys(index);
    slot = slotOf(index.slots, key);
  }

  const entry = index.count;

  index.keys[entry] = key;
  index.count = entry + 1;
  index.slots[slot * 2] = key;
  index.slots[slot * 2 + 1] = entry + 1;
  return entry;
};
