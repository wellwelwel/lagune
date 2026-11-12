import type { LockedState, StateLock, StateLockTiming } from '../types/core.js';
import { randomBytes } from 'node:crypto';
import { lstat, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import {
  ensureDir,
  existingWithin,
  hasErrorCode,
  isInUse,
  retryDelay,
  retryWhileInUse,
} from './fs-actions.js';
import { stateFileRefusal } from './state-file.js';

const STATE_FOLDER = '.lagune';
const ENGINE_FOLDER_NAME = '.tmp';
const ENGINE_FOLDER = `${STATE_FOLDER}/${ENGINE_FOLDER_NAME}`;
const LOCK_NAME = 'lock';
const CLAIM_NAME = 'lock.break';
const IGNORE_FILE = '.gitignore';
const IGNORE_EVERYTHING = '*\n';
const TOKEN_BYTES = 16;
const STATE_LOCK_TIMING: StateLockTiming = {
  staleMs: 10_000,
  waitMs: 30_000,
};

const lockStillHeld = (waitMs: number): Error =>
  new Error(
    `${ENGINE_FOLDER}/${LOCK_NAME} stayed held by another Lagune write for ${waitMs / 1000} seconds, so this call wrote nothing: run it again once that write ends.`
  );

const ignoreExisting = (error: unknown): void => {
  if (!hasErrorCode(error, 'EEXIST')) throw error;
};

const stateFolderOf = async (cwd: string): Promise<string> => {
  await ensureDir(join(cwd, STATE_FOLDER));

  const folder = await existingWithin(cwd, join(cwd, STATE_FOLDER));

  if (folder === undefined)
    throw stateFileRefusal(
      STATE_FOLDER,
      'must be a folder inside this project, not a link to a path outside it'
    );

  return folder;
};

/** The folder that holds every write's lock and temporary files, kept between writes with a .gitignore that hides it and all it holds from Git */
const engineFolderOf = async (cwd: string): Promise<string> => {
  const folder = join(await stateFolderOf(cwd), ENGINE_FOLDER_NAME);

  await mkdir(folder).catch(ignoreExisting);

  const stats = await lstat(folder);

  if (!stats.isDirectory())
    throw stateFileRefusal(
      ENGINE_FOLDER,
      'must be a folder, not a link or a file'
    );

  await writeFile(join(folder, IGNORE_FILE), IGNORE_EVERYTHING, {
    encoding: 'utf8',
    flag: 'wx',
  }).catch(ignoreExisting);

  return folder;
};

/** Creates a folder only while nothing holds its name, telling whether this call took it */
const takeFolder = async (path: string): Promise<boolean> => {
  try {
    await mkdir(path);

    return true;
  } catch (error) {
    if (hasErrorCode(error, 'EEXIST') || isInUse(error)) return false;

    throw error;
  }
};

const isStale = async (path: string, staleMs: number): Promise<boolean> => {
  const stats = await lstat(path).catch(() => undefined);

  return stats !== undefined && Date.now() - stats.mtimeMs > staleMs;
};

const removeTree = (path: string): Promise<void> =>
  retryWhileInUse(() => rm(path, { recursive: true, force: true }));

const sweepClaim = (lock: StateLock): Promise<void> =>
  removeTree(lock.claim).catch(() => undefined);

const holderOf = (lock: StateLock): string => join(lock.path, lock.token);

/** Makes the holder's own folder inside the lock, the proof of who holds it */
const signLock = async (lock: StateLock): Promise<void> => {
  try {
    await mkdir(holderOf(lock));
  } catch (error) {
    await removeTree(lock.path).catch(() => undefined);

    throw error;
  }
};

/** Removes the lock a crashed write left behind, judged by one process at a time, telling whether it did */
const breakStaleLock = async (lock: StateLock): Promise<boolean> => {
  if (!(await takeFolder(lock.claim))) {
    if (await isStale(lock.claim, lock.timing.staleMs))
      await removeTree(lock.claim);

    return false;
  }

  try {
    if (!(await isStale(lock.path, lock.timing.staleMs))) return false;

    await removeTree(lock.path);

    return true;
  } finally {
    await sweepClaim(lock);
  }
};

const acquire = async (lock: StateLock, attempt = 0): Promise<void> => {
  if (await takeFolder(lock.path)) return signLock(lock);
  if (performance.now() >= lock.deadline)
    throw lockStillHeld(lock.timing.waitMs);

  const broken =
    (await isStale(lock.path, lock.timing.staleMs)) &&
    (await breakStaleLock(lock));

  if (!broken) await sleep(retryDelay(attempt));

  return acquire(lock, attempt + 1);
};

const holdsLock = async (lock: StateLock): Promise<boolean> => {
  const stats = await lstat(holderOf(lock)).catch(() => undefined);

  return stats?.isDirectory() === true;
};

const release = async (lock: StateLock): Promise<void> => {
  if (await holdsLock(lock)) await removeTree(lock.path).catch(() => undefined);
};

/** Runs a read, merge, and write of the project's state while holding its lock, never once the lock stays held past the wait, handing the write a folder Git never shows */
export const withStateLock = async <Result>(
  cwd: string,
  work: (state: LockedState) => Promise<Result>,
  timing: StateLockTiming = STATE_LOCK_TIMING
): Promise<Result> => {
  const folder = await engineFolderOf(cwd);
  const lock: StateLock = {
    path: join(folder, LOCK_NAME),
    claim: join(folder, CLAIM_NAME),
    token: randomBytes(TOKEN_BYTES).toString('hex'),
    timing,
    deadline: performance.now() + timing.waitMs,
  };

  await acquire(lock);

  try {
    await sweepClaim(lock);

    return await work({ cwd, scratch: holderOf(lock) });
  } finally {
    await release(lock);
  }
};
