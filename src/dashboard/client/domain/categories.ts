import type { CategoryOption } from '@/types/dashboard/client';
import { CATEGORIES } from '@/catalog/categories';
import { categoryIcon } from '@/dashboard/shared/specialization-meta';

export const CATEGORY_OPTIONS: CategoryOption[] = CATEGORIES.map(
  (category) => ({
    key: category.key,
    name: category.label,
    description: category.description,
    icon: categoryIcon(category.key),
  })
);
