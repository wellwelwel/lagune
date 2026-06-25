import type { SkillCatalogEntry, SkillsCatalogFile } from '../../types/core.js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const USER_CATALOG_PATH = '.bluespec/skills.json';

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

const isValidEntry = (value: Record<string, unknown>): boolean =>
  typeof value.name === 'string' &&
  isStringArray(value.tags) &&
  (value.groups === undefined || isStringArray(value.groups));

const toEntry = (value: Record<string, unknown>): SkillCatalogEntry => ({
  name: String(value.name),
  tags: isStringArray(value.tags) ? [...value.tags] : [],
  groups: isStringArray(value.groups) ? [...value.groups] : [],
});

const asRecords = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is Record<string, unknown> =>
          typeof item === 'object' && item !== null
      )
    : [];

const parseUserCatalog = (raw: string): SkillCatalogEntry[] => {
  const parsed: Partial<SkillsCatalogFile> = JSON.parse(raw);

  return asRecords(parsed.entries).filter(isValidEntry).map(toEntry);
};

/** Reads the user's own sub-skills from .bluespec/skills.json, failing closed to [] */
export const discoverSkills = async (
  targetDir: string
): Promise<SkillCatalogEntry[]> => {
  try {
    const raw = await readFile(join(targetDir, USER_CATALOG_PATH), 'utf8');

    return parseUserCatalog(raw);
  } catch {
    return [];
  }
};
