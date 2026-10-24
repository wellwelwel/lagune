export type HookRun = { stdout: string; stderr: string; code: number | null };

export type FrontmatterSource = {
  relativePath: string;
  frontmatter: string;
};

export type HookCase = {
  label: string;
  hook: string;
  args: string[];
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
