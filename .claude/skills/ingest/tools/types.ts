export type EntryKind = 'text' | 'binary' | 'empty' | 'symlink';

export type Entry = {
  path: string;
  kind: EntryKind;
  target: string | null;
  lines: string[];
  characters: number;
  noise: boolean;
};

export type Digest = {
  file: string;
  root: string;
  bytes: number;
  entries: Entry[];
  byPath: Map<string, Entry>;
};

export type Probe = { file: string; root: string | null; bytes: number };

export type Scope = {
  under: string[];
  extensions: string[];
  name: string | null;
  noise: boolean;
};

export type Options = {
  scope: Scope;
  terms: string[];
  patterns: string[];
  caseSensitive: boolean;
  context: number;
  limit: number | null;
  perFile: number;
  filesOnly: boolean;
  paths: string[];
  at: string[];
  lines: string | null;
  depth: number;
  sort: 'path' | 'size';
  out: string | null;
  synthesis: string | null;
};

export type Command = (
  digests: Digest[],
  options: Options
) => Promise<string[]>;

export type Range = { start: number; end: number | null };

export type Anchor = { path: string; range: Range };

export type CitedAnchor = { text: string; anchor: Anchor | null };

export type Target = { digest: Digest; entry: Entry; range: Range | null };

export type Stats = { files: number; characters: number };

export type LineTest = (line: string) => boolean;

export type Match = { entry: Entry; line: number };

export type PatternRequest = {
  sources: string[];
  flags: string;
  texts: string[];
};

export type RepetitionScan = {
  output: string;
  escaped: boolean;
  inClass: boolean;
  skip: number;
};

export type OutlineRule = { extensions: string[]; pattern: RegExp };

export type WriteOutcome = { entry: Entry; problem: string | null };
