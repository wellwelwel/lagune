import type {
  AgentProvider,
  BundledAssets,
  FileOutcome,
  GitignoreOutcome,
  LegacyInstall,
  PerformMigrateInput,
  PerformMigrateResult,
} from '../types/core.js';
import { readdir, readFile, rename, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { getProviders, listAgentKeys } from '../providers/registry.js';
import { loadAssets, loadVersion } from './assets.js';
import { pathExists, writeFileOverwrite } from './fs-actions.js';
import { ensureGitignoreEntries } from './gitignore.js';
import { selectSkillAssets } from './manage-skills.js';
import { isStringArray, manifestAgents } from './manifest.js';
import { refresh } from './scaffold.js';

const LEGACY_DIR = '.bluespec';
const LAGUNE_DIR = '.lagune';
const LEGACY_MANIFEST_PATH = `${LEGACY_DIR}/manifest.json`;
const MANIFEST_PATH = `${LAGUNE_DIR}/manifest.json`;
const TRACKING_PATH = `${LAGUNE_DIR}/tracking.json`;
const SKILLS_CATALOG_PATH = `${LAGUNE_DIR}/skills.json`;
const MEMORY_DIR = `${LAGUNE_DIR}/memory`;
const SKILLS_DIR = `${LAGUNE_DIR}/skills`;

const NAME_REWRITES: [RegExp, string][] = [
  [/blue-spec/g, 'lagune'],
  [/Blue Spec/g, 'Lagune'],
  [/BlueSpec/g, 'Lagune'],
  [/blueSpec/g, 'lagune'],
  [/Bluespec/g, 'Lagune'],
  [/BLUESPEC/g, 'LAGUNE'],
  [/bluespec/g, 'lagune'],
];

const rewriteName = (text: string): string =>
  NAME_REWRITES.reduce(
    (current, [pattern, replacement]) => current.replace(pattern, replacement),
    text
  );

const migratePathSegment = (segment: string): string => {
  if (segment === LEGACY_DIR) return LAGUNE_DIR;

  return segment.replace(/^bluespec(?=\.|$)/, 'lagune');
};

const migratePath = (path: string): string =>
  path.split('/').map(migratePathSegment).join('/');

const legacyPathSegment = (segment: string): string =>
  segment.replace(/^lagune(?=\.|$)/, 'bluespec');

const legacyCommandPath = (relativePath: string): string =>
  relativePath.split('/').map(legacyPathSegment).join('/');

const isLegacyNamed = (path: string): boolean => {
  const segments = path.split('/');

  return segments[segments.length - 1].startsWith('bluespec');
};

const readJsonIfPresent = async (
  path: string
): Promise<Record<string, unknown> | undefined> => {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return undefined;
  }
};

const readLegacyInstall = async (
  cwd: string
): Promise<LegacyInstall | undefined> => {
  if (!(await pathExists(join(cwd, LEGACY_DIR)))) return undefined;

  const fields =
    (await readJsonIfPresent(join(cwd, LEGACY_MANIFEST_PATH))) ??
    Object.create(null);

  return {
    agents: manifestAgents(fields.agent),
    categories: isStringArray(fields.categories) ? fields.categories : [],
    files: isStringArray(fields.files) ? fields.files : [],
  };
};

const removalTarget = (relativePath: string): string =>
  relativePath.endsWith('/SKILL.md') ? dirname(relativePath) : relativePath;

const legacyCommandTargets = (
  providers: AgentProvider[],
  assets: BundledAssets,
  legacyFiles: string[]
): string[] => {
  const fromProviders = providers.flatMap((provider) =>
    provider
      .buildCommands(assets)
      .map((command) => legacyCommandPath(command.relativePath))
  );
  const fromManifest = legacyFiles.filter(
    (file) => !file.startsWith(`${LEGACY_DIR}/`)
  );
  const targets = [...fromProviders, ...fromManifest].map(removalTarget);

  return [...new Set(targets)].filter(isLegacyNamed);
};

const removeEntryIfPresent = async (
  cwd: string,
  relativePath: string
): Promise<FileOutcome> => {
  const absolute = join(cwd, relativePath);

  if (!(await pathExists(absolute)))
    return { path: relativePath, status: 'absent' };

  await rm(absolute, { recursive: true, force: true });

  return { path: relativePath, status: 'removed' };
};

const removeLegacyCommands = (
  cwd: string,
  providers: AgentProvider[],
  assets: BundledAssets,
  legacyFiles: string[]
): Promise<FileOutcome[]> =>
  Promise.all(
    legacyCommandTargets(providers, assets, legacyFiles).map((target) =>
      removeEntryIfPresent(cwd, target)
    )
  );

const rewriteJsonName = async (
  cwd: string,
  relativePath: string,
  transform: (fields: Record<string, unknown>) => Record<string, unknown>
): Promise<string | undefined> => {
  const fields = await readJsonIfPresent(join(cwd, relativePath));

  if (fields === undefined) return undefined;

  await writeFileOverwrite(
    join(cwd, relativePath),
    `${JSON.stringify(transform(fields), null, 2)}\n`
  );

  return relativePath;
};

const migrateManifestFields = (
  fields: Record<string, unknown>
): Record<string, unknown> => ({
  ...fields,
  name: 'lagune',
  files: isStringArray(fields.files)
    ? fields.files.map(migratePath)
    : fields.files,
});

const renameStateFields = (
  fields: Record<string, unknown>
): Record<string, unknown> => ({ ...fields, name: 'lagune' });

const rewriteMarkdownFile = async (
  cwd: string,
  relativePath: string
): Promise<string | undefined> => {
  const contents = await readFile(join(cwd, relativePath), 'utf8');
  const updated = rewriteName(contents);

  if (updated === contents) return undefined;

  await writeFileOverwrite(join(cwd, relativePath), updated);

  return relativePath;
};

const listMarkdownFiles = async (
  cwd: string,
  relativeDir: string
): Promise<string[]> => {
  try {
    const entries = await readdir(join(cwd, relativeDir));

    return entries
      .filter((entry) => entry.endsWith('.md'))
      .map((entry) => `${relativeDir}/${entry}`);
  } catch {
    return [];
  }
};

const rewriteMarkdownDir = async (
  cwd: string,
  relativeDir: string
): Promise<string[]> => {
  const files = await listMarkdownFiles(cwd, relativeDir);
  const rewritten = await Promise.all(
    files.map((relativePath) => rewriteMarkdownFile(cwd, relativePath))
  );

  return rewritten.filter((path): path is string => path !== undefined);
};

const rewriteMigratedState = async (cwd: string): Promise<string[]> => {
  const [manifest, tracking, skillsCatalog, memory, skills] = await Promise.all(
    [
      rewriteJsonName(cwd, MANIFEST_PATH, migrateManifestFields),
      rewriteJsonName(cwd, TRACKING_PATH, renameStateFields),
      rewriteJsonName(cwd, SKILLS_CATALOG_PATH, renameStateFields),
      rewriteMarkdownDir(cwd, MEMORY_DIR),
      rewriteMarkdownDir(cwd, SKILLS_DIR),
    ]
  );

  return [manifest, tracking, skillsCatalog, ...memory, ...skills].filter(
    (path): path is string => path !== undefined
  );
};

const readTextIfPresent = async (path: string): Promise<string | undefined> => {
  try {
    return await readFile(path, 'utf8');
  } catch {
    return undefined;
  }
};

const migrateGitignore = async (cwd: string): Promise<GitignoreOutcome> => {
  const gitignorePath = join(cwd, '.gitignore');
  const existing = await readTextIfPresent(gitignorePath);
  const rewritten = existing === undefined ? undefined : rewriteName(existing);
  const changed = rewritten !== undefined && rewritten !== existing;

  if (changed) await writeFileOverwrite(gitignorePath, rewritten);

  const ensured = await ensureGitignoreEntries(cwd);

  return changed && ensured === 'unchanged' ? 'updated' : ensured;
};

export const performMigrate = async (
  input: PerformMigrateInput
): Promise<PerformMigrateResult> => {
  const { cwd, packageRoot, now } = input;
  const legacy = await readLegacyInstall(cwd);
  const migratedExists = await pathExists(join(cwd, LAGUNE_DIR));

  if (legacy === undefined) {
    return {
      migrated: false,
      reason: migratedExists ? 'already-migrated' : 'not-initialized',
    };
  }

  if (migratedExists) return { migrated: false, reason: 'conflict' };

  const knownKeys = listAgentKeys();
  const agents = legacy.agents.filter((key) => knownKeys.includes(key));
  const providers = getProviders(agents);
  const [assets, version] = await Promise.all([
    loadAssets(packageRoot),
    loadVersion(packageRoot),
  ]);

  await rename(join(cwd, LEGACY_DIR), join(cwd, LAGUNE_DIR));

  const removedCommands = await removeLegacyCommands(
    cwd,
    providers,
    assets,
    legacy.files
  );
  const rewrittenState = await rewriteMigratedState(cwd);
  const gitignore = await migrateGitignore(cwd);
  const refreshed = await refresh({
    targetDir: cwd,
    providers,
    assets: { ...assets, skills: selectSkillAssets(assets, legacy.categories) },
    version,
    now,
  });

  return {
    migrated: true,
    agents,
    removedCommands,
    rewrittenState,
    gitignore,
    refresh: refreshed,
  };
};
