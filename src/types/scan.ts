import type { IgnoreList, MatchBudget } from './git.js';

export type LanguageId =
  | 'javascript'
  | 'python'
  | 'ruby'
  | 'go'
  | 'php'
  | 'rust'
  | 'java'
  | 'csharp'
  | 'c'
  | 'cpp'
  | 'kotlin'
  | 'swift'
  | 'scala'
  | 'dart'
  | 'powershell'
  | 'elixir'
  | 'objc'
  | 'r'
  | 'julia'
  | 'clojure'
  | 'crystal'
  | 'nim'
  | 'vlang'
  | 'dlang'
  | 'perl';

export type LanguageMap = Readonly<Record<string, LanguageId>>;

export type WalkFilter = {
  ignoredDirs: ReadonlySet<string>;
  ignoredDirPatterns: readonly RegExp[];
  accept: (relativePath: string) => boolean;
};

export type SkippedPaths = {
  git: string[];
  configs: string[];
};

export type SkippedCounts = {
  [Origin in keyof SkippedPaths]: number;
};

export type WalkResult = {
  files: string[];
  skipped: SkippedPaths;
};

export type ConfigIgnores = {
  lists: readonly IgnoreList[];
  budget: MatchBudget;
};

export type WalkContext = {
  scanRoot: string;
  displayRoot: string;
  filter: WalkFilter;
  configIgnores: ConfigIgnores | null;
};

export type ScanDetail = { file: string; detail: string };

export type ScanReport = {
  findings: ScanDetail[];
  review: ScanDetail[];
  advisory: ScanDetail[];
  skipped: SkippedCounts;
};

export type ReportHeadings = {
  sentinel: string;
  findings: string;
  review?: string;
  advisory?: string;
};

export type FileAnalysis = {
  findings: string[];
  review: string[];
  advisory: string[];
};

export type RuleSeverity = 'finding' | 'advisory';

export type SeverityDetail = {
  severity: RuleSeverity;
  detail: string;
};

export type CommentSpec = {
  line: readonly string[];
  block?: readonly [open: string, close: string];
};

export type CommentScan = { text: string; inBlock: boolean };

export type LineRule = { regex: RegExp; detail: string };

export type WindowRule = {
  call: RegExp;
  guard: RegExp;
  window: number;
  detail: string;
};

export type AnalyzedFile = {
  file: string;
  analysis: FileAnalysis;
};
