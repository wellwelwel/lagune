import { join } from 'node:path';
import { isStringArray } from '../core/collections.js';
import { ensureDir, writeFileOverwrite } from '../core/fs-actions.js';
import { parseJsonObject } from '../core/json.js';
import { readText } from '../core/markdown/read.js';
import { containedStateFile } from '../core/state-file.js';

export const CATEGORIES_FILE = '.lagune/categories.json';
export const DEFAULT_CATEGORIES = ['owasp'];

const recordedIn = (fields: Record<string, unknown>): string[] | undefined => {
  if (fields.categories === undefined) return undefined;
  if (!isStringArray(fields.categories))
    throw new Error(
      `${CATEGORIES_FILE} records categories that are not a list of names: fix it, then run this again.`
    );

  return [...fields.categories];
};

/** Reads the categories the project recorded, none while the file is absent, refusing a file it cannot trust */
export const readProjectCategories = async (
  cwd: string
): Promise<string[] | undefined> => {
  const raw = await readText(join(cwd, CATEGORIES_FILE));

  if (raw === null) return undefined;

  return recordedIn(parseJsonObject(raw, CATEGORIES_FILE));
};

export const usedCategories = (recorded: string[] | undefined): string[] =>
  recorded ?? DEFAULT_CATEGORIES;

export const recordCategories = async (
  cwd: string,
  categories: string[]
): Promise<void> => {
  await ensureDir(join(cwd, '.lagune'));

  const path = await containedStateFile(cwd, CATEGORIES_FILE);
  const raw = await readText(path);
  const fields: Record<string, unknown> =
    raw === null ? {} : parseJsonObject(raw, CATEGORIES_FILE);
  const recorded = { ...fields, name: 'lagune', categories };

  await writeFileOverwrite(path, `${JSON.stringify(recorded, null, 2)}\n`);
};
