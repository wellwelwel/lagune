import type {
  Frontmatter,
  SkillRegistration,
} from '../../../src/types/test.js';
import { execFile } from 'node:child_process';
import { cp, mkdtemp, readFile, realpath, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { describe, it, strict } from 'poku';
import { parse } from 'yaml.min';
import { listFrontmatterSources } from '../skills/__utils__.js';
import {
  firstFound,
  listTrackedPaths,
  packageRoot,
  readManifest,
  repositoryRoot,
} from './__utils__.js';

const PLUGIN_FOLDER = '.hermes-plugin';
const MANIFEST_LOOKUP = [
  'plugin.yaml',
  'plugin.yml',
  'plugin.json',
  `${PLUGIN_FOLDER}/plugin.yaml`,
];
const RECORDING_CONTEXT = `
import importlib.util, json, sys

class RecordingContext:
    def __init__(self):
        self.skills = []

    def register_skill(self, name, path, description=""):
        self.skills.append({"name": name, "description": description, "path": str(path)})

spec = importlib.util.spec_from_file_location("lagune_hermes_plugin", sys.argv[1])
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
context = RecordingContext()
module.register(context)
print(json.dumps(context.skills))
`;
const HERMES_SKILL_NAME = /^[a-zA-Z0-9_-]+$/;
// Hermes v0.22.5's install scan rates both critical in Markdown, blocking the install even with --force
const BLOCKING_INJECTIONS = [
  /ignore\s+(?:\w+\s+)*(previous|all|above|prior)\s+instructions/i,
  /disregard\s+(?:\w+\s+)*(your|all|any)\s+(?:\w+\s+)*(instructions|rules|guidelines)/i,
];

const run = promisify(execFile);

const { contents = {} } = await readManifest(`${PLUGIN_FOLDER}/plugin.yaml`);
const tracked = await listTrackedPaths();
const root = await realpath(repositoryRoot);
const hasPython = await run('python3', ['--version']).then(
  () => true,
  () => false
);
const itWithPython = hasPython ? it : it.skip;

const registerFrom = async (
  pluginFolder: string
): Promise<SkillRegistration[]> => {
  const { stdout } = await run('python3', [
    '-I',
    '-B',
    '-c',
    RECORDING_CONTEXT,
    join(pluginFolder, '__init__.py'),
  ]);

  return JSON.parse(stdout);
};

const expectedRegistrations = async (): Promise<SkillRegistration[]> => {
  const sources = await listFrontmatterSources(
    new URL('skills/', packageRoot),
    (relativePath) => relativePath.endsWith('/SKILL.md')
  );

  return sources.map(({ relativePath, frontmatter }) => {
    const { name = '', description } = parse<Frontmatter>(frontmatter);

    return {
      name: name.replaceAll('.', '-'),
      description,
      path: join(root, 'skills', relativePath),
    };
  });
};

const byName = (left: SkillRegistration, right: SkillRegistration): number =>
  left.name.localeCompare(right.name);

const blockedLines = async (path: string): Promise<string[]> => {
  const text = await readFile(join(root, path), 'utf8');

  return text
    .split('\n')
    .flatMap((line, index) =>
      BLOCKING_INJECTIONS.some((pattern) => pattern.test(line))
        ? [`${path}:${index + 1}`]
        : []
    );
};

describe('the Hermes Agent plugin manifest', () => {
  it('is the one Hermes discovers, since the repository root holds no manifest of its own', () => {
    strict.strictEqual(
      firstFound(MANIFEST_LOOKUP, tracked),
      `${PLUGIN_FOLDER}/plugin.yaml`
    );
  });

  it('describes the plugin, which Hermes validation requires', () => {
    strict(
      typeof contents.description === 'string' &&
        contents.description.trim().length > 0
    );
  });
});

await describe('the Hermes Agent plugin registration', async () => {
  await itWithPython(
    'registers every published skill under its name with a hyphen in place of the dot, with its description and its file',
    async () => {
      const registered = await registerFrom(join(root, PLUGIN_FOLDER));
      const expected = await expectedRegistrations();

      strict.deepStrictEqual(
        [...registered].sort(byName),
        [...expected].sort(byName)
      );
    }
  );

  await itWithPython(
    'registers only names Hermes accepts, since one it rejects unloads the whole plugin',
    async () => {
      const registered = await registerFrom(join(root, PLUGIN_FOLDER));

      strict.deepStrictEqual(
        registered
          .map(({ name }) => name)
          .filter((name) => !HERMES_SKILL_NAME.test(name)),
        []
      );
    }
  );

  await itWithPython(
    'fails the load when the skills are missing, instead of loading with no commands',
    async () => {
      const scratch = await realpath(
        await mkdtemp(join(tmpdir(), 'lagune-hermes-'))
      );
      const pluginFolder = join(scratch, PLUGIN_FOLDER);

      await cp(join(root, PLUGIN_FOLDER), pluginFolder, { recursive: true });

      const loaded = await registerFrom(pluginFolder).then(
        () => true,
        () => false
      );

      await rm(scratch, { recursive: true, force: true });

      strict.strictEqual(loaded, false);
    }
  );
});

await describe('the Hermes Agent install scan', async () => {
  await it('finds no line it rates a critical prompt injection, which would block every install of the repository', async () => {
    const blocked = await Promise.all([...tracked].map(blockedLines));

    strict.deepStrictEqual(blocked.flat(), []);
  });
});
