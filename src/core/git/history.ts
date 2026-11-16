import type {
  HistoryBarrier,
  HistoryLimits,
  HistoryRead,
  HistoryResume,
  HistoryState,
  HistoryVisitor,
  ParsedCommit,
  RefTips,
  ShallowBoundary,
  TreeEntry,
  UnreadCause,
  UnreadObject,
  UnreadObjects,
} from '../../types/git.js';
import { lstat } from 'node:fs/promises';
import { join } from 'node:path';
import { deepFreeze } from '../collections.js';
import { popNewest, pushCommit } from './commit-queue.js';
import {
  objectIdPattern,
  parseCommit,
  parseTree,
  tagTargetOf,
} from './object-content.js';
import {
  budgetOf,
  closeObjectStore,
  openObjectStore,
  readObject,
} from './objects.js';
import { refTipsOf, STASH_REF } from './refs.js';
import { gitEntryOf, readBounded, repositoryFormatOf } from './repository.js';

const MAX_TAG_DEPTH = 16;
const MAX_TREE_DEPTH = 4096;
const MAX_SHALLOW_BYTES = 16 * 1024 * 1024;

const NOT_SHALLOW: ShallowBoundary = deepFreeze({
  isShallow: false,
  commits: new Set<string>(),
});

const barred = (barrier: HistoryBarrier): HistoryRead => ({
  kind: 'barred',
  barrier,
});

const markUnread = (
  state: HistoryState,
  id: string,
  cause: UnreadCause,
  path: string | null = null
): null => {
  state.unread.set(id, { cause, path });

  return null;
};

const unfollowed = (
  state: HistoryState,
  id: string,
  ref: string | null
): null => {
  if (ref === null) return markUnread(state, id, 'malformed');

  state.unfollowedRefs.push(ref);

  return null;
};

/** The commit an id names, peeling the tags the ref that names it points through, or none when it was already queued or cannot be read as one */
const commitAt = async (
  state: HistoryState,
  id: string,
  ref: string | null
): Promise<ParsedCommit | null> => {
  const { hashLength } = state.store;
  let current = id;

  for (let depth = 0; depth <= MAX_TAG_DEPTH; depth++) {
    if (state.commits.has(current)) return null;

    const read = await readObject(state.store, current);

    if (read.status === 'stopped') return null;
    if (read.status !== 'read') return markUnread(state, current, read.status);

    const { type, content } = read.object;

    if (type === 'commit') {
      state.commits.add(current);

      return (
        parseCommit(current, content, hashLength) ??
        markUnread(state, current, 'malformed')
      );
    }

    const target =
      ref !== null && type === 'tag' ? tagTargetOf(content, hashLength) : null;

    if (target === null) return unfollowed(state, current, ref);

    current = target;
  }

  return unfollowed(state, current, ref);
};

const folderPathOf = (segments: readonly string[]): string | null =>
  segments.length === 0 ? null : `${segments.join('/')}/`;

const treeEntriesOf = async (
  state: HistoryState,
  id: string,
  segments: readonly string[]
): Promise<TreeEntry[] | null> => {
  const read = await readObject(state.store, id);

  if (read.status === 'stopped') return null;
  if (read.status !== 'read')
    return markUnread(state, id, read.status, folderPathOf(segments));
  if (read.object.type !== 'tree')
    return markUnread(state, id, 'malformed', folderPathOf(segments));

  return (
    parseTree(read.object.content, state.store.hashLength) ??
    markUnread(state, id, 'malformed', folderPathOf(segments))
  );
};

const readFileAt = async (
  state: HistoryState,
  commit: ParsedCommit,
  id: string,
  segments: readonly string[]
): Promise<void> => {
  const path = segments.join('/');
  const key = id + path;

  if (state.files.has(key)) return;

  state.files.add(key);

  const read = await readObject(state.store, id);

  if (read.status === 'stopped') return;
  if (read.status !== 'read') {
    markUnread(state, id, read.status, path);
    return;
  }
  if (read.object.type !== 'blob') {
    markUnread(state, id, 'malformed', path);
    return;
  }

  state.visitor.file(path, read.object.content, commit.id, id);
};

/** Walks a tree once for each path it sits at */
const walkTree = async (
  state: HistoryState,
  commit: ParsedCommit,
  id: string,
  segments: readonly string[]
): Promise<void> => {
  const key = id + segments.join('/');

  if (state.trees.has(key)) return;

  state.trees.add(key);

  if (segments.length > MAX_TREE_DEPTH) {
    markUnread(state, id, 'malformed', folderPathOf(segments));
    return;
  }

  const entries = await treeEntriesOf(state, id, segments);

  if (entries === null) return;

  for (const entry of entries) {
    if (state.store.budget.stop !== null) return;

    const inner = [...segments, entry.name];

    if (entry.kind === 'tree' && state.visitor.entersFolder(inner))
      await walkTree(state, commit, entry.id, inner);
    if (entry.kind === 'submodule') state.submodules.add(inner.join('/'));
    if (entry.kind === 'file' && state.visitor.readsFile(inner))
      await readFileAt(state, commit, entry.id, inner);
  }
};

const queueCommit = async (
  state: HistoryState,
  id: string,
  ref: string | null
): Promise<void> => {
  const commit = await commitAt(state, id, ref);

  if (commit !== null) pushCommit(state.queue, commit);
};

const queueTips = async (
  state: HistoryState,
  tips: ReadonlyMap<string, string>
): Promise<void> => {
  for (const [id, ref] of tips) {
    if (state.store.budget.stop !== null) return;

    await queueCommit(state, id, ref);
  }
};

const queueParents = async (
  state: HistoryState,
  ids: readonly string[]
): Promise<void> => {
  for (const id of ids) {
    if (state.store.budget.stop !== null) return;

    await queueCommit(state, id, null);
  }
};

/** The commit a continued walk has yet to reach, while it passes over what the run before it read */
const pendingResume = ({ resume }: HistoryState): HistoryResume | null =>
  resume === null || resume.reached ? null : resume;

/** Whether a continued walk passes over a commit the run before already read, noting when it meets the commit that run named */
const passesOver = (state: HistoryState, commit: ParsedCommit): boolean => {
  const pending = pendingResume(state);

  if (pending === null) return false;

  pending.reached = commit.id === pending.commit;

  return true;
};

/** Reads the files of a commit, or stops the walk at its commit limit, and tells whether it read them all */
const readCommit = async (
  state: HistoryState,
  commit: ParsedCommit
): Promise<boolean> => {
  const { budget } = state.store;

  if (state.walked >= budget.limits.commits) {
    budget.stop = 'commits';
    return false;
  }

  await walkTree(state, commit, commit.tree, []);

  if (budget.stop !== null) return false;

  state.walked++;

  return true;
};

/** Whether the walk goes on to a commit's parents */
const takesCommit = async (
  state: HistoryState,
  commit: ParsedCommit
): Promise<boolean> => {
  if (passesOver(state, commit)) return true;
  if (!(await readCommit(state, commit))) return false;

  state.last = commit;

  return true;
};

/** Reads the queued commits newest first, each tree once per path, until the queue empties or a bound stops it */
const walkCommits = async (state: HistoryState): Promise<void> => {
  const { budget } = state.store;

  while (state.queue.length > 0 && budget.stop === null) {
    const commit = popNewest(state.queue);

    if (commit === undefined) return;
    if (!(await takesCommit(state, commit))) return;

    if (!state.shallow.commits.has(commit.id))
      await queueParents(state, commit.parents);
  }
};

const readStashed = async (
  state: HistoryState,
  commit: ParsedCommit | null
): Promise<void> => {
  if (commit === null || state.store.budget.stop !== null) return;
  if (pendingResume(state) !== null) return;

  if (await readCommit(state, commit)) state.stashed.add(commit.id);
};

/** Reads the commits git stash made last, after the history the stash was taken from: a file a branch also holds belongs to the branch's commit */
const walkStash = async (state: HistoryState, id: string): Promise<void> => {
  const stash = await commitAt(state, id, STASH_REF);

  if (stash === null) return;

  const [base, ...made] = stash.parents;

  if (base !== undefined) await queueCommit(state, base, null);

  await walkCommits(state);
  await readStashed(state, stash);

  for (const parent of made)
    await readStashed(state, await commitAt(state, parent, null));
};

const shallowBoundaryOf = async (
  gitDirectory: string,
  hashLength: number
): Promise<ShallowBoundary> => {
  const read = await readBounded(
    join(gitDirectory, 'shallow'),
    MAX_SHALLOW_BYTES,
    false
  );

  if (read.status === 'absent') return NOT_SHALLOW;

  const objectId = objectIdPattern(hashLength);
  const commits =
    read.status === 'read'
      ? read.content
          .toString('utf8')
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => objectId.test(line))
      : [];

  return { isShallow: true, commits: new Set(commits) };
};

const hasEntry = async (path: string): Promise<boolean> => {
  try {
    await lstat(path);
    return true;
  } catch {
    return false;
  }
};

const unreadBy = (
  objects: readonly UnreadObject[],
  cause: UnreadCause
): UnreadObjects => {
  const caused = objects.filter((object) => object.cause === cause);
  const paths = caused.flatMap(({ path }) => (path === null ? [] : [path]));

  return { count: caused.length, paths: [...new Set(paths)] };
};

const unreadObjects = (
  unread: ReadonlyMap<string, UnreadObject>
): Record<UnreadCause, UnreadObjects> => {
  const objects = [...unread.values()];

  return {
    missing: unreadBy(objects, 'missing'),
    malformed: unreadBy(objects, 'malformed'),
    oversized: unreadBy(objects, 'oversized'),
    deep: unreadBy(objects, 'deep'),
  };
};

const walkedRead = (
  state: HistoryState,
  refs: RefTips,
  alternates: boolean
): HistoryRead => ({
  kind: 'walked',
  walk: {
    commits: state.walked,
    last: state.last,
    stop: state.store.budget.stop,
    limits: state.store.budget.limits,
    unread: unreadObjects(state.unread),
    packs: state.store.unreadPacks,
    refs: [...refs.unread, ...state.unfollowedRefs],
    refsTruncated: refs.truncated,
    submodules: [...state.submodules],
    stashed: [...state.stashed],
    resume: state.resume,
    alternates,
    shallow: state.shallow.isShallow,
  },
});

/** Walks every commit the repository's refs reach, newest first and what only the stash holds last, handing the visitor each file it accepts once per version and path, and reports how much of the history it read. A walk that continues another passes over every commit up to the one that run named */
export const walkHistory = async (
  root: string,
  limits: HistoryLimits,
  visitor: HistoryVisitor,
  before: string | null
): Promise<HistoryRead> => {
  const entry = await gitEntryOf(root);

  if (entry !== 'folder') return barred(entry);

  const gitDirectory = join(root, '.git');
  const { hashLength, reftable } = await repositoryFormatOf(gitDirectory);

  if (reftable) return barred('reftable');

  const store = await openObjectStore(
    gitDirectory,
    hashLength,
    budgetOf(limits)
  );

  if (store === null) return barred('other');

  try {
    const [refs, shallow, alternates] = await Promise.all([
      refTipsOf(gitDirectory, hashLength),
      shallowBoundaryOf(gitDirectory, hashLength),
      hasEntry(join(store.directory, 'info', 'alternates')),
    ]);
    const state: HistoryState = {
      store,
      visitor,
      shallow,
      commits: new Set(),
      trees: new Set(),
      files: new Set(),
      unread: new Map(),
      submodules: new Set(),
      stashed: new Set(),
      queue: [],
      walked: 0,
      last: null,
      unfollowedRefs: [],
      resume: before === null ? null : { commit: before, reached: false },
    };

    await queueTips(state, refs.tips);
    await walkCommits(state);

    for (const id of refs.stash) await walkStash(state, id);

    return walkedRead(state, refs, alternates);
  } finally {
    await closeObjectStore(store);
  }
};
