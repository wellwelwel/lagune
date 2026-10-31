import type {
  PackedPackage,
  PluginManifest,
  TrackedFile,
} from '../../../src/types/test.js';
import { execFile } from 'node:child_process';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { parse } from 'yaml.min';
import { isRecord } from '../../../src/core/collections.js';

export const packageRoot = new URL('../../../', import.meta.url);
export const repositoryRoot = fileURLToPath(packageRoot);
export const YAML_FILE = /\.ya?ml$/;

const MANIFEST_FILE =
  /^(?:\.[a-z]+-plugin\/[^/]+\.(?:json|ya?ml)|[a-z]+-extension\.json|\.agents\/plugins\/marketplace\.json)$/;

const run = promisify(execFile);

/** Every file git tracks, the tree a harness installs, with its mode */
export const listTracked = async (): Promise<TrackedFile[]> => {
  const { stdout } = await run('git', ['ls-files', '-z', '--stage'], {
    cwd: repositoryRoot,
  });

  return stdout
    .split('\0')
    .filter((record) => record.length > 0)
    .map((record) => ({
      mode: record.slice(0, record.indexOf(' ')),
      path: record.slice(record.indexOf('\t') + 1),
    }));
};

export const listTrackedPaths = async (): Promise<Set<string>> =>
  new Set((await listTracked()).map(({ path }) => path));

/** Every file the npm package carries, the tree the harnesses that install from npm receive */
export const listPackedPaths = async (): Promise<Set<string>> => {
  const { stdout } = await run(
    'npm',
    ['pack', '--dry-run', '--json', '--ignore-scripts'],
    { cwd: repositoryRoot }
  );
  // npm 12 keys the report by package name, earlier versions list it
  const [packed]: PackedPackage[] = Object.values(JSON.parse(stdout));

  return new Set(packed.files.map(({ path }) => path));
};

const listFiles = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, {
    recursive: true,
    withFileTypes: true,
  });

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) =>
      relative(directory, join(entry.parentPath, entry.name))
        .split(sep)
        .join('/')
    );
};

/** Every file a repository folder holds, as a path from the repository root */
export const listFolderFiles = async (folder: string): Promise<string[]> =>
  (await listFiles(join(repositoryRoot, folder))).map(
    (path) => `${folder}/${path}`
  );

export const listSkillFiles = (): Promise<string[]> =>
  listFolderFiles('skills');

/** Every file a plugin's branch carries, the tree the listing that follows it reviews */
export const listBundledPaths = async (
  plugin: string
): Promise<Set<string>> => {
  const scratch = await mkdtemp(join(tmpdir(), `lagune-plugin-${plugin}-`));
  const bundle = join(scratch, 'bundle');

  await run('bash', ['scripts/plugins/bundle.sh', plugin, bundle], {
    cwd: repositoryRoot,
  });

  const bundled = await listFiles(bundle);

  await rm(scratch, { recursive: true, force: true });

  return new Set(bundled);
};

/** Whether release archives, which some harnesses install, leave the path out */
export const isLeftOutOfArchives = async (path: string): Promise<boolean> => {
  const { stdout } = await run(
    'git',
    ['check-attr', 'export-ignore', '--', path],
    { cwd: repositoryRoot }
  );

  return stdout.trim().endsWith(': set');
};

/** The file a harness reads: the first of its lookup order the tree carries */
export const firstFound = (
  lookup: string[],
  tracked: Set<string>
): string | undefined => lookup.find((path) => tracked.has(path));

/** The plugin entries a marketplace lists */
export const listedEntries = (plugins: unknown): Record<string, unknown>[] =>
  Array.isArray(plugins) ? plugins.filter(isRecord) : [];

export const occupies = (path: string, entry: string): boolean =>
  path === entry || path.startsWith(`${entry}/`);

const parseManifest = (path: string, text: string): unknown => {
  try {
    return YAML_FILE.test(path) ? parse<unknown>(text) : JSON.parse(text);
  } catch {
    return undefined;
  }
};

export const readManifest = async (path: string): Promise<PluginManifest> => {
  const contents = parseManifest(
    path,
    await readFile(new URL(path, packageRoot), 'utf8')
  );

  return { path, contents: isRecord(contents) ? contents : undefined };
};

export const readManifests = async (): Promise<PluginManifest[]> =>
  Promise.all(
    (await listTracked())
      .map(({ path }) => path)
      .filter((path) => MANIFEST_FILE.test(path))
      .map(readManifest)
  );
