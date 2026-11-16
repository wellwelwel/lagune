import type { FileHandle } from 'node:fs/promises';
import type { BoundedCache } from './core.js';

export type CharacterRange = readonly [low: number, high: number];

export type PatternToken =
  | { kind: 'star' }
  | { kind: 'any' }
  | { kind: 'literal'; code: number }
  | { kind: 'class'; negated: boolean; ranges: readonly CharacterRange[] };

export type SegmentPattern = readonly PatternToken[];

export type PathToken =
  { kind: 'globstar' } | { kind: 'segment'; pattern: SegmentPattern };

export type IgnoreRule = {
  negated: boolean;
  directoryOnly: boolean;
  anchored: boolean;
  tokens: readonly PathToken[];
};

export type IgnoreList = {
  base: readonly string[];
  rules: readonly IgnoreRule[];
};

export type TrackedIndex = {
  files: ReadonlySet<string>;
  directories: ReadonlySet<string>;
};

export type GitIgnores = {
  tracked: TrackedIndex;
  lists: readonly IgnoreList[];
};

export type MatchBudget = { remaining: number };

export type GitTracking = 'tracked' | 'ignored' | 'unignored';

export type GitEntry = 'absent' | 'pointer' | 'folder' | 'other';

export type GitScope = GitIgnores & {
  segments: readonly string[];
  ignored: boolean;
  budget: MatchBudget;
};

export type BoundedRead =
  | { status: 'absent' }
  | { status: 'unusable' }
  | { status: 'read'; content: Buffer };

export type RepositoryFormat = { hashLength: number; reftable: boolean };

export type GitObjectType = 'commit' | 'tree' | 'blob' | 'tag';

export type GitObject = { type: GitObjectType; content: Buffer };

export type UnreadCause = 'missing' | 'malformed' | 'oversized' | 'deep';

export type UnreadObject = { cause: UnreadCause; path: string | null };

export type UnreadObjects = { count: number; paths: string[] };

export type ObjectRead =
  | { status: 'read'; object: GitObject }
  | { status: UnreadCause }
  | { status: 'stopped' };

export type HistoryStop = 'commits' | 'objects' | 'bytes' | 'time';

export type HistoryLimits = {
  commits: number;
  objects: number;
  bytes: number;
  objectBytes: number;
  deltaDepth: number;
  milliseconds: number;
};

export type HistoryBudget = {
  limits: HistoryLimits;
  deadline: number;
  objects: number;
  bytes: number;
  stop: HistoryStop | null;
};

export type PackIndex = {
  buffer: Buffer;
  hashLength: number;
  offsets: number;
  largeOffsets: number;
  largeCount: number;
};

export type PackFile = {
  id: number;
  handle: FileHandle;
  dataEnd: number;
  index: PackIndex;
};

export type PackLocation = { pack: PackFile; offset: number };

export type PackedHeader =
  | { kind: 'whole'; type: GitObjectType; size: number; data: number }
  | { kind: 'offset-delta'; size: number; data: number; base: number }
  | { kind: 'ref-delta'; size: number; data: number; base: string };

export type PackedDelta = { location: PackLocation; header: PackedHeader };

export type DeltaFailure = 'malformed' | 'oversized';

export type ObjectStore = {
  directory: string;
  hashLength: number;
  packs: readonly PackFile[];
  unreadPacks: number;
  looseFolders: Map<string, boolean>;
  bases: BoundedCache<GitObject>;
  budget: HistoryBudget;
};

export type RefTips = {
  tips: Map<string, string>;
  stash: string[];
  unread: string[];
  truncated: boolean;
};

export type RefReading = {
  objectId: RegExp;
  refs: Map<string, string[]>;
  unread: string[];
  seen: number;
  truncated: boolean;
};

export type TreeEntryKind = 'tree' | 'file' | 'link' | 'submodule';

export type TreeEntry = { kind: TreeEntryKind; name: string; id: string };

export type ParsedCommit = {
  id: string;
  tree: string;
  parents: readonly string[];
  time: number;
};

export type HistoryVisitor = {
  entersFolder: (segments: readonly string[]) => boolean;
  readsFile: (segments: readonly string[]) => boolean;
  file: (path: string, content: Buffer, commit: string, blob: string) => void;
};

export type HistoryResume = { commit: string; reached: boolean };

export type ShallowBoundary = {
  isShallow: boolean;
  commits: ReadonlySet<string>;
};

export type HistoryState = {
  store: ObjectStore;
  visitor: HistoryVisitor;
  shallow: ShallowBoundary;
  commits: Set<string>;
  trees: Set<string>;
  files: Set<string>;
  unread: Map<string, UnreadObject>;
  submodules: Set<string>;
  stashed: Set<string>;
  queue: ParsedCommit[];
  walked: number;
  last: ParsedCommit | null;
  unfollowedRefs: string[];
  resume: HistoryResume | null;
};

export type HistoryBarrier = Exclude<GitEntry, 'folder'> | 'reftable';

export type HistoryWalk = {
  commits: number;
  last: ParsedCommit | null;
  stop: HistoryStop | null;
  limits: HistoryLimits;
  unread: Readonly<Record<UnreadCause, UnreadObjects>>;
  packs: number;
  refs: string[];
  refsTruncated: boolean;
  submodules: string[];
  stashed: string[];
  resume: HistoryResume | null;
  alternates: boolean;
  shallow: boolean;
};

export type HistoryRead =
  | { kind: 'barred'; barrier: HistoryBarrier }
  | { kind: 'walked'; walk: HistoryWalk };
