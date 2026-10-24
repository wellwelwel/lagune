import type {
  CatalogEntry,
  ProjectCatalog,
  Specialization,
} from '../types/catalog.js';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isRecord, isStringArray } from '../core/collections.js';
import {
  ensureDir,
  pathExists,
  writeFileOverwrite,
} from '../core/fs-actions.js';
import { parseJsonObject } from '../core/json.js';
import { readText } from '../core/markdown/read.js';
import { BUILTIN_SPECIALIZATIONS } from './builtin.js';
import { builtinsIn, merge } from './catalog.js';
import { isSpecializationName } from './name.js';

export const CATALOG_FILE = '.lagune/catalog.json';
export const CATALOG_DIR = '.lagune/catalog';
export const DEFAULT_CATEGORIES = ['owasp'];

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

const recordedCategories = (
  fields: Record<string, unknown>
): string[] | undefined => {
  if (fields.categories === undefined) return undefined;
  if (!isStringArray(fields.categories))
    throw new Error(
      `${CATALOG_FILE} records categories that are not a list of names: fix it, then run this again.`
    );

  return [...fields.categories];
};

/** Reads the project's recorded categories and its own index, refusing a file it cannot trust */
export const readProjectCatalog = async (
  cwd: string
): Promise<ProjectCatalog> => {
  const raw = await readText(join(cwd, CATALOG_FILE));

  if (raw === null) return { categories: undefined, entries: [] };

  const fields = parseJsonObject(raw, CATALOG_FILE);

  return {
    categories: recordedCategories(fields),
    entries: specializationsOf(fields.entries),
  };
};

export const usedCategories = (catalog: ProjectCatalog): string[] =>
  catalog.categories ?? DEFAULT_CATEGORIES;

const ownFile = (cwd: string, name: string): string =>
  join(cwd, CATALOG_DIR, `${name}.md`);

const presentOwn = async (
  cwd: string,
  entries: Specialization[]
): Promise<Specialization[]> => {
  const present = await Promise.all(
    entries.map((entry) => pathExists(ownFile(cwd, entry.name)))
  );

  return entries.filter((_entry, index) => present[index]);
};

/** The catalog the project uses: the built-ins of its categories plus its own, its own winning a name */
export const resolveCatalog = async (
  cwd: string,
  catalog: ProjectCatalog
): Promise<CatalogEntry[]> =>
  merge(
    builtinsIn(BUILTIN_SPECIALIZATIONS, usedCategories(catalog)),
    await presentOwn(cwd, catalog.entries)
  );

export const catalogEntries = async (cwd: string): Promise<CatalogEntry[]> =>
  resolveCatalog(cwd, await readProjectCatalog(cwd));

const isBuiltin = (name: string): boolean =>
  BUILTIN_SPECIALIZATIONS.some((entry) => entry.name === name);

/** The specialization the project resolves under a name, its own first and then the built-in, whatever the categories */
export const readSpecialization = async (
  cwd: string,
  packageRoot: URL,
  name: string
): Promise<string | undefined> => {
  const own = await readText(ownFile(cwd, name));

  if (own !== null) return own;
  if (!isBuiltin(name)) return undefined;

  const builtin = await readText(
    fileURLToPath(new URL(`catalog/${name}.md`, packageRoot))
  );

  return builtin ?? undefined;
};

export const recordCategories = async (
  cwd: string,
  categories: string[]
): Promise<void> => {
  const path = join(cwd, CATALOG_FILE);
  const raw = await readText(path);
  const fields: Record<string, unknown> =
    raw === null ? {} : parseJsonObject(raw, CATALOG_FILE);
  const recorded = {
    ...fields,
    name: 'lagune',
    categories,
    entries: fields.entries ?? [],
  };

  await ensureDir(join(cwd, '.lagune'));
  await writeFileOverwrite(path, `${JSON.stringify(recorded, null, 2)}\n`);
};
