import type { SkillCatalogEntry, SkillGroup } from '../../types/core.js';

/** Merges built-in and user sub-skills by name, the user entry winning a name collision */
export const merge = (
  builtin: SkillCatalogEntry[],
  user: SkillCatalogEntry[]
): SkillCatalogEntry[] => {
  const overridden = new Set(user.map((entry) => entry.name));
  const keptBuiltin = builtin.filter((entry) => !overridden.has(entry.name));

  return [...keptBuiltin, ...user];
};

/** Sub-skill names belonging to the exact group key, in catalog order */
export const skillsInGroup = (
  catalog: SkillCatalogEntry[],
  key: string
): string[] =>
  catalog
    .filter((entry) => entry.groups.includes(key))
    .map((entry) => entry.name);

/** The group descriptor for an exact key, or undefined when no group matches */
export const findGroup = (
  groups: SkillGroup[],
  key: string
): SkillGroup | undefined => groups.find((group) => group.key === key);

/** Formats the catalog as a readable listing, one sub-skill per line with its tags */
export const list = (catalog: SkillCatalogEntry[]): string => {
  if (catalog.length === 0) return 'No sub-skills available.\n';

  const lines = catalog.map((entry) =>
    entry.tags.length === 0
      ? entry.name
      : `${entry.name}: ${entry.tags.join(', ')}`
  );

  return `${lines.join('\n')}\n`;
};
