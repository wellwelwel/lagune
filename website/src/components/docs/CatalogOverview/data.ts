import type {
  CategoryBadge,
  PromptSegment,
  SpecializationIconName,
} from '@site/src/data/lagune';
import {
  BUILTIN_SPECIALIZATIONS,
  specializationCategories,
  specializationDescription,
  specializationIconName,
  specializationLabel,
  specializationPrompt,
} from '@site/src/data/lagune';

export type CatalogSpecialization = {
  name: string;
  label: string;
  icon: SpecializationIconName;
  description: string;
  prompt: PromptSegment[][];
  categories: CategoryBadge[];
};

const byName = (
  left: CatalogSpecialization,
  right: CatalogSpecialization
): number => left.name.localeCompare(right.name);

export const builtinCatalog: CatalogSpecialization[] =
  BUILTIN_SPECIALIZATIONS.map((entry) => ({
    name: entry.name,
    label: specializationLabel(entry.name),
    icon: specializationIconName(entry.name),
    description: specializationDescription(entry.name),
    prompt: specializationPrompt(entry.name),
    categories: specializationCategories(entry.name),
  })).sort(byName);
