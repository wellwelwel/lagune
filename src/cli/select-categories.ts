import type {
  SelectCategoriesDeps,
  SelectCategoriesInput,
} from '../types/core.js';
import { isInteractive, promptForCategories } from './prompt.js';

const defaultDeps: SelectCategoriesDeps = {
  isInteractive,
  promptForCategories,
};

const allLocked = (input: SelectCategoriesInput): boolean =>
  input.categories.every((category) => input.locked.includes(category.key));

/** The categories to act on: the values given, or a choice in a terminal, or undefined when neither is possible */
export const selectCategories = async (
  input: SelectCategoriesInput,
  deps: SelectCategoriesDeps = defaultDeps
): Promise<string[] | undefined> => {
  if (input.requested.length > 0) return input.requested;

  if (!deps.isInteractive()) return undefined;

  if (allLocked(input)) return [];

  return deps.promptForCategories(input.categories, input.locked);
};
