import type {
  SelectCategoriesDeps,
  SelectCategoriesInput,
} from '../types/core.js';
import { isInteractive, promptForSkills } from './prompt.js';

const defaultDeps: SelectCategoriesDeps = { isInteractive, promptForSkills };

export const selectCategories = async (
  input: SelectCategoriesInput,
  deps: SelectCategoriesDeps = defaultDeps
): Promise<string[]> => {
  if (input.requested.length > 0) return input.requested;

  if (!input.shouldPrompt || !deps.isInteractive()) return [];

  return deps.promptForSkills(input.groups);
};
