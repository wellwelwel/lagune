import type { TrackedIndex } from '../../types/git.js';

const SIGNATURE = 0x44_49_52_43;
const HEADER_LENGTH = 12;
const STAT_LENGTH = 40;
const MODE_OFFSET = 24;
const FLAGS_LENGTH = 2;
const EXTENDED_FLAG = 0x40_00;
const TYPE_MASK = 0o170000;
const DIRECTORY_TYPE = 0o040000;
const EXTENSION_HEADER_LENGTH = 8;
const OPTIONAL_EXTENSION_FIRST = 0x41;
const OPTIONAL_EXTENSION_LAST = 0x5a;

const readVarint = (
  buffer: Buffer,
  start: number
): readonly [value: number, next: number] | null => {
  if (start >= buffer.length) return null;

  let index = start + 1;
  let byte = buffer[start];
  let value = byte & 0x7f;

  while ((byte & 0x80) !== 0) {
    if (index >= buffer.length) return null;

    byte = buffer[index];
    index++;
    value = (value + 1) * 0x80 + (byte & 0x7f);

    if (!Number.isSafeInteger(value)) return null;
  }

  return [value, index];
};

const readPaddedName = (
  buffer: Buffer,
  entryOffset: number,
  nameOffset: number
): readonly [path: Buffer, next: number] | null => {
  const end = buffer.indexOf(0, nameOffset);

  if (end === -1) return null;

  return [
    buffer.subarray(nameOffset, end),
    entryOffset + ((end - entryOffset + 8) & ~7),
  ];
};

const readCompressedName = (
  buffer: Buffer,
  nameOffset: number,
  previous: Buffer
): readonly [path: Buffer, next: number] | null => {
  const varint = readVarint(buffer, nameOffset);

  if (varint === null) return null;

  const [removed, suffixOffset] = varint;
  const end = buffer.indexOf(0, suffixOffset);

  if (end === -1 || removed > previous.length) return null;

  return [
    Buffer.concat([
      previous.subarray(0, previous.length - removed),
      buffer.subarray(suffixOffset, end),
    ]),
    end + 1,
  ];
};

const readEntry = (
  buffer: Buffer,
  offset: number,
  version: number,
  hashLength: number,
  previous: Buffer
): readonly [path: Buffer, next: number] | null => {
  const flagsOffset = offset + STAT_LENGTH + hashLength;

  if (flagsOffset + FLAGS_LENGTH > buffer.length) return null;

  const mode = buffer.readUInt32BE(offset + MODE_OFFSET);
  const extended = (buffer.readUInt16BE(flagsOffset) & EXTENDED_FLAG) !== 0;

  if ((mode & TYPE_MASK) === DIRECTORY_TYPE || (extended && version < 3))
    return null;

  const nameOffset = flagsOffset + FLAGS_LENGTH * (extended ? 2 : 1);

  return version === 4
    ? readCompressedName(buffer, nameOffset, previous)
    : readPaddedName(buffer, offset, nameOffset);
};

const extensionsAreOptional = (
  buffer: Buffer,
  start: number,
  end: number
): boolean => {
  let offset = start;

  while (offset < end) {
    if (offset + EXTENSION_HEADER_LENGTH > end) return false;

    const first = buffer[offset];

    if (first < OPTIONAL_EXTENSION_FIRST || first > OPTIONAL_EXTENSION_LAST)
      return false;

    offset += EXTENSION_HEADER_LENGTH + buffer.readUInt32BE(offset + 4);
  }

  return offset === end;
};

const ancestorsOf = (path: string): string[] => {
  const segments = path.split('/');

  return segments
    .slice(1)
    .map((_segment, index) => segments.slice(0, index + 1).join('/'));
};

/** The paths a Git index tracks and the folders above them, or none for an index this reader cannot fully trust */
export const trackedIndexOf = (
  buffer: Buffer,
  hashLength: number
): TrackedIndex | null => {
  const end = buffer.length - hashLength;

  if (end < HEADER_LENGTH || buffer.readUInt32BE(0) !== SIGNATURE) return null;

  const version = buffer.readUInt32BE(4);
  const count = buffer.readUInt32BE(8);

  if (version < 2 || version > 4) return null;

  const paths: string[] = [];
  let offset = HEADER_LENGTH;
  let previous: Buffer = Buffer.alloc(0);

  for (let entry = 0; entry < count; entry++) {
    const read =
      offset < end
        ? readEntry(buffer, offset, version, hashLength, previous)
        : null;

    if (read === null || read[1] > end) return null;

    [previous, offset] = read;
    paths.push(previous.toString('utf8'));
  }

  if (!extensionsAreOptional(buffer, offset, end)) return null;

  return {
    files: new Set(paths),
    directories: new Set(paths.flatMap(ancestorsOf)),
  };
};
