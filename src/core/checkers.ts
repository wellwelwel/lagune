import type {
  CheckerName,
  CheckerOverride,
  CheckersConfig,
  CheckerSettings,
  IgnorePatternRead,
} from '../types/checkers.js';
import { win32 } from 'node:path';
import {
  allOf,
  deepFreeze,
  isRecord,
  isStringArray,
  ownValue,
} from './collections.js';
import { CONFIGS_FILE, readConfigs } from './configs.js';
import { quotedExcerpt } from './errors.js';
import { rootPatternOf } from './git/pattern.js';
import { stateFileRefusal } from './state-file.js';

export const CHECKERS: readonly CheckerName[] = deepFreeze([
  'agent',
  'cors',
  'crypto',
  'infra',
  'interpreter',
  'jwt',
  'regex',
  'secrets',
]);

export const DEFAULT_SETTINGS: CheckerSettings = deepFreeze({
  gitignore: true,
  ignore: [],
});

const SETTING_KEYS: readonly string[] = deepFreeze(
  Object.keys(DEFAULT_SETTINGS)
);

const CHECKERS_KEYS: readonly string[] = deepFreeze([
  ...SETTING_KEYS,
  ...CHECKERS,
]);

export const MAX_IGNORE_ENTRIES = 1000;

const MAX_PATTERN_LENGTH = 1024;

export const isCheckerName = (value: unknown): value is CheckerName =>
  CHECKERS.some((name) => name === value);

const refuse = (problem: string): never => {
  throw stateFileRefusal(CONFIGS_FILE, problem);
};

/** The error that stops a scan whose ignore patterns would take longer to match than any scan should */
export const costlyPatterns = (): Error =>
  new Error(
    `${CONFIGS_FILE} ignores paths through patterns too costly to match: simplify them, then run this again.`
  );

const hasDrive = (entry: string): boolean => /^[A-Za-z]:/.test(entry);

const hasControlCharacter = (entry: string): boolean =>
  /[\u0000-\u001f\u007f]/.test(entry);

const segmentsOf = (entry: string): string[] =>
  entry
    .replaceAll('\\', '/')
    .split('/')
    .filter((segment) => segment !== '' && segment !== '.');

const shapeProblem = (entry: string): string | undefined => {
  if (entry.length > MAX_PATTERN_LENGTH)
    return `is longer than ${MAX_PATTERN_LENGTH} characters`;
  if (hasControlCharacter(entry)) return 'holds a control character';
  if (entry.trim() !== entry) return 'starts or ends with a space';
  if (entry.startsWith('!'))
    return "starts with !, but a checker's own list, not a pattern, is what takes paths back";
  if (win32.isAbsolute(entry) || hasDrive(entry))
    return 'is absolute instead of starting at the project root';

  return undefined;
};

/** Reads an ignore entry as a path or glob pattern from the project root, or names the problem that keeps it from being one */
export const readIgnorePattern = (entry: string): IgnorePatternRead => {
  const problem = shapeProblem(entry);

  if (problem !== undefined) return { problem };

  const segments = segmentsOf(entry);

  if (segments.length === 0)
    return { problem: 'names no path inside the project' };
  if (segments.includes('..')) return { problem: 'climbs out of the project' };

  const rule = rootPatternOf(segments);

  return rule === null
    ? { problem: 'opens a bracket the checkers cannot read' }
    : { pattern: segments.join('/'), rule };
};

const ignoredPathsOf = (value: unknown, field: string): string[] => {
  if (!isStringArray(value))
    return refuse(
      `sets ${field} to something other than a list of paths or patterns`
    );
  if (value.length > MAX_IGNORE_ENTRIES)
    return refuse(
      `lists more than ${MAX_IGNORE_ENTRIES} paths or patterns in ${field}`
    );

  const patterns = value.map((entry) => {
    const read = readIgnorePattern(entry);

    return 'problem' in read
      ? refuse(
          `lists ${quotedExcerpt(entry)} in ${field}, which ${read.problem}`
        )
      : read.pattern;
  });

  return [...new Set(patterns)];
};

const overrideOf = (
  value: unknown,
  field: string,
  keys: readonly string[]
): CheckerOverride => {
  if (!isRecord(value))
    return refuse(`sets ${field} to something other than an object`);

  const unknown = Object.keys(value).find((key) => !keys.includes(key));

  if (unknown !== undefined)
    return refuse(
      `sets ${quotedExcerpt(unknown)} under ${field}, which takes only ${allOf(keys)}`
    );

  const gitignore = ownValue(value, 'gitignore');
  const ignore = ownValue(value, 'ignore');

  if (gitignore !== undefined && typeof gitignore !== 'boolean')
    return refuse(
      `sets ${field}.gitignore to something other than true or false`
    );

  return {
    ...(gitignore === undefined ? {} : { gitignore }),
    ...(ignore === undefined
      ? {}
      : { ignore: ignoredPathsOf(ignore, `${field}.ignore`) }),
  };
};

/** The checkers block of the project's configs, refusing any key, value, or path it cannot trust */
export const checkersConfigOf = (
  configs: Record<string, unknown>
): CheckersConfig => {
  const value = ownValue(configs, 'checkers');

  if (value === undefined) return { shared: {}, own: new Map() };
  if (!isRecord(value))
    return refuse('sets checkers to something other than an object');

  const shared = overrideOf(value, 'checkers', CHECKERS_KEYS);
  const own = CHECKERS.flatMap((checker): [CheckerName, CheckerOverride][] => {
    const setting = ownValue(value, checker);

    return setting === undefined
      ? []
      : [[checker, overrideOf(setting, `checkers.${checker}`, SETTING_KEYS)]];
  });

  return { shared, own: new Map(own) };
};

/** What a checker leaves out, its own setting replacing the shared one key by key */
const settingsFor = (
  { shared, own }: CheckersConfig,
  checker: CheckerName
): CheckerSettings => ({
  gitignore:
    own.get(checker)?.gitignore ??
    shared.gitignore ??
    DEFAULT_SETTINGS.gitignore,
  ignore: own.get(checker)?.ignore ?? shared.ignore ?? DEFAULT_SETTINGS.ignore,
});

export const checkerSettings = async (
  cwd: string,
  checker: CheckerName
): Promise<CheckerSettings> =>
  settingsFor(checkersConfigOf(await readConfigs(cwd)), checker);

/** The ignore list a change starts from: the checker's own, or the shared one it would otherwise follow */
export const ignoreListOf = (
  config: CheckersConfig,
  checker: CheckerName | undefined
): readonly string[] =>
  checker === undefined
    ? (config.shared.ignore ?? DEFAULT_SETTINGS.ignore)
    : settingsFor(config, checker).ignore;

export const withIgnoreList = (
  config: CheckersConfig,
  checker: CheckerName | undefined,
  ignore: string[]
): CheckersConfig =>
  checker === undefined
    ? { ...config, shared: { ...config.shared, ignore } }
    : {
        ...config,
        own: new Map([
          ...config.own,
          [checker, { ...config.own.get(checker), ignore }],
        ]),
      };

/** The checkers that keep an ignore list of their own instead of the shared one */
export const checkersWithOwnList = ({ own }: CheckersConfig): CheckerName[] =>
  CHECKERS.filter((checker) => own.get(checker)?.ignore !== undefined);

/** The checkers block as the configs file records it */
export const checkersRecord = ({
  shared,
  own,
}: CheckersConfig): Record<string, unknown> => ({
  ...shared,
  ...Object.fromEntries(own),
});
