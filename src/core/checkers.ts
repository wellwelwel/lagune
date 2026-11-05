import type {
  CheckerName,
  CheckerOverride,
  CheckersConfig,
  CheckerSettings,
} from '../types/checkers.js';
import {
  CHECKERS,
  DEFAULT_SETTINGS,
  MAX_IGNORE_ENTRIES,
  readIgnorePattern,
  settingsFor,
} from './checker-rules.js';
import {
  allOf,
  deepFreeze,
  isRecord,
  isStringArray,
  ownValue,
} from './collections.js';
import { CONFIGS_FILE, readConfigs } from './configs.js';
import { quotedExcerpt } from './errors.js';
import { stateFileRefusal } from './state-file.js';

const SETTING_KEYS: readonly string[] = deepFreeze(
  Object.keys(DEFAULT_SETTINGS)
);

const CHECKERS_KEYS: readonly string[] = deepFreeze([
  ...SETTING_KEYS,
  ...CHECKERS,
]);

const refuse = (problem: string): never => {
  throw stateFileRefusal(CONFIGS_FILE, problem);
};

/** The error that stops a scan whose ignore patterns would take longer to match than any scan should */
export const costlyPatterns = (): Error =>
  new Error(
    `${CONFIGS_FILE} ignores paths through patterns too costly to match: simplify them, then run this again.`
  );

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

export const checkerSettings = async (
  cwd: string,
  checker: CheckerName
): Promise<CheckerSettings> =>
  settingsFor(checkersConfigOf(await readConfigs(cwd)), checker);
