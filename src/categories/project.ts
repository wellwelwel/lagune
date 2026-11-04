import { isStringArray } from '../core/collections.js';
import { CONFIGS_FILE, readConfigs, recordConfigs } from '../core/configs.js';
import { stateFileRefusal } from '../core/state-file.js';

export const DEFAULT_CATEGORIES = ['owasp'];

const recordedIn = (configs: Record<string, unknown>): string[] | undefined => {
  if (configs.categories === undefined) return undefined;
  if (!isStringArray(configs.categories))
    throw stateFileRefusal(
      CONFIGS_FILE,
      'records categories that are not a list of names'
    );

  return [...configs.categories];
};

/** Reads the categories the project recorded, none while it records none, refusing a file it cannot trust */
export const readProjectCategories = async (
  cwd: string
): Promise<string[] | undefined> => recordedIn(await readConfigs(cwd));

export const usedCategories = (recorded: string[] | undefined): string[] =>
  recorded ?? DEFAULT_CATEGORIES;

export const recordCategories = (
  cwd: string,
  categories: string[]
): Promise<void> => recordConfigs(cwd, { categories });
