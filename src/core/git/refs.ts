import type { BoundedRead, RefReading, RefTips } from '../../types/git.js';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { objectIdPattern } from './object-content.js';
import { isRealDirectory, readBounded } from './repository.js';

export const MAX_REFS = 100_000;
const MAX_REF_DEPTH = 32;
const MAX_REF_BYTES = 4096;
const MAX_PACKED_REFS_BYTES = 64 * 1024 * 1024;
const REFS_FOLDER = 'refs';
const PACKED_REFS = 'packed-refs';
export const STASH_REF = 'refs/stash';
const SYMBOLIC_REF = 'ref:';
const PEELED_MARK = '^';
const COMMENT_MARK = '#';
const LOCK_SUFFIX = '.lock';

const idsOf = (reading: RefReading, value: string, ref: string): string[] => {
  if (reading.objectId.test(value)) return [value];

  reading.unread.push(ref);

  return [];
};

/** The object a loose ref names, or none for a symbolic ref */
const looseIdsOf = (
  reading: RefReading,
  read: BoundedRead,
  ref: string
): string[] => {
  if (read.status !== 'read') {
    reading.unread.push(ref);
    return [];
  }

  const value = read.content.toString('utf8').trim();

  return value.startsWith(SYMBOLIC_REF) ? [] : idsOf(reading, value, ref);
};

/** Git never reads a ref whose name starts with a dot or ends in .lock, such as a lock left by an update or a file a desktop drops */
const isRefName = (name: string): boolean =>
  !name.startsWith('.') && !name.endsWith(LOCK_SUFFIX);

const hasRoom = (reading: RefReading): boolean => {
  if (reading.seen < MAX_REFS) {
    reading.seen++;
    return true;
  }

  reading.truncated = true;

  return false;
};

const readLooseRef = async (
  reading: RefReading,
  path: string,
  name: string
): Promise<void> => {
  const read = await readBounded(path, MAX_REF_BYTES, false);

  if (read.status !== 'absent')
    reading.refs.set(name, looseIdsOf(reading, read, name));
};

/** Reads the loose refs below a folder, each replacing the packed value of the same name, as Git resolves them */
const readRefFolder = async (
  reading: RefReading,
  folder: string,
  name: string,
  depth: number
): Promise<void> => {
  if (depth > MAX_REF_DEPTH || !(await isRealDirectory(folder))) return;

  const entries = await readdir(folder, { withFileTypes: true }).catch(
    () => null
  );

  if (entries === null) {
    reading.unread.push(name);
    return;
  }

  for (const entry of entries) {
    if (reading.truncated) return;
    if (!isRefName(entry.name)) continue;

    const path = join(folder, entry.name);
    const inner = `${name}/${entry.name}`;

    if (entry.isDirectory())
      await readRefFolder(reading, path, inner, depth + 1);
    if (entry.isFile() && hasRoom(reading))
      await readLooseRef(reading, path, inner);
  }
};

/** Records one line of packed-refs, a peeled line adding the object a tag points to under the ref above it, and returns the ref the next peeled line belongs to */
const readPackedLine = (
  reading: RefReading,
  line: string,
  current: string | null
): string | null => {
  if (line === '' || line.startsWith(COMMENT_MARK)) return current;

  if (line.startsWith(PEELED_MARK)) {
    const peeled = idsOf(
      reading,
      line.slice(PEELED_MARK.length),
      current ?? PACKED_REFS
    );

    if (current !== null) reading.refs.get(current)?.push(...peeled);

    return current;
  }

  const space = line.indexOf(' ');

  if (space === -1) {
    reading.unread.push(PACKED_REFS);
    return null;
  }

  const name = line.slice(space + 1);

  reading.refs.set(name, idsOf(reading, line.slice(0, space), name));

  return name;
};

const readPackedRefs = async (
  reading: RefReading,
  path: string
): Promise<void> => {
  const read = await readBounded(path, MAX_PACKED_REFS_BYTES, false);

  if (read.status === 'absent') return;
  if (read.status === 'unusable') {
    reading.unread.push(PACKED_REFS);
    return;
  }

  let current: string | null = null;

  for (const line of read.content.toString('utf8').split('\n')) {
    if (!hasRoom(reading)) return;

    current = readPackedLine(reading, line.trimEnd(), current);
  }
};

/** Each object a ref other than the stash names, under one of the refs that name it */
const tipsOf = (refs: ReadonlyMap<string, string[]>): Map<string, string> =>
  new Map(
    [...refs]
      .filter(([ref]) => ref !== STASH_REF)
      .flatMap(([ref, ids]) => ids.map((id): [string, string] => [id, ref]))
  );

/** The object ids the refs under a .git folder name, read from HEAD, packed-refs, and the loose refs without following a link, apart from the ones only the stash names, with the refs it could not read */
export const refTipsOf = async (
  gitDirectory: string,
  hashLength: number
): Promise<RefTips> => {
  const reading: RefReading = {
    objectId: objectIdPattern(hashLength),
    refs: new Map(),
    unread: [],
    seen: 0,
    truncated: false,
  };

  await readLooseRef(reading, join(gitDirectory, 'HEAD'), 'HEAD');
  await readPackedRefs(reading, join(gitDirectory, PACKED_REFS));
  await readRefFolder(reading, join(gitDirectory, REFS_FOLDER), REFS_FOLDER, 0);

  const tips = tipsOf(reading.refs);
  const stash = reading.refs.get(STASH_REF) ?? [];

  return {
    tips,
    stash: stash.filter((id) => !tips.has(id)),
    unread: reading.unread,
    truncated: reading.truncated,
  };
};
