import type {
  ManifestChange,
  ManifestData,
  ManifestInput,
} from '../types/core.js';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { ensureDir, writeFileOverwrite } from './fs-actions.js';

const MANIFEST_PATH = '.bluespec/manifest.json';

export const buildManifest = (input: ManifestInput): ManifestData => ({
  name: 'blue-spec',
  version: input.version,
  agent: input.agent,
  createdAt: input.now.toISOString(),
  files: input.files,
  categories: input.categories,
});

export const serializeManifest = (data: ManifestData): string =>
  `${JSON.stringify(data, null, 2)}\n`;

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

/** The categories recorded in the project's manifest, failing closed to [] */
export const readManifestCategories = async (
  targetDir: string
): Promise<string[]> => {
  try {
    const raw = await readFile(join(targetDir, MANIFEST_PATH), 'utf8');
    const parsed: { categories?: unknown } = JSON.parse(raw);

    return isStringArray(parsed.categories) ? parsed.categories : [];
  } catch {
    return [];
  }
};

const readManifestFields = async (
  path: string
): Promise<Record<string, unknown>> => {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return {};
  }
};

const mergeFiles = (
  existing: unknown,
  addFiles: string[],
  removeFiles: string[]
): string[] => {
  const dropped = new Set(removeFiles);
  const current = isStringArray(existing)
    ? existing.filter((file) => !dropped.has(file))
    : [];

  return [...current, ...addFiles.filter((file) => !current.includes(file))];
};

/**
 * Upserts the manifest after an add/remove. Updates `categories` and merges the changed skill files
 * into `files`, leaving every other field intact when the manifest exists, and creating a minimal
 * one (no agent yet) when it does not, so add/remove stay coherent in a project that never ran init.
 */
export const applyManifestChange = async (
  targetDir: string,
  change: ManifestChange,
  defaults: { version: string; now: Date }
): Promise<void> => {
  const path = join(targetDir, MANIFEST_PATH);
  const existing = await readManifestFields(path);
  const base = buildManifest({
    version: defaults.version,
    agent: '',
    now: defaults.now,
    files: [],
    categories: change.categories,
  });
  const files = mergeFiles(existing.files, change.addFiles, change.removeFiles);

  await ensureDir(dirname(path));
  await writeFileOverwrite(
    path,
    `${JSON.stringify(
      { ...base, ...existing, categories: change.categories, files },
      null,
      2
    )}\n`
  );
};
