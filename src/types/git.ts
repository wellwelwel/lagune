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

export type GitTracking = 'tracked' | 'ignored' | 'unignored' | 'unknown';

export type GitScope = GitIgnores & {
  segments: readonly string[];
  ignored: boolean;
  budget: MatchBudget;
};

export type BoundedRead =
  | { status: 'absent' }
  | { status: 'unusable' }
  | { status: 'read'; content: Buffer };
