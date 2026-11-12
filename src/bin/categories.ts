import type { ConfigsAction, SelectCategoriesInput } from '../types/core.js';
import { stdout } from 'node:process';
import {
  assertKnownCategories,
  CATEGORIES,
  findCategory,
} from '../categories/categories.js';
import {
  readProjectCategories,
  recordCategories,
  usedCategories,
} from '../categories/project.js';
import {
  banner,
  categoriesRecorded,
  categoriesUsage,
  categoryList,
  nothingSelected,
} from '../cli/messages.js';
import { selectCategories } from '../cli/select-categories.js';
import { changeList } from '../core/collections.js';

const print = (lines: string[]): void => {
  stdout.write(`${lines.join('\n')}\n`);
};

const choices = (
  action: ConfigsAction,
  used: string[]
): Omit<SelectCategoriesInput, 'requested'> =>
  action === 'add'
    ? { categories: CATEGORIES, locked: used }
    : {
        categories: used
          .map((key) => findCategory(CATEGORIES, key))
          .filter((category) => category !== undefined),
        locked: [],
      };

/** Records the categories the project uses, starting from the default while none is recorded */
export const runCategoryChange = async (
  action: ConfigsAction,
  requested: string[],
  cwd: string
): Promise<void> => {
  const used = usedCategories(await readProjectCategories(cwd));
  const selected = await selectCategories({
    requested,
    ...choices(action, used),
  });

  if (selected === undefined) throw new Error(categoriesUsage(action));

  assertKnownCategories(CATEGORIES, selected);

  if (selected.length === 0) return print([banner(), '', nothingSelected()]);

  const change = await recordCategories(cwd, (current) =>
    changeList(action, current, selected)
  );

  print([banner(), '', categoriesRecorded(action, change)]);
};

export const categoriesReport = async (cwd: string): Promise<string> => {
  const recorded = await readProjectCategories(cwd);

  return categoryList(
    CATEGORIES,
    usedCategories(recorded),
    recorded !== undefined
  );
};
