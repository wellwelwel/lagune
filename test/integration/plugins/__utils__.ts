import type {
  EngineServer,
  ImageSize,
  PackedPackage,
  PluginManifest,
  TrackedFile,
} from '../../../src/types/test.js';
import { execFile } from 'node:child_process';
import {
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { afterEach } from 'poku';
import { parse } from 'yaml.min';
import { isRecord, isStringArray } from '../../../src/core/collections.js';

export const packageRoot = new URL('../../../', import.meta.url);
export const repositoryRoot = fileURLToPath(packageRoot);
export const YAML_FILE = /\.ya?ml$/;

const MANIFEST_FILE =
  /^(?:scripts\/plugins\/[a-z]+\/)?(?:\.(?:[a-z]+-)?plugin\/[^/]+\.(?:json|ya?ml)|[a-z]+-extension\.json|plugin\.ya?ml|\.agents\/plugins\/marketplace\.json)$/;
const OVERLAYS_FOLDER = 'scripts/plugins/';

const run = promisify(execFile);
const projects: string[] = [];

/** Every file git tracks, the tree an agent installs, with its mode */
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

/** Every file the npm package carries, the tree the agents that install from npm receive */
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

/** A plugin's branch as the release publishes it, assembled into a folder of its own */
export const assembleBundle = async (plugin: string): Promise<string> => {
  const scratch = await mkdtemp(join(tmpdir(), `lagune-plugin-${plugin}-`));
  const bundle = join(scratch, 'bundle');

  await run('bash', ['scripts/plugins/bundle.sh', plugin, bundle], {
    cwd: repositoryRoot,
  });

  return bundle;
};

/** Every file a plugin's branch carries, the tree the listing that follows it reviews */
export const listBundledPaths = async (
  plugin: string
): Promise<Set<string>> => {
  const bundle = await assembleBundle(plugin);
  const bundled = await listFiles(bundle);

  await rm(dirname(bundle), { recursive: true, force: true });

  return new Set(bundled);
};

/** A project an agent opened, using the categories it names */
export const newProject = async (categories: string[]): Promise<string> => {
  const project = await mkdtemp(join(tmpdir(), 'lagune-project-'));

  projects.push(project);
  await mkdir(join(project, '.lagune'));
  await writeFile(
    join(project, '.lagune', 'configs.json'),
    `${JSON.stringify({ categories }, null, 2)}\n`
  );

  return project;
};

export const readCategories = async (project: string): Promise<unknown> => {
  const configs: unknown = JSON.parse(
    await readFile(join(project, '.lagune', 'configs.json'), 'utf8')
  );

  return isRecord(configs) ? configs.categories : undefined;
};

/** Whether release archives, which some agents install, leave the path out */
export const isLeftOutOfArchives = async (path: string): Promise<boolean> => {
  const { stdout } = await run(
    'git',
    ['check-attr', 'export-ignore', '--', path],
    { cwd: repositoryRoot }
  );

  return stdout.trim().endsWith(': set');
};

/** The file an agent reads: the first of its lookup order the tree carries */
export const firstFound = (
  lookup: string[],
  tracked: Set<string>
): string | undefined => lookup.find((path) => tracked.has(path));

/** The plugin entries a marketplace lists */
export const listedEntries = (plugins: unknown): Record<string, unknown>[] =>
  Array.isArray(plugins) ? plugins.filter(isRecord) : [];

export const occupies = (path: string, entry: string): boolean =>
  path === entry || path.startsWith(`${entry}/`);

export const pngSize = (image: Buffer): ImageSize => ({
  width: image.readUInt32BE(16),
  height: image.readUInt32BE(20),
});

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

/** Whether a tracked file is an overlay, which only its plugin's bundle carries */
export const isOverlay = (path: string): boolean =>
  path.startsWith(OVERLAYS_FOLDER);

/** Every field of the engine server a declaration names, as its agent reads it */
export const readDeclaredServer = async (
  path: string
): Promise<Record<string, unknown>> => {
  const { contents } = await readManifest(path);
  const servers = contents?.mcpServers;
  const server = isRecord(servers) ? servers.lagune : undefined;

  return isRecord(server) ? server : {};
};

/** How a declaration starts the engine, as its agent reads it */
export const readEngineServer = async (path: string): Promise<EngineServer> => {
  const server = await readDeclaredServer(path);

  return {
    command: server.command,
    args: isStringArray(server.args) ? server.args : [],
    ...('cwd' in server ? { cwd: server.cwd } : {}),
  };
};

afterEach(async () => {
  await Promise.all(
    projects.map((project) => rm(project, { recursive: true, force: true }))
  );

  projects.length = 0;
});
