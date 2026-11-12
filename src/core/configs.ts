import type { ConfigsUpdate } from '../types/core.js';
import { parseJsonObject } from './json.js';
import { readStateFile, writeStateFile } from './state-file.js';
import { withStateLock } from './state-lock.js';

export const CONFIGS_FILE = '.lagune/configs.json';
export const CONFIGS_SCHEMA = 'https://lagune.ai/schemas/configs.json';

const parseConfigs = (raw: string | null): Record<string, unknown> =>
  raw === null ? Object.create(null) : parseJsonObject(raw, CONFIGS_FILE);

/** Reads the project's configs, none while the file is absent, refusing a file it cannot trust or one outside the project */
export const readConfigs = async (
  cwd: string
): Promise<Record<string, unknown>> =>
  parseConfigs(await readStateFile(cwd, CONFIGS_FILE));

const serializeConfigs = (
  configs: Record<string, unknown>,
  fields: Record<string, unknown>
): string => {
  const merged: Record<string, unknown> = Object.assign(
    Object.create(null),
    { $schema: CONFIGS_SCHEMA },
    configs,
    fields
  );

  return `${JSON.stringify(merged, null, 2)}\n`;
};

/** Records the fields a change derives from the project's configs, read and written under the state lock, keeping every other field and pointing a file that names no schema at the current one */
export const recordConfigs = <Result>(
  cwd: string,
  change: (configs: Record<string, unknown>) => ConfigsUpdate<Result>
): Promise<Result> =>
  withStateLock(cwd, async (state) => {
    const configs = await readConfigs(cwd);
    const { fields, result } = change(configs);

    await writeStateFile(
      state,
      CONFIGS_FILE,
      serializeConfigs(configs, fields)
    );

    return result;
  });
