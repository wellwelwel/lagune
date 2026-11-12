import type { Specialization } from '../types/catalog.js';
import type {
  MigratedConfig,
  MigrateResult,
  MigrateSummary,
  MovedFile,
} from '../types/core.js';
import { rename, rmdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { BUILTIN_SPECIALIZATIONS } from '../catalog/builtin.js';
import {
  CATALOG_DIR,
  readOwnIndex,
  specializationsOf,
} from '../catalog/project.js';
import { readProjectCategories } from '../categories/project.js';
import { isStringArray } from './collections.js';
import { CONFIGS_FILE, recordConfigs } from './configs.js';
import {
  ensureDir,
  entryWithin,
  fileWithin,
  listingWithin,
  pathExists,
  removeEntryIfPresent,
  writeFileOverwrite,
} from './fs-actions.js';
import { removeLaguneBlock } from './gitignore.js';
import { parseJsonObject } from './json.js';
import { legacyCommands } from './legacy-commands.js';
import { readText } from './markdown/read.js';
import { containedStateFile } from './state-file.js';

const MANIFEST_FILE = '.lagune/manifest.json';
const BLUE_SPEC_DIR = '.bluespec';
const LEGACY_INDEX_FILE = '.lagune/skills.json';
const LEGACY_SPECIALIZATIONS_DIR = '.lagune/skills';
const PROOFS_DIR = '.lagune/proofs';
const GENERATED = [
  '.lagune/templates/',
  '.lagune/hooks/',
  '.lagune/specializations.md',
];
const CONFIG_FIELDS: MigratedConfig[] = ['categories', 'catalog'];

export const hasManifest = (cwd: string): Promise<boolean> =>
  pathExists(join(cwd, MANIFEST_FILE));

/** Blue Spec, Lagune's former name, installed into its own folder, which only the manifest-based Lagune moves */
export const hasBlueSpec = (cwd: string): Promise<boolean> =>
  pathExists(join(cwd, BLUE_SPEC_DIR));

const readManifestCategories = async (
  cwd: string
): Promise<string[] | undefined> => {
  const raw = await readText(join(cwd, MANIFEST_FILE));

  if (raw === null) return undefined;

  const { categories } = parseJsonObject(raw, MANIFEST_FILE);

  return isStringArray(categories) ? categories : undefined;
};

const readLegacyIndex = async (cwd: string): Promise<Specialization[]> => {
  const raw = await readText(join(cwd, LEGACY_INDEX_FILE));

  if (raw === null) return [];

  return specializationsOf(parseJsonObject(raw, LEGACY_INDEX_FILE).entries);
};

/** Removes the entry itself, never a link's target, and only when it sits inside the project */
const removeWithin = async (cwd: string, path: string): Promise<boolean> => {
  const entry = await entryWithin(cwd, resolve(cwd, path));

  if (entry === undefined) return false;

  return (await removeEntryIfPresent(entry)) === 'removed';
};

const removeAll = async (cwd: string, paths: string[]): Promise<string[]> => {
  const removed = await Promise.all(
    paths.map((path) => removeWithin(cwd, path))
  );

  return paths.filter((_path, index) => removed[index]);
};

const legacyFiles = async (cwd: string): Promise<string[]> =>
  (await listingWithin(cwd, join(cwd, LEGACY_SPECIALIZATIONS_DIR)))
    .filter((entry) => entry.endsWith('.md'))
    .toSorted();

const isGeneratedCopy = (file: string, ownNames: Set<string>): boolean => {
  const name = file.slice(0, -'.md'.length);

  return (
    !ownNames.has(name) &&
    BUILTIN_SPECIALIZATIONS.some((entry) => entry.name === name)
  );
};

const moveIfFree = async (cwd: string, file: MovedFile): Promise<boolean> => {
  const [from, to] = await Promise.all([
    entryWithin(cwd, join(cwd, file.from)),
    entryWithin(cwd, join(cwd, file.to)),
  ]);

  if (from === undefined || to === undefined) return false;
  if (await pathExists(to)) return false;

  await rename(from, to);

  return true;
};

const removeIfEmpty = (dir: string): Promise<void> =>
  rmdir(dir).catch(() => undefined);

const moveOwnSpecializations = async (
  cwd: string,
  files: string[]
): Promise<{ moved: MovedFile[]; kept: string[] }> => {
  const planned = files.map((file) => ({
    from: `${LEGACY_SPECIALIZATIONS_DIR}/${file}`,
    to: `${CATALOG_DIR}/${file}`,
  }));

  if (planned.length > 0) await ensureDir(join(cwd, CATALOG_DIR));

  const outcomes = await Promise.all(
    planned.map((file) => moveIfFree(cwd, file))
  );

  return {
    moved: planned.filter((_file, index) => outcomes[index]),
    kept: planned
      .filter((_file, index) => !outcomes[index])
      .map((file) => file.from),
  };
};

const mergedEntries = (
  current: Specialization[],
  legacy: Specialization[]
): Specialization[] => [
  ...current,
  ...legacy.filter(
    (entry) => !current.some((existing) => existing.name === entry.name)
  ),
];

/** What the configs file gains: the manifest's categories while it records none, and the legacy index */
const configChanges = (
  categories: string[] | undefined,
  catalog: Specialization[]
): Partial<Record<MigratedConfig, unknown>> => ({
  ...(categories === undefined ? {} : { categories }),
  ...(catalog.length === 0 ? {} : { catalog }),
});

const guardProofs = async (cwd: string): Promise<boolean> => {
  const ignore = await fileWithin(cwd, join(cwd, PROOFS_DIR, '.gitignore'));

  if (ignore === undefined) return false;
  if (await pathExists(ignore)) return false;

  await writeFileOverwrite(ignore, '*\n');

  return true;
};

const changedAnything = (summary: MigrateSummary): boolean =>
  summary.manifest ||
  summary.removed.length > 0 ||
  summary.moved.length > 0 ||
  summary.kept.length > 0 ||
  summary.configs.length > 0 ||
  summary.gitignore !== 'unchanged' ||
  summary.proofs;

/** Moves a project off the manifest-based Lagune, on the clone that holds its manifest and on every clone that pulls the move, keeping its memory and tracking */
export const performMigrate = async (cwd: string): Promise<MigrateResult> => {
  const [manifestCategories, legacy, ownIndex, recorded, files] =
    await Promise.all([
      readManifestCategories(cwd),
      readLegacyIndex(cwd),
      readOwnIndex(cwd),
      readProjectCategories(cwd),
      legacyFiles(cwd),
    ]);
  const changes = configChanges(
    recorded === undefined ? manifestCategories : undefined,
    legacy.length === 0 ? [] : mergedEntries(ownIndex, legacy)
  );
  const configs = CONFIG_FIELDS.filter((field) => changes[field] !== undefined);

  if (configs.length > 0) await containedStateFile(cwd, CONFIGS_FILE);

  const ownNames = new Set([...legacy, ...ownIndex].map((entry) => entry.name));
  const copies = files
    .filter((file) => isGeneratedCopy(file, ownNames))
    .map((file) => `${LEGACY_SPECIALIZATIONS_DIR}/${file}`);
  const own = files.filter((file) => !isGeneratedCopy(file, ownNames));
  const removed = await removeAll(cwd, [
    ...GENERATED,
    ...copies,
    ...(await legacyCommands(cwd)),
  ]);
  const { moved, kept } = await moveOwnSpecializations(cwd, own);

  await removeIfEmpty(join(cwd, LEGACY_SPECIALIZATIONS_DIR));

  if (configs.length > 0)
    await recordConfigs(cwd, () => ({ fields: changes, result: undefined }));

  const index = await removeAll(cwd, [LEGACY_INDEX_FILE]);
  const proofs = await guardProofs(cwd);
  const gitignore = await removeLaguneBlock(cwd);
  const manifest = await removeWithin(cwd, MANIFEST_FILE);
  const summary: MigrateSummary = {
    manifest,
    removed: [...removed, ...index],
    moved,
    kept,
    configs,
    gitignore,
    proofs,
  };

  return changedAnything(summary)
    ? { migrated: true, ...summary }
    : { migrated: false };
};
