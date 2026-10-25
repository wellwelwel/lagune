import { join } from 'node:path';
import { writeFileOverwrite } from './fs-actions.js';
import { parseJsonObject } from './json.js';
import { readText } from './markdown/read.js';

export const CONFIGS_FILE = '.lagune/configs.json';

const parseConfigs = (raw: string | null): Record<string, unknown> =>
  raw === null ? Object.create(null) : parseJsonObject(raw, CONFIGS_FILE);

/** Reads the project's configs, none while the file is absent, refusing a file it cannot trust */
export const readConfigs = async (
  cwd: string
): Promise<Record<string, unknown>> =>
  parseConfigs(await readText(join(cwd, CONFIGS_FILE)));

/** Writes fields into the configs file at a contained path, keeping every other field untouched */
export const writeConfigs = async (
  path: string,
  fields: Record<string, unknown>
): Promise<void> => {
  const current = parseConfigs(await readText(path));
  const merged: Record<string, unknown> = Object.assign(
    Object.create(null),
    current,
    fields
  );

  await writeFileOverwrite(path, `${JSON.stringify(merged, null, 2)}\n`);
};
