import { CATEGORIES, categoryIcon } from './lagune';

export type Category = {
  key: string;
  name: string;
  description: string;
  icon: string;
};

export const ALL_CATEGORIES: Category[] = CATEGORIES.map((category) => ({
  key: category.key,
  name: category.label,
  description: category.description,
  icon: categoryIcon(category.key),
}));
