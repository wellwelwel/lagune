import { join } from 'node:path';
import { ensureDir, writeFileOverwrite } from './fs-actions.js';
import { parseJsonObject } from './json.js';
import { readText } from './markdown/read.js';
import { containedStateFile, readStateFile } from './state-file.js';

export const CONFIGS_FILE = '.lagune/configs.json';
export const CONFIGS_SCHEMA = 'https://lagune.ai/schemas/configs.json';

const parseConfigs = (raw: string | null): Record<string, unknown> =>
  raw === null ? Object.create(null) : parseJsonObject(raw, CONFIGS_FILE);

/** Reads the project's configs, none while the file is absent, refusing a file it cannot trust or one outside the project */
export const readConfigs = async (
  cwd: string
): Promise<Record<string, unknown>> =>
  parseConfigs(await readStateFile(cwd, CONFIGS_FILE));

/** Writes fields into the configs file at a contained path, keeping every other field untouched, and points a file that names no schema at the current one */
export const writeConfigs = async (
  path: string,
  fields: Record<string, unknown>
): Promise<void> => {
  const current = parseConfigs(await readText(path));
  const merged: Record<string, unknown> = Object.assign(
    Object.create(null),
    { $schema: CONFIGS_SCHEMA },
    current,
    fields
  );

  await writeFileOverwrite(path, `${JSON.stringify(merged, null, 2)}\n`);
};

/** Records fields in the project's configs, creating the file inside the project when it is absent */
export const recordConfigs = async (
  cwd: string,
  fields: Record<string, unknown>
): Promise<void> => {
  await ensureDir(join(cwd, '.lagune'));
  await writeConfigs(await containedStateFile(cwd, CONFIGS_FILE), fields);
};
