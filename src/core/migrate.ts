import type { ProjectCatalog, Specialization } from '../types/catalog.js';
import type { LegacyInstall, MigrateResult, MovedFile } from '../types/core.js';
import { readdir, rename, rmdir } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';
import { BUILTIN_SPECIALIZATIONS } from '../catalog/builtin.js';
import {
  CATALOG_DIR,
  CATALOG_FILE,
  readProjectCatalog,
  specializationsOf,
} from '../catalog/project.js';
import { isStringArray } from './collections.js';
import {
  ensureDir,
  pathExists,
  removeEntryIfPresent,
  removeFileIfPresent,
  writeFileOverwrite,
} from './fs-actions.js';
import { removeLaguneBlock } from './gitignore.js';
import { parseJsonObject } from './json.js';
import { readText } from './markdown/read.js';

const MANIFEST_FILE = '.lagune/manifest.json';
const LEGACY_INDEX_FILE = '.lagune/skills.json';
const LEGACY_SPECIALIZATIONS_DIR = '.lagune/skills';
const PROOFS_DIR = '.lagune/proofs';
const GENERATED = [
  '.lagune/templates/',
  '.lagune/hooks/',
  '.lagune/specializations.md',
];
const SKILL_FOLDER = /^lagune(\.[a-z]+)?$/;
const COMMAND_FILE = /^lagune(\.[a-z]+)?\.(md|mdc|toml|yaml)$/;

export const hasManifest = (cwd: string): Promise<boolean> =>
  pathExists(join(cwd, MANIFEST_FILE));

const readLegacyInstall = async (
  cwd: string
): Promise<LegacyInstall | undefined> => {
  const raw = await readText(join(cwd, MANIFEST_FILE));

  if (raw === null) return undefined;

  const fields = parseJsonObject(raw, MANIFEST_FILE);

  return {
    files: isStringArray(fields.files) ? fields.files : [],
    categories: isStringArray(fields.categories)
      ? fields.categories
      : undefined,
  };
};

const readLegacyIndex = async (cwd: string): Promise<Specialization[]> => {
  const raw = await readText(join(cwd, LEGACY_INDEX_FILE));

  if (raw === null) return [];

  return specializationsOf(parseJsonObject(raw, LEGACY_INDEX_FILE).entries);
};

const isInside = (cwd: string, path: string): boolean =>
  resolve(cwd, path).startsWith(resolve(cwd) + sep);

/** The folder or file the Lagune CLI generated for one agent command, never anything else */
const commandEntry = (path: string): string | undefined => {
  const segments = path.split('/');
  const file = segments[segments.length - 1] ?? '';
  const folder = segments[segments.length - 2] ?? '';

  if (file === 'SKILL.md' && SKILL_FOLDER.test(folder))
    return `${segments.slice(0, -1).join('/')}/`;

  return COMMAND_FILE.test(file) ? path : undefined;
};

const agentCommands = (cwd: string, files: string[]): string[] => [
  ...new Set(
    files
      .filter((file) => !file.startsWith('.lagune/') && isInside(cwd, file))
      .map(commandEntry)
      .filter((entry): entry is string => entry !== undefined)
  ),
];

const removeAll = async (cwd: string, paths: string[]): Promise<string[]> => {
  const statuses = await Promise.all(
    paths.map((path) => removeEntryIfPresent(join(cwd, path)))
  );

  return paths.filter((_path, index) => statuses[index] === 'removed');
};

const legacyFiles = async (cwd: string): Promise<string[]> => {
  try {
    const entries = await readdir(join(cwd, LEGACY_SPECIALIZATIONS_DIR));

    return entries.filter((entry) => entry.endsWith('.md')).toSorted();
  } catch {
    return [];
  }
};

const isGeneratedCopy = (file: string, ownNames: Set<string>): boolean => {
  const name = file.slice(0, -'.md'.length);

  return (
    !ownNames.has(name) &&
    BUILTIN_SPECIALIZATIONS.some((entry) => entry.name === name)
  );
};

const moveIfFree = async (cwd: string, file: MovedFile): Promise<boolean> => {
  if (await pathExists(join(cwd, file.to))) return false;

  await rename(join(cwd, file.from), join(cwd, file.to));

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

const writeProjectCatalog = async (
  cwd: string,
  current: ProjectCatalog,
  install: LegacyInstall,
  legacy: Specialization[]
): Promise<void> => {
  const categories = current.categories ?? install.categories;
  const catalog = {
    name: 'lagune',
    ...(categories === undefined ? {} : { categories }),
    entries: mergedEntries(current.entries, legacy),
  };

  await writeFileOverwrite(
    join(cwd, CATALOG_FILE),
    `${JSON.stringify(catalog, null, 2)}\n`
  );
};

const guardProofs = async (cwd: string): Promise<void> => {
  const ignore = join(cwd, PROOFS_DIR, '.gitignore');

  if (!(await pathExists(join(cwd, PROOFS_DIR)))) return;
  if (await pathExists(ignore)) return;

  await writeFileOverwrite(ignore, '*\n');
};

/** Moves a project the Lagune CLI installed to the skills-based layout, keeping its memory and tracking */
export const performMigrate = async (cwd: string): Promise<MigrateResult> => {
  const install = await readLegacyInstall(cwd);

  if (install === undefined) return { migrated: false };

  const [legacy, current, files] = await Promise.all([
    readLegacyIndex(cwd),
    readProjectCatalog(cwd),
    legacyFiles(cwd),
  ]);
  const ownNames = new Set(legacy.map((entry) => entry.name));
  const copies = files
    .filter((file) => isGeneratedCopy(file, ownNames))
    .map((file) => `${LEGACY_SPECIALIZATIONS_DIR}/${file}`);
  const own = files.filter((file) => !isGeneratedCopy(file, ownNames));
  const removed = await removeAll(cwd, [
    ...GENERATED,
    ...copies,
    ...agentCommands(cwd, install.files),
  ]);
  const { moved, kept } = await moveOwnSpecializations(cwd, own);

  await removeIfEmpty(join(cwd, LEGACY_SPECIALIZATIONS_DIR));
  await writeProjectCatalog(cwd, current, install, legacy);
  await removeFileIfPresent(join(cwd, LEGACY_INDEX_FILE));
  await guardProofs(cwd);

  const gitignore = await removeLaguneBlock(cwd);

  await removeFileIfPresent(join(cwd, MANIFEST_FILE));

  return { migrated: true, removed, moved, kept, gitignore };
};
