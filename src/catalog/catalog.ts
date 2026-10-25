import type { BuiltinSpecialization, CatalogEntry } from '../types/catalog.js';

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
