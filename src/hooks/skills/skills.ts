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

export const ALL_CATEGORIES = 'all';

/** Expands the reserved `all` selector to every registered key, otherwise the keys as given */
export const expandCategories = (
  groups: SkillGroup[],
  keys: string[]
): string[] =>
  keys.includes(ALL_CATEGORIES) ? groups.map((group) => group.key) : keys;

/** The category keys that match no registered group, in the order requested */
export const unknownGroupKeys = (
  groups: SkillGroup[],
  keys: string[]
): string[] => keys.filter((key) => findGroup(groups, key) === undefined);

/** The distinct sub-skill names covered by the requested category keys, in catalog order */
export const skillNamesForGroups = (
  catalog: SkillCatalogEntry[],
  keys: string[]
): string[] =>
  catalog
    .filter((entry) => entry.groups.some((group) => keys.includes(group)))
    .map((entry) => entry.name);

/** The keys, among the candidates, whose group contains the given sub-skill name */
export const groupKeysForSkill = (
  catalog: SkillCatalogEntry[],
  name: string,
  keys: string[]
): string[] => {
  const entry = catalog.find((candidate) => candidate.name === name);

  if (entry === undefined) return [];

  return keys.filter((key) => entry.groups.includes(key));
};

/** Keeps only the catalog entries whose sub-skill file is present on disk */
export const keepPresent = (
  catalog: SkillCatalogEntry[],
  presentNames: string[]
): SkillCatalogEntry[] => {
  const present = new Set(presentNames);

  return catalog.filter((entry) => present.has(entry.name));
};

/** The registered group keys with at least one built-in sub-skill present on disk */
export const installedGroupKeys = (
  groups: SkillGroup[],
  catalog: SkillCatalogEntry[],
  presentNames: string[]
): string[] => {
  const present = new Set(presentNames);

  return groups
    .map((group) => group.key)
    .filter((key) =>
      skillNamesForGroups(catalog, [key]).some((name) => present.has(name))
    );
};

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
