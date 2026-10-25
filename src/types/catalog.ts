import type { CategoryKey } from './categories.js';

export type BuiltinSpecialization = {
  name: string;
  tags: string[];
  categories: CategoryKey[];
  required?: boolean;
};

export type Specialization = {
  name: string;
  tags: string[];
};

export type CatalogEntry = Specialization & { required?: boolean };
