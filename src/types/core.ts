import type { Category } from './categories.js';
import type { CvssSeverity } from './cvss.js';

export type CliCommand =
  | 'catalog'
  | 'add'
  | 'remove'
  | 'list'
  | 'dashboard'
  | 'migrate'
  | 'init'
  | 'pull'
  | 'update';

export type ParsedCliArgs = {
  command: CliCommand | undefined;
  unknown: string | undefined;
  values: string[];
  categoriesRequested: boolean;
  findingsRequested: boolean;
  help: boolean;
  version: boolean;
  bare: boolean;
  port: number | undefined;
};

export type InstalledRoute = 'local' | 'frozen' | 'refused';

export type HookResult = {
  output: string;
  hasFinding: boolean;
};

export type HookReturn = string | HookResult;

export type HookHandler = (args: string[]) => Promise<HookReturn> | HookReturn;

export type HookName =
  | 'agent'
  | 'cors'
  | 'crypto'
  | 'cvss'
  | 'infra'
  | 'interpreter'
  | 'jwt'
  | 'network'
  | 'regex'
  | 'repair'
  | 'secrets'
  | 'track'
  | 'untrack'
  | 'validate';

export type TokenCount = {
  relativePath: string;
  tokens: number;
};

export type RemovalStatus = 'removed' | 'absent';

export type SelectOption = {
  label: string;
  keywords?: string;
  selected?: boolean;
  locked?: boolean;
};

export type SelectConfig = {
  title: string;
  hint: string;
  options: SelectOption[];
  maxVisible?: number;
  emptyLabel?: string;
  confirmLabel?: string;
  footer?: string;
};

export type ListTarget = 'findings' | 'categories';

export type FilteredOption = {
  option: SelectOption;
  index: number;
};

export type SelectRowRenderer = (
  entry: FilteredOption,
  isActive: boolean
) => string;

export type KeypressEvent = {
  name?: string;
  sequence?: string;
  ctrl?: boolean;
};

export type SelectCategoriesInput = {
  requested: string[];
  categories: Category[];
  locked: string[];
};

export type SelectCategoriesDeps = {
  isInteractive: () => boolean;
  promptForCategories: (
    categories: Category[],
    locked: string[]
  ) => Promise<string[]>;
};

export type MovedFile = {
  from: string;
  to: string;
};

export type GitignoreChange = 'removed' | 'updated' | 'unchanged';

export type MigrateSummary = {
  removed: string[];
  moved: MovedFile[];
  kept: string[];
  gitignore: GitignoreChange;
};

export type MigrateResult =
  { migrated: false } | ({ migrated: true } & MigrateSummary);

export type LegacyInstall = {
  files: string[];
  categories: string[] | undefined;
};

export type TrackingEntry = {
  name: string;
  paths: string[];
};

export type TrackingMap = {
  entries: TrackingEntry[];
};

export type ObservedEntry = {
  name: string;
  paths: string[];
};

export type EntryClassification = 'new' | 'moved' | 'unchanged';

export type ClassifiedEntry = {
  name: string;
  classification: EntryClassification;
};

export type UnresolvedReason = 'orphan' | 'renamed-candidate';

export type UnresolvedEntry = {
  name: string;
  paths: string[];
  reason: UnresolvedReason;
};

export type ReconcileResult = {
  updatedMap: TrackingMap;
  classifications: ClassifiedEntry[];
  unresolved: UnresolvedEntry[];
};

export type TrackResult = {
  updatedMap: TrackingMap;
  classifications: ClassifiedEntry[];
};

export type ItemMatch = {
  entry: TrackingEntry;
  classification: ClassifiedEntry;
};

export type FoldState = {
  map: TrackingMap;
  classifications: ClassifiedEntry[];
};

export type RemovalResult = {
  updatedMap: TrackingMap;
  removed: string[];
  notFound: string[];
};

export type Block = {
  name: string;
  body: string;
};

export type AppliedEntry = {
  name: string;
  contribution: string;
};

export type MarkdownLine = {
  text: string;
  code: boolean;
};

export type TextSpan = {
  from: number;
  to: number;
};

export type SectionRemoval = {
  content: string;
  removed: boolean;
};

export type ProseRemovalStatus = 'edited' | 'removed' | 'unchanged' | 'absent';

export type DanglingMention = {
  name: string;
  line: number;
  text: string;
};

export type ProseRemoval = {
  file: string;
  status: ProseRemovalStatus;
  removed: string[];
  dangling: DanglingMention[];
};

export type HistoryEntry = {
  name: string;
  classification: string;
  category: string;
  whatItIs: string;
  closed: string;
};

export type HistoryAppend = {
  file: string;
  recorded: string[];
};

export type UntrackSummary = {
  removed: string[];
  notFound: string[];
  prose: ProseRemoval[];
  history: HistoryAppend;
};

export type ValidateTarget = 'charter' | 'detect' | 'plan' | 'harden';

export type PlanRatingCheck = {
  problem: string | null;
  severity: CvssSeverity | null;
};

export type MemoryContents = Record<ValidateTarget, string | null>;

export type ValidationStatus = 'valid' | 'invalid' | 'absent';

export type ArtifactValidation = {
  target: ValidateTarget;
  file: string;
  status: ValidationStatus;
  problems: string[];
  warnings: string[];
};

export type ValidateSummary = {
  results: ArtifactValidation[];
  configsWarnings: string[];
};
