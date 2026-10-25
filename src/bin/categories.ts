import type { CategoryAction, CategoryChange } from '../types/catalog.js';
import { stdout } from 'node:process';
import {
  addCategories,
  assertKnownCategories,
  findCategory,
  removeCategories,
} from '../catalog/catalog.js';
import { CATEGORIES } from '../catalog/categories.js';
import {
  readProjectCatalog,
  recordCategories,
  usedCategories,
} from '../catalog/project.js';
import {
  banner,
  categoriesRecorded,
  categoriesUsage,
  categoryList,
  nothingSelected,
} from '../cli/messages.js';
import { selectCategories } from '../cli/select-categories.js';

const CHANGES: Record<
  CategoryAction,
  (current: string[], requested: string[]) => CategoryChange
> = {
  add: addCategories,
  remove: removeCategories,
};

const print = (lines: string[]): void => {
  stdout.write(`${lines.join('\n')}\n`);
};

const choices = (action: CategoryAction, used: string[]) =>
  action === 'add'
    ? { categories: CATEGORIES, locked: used }
    : {
        categories: used
          .map((key) => findCategory(CATEGORIES, key))
          .filter((category) => category !== undefined),
        locked: [],
      };

/** Records the categories the project uses in its catalog, starting from the default while none is recorded */
export const runCategoryChange = async (
  action: CategoryAction,
  requested: string[],
  cwd: string,
  version: string
): Promise<void> => {
  const used = usedCategories(await readProjectCatalog(cwd));
  const selected = await selectCategories({
    requested,
    ...choices(action, used),
  });

  if (selected === undefined) throw new Error(categoriesUsage(action, version));

  assertKnownCategories(CATEGORIES, selected);

  if (selected.length === 0) return print([banner(), '', nothingSelected()]);

  const change = CHANGES[action](used, selected);

  await recordCategories(cwd, change.categories);

  print([banner(), '', categoriesRecorded(action, change)]);
};

export const categoriesReport = async (cwd: string): Promise<string> => {
  const catalog = await readProjectCatalog(cwd);

  return categoryList(
    CATEGORIES,
    usedCategories(catalog),
    catalog.categories !== undefined
  );
};
