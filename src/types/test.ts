export type HookRun = { stdout: string; stderr: string; code: number | null };

export type EngineRunOptions = { env?: NodeJS.ProcessEnv; input?: string };

export type FrontmatterSource = {
  relativePath: string;
  frontmatter: string;
};

export type HookCase = {
  label: string;
  hook: string;
  args: string[];
  verdict: string;
  code: number;
};

export type Frontmatter = {
  name?: string;
  description: string;
  'argument-hint'?: string;
  'user-invocable'?: boolean;
  'disable-model-invocation'?: boolean;
  metadata?: Record<string, unknown>;
};

export type SkillsLock = {
  skills: Record<string, unknown>;
};

export type SpecLimits = {
  nameChars: number;
  descriptionChars: number;
  tokens: number;
  lines: number;
};

export type SpecMeasurement = {
  relativePath: string;
  nameChars: number;
  descriptionChars: number;
  tokens: number;
  lines: number;
};

export type SpecLimitViolation = {
  limit: keyof SpecLimits;
  actual: number;
  max: number;
};

export type ConfigsSchema = {
  properties: { categories: { items: { enum: string[] } } };
};

export type PackedPackage = { files: { path: string }[] };

export type TrackedFile = { mode: string; path: string };

export type ExtraFile = { type: string; path: string; jsonpath?: string };

export type ReleaseConfig = {
  packages: Record<string, { 'extra-files'?: ExtraFile[] }>;
};

export type PluginManifest = {
  path: string;
  contents: Record<string, unknown> | undefined;
};

/** How an agent starts the engine: the command, its arguments, and the folder it starts from */
export type EngineServer = { command: unknown; args: string[]; cwd?: unknown };

/** The bundle a release publishes for one agent, and the server its agent starts from it */
export type PluginBundle = {
  plugin: string;
  agent: string;
  route: 'branch' | 'release archive';
  metadata: string[];
  declaration: string;
  server: EngineServer;
};

/** What a run returned, beside what it reported through `console.error` */
export type ReportedRun<Result> = {
  result: Result;
  reports: unknown[][];
};

export type ImageSize = { width: number; height: number };

export type SkillRegistration = {
  name: string;
  description: string;
  path: string;
};

export type PublishedText = { file: string; text: string };
