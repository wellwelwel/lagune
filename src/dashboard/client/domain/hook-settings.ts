import type {
  CheckerName,
  CheckerOverride,
  CheckersConfig,
  IgnorePatternRead,
} from '@/types/checkers';
import type { CheckersRequest } from '@/types/dashboard/api';
import type {
  GitChoice,
  HookScope,
  HookSummary,
  ListChoice,
  ScopeChange,
  SettingShift,
} from '@/types/dashboard/client';
import type { ProjectCheckers } from '@/types/dashboard/dashboard';
import {
  CHECKERS,
  checkersRecord,
  DEFAULT_SETTINGS,
  ignoreListOf,
  MAX_IGNORE_ENTRIES,
  readIgnorePattern,
  settingsFor,
} from '../../../core/checker-rules';

export const HOOK_SCOPES: readonly HookScope[] = [undefined, ...CHECKERS];

export const GIT_LABELS: Record<GitChoice, string> = {
  shared: 'Inherit',
  skip: 'Yes',
  scan: 'No',
};

export const LIST_LABELS: Record<ListChoice, string> = {
  shared: 'Inherit',
  own: 'Custom',
};

const GIT_VALUE: Record<GitChoice, boolean | undefined> = {
  shared: undefined,
  skip: true,
  scan: false,
};

const isEmpty = (override: CheckerOverride): boolean =>
  Object.keys(override).length === 0;

export const configOf = ({ shared, own }: ProjectCheckers): CheckersConfig => ({
  shared,
  own: new Map(own.filter(([, override]) => !isEmpty(override))),
});

const sameList = (
  left: readonly string[] | undefined,
  right: readonly string[] | undefined
): boolean =>
  left === right ||
  (left !== undefined &&
    right !== undefined &&
    left.length === right.length &&
    left.every((pattern, index) => pattern === right[index]));

const sameOverride = (
  left: CheckerOverride | undefined,
  right: CheckerOverride | undefined
): boolean =>
  left?.gitignore === right?.gitignore && sameList(left?.ignore, right?.ignore);

export const sameConfig = (
  left: CheckersConfig,
  right: CheckersConfig
): boolean =>
  sameOverride(left.shared, right.shared) &&
  left.own.size === right.own.size &&
  [...left.own].every(([checker, override]) =>
    sameOverride(override, right.own.get(checker))
  );

const overrideOf = (
  gitignore: boolean | undefined,
  ignore: readonly string[] | undefined
): CheckerOverride => ({
  ...(gitignore === undefined ? {} : { gitignore }),
  ...(ignore === undefined ? {} : { ignore }),
});

const withOwn = (
  config: CheckersConfig,
  checker: CheckerName,
  override: CheckerOverride
): CheckersConfig => {
  const own = new Map(config.own);

  if (isEmpty(override)) own.delete(checker);
  else own.set(checker, override);

  return { ...config, own };
};

/** Sets what a scope does with Git-ignored paths, the shared default and a checker's choice to follow it both left unrecorded */
export const withGit = (
  config: CheckersConfig,
  checker: HookScope,
  choice: GitChoice
): CheckersConfig => {
  if (checker === undefined)
    return {
      ...config,
      shared: overrideOf(
        choice === 'scan' ? false : undefined,
        config.shared.ignore
      ),
    };

  return withOwn(
    config,
    checker,
    overrideOf(GIT_VALUE[choice], config.own.get(checker)?.ignore)
  );
};

/** Sets a scope's left-out paths, leaving the default empty shared list unrecorded */
export const withPaths = (
  config: CheckersConfig,
  checker: HookScope,
  ignore: readonly string[] | undefined
): CheckersConfig => {
  if (checker === undefined)
    return {
      ...config,
      shared: overrideOf(
        config.shared.gitignore,
        ignore?.length === 0 ? undefined : ignore
      ),
    };

  return withOwn(
    config,
    checker,
    overrideOf(config.own.get(checker)?.gitignore, ignore)
  );
};

/** Gives a checker a list of its own, starting as a copy of the shared one, or returns it to the shared list */
export const withListChoice = (
  config: CheckersConfig,
  checker: CheckerName,
  choice: ListChoice
): CheckersConfig =>
  withPaths(
    config,
    checker,
    choice === 'own' ? [...ignoreListOf(config, checker)] : undefined
  );

export const gitChoiceOf = (
  config: CheckersConfig,
  checker: HookScope
): GitChoice => {
  const gitignore =
    checker === undefined
      ? (config.shared.gitignore ?? DEFAULT_SETTINGS.gitignore)
      : config.own.get(checker)?.gitignore;

  if (gitignore === undefined) return 'shared';

  return gitignore ? 'skip' : 'scan';
};

export const listChoiceOf = (
  config: CheckersConfig,
  checker: CheckerName
): ListChoice =>
  config.own.get(checker)?.ignore === undefined ? 'shared' : 'own';

export const summaryOf = (
  config: CheckersConfig,
  checker: HookScope
): HookSummary => {
  if (checker === undefined)
    return {
      gitignore: config.shared.gitignore ?? DEFAULT_SETTINGS.gitignore,
      ignore: ignoreListOf(config, undefined),
      customGit: false,
      customList: false,
    };

  return {
    ...settingsFor(config, checker),
    customGit: gitChoiceOf(config, checker) !== 'shared',
    customList: listChoiceOf(config, checker) === 'own',
  };
};

/** Reads an entry typed into a list as a pattern the list can still take, or names why it cannot */
export const readNewPattern = (
  patterns: readonly string[],
  entry: string
): IgnorePatternRead => {
  const read = readIgnorePattern(entry);

  if ('problem' in read) return { problem: `It ${read.problem}.` };
  if (patterns.includes(read.pattern))
    return { problem: 'It is already ignored.' };
  if (patterns.length >= MAX_IGNORE_ENTRIES)
    return {
      problem: `The list already holds ${MAX_IGNORE_ENTRIES} paths, the most it takes.`,
    };

  return read;
};

/** Whether a pattern leaves out nearly every path, each of its folder names being only wildcards */
export const sweepsEverything = (pattern: string): boolean =>
  pattern
    .split('/')
    .every((segment) => [...segment].every((character) => character === '*'));

const shiftOf = <Choice extends string>(
  labels: Record<Choice, string>,
  from: Choice,
  to: Choice
): SettingShift | null =>
  from === to ? null : { from: labels[from], to: labels[to] };

/** What changed in each scope the user edited, leaving out a hook that only follows a change to the list it inherits */
export const scopeChanges = (
  before: CheckersConfig,
  after: CheckersConfig
): ScopeChange[] =>
  HOOK_SCOPES.flatMap((scope): ScopeChange[] => {
    const gitignore = shiftOf(
      GIT_LABELS,
      gitChoiceOf(before, scope),
      gitChoiceOf(after, scope)
    );
    const list =
      scope === undefined
        ? null
        : shiftOf(
            LIST_LABELS,
            listChoiceOf(before, scope),
            listChoiceOf(after, scope)
          );
    const ownsList =
      scope === undefined ||
      list !== null ||
      listChoiceOf(after, scope) === 'own';
    const was = summaryOf(before, scope).ignore;
    const now = summaryOf(after, scope).ignore;
    const added = ownsList ? now.filter((path) => !was.includes(path)) : [];
    const removed = ownsList ? was.filter((path) => !now.includes(path)) : [];
    const touched =
      gitignore !== null ||
      list !== null ||
      added.length > 0 ||
      removed.length > 0;

    return touched ? [{ scope, gitignore, list, added, removed }] : [];
  });

export const checkersPayload = (config: CheckersConfig): CheckersRequest => ({
  checkers: checkersRecord(config),
});
