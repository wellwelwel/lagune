import type {
  DeltaFailure,
  GitObjectType,
  PackedHeader,
  PackIndex,
} from '../../types/git.js';
import { deepFreeze } from '../collections.js';

const INDEX_SIGNATURE = 0xff_74_4f_63;
const INDEX_VERSION = 2;
const FANOUT_START = 8;
const FANOUT_ENTRIES = 256;
const NAMES_START = FANOUT_START + FANOUT_ENTRIES * 4;
const LARGE_OFFSET_FLAG = 0x80_00_00_00;
const LARGE_OFFSET_LENGTH = 8;
const PACK_SIGNATURE = 0x50_41_43_4b;
const MAX_VARINT_SHIFT = 49;
const COPY_DEFAULT_SIZE = 0x1_00_00;
const OFFSET_DELTA = 6;
const REF_DELTA = 7;

export const PACK_HEADER_LENGTH = 12;

const PACKED_TYPES: readonly (GitObjectType | undefined)[] = deepFreeze([
  undefined,
  'commit',
  'tree',
  'blob',
  'tag',
]);

const fanoutAt = (buffer: Buffer, entry: number): number =>
  buffer.readUInt32BE(FANOUT_START + entry * 4);

const isMonotonic = (buffer: Buffer): boolean => {
  let previous = 0;

  for (let entry = 0; entry < FANOUT_ENTRIES; entry++) {
    const value = fanoutAt(buffer, entry);

    if (value < previous) return false;

    previous = value;
  }

  return true;
};

/** The lookup tables of a version 2 pack index, or none for one whose layout does not add up */
export const packIndexOf = (
  buffer: Buffer,
  hashLength: number
): PackIndex | null => {
  const trailer = hashLength * 2;

  if (buffer.length < NAMES_START + trailer) return null;
  if (buffer.readUInt32BE(0) !== INDEX_SIGNATURE) return null;
  if (buffer.readUInt32BE(4) !== INDEX_VERSION || !isMonotonic(buffer))
    return null;

  const count = fanoutAt(buffer, FANOUT_ENTRIES - 1);
  const offsets = NAMES_START + count * (hashLength + 4);
  const largeOffsets = offsets + count * 4;
  const largeBytes = buffer.length - trailer - largeOffsets;

  if (largeBytes < 0 || largeBytes % LARGE_OFFSET_LENGTH !== 0) return null;

  return {
    buffer,
    hashLength,
    offsets,
    largeOffsets,
    largeCount: largeBytes / LARGE_OFFSET_LENGTH,
  };
};

export const packCountOf = (index: PackIndex): number =>
  fanoutAt(index.buffer, FANOUT_ENTRIES - 1);

/** Where an object sits in the index's sorted names, or none when the pack does not hold it */
export const packedPositionOf = (
  index: PackIndex,
  id: Buffer
): number | undefined => {
  const { buffer, hashLength } = index;
  const first = id[0];
  let low = first === 0 ? 0 : fanoutAt(buffer, first - 1);
  let high = fanoutAt(buffer, first);

  while (low < high) {
    const middle = (low + high) >>> 1;
    const start = NAMES_START + middle * hashLength;
    const order = id.compare(buffer, start, start + hashLength);

    if (order === 0) return middle;
    if (order < 0) high = middle;
    else low = middle + 1;
  }

  return undefined;
};

/** The pack offset the index records at a position, or none when it points past the large offsets the index holds */
export const packedOffsetAt = (
  index: PackIndex,
  position: number
): number | null => {
  const { buffer, offsets, largeOffsets, largeCount } = index;
  const value = buffer.readUInt32BE(offsets + position * 4);

  if ((value & LARGE_OFFSET_FLAG) === 0) return value;

  const slot = value - LARGE_OFFSET_FLAG;

  if (slot >= largeCount) return null;

  const large = buffer.readBigUInt64BE(
    largeOffsets + slot * LARGE_OFFSET_LENGTH
  );

  return large > BigInt(Number.MAX_SAFE_INTEGER) ? null : Number(large);
};

/** Whether a pack's first bytes open a version 2 or 3 pack holding the count its index lists */
export const isPackHeader = (header: Buffer, count: number): boolean => {
  if (header.length < PACK_HEADER_LENGTH) return false;

  const version = header.readUInt32BE(4);

  return (
    header.readUInt32BE(0) === PACK_SIGNATURE &&
    (version === 2 || version === 3) &&
    header.readUInt32BE(8) === count
  );
};

const readObjectSize = (
  chunk: Buffer
): readonly [type: number, size: number, next: number] | null => {
  let byte = chunk[0];
  let size = byte & 0x0f;
  let factor = 0x10;
  let index = 1;

  while ((byte & 0x80) !== 0) {
    if (index >= chunk.length) return null;

    byte = chunk[index];
    index++;
    size += (byte & 0x7f) * factor;
    factor *= 0x80;

    if (!Number.isSafeInteger(size)) return null;
  }

  return [(chunk[0] >> 4) & 0x07, size, index];
};

const readBaseDistance = (
  chunk: Buffer,
  start: number
): readonly [distance: number, next: number] | null => {
  if (start >= chunk.length) return null;

  let byte = chunk[start];
  let distance = byte & 0x7f;
  let index = start + 1;

  while ((byte & 0x80) !== 0) {
    if (index >= chunk.length) return null;

    byte = chunk[index];
    index++;
    distance = (distance + 1) * 0x80 + (byte & 0x7f);

    if (!Number.isSafeInteger(distance)) return null;
  }

  return [distance, index];
};

/** The type, size, and data start of the object a pack holds at an offset, or none for bytes that do not read as one */
export const packedHeaderOf = (
  chunk: Buffer,
  offset: number,
  hashLength: number
): PackedHeader | null => {
  if (chunk.length === 0) return null;

  const read = readObjectSize(chunk);

  if (read === null) return null;

  const [type, size, next] = read;
  const whole = PACKED_TYPES[type];

  if (whole !== undefined)
    return { kind: 'whole', type: whole, size, data: offset + next };

  if (type === REF_DELTA) {
    if (next + hashLength > chunk.length) return null;

    return {
      kind: 'ref-delta',
      size,
      data: offset + next + hashLength,
      base: chunk.toString('hex', next, next + hashLength),
    };
  }

  if (type !== OFFSET_DELTA) return null;

  const distance = readBaseDistance(chunk, next);

  if (distance === null) return null;

  const base = offset - distance[0];

  if (base < PACK_HEADER_LENGTH || base >= offset) return null;

  return { kind: 'offset-delta', size, data: offset + distance[1], base };
};

const readDeltaSize = (
  delta: Buffer,
  start: number
): readonly [size: number, next: number] | null => {
  let size = 0;
  let shift = 0;
  let index = start;
  let byte;

  do {
    if (index >= delta.length || shift > MAX_VARINT_SHIFT) return null;

    byte = delta[index];
    index++;
    size += (byte & 0x7f) * 2 ** shift;
    shift += 7;
  } while ((byte & 0x80) !== 0);

  return [size, index];
};

const readCopy = (
  delta: Buffer,
  opcode: number,
  start: number
): readonly [offset: number, size: number, next: number] | null => {
  let offset = 0;
  let size = 0;
  let index = start;

  for (let bit = 0; bit < 7; bit++) {
    if ((opcode & (1 << bit)) === 0) continue;
    if (index >= delta.length) return null;

    const value = delta[index] * 2 ** (8 * (bit < 4 ? bit : bit - 4));

    if (bit < 4) offset += value;
    else size += value;

    index++;
  }

  return [offset, size === 0 ? COPY_DEFAULT_SIZE : size, index];
};

/** Rebuilds an object from its base and a delta, refusing any instruction that reaches outside either or overshoots the size the delta declares */
export const applyDelta = (
  base: Buffer,
  delta: Buffer,
  maxBytes: number
): Buffer | DeltaFailure => {
  const source = readDeltaSize(delta, 0);
  const target = source === null ? null : readDeltaSize(delta, source[1]);

  if (source === null || target === null || source[0] !== base.length)
    return 'malformed';

  const [targetSize, start] = target;

  if (targetSize > maxBytes) return 'oversized';

  const result = Buffer.allocUnsafe(targetSize);
  let written = 0;
  let index = start;

  while (index < delta.length) {
    const opcode = delta[index];

    index++;

    if (opcode === 0) return 'malformed';

    if ((opcode & 0x80) === 0) {
      if (index + opcode > delta.length || written + opcode > targetSize)
        return 'malformed';

      written += delta.copy(result, written, index, index + opcode);
      index += opcode;
      continue;
    }

    const copy = readCopy(delta, opcode, index);

    if (copy === null) return 'malformed';

    const [offset, size, next] = copy;

    if (offset + size > base.length || written + size > targetSize)
      return 'malformed';

    written += base.copy(result, written, offset, offset + size);
    index = next;
  }

  return written === targetSize ? result : 'malformed';
};
