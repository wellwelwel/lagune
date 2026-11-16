import type { FileHandle } from 'node:fs/promises';
import type {
  GitObject,
  GitObjectType,
  HistoryBudget,
  HistoryLimits,
  ObjectRead,
  ObjectStore,
  PackedDelta,
  PackedHeader,
  PackFile,
  PackIndex,
  PackLocation,
  UnreadCause,
} from '../../types/git.js';
import { lstat, open, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { inflateSync } from 'node:zlib';
import {
  boundedCache,
  cachedValue,
  cacheValue,
  deepFreeze,
} from '../collections.js';
import {
  applyDelta,
  isPackHeader,
  PACK_HEADER_LENGTH,
  packCountOf,
  packedHeaderOf,
  packedOffsetAt,
  packedPositionOf,
  packIndexOf,
} from './pack.js';
import { isRealDirectory, readBounded } from './repository.js';

const PACK_INDEX_NAME = /^pack-[0-9a-f]{40,64}\.idx$/;
const LOOSE_HEADER = /^([a-z]{3,6}) (0|[1-9]\d{0,15})$/;
const MAX_PACKS = 1024;
const MAX_PACK_INDEX_BYTES = 512 * 1024 * 1024;
const MAX_HEADER_BYTES = 32;
const MAX_LOOSE_HEADER_BYTES = 32;
const MAX_CACHED_BASES_BYTES = 64 * 1024 * 1024;
const MAX_CACHED_BASE_BYTES = 16 * 1024 * 1024;
const BUFFER_TOO_LARGE = 'ERR_BUFFER_TOO_LARGE';

const OBJECT_TYPES: ReadonlyMap<string, GitObjectType> = new Map([
  ['commit', 'commit'],
  ['tree', 'tree'],
  ['blob', 'blob'],
  ['tag', 'tag'],
]);

const STOPPED: ObjectRead = deepFreeze({ status: 'stopped' });

const UNREAD: Readonly<Record<UnreadCause, ObjectRead>> = deepFreeze({
  missing: { status: 'missing' },
  malformed: { status: 'malformed' },
  oversized: { status: 'oversized' },
  deep: { status: 'deep' },
});

/** The most bytes a compressed object of a given size can take, with room for zlib's framing and stored blocks */
const compressedBound = (size: number): number =>
  size + Math.ceil(size / 8) + 1024;

export const budgetOf = (limits: HistoryLimits): HistoryBudget => ({
  limits,
  deadline: performance.now() + limits.milliseconds,
  objects: 0,
  bytes: 0,
  stop: null,
});

/** Whether the walk may read one more object, recording the first bound that stops it */
const admits = (budget: HistoryBudget): boolean => {
  if (budget.stop !== null) return false;

  const { limits } = budget;

  if (performance.now() >= budget.deadline) budget.stop = 'time';
  else if (budget.objects >= limits.objects) budget.stop = 'objects';
  else if (budget.bytes >= limits.bytes) budget.stop = 'bytes';

  if (budget.stop !== null) return false;

  budget.objects++;

  return true;
};

const readAt = async (
  pack: PackFile,
  position: number,
  length: number
): Promise<Buffer> => {
  const size = Math.max(0, Math.min(length, pack.dataEnd - position));
  const buffer = Buffer.alloc(size);
  const { bytesRead } = await pack.handle.read(buffer, 0, size, position);

  return buffer.subarray(0, bytesRead);
};

/** Inflates exactly the declared number of bytes, failing on a stream that ends early, runs long, or exceeds the cap */
const inflateExactly = (
  compressed: Buffer,
  size: number
): Buffer | UnreadCause => {
  try {
    const inflated = inflateSync(compressed, {
      maxOutputLength: Math.max(1, size),
    });

    return inflated.length === size ? inflated : 'malformed';
  } catch {
    return 'malformed';
  }
};

const isBufferTooLarge = (error: unknown): boolean =>
  error instanceof RangeError &&
  'code' in error &&
  error.code === BUFFER_TOO_LARGE;

const inflateCapped = (
  compressed: Buffer,
  maxBytes: number
): Buffer | UnreadCause => {
  try {
    return inflateSync(compressed, { maxOutputLength: maxBytes });
  } catch (error) {
    return isBufferTooLarge(error) ? 'oversized' : 'malformed';
  }
};

const cacheKey = ({ pack, offset }: PackLocation): string =>
  `${pack.id}:${offset}`;

const rememberBase = (
  store: ObjectStore,
  location: PackLocation,
  object: GitObject
): void =>
  cacheValue(store.bases, cacheKey(location), object, object.content.length);

/** Where a pack holds an object, null when its index records an offset no pack can hold, or undefined when no pack holds it */
const locate = (
  store: ObjectStore,
  id: string
): PackLocation | null | undefined => {
  const name = Buffer.from(id, 'hex');

  for (const pack of store.packs) {
    const position = packedPositionOf(pack.index, name);

    if (position === undefined) continue;

    const offset = packedOffsetAt(pack.index, position);

    return offset === null ? null : { pack, offset };
  }

  return undefined;
};

const headerAt = async (
  store: ObjectStore,
  { pack, offset }: PackLocation
): Promise<PackedHeader | null> => {
  if (offset < PACK_HEADER_LENGTH || offset >= pack.dataEnd) return null;

  const chunk = await readAt(pack, offset, MAX_HEADER_BYTES + store.hashLength);

  return packedHeaderOf(chunk, offset, store.hashLength);
};

const inflatePacked = async (
  store: ObjectStore,
  pack: PackFile,
  { size, data }: PackedHeader
): Promise<Buffer | UnreadCause | 'stopped'> => {
  if (size > store.budget.limits.objectBytes) return 'oversized';
  if (!admits(store.budget)) return 'stopped';

  const inflated = inflateExactly(
    await readAt(pack, data, compressedBound(size)),
    size
  );

  if (typeof inflated !== 'string') store.budget.bytes += inflated.length;

  return inflated;
};

const looseFolderIsReal = async (
  store: ObjectStore,
  folder: string
): Promise<boolean> => {
  const known = store.looseFolders.get(folder);

  if (known !== undefined) return known;

  const real = await isRealDirectory(join(store.directory, folder));

  store.looseFolders.set(folder, real);

  return real;
};

const looseObjectOf = (inflated: Buffer): GitObject | null => {
  const end = inflated.indexOf(0);

  if (end === -1 || end > MAX_LOOSE_HEADER_BYTES) return null;

  const header = LOOSE_HEADER.exec(inflated.toString('latin1', 0, end));
  const type = header === null ? undefined : OBJECT_TYPES.get(header[1]);

  if (header === null || type === undefined) return null;

  const content = inflated.subarray(end + 1);

  return Number(header[2]) === content.length ? { type, content } : null;
};

/** Why a loose object file was not read whole: a regular file past the bound holds an object larger than the walk reads */
const unusableLoose = async (
  path: string,
  maxBytes: number
): Promise<ObjectRead> => {
  try {
    const stats = await lstat(path);

    return stats.isFile() && stats.size > maxBytes
      ? UNREAD.oversized
      : UNREAD.malformed;
  } catch {
    return UNREAD.malformed;
  }
};

const readLoose = async (
  store: ObjectStore,
  id: string
): Promise<ObjectRead> => {
  const folder = id.slice(0, 2);

  if (!(await looseFolderIsReal(store, folder))) return UNREAD.missing;

  const { objectBytes } = store.budget.limits;
  const path = join(store.directory, folder, id.slice(2));
  const maxBytes = compressedBound(objectBytes);
  const read = await readBounded(path, maxBytes, false);

  if (read.status === 'absent') return UNREAD.missing;
  if (read.status === 'unusable') return unusableLoose(path, maxBytes);
  if (!admits(store.budget)) return STOPPED;

  const inflated = inflateCapped(
    read.content,
    objectBytes + MAX_LOOSE_HEADER_BYTES
  );

  if (typeof inflated === 'string') return UNREAD[inflated];

  store.budget.bytes += inflated.length;

  const object = looseObjectOf(inflated);

  if (object === null) return UNREAD.malformed;

  return object.content.length > objectBytes
    ? UNREAD.oversized
    : { status: 'read', object };
};

const baseLocation = (
  store: ObjectStore,
  { location, header }: PackedDelta
): PackLocation | string | null => {
  if (header.kind === 'offset-delta')
    return { pack: location.pack, offset: header.base };
  if (header.kind !== 'ref-delta') return null;

  const found = locate(store, header.base);

  return found === undefined ? header.base : found;
};

const resolveChain = async (
  store: ObjectStore,
  base: GitObject,
  chain: readonly PackedDelta[]
): Promise<ObjectRead> => {
  let object = base;

  for (let link = chain.length - 1; link >= 0; link--) {
    const { location, header } = chain[link];
    const delta = await inflatePacked(store, location.pack, header);

    if (delta === 'stopped') return STOPPED;
    if (typeof delta === 'string') return UNREAD[delta];

    const content = applyDelta(
      object.content,
      delta,
      store.budget.limits.objectBytes
    );

    if (typeof content === 'string') return UNREAD[content];

    object = { type: object.type, content };
    rememberBase(store, location, object);
  }

  return { status: 'read', object };
};

/** Reads a packed object, following its delta chain back to a whole object, a cached base, or a loose base, no deeper than the limit */
const readPacked = async (
  store: ObjectStore,
  start: PackLocation
): Promise<ObjectRead> => {
  const chain: PackedDelta[] = [];
  let location = start;

  while (true) {
    const cached = cachedValue(store.bases, cacheKey(location));

    if (cached !== undefined) return resolveChain(store, cached, chain);

    const header = await headerAt(store, location);

    if (header === null) return UNREAD.malformed;

    if (header.kind === 'whole') {
      const content = await inflatePacked(store, location.pack, header);

      if (content === 'stopped') return STOPPED;
      if (typeof content === 'string') return UNREAD[content];

      const object = { type: header.type, content };

      if (chain.length > 0) rememberBase(store, location, object);

      return resolveChain(store, object, chain);
    }

    if (chain.length >= store.budget.limits.deltaDepth) return UNREAD.deep;

    const link = { location, header };
    const next = baseLocation(store, link);

    chain.push(link);

    if (next === null) return UNREAD.malformed;
    if (typeof next !== 'string') {
      location = next;
      continue;
    }

    const loose = await readLoose(store, next);

    return loose.status === 'read'
      ? resolveChain(store, loose.object, chain)
      : loose;
  }
};

/** Reads an object by its hex id from the packs, then from the loose objects */
export const readObject = (
  store: ObjectStore,
  id: string
): Promise<ObjectRead> => {
  const location = locate(store, id);

  if (location === null) return Promise.resolve(UNREAD.malformed);

  return location === undefined
    ? readLoose(store, id)
    : readPacked(store, location);
};

const isRegularFile = async (path: string): Promise<boolean> => {
  try {
    return (await lstat(path)).isFile();
  } catch {
    return false;
  }
};

const trustedPack = async (
  handle: FileHandle,
  index: PackIndex
): Promise<number | null> => {
  const stats = await handle.stat();

  if (!stats.isFile() || stats.size < PACK_HEADER_LENGTH + index.hashLength)
    return null;

  const header = Buffer.alloc(PACK_HEADER_LENGTH);

  await handle.read(header, 0, PACK_HEADER_LENGTH, 0);

  return isPackHeader(header, packCountOf(index))
    ? stats.size - index.hashLength
    : null;
};

/** Opens the pack beside an index when it is a regular file whose header matches the index, or none */
const openPack = async (
  indexPath: string,
  id: number,
  index: PackIndex
): Promise<PackFile | null> => {
  const packPath = `${indexPath.slice(0, -'.idx'.length)}.pack`;

  if (!(await isRegularFile(packPath))) return null;

  const handle = await open(packPath, 'r').catch(() => null);

  if (handle === null) return null;

  const dataEnd = await trustedPack(handle, index).catch(() => null);

  if (dataEnd !== null) return { id, handle, dataEnd, index };

  await handle.close();

  return null;
};

const packIndexNames = async (packDirectory: string): Promise<string[]> => {
  if (!(await isRealDirectory(packDirectory))) return [];

  const entries = await readdir(packDirectory, { withFileTypes: true }).catch(
    () => []
  );

  return entries
    .filter((entry) => entry.isFile() && PACK_INDEX_NAME.test(entry.name))
    .map((entry) => entry.name)
    .toSorted();
};

const packsIn = async (
  objectsDirectory: string,
  hashLength: number
): Promise<readonly [packs: PackFile[], unread: number]> => {
  const packDirectory = join(objectsDirectory, 'pack');
  const names = await packIndexNames(packDirectory);
  const packs: PackFile[] = [];
  let indexBytes = 0;

  for (const name of names.slice(0, MAX_PACKS)) {
    const path = join(packDirectory, name);
    const read = await readBounded(
      path,
      MAX_PACK_INDEX_BYTES - indexBytes,
      false
    );
    const index =
      read.status === 'read' ? packIndexOf(read.content, hashLength) : null;
    const pack =
      index === null ? null : await openPack(path, packs.length, index);

    if (pack === null) continue;

    indexBytes += pack.index.buffer.length;
    packs.push(pack);
  }

  return [packs, names.length - packs.length];
};

/** The object store under a .git folder, with every pack whose index and header it trusts open for reading, or none when the store is not a real folder */
export const openObjectStore = async (
  gitDirectory: string,
  hashLength: number,
  budget: HistoryBudget
): Promise<ObjectStore | null> => {
  const directory = join(gitDirectory, 'objects');

  if (!(await isRealDirectory(directory))) return null;

  const [packs, unreadPacks] = await packsIn(directory, hashLength);

  return {
    directory,
    hashLength,
    packs,
    unreadPacks,
    looseFolders: new Map(),
    bases: boundedCache(MAX_CACHED_BASES_BYTES, MAX_CACHED_BASE_BYTES),
    budget,
  };
};

export const closeObjectStore = async (store: ObjectStore): Promise<void> => {
  await Promise.all(store.packs.map((pack) => pack.handle.close()));
};
