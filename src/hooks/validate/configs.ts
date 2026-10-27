import { CONFIGS_FILE, CONFIGS_SCHEMA } from '../../core/configs.js';
import { parseJsonObject } from '../../core/json.js';

const readableConfigs = (raw: string): Record<string, unknown> | null => {
  try {
    return parseJsonObject(raw, CONFIGS_FILE);
  } catch {
    return null;
  }
};

/** Warns about a configs file that names no schema, leaving an unreadable one to the commands that refuse it */
export const configsWarnings = (raw: string | null): string[] => {
  if (raw === null) return [];

  const configs = readableConfigs(raw);

  if (configs === null || Object.hasOwn(configs, '$schema')) return [];

  return [
    `it names no schema: add "$schema": "${CONFIGS_SCHEMA}" as its first field`,
  ];
};
