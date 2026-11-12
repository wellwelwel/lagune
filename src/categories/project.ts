import type { ListChange } from '../types/core.js';
import { isStringArray } from '../core/collections.js';
import { CONFIGS_FILE, readConfigs, recordConfigs } from '../core/configs.js';
import { stateFileRefusal } from '../core/state-file.js';

const DEFAULT_CATEGORIES = ['owasp'];

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

/** Records the categories a change derives from the ones the project uses, read and written under the state lock */
export const recordCategories = <Change extends Pick<ListChange, 'values'>>(
  cwd: string,
  change: (used: string[]) => Change
): Promise<Change> =>
  recordConfigs(cwd, (configs) => {
    const result = change(usedCategories(recordedIn(configs)));

    return { fields: { categories: result.values }, result };
  });
