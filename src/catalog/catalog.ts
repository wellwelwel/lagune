import type {
  BuiltinSpecialization,
  CatalogEntry,
  Category,
  CategoryChange,
} from '../types/catalog.js';

/** The built-in specializations belonging to any of the given categories, in index order */
export const builtinsIn = (
  builtins: BuiltinSpecialization[],
  keys: string[]
): BuiltinSpecialization[] =>
  builtins.filter((entry) =>
    entry.categories.some((key) => keys.includes(key))
  );

/** Merges the project's own specializations into the built-ins by name, its own winning a collision */
export const merge = (
  builtin: CatalogEntry[],
  own: CatalogEntry[]
): CatalogEntry[] => {
  const overridden = new Set(own.map((entry) => entry.name));
  const keptBuiltin = builtin.filter((entry) => !overridden.has(entry.name));

  return [...keptBuiltin, ...own];
};

/** Formats the catalog as one `name: tags` line per specialization, flagging the required ones */
export const list = (catalog: CatalogEntry[]): string => {
  if (catalog.length === 0)
    return "No specialization is in this project's catalog.\n";

  const lines = catalog.map((entry) => {
    const base =
      entry.tags.length === 0
        ? entry.name
        : `${entry.name}: ${entry.tags.join(', ')}`;

    return entry.required === true ? `${base} [required]` : base;
  });

  return `${lines.join('\n')}\n`;
};

export const findCategory = (
  categories: Category[],
  key: string
): Category | undefined => categories.find((category) => category.key === key);

export const unknownCategoryKeys = (
  categories: Category[],
  keys: string[]
): string[] =>
  keys.filter((key) => findCategory(categories, key) === undefined);

const unknownCategoriesMessage = (
  keys: string[],
  availableKeys: string[]
): string =>
  [
    `Unknown specialization ${keys.length === 1 ? 'category' : 'categories'}: ${keys.join(', ')}`,
    `Available categories: ${availableKeys.join(', ')}`,
  ].join('\n');

/** Throws for any key that names no registered category */
export const assertKnownCategories = (
  categories: Category[],
  keys: string[]
): void => {
  const unknown = unknownCategoryKeys(categories, keys);

  if (unknown.length > 0)
    throw new Error(
      unknownCategoriesMessage(
        unknown,
        categories.map((category) => category.key)
      )
    );
};

export const addCategories = (
  current: string[],
  requested: string[]
): CategoryChange => {
  const keys = [...new Set(requested)];
  const changed = keys.filter((key) => !current.includes(key));

  return {
    categories: [...current, ...changed],
    changed,
    unchanged: keys.filter((key) => current.includes(key)),
  };
};

export const removeCategories = (
  current: string[],
  requested: string[]
): CategoryChange => {
  const keys = [...new Set(requested)];

  return {
    categories: current.filter((key) => !keys.includes(key)),
    changed: keys.filter((key) => current.includes(key)),
    unchanged: keys.filter((key) => !current.includes(key)),
  };
};
