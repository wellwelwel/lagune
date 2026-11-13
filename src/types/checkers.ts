import type { IgnoreRule } from './git.js';

export type CheckerName =
  | 'agent'
  | 'cors'
  | 'crypto'
  | 'dependency'
  | 'infra'
  | 'interpreter'
  | 'jwt'
  | 'regex'
  | 'secrets';

export type CheckerSettings = {
  gitignore: boolean;
  ignore: readonly string[];
};

export type CheckerOverride = Partial<CheckerSettings>;

export type CheckersConfig = {
  shared: CheckerOverride;
  own: ReadonlyMap<CheckerName, CheckerOverride>;
};

export type IgnorePatternRead =
  { pattern: string; rule: IgnoreRule } | { problem: string };
