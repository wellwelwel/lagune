import type { CatalogEntry, Specialization } from '../types/catalog.js';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  readProjectCategories,
  usedCategories,
} from '../categories/project.js';
import { isRecord, isStringArray } from '../core/collections.js';
import { existingWithin } from '../core/fs-actions.js';
import { parseJsonObject } from '../core/json.js';
import { readText } from '../core/markdown/read.js';
import { BUILTIN_SPECIALIZATIONS } from './builtin.js';
import { builtinsIn, merge } from './catalog.js';
import { isSpecializationName } from './name.js';

export const CATALOG_FILE = '.lagune/catalog.json';
export const CATALOG_DIR = '.lagune/catalog';

const toSpecialization = (value: unknown): Specialization[] => {
  if (!isRecord(value)) return [];

  const { name, tags } = value;

  if (typeof name !== 'string' || !isSpecializationName(name)) return [];
  if (!isStringArray(tags)) return [];

  return [{ name, tags: [...tags] }];
};

/** The valid entries of a specialization index, dropping any it cannot read */
export const specializationsOf = (entries: unknown): Specialization[] =>
  Array.isArray(entries) ? entries.flatMap(toSpecialization) : [];

/** Reads the index of the project's own specializations, refusing a file it cannot trust */
export const readOwnIndex = async (cwd: string): Promise<Specialization[]> => {
  const raw = await readText(join(cwd, CATALOG_FILE));

  if (raw === null) return [];

  return specializationsOf(parseJsonObject(raw, CATALOG_FILE).entries);
};

/** The project's own file for a name, only when it resolves inside the project */
const ownFile = (cwd: string, name: string): Promise<string | undefined> =>
  existingWithin(cwd, join(cwd, CATALOG_DIR, `${name}.md`));

const presentOwn = async (
  cwd: string,
  entries: Specialization[]
): Promise<Specialization[]> => {
  const present = await Promise.all(
    entries.map((entry) => ownFile(cwd, entry.name))
  );

  return entries.filter((_entry, index) => present[index] !== undefined);
};

/** The catalog the project uses: the built-ins of its categories plus its own, its own winning a name */
export const resolveCatalog = async (
  cwd: string,
  categories: string[],
  own: Specialization[]
): Promise<CatalogEntry[]> =>
  merge(
    builtinsIn(BUILTIN_SPECIALIZATIONS, categories),
    await presentOwn(cwd, own)
  );

export const catalogEntries = async (cwd: string): Promise<CatalogEntry[]> => {
  const [categories, own] = await Promise.all([
    readProjectCategories(cwd),
    readOwnIndex(cwd),
  ]);

  return resolveCatalog(cwd, usedCategories(categories), own);
};

const isBuiltin = (name: string): boolean =>
  BUILTIN_SPECIALIZATIONS.some((entry) => entry.name === name);

const readOwn = async (cwd: string, name: string): Promise<string | null> => {
  const file = await ownFile(cwd, name);

  return file === undefined ? null : readText(file);
};

/** The specialization the project resolves under a name, its own first and then the built-in, whatever the categories */
export const readSpecialization = async (
  cwd: string,
  packageRoot: URL,
  name: string
): Promise<string | undefined> => {
  const own = await readOwn(cwd, name);

  if (own !== null) return own;
  if (!isBuiltin(name)) return undefined;

  const builtin = await readText(
    fileURLToPath(new URL(`catalog/${name}.md`, packageRoot))
  );

  return builtin ?? undefined;
};
