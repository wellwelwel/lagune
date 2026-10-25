import type { Category } from '../types/categories.js';
import type { ListTarget } from '../types/core.js';
import { stdin } from 'node:process';
import {
  interactiveMultiSelect,
  interactiveSelect,
} from './interactive-select.js';
import {
  categoriesSelectFooter,
  categoriesSelectHint,
  categoriesSelectTitle,
  listSelectHint,
  listSelectTitle,
  selectFooter,
} from './messages.js';

export const isInteractive = (): boolean => stdin.isTTY === true;

const lockedFirst = <Item>(
  items: Item[],
  isLocked: (item: Item) => boolean
): Item[] => [
  ...items.filter((item) => isLocked(item)),
  ...items.filter((item) => !isLocked(item)),
];

const LIST_TARGETS: { value: ListTarget; label: string }[] = [
  {
    value: 'findings',
    label: 'Findings: the security findings Lagune tracks',
  },
  {
    value: 'categories',
    label:
      'Categories: the specialization categories and which this project uses',
  },
];

export const promptForListTarget = async (): Promise<
  ListTarget | undefined
> => {
  const index = await interactiveSelect({
    title: listSelectTitle(),
    hint: listSelectHint(),
    options: LIST_TARGETS.map((target) => ({
      label: target.label,
      keywords: target.value,
    })),
    confirmLabel: 'List:',
    footer: selectFooter(),
  });

  if (index === undefined) return undefined;

  return LIST_TARGETS[index].value;
};

export const promptForCategories = async (
  categories: Category[],
  locked: string[]
): Promise<string[]> => {
  const ordered = lockedFirst(categories, (category) =>
    locked.includes(category.key)
  );
  const indexes = await interactiveMultiSelect({
    title: categoriesSelectTitle(),
    hint: categoriesSelectHint(),
    options: ordered.map((category) => ({
      label: `${category.label}: ${category.description}`,
      keywords: category.key,
      locked: locked.includes(category.key),
    })),
    footer: categoriesSelectFooter(),
  });

  if (indexes === undefined) return [];

  return indexes
    .map((index) => ordered[index].key)
    .filter((key) => !locked.includes(key));
};
