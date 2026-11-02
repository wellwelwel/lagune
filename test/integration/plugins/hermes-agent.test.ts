import type {
  Frontmatter,
  HermesCall,
  HermesLoad,
  HermesTool,
  SkillRegistration,
} from '../../../src/types/test.js';
import { execFile } from 'node:child_process';
import { cp, mkdtemp, readFile, realpath, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { promisify } from 'node:util';
import { describe, it, strict } from 'poku';
import { parse } from 'yaml.min';
import { isRecord, isStringArray } from '../../../src/core/collections.js';
import { describeTool, ENGINE_TOOLS } from '../../../src/mcp/tools.js';
import { listSkillFrontmatters } from '../skills/__utils__.js';
import {
  assembleBundle,
  firstFound,
  listTrackedPaths,
  newProject,
  readCategories,
  readManifest,
  repositoryRoot,
} from './__utils__.js';

const PLUGIN_FOLDER = '.hermes-plugin';
const BUNDLE_MANIFEST = 'scripts/plugins/hermes/plugin.yaml';
const MANIFEST_LOOKUP = [
  'plugin.yaml',
  'plugin.yml',
  'plugin.json',
  `${PLUGIN_FOLDER}/plugin.yaml`,
];
const RECORDING_CONTEXT = `
import importlib.util, json, sys

plugin_file, session_folder, calls = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])


class RecordingContext:
    def __init__(self):
        self.skills = []
        self.tools = {}

    def register_skill(self, name, path, description=""):
        self.skills.append({"name": name, "description": description, "path": str(path)})

    def register_tool(self, name, toolset, schema, handler, **options):
        self.tools[name] = {"schema": schema, "handler": handler}

    def session_cwd(self):
        return session_folder


spec = importlib.util.spec_from_file_location("lagune_hermes_plugin", plugin_file)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
context = RecordingContext()
module.register(context)
print(json.dumps({
    "skills": context.skills,
    "tools": [{"name": name, "schema": tool["schema"]} for name, tool in context.tools.items()],
    "answers": [context.tools[call["tool"]]["handler"](call["arguments"]) for call in calls],
}))
`;
const ADD_PYTHON = { command: 'add', arguments: ['--categories', 'python'] };
// Hermes v0.22.5's install scan rates both critical in Markdown, blocking the install even with --force
const BLOCKING_INJECTIONS = [
  /ignore\s+(?:\w+\s+)*(previous|all|above|prior)\s+instructions/i,
  /disregard\s+(?:\w+\s+)*(your|all|any)\s+(?:\w+\s+)*(instructions|rules|guidelines)/i,
];

const run = promisify(execFile);

const { contents = {} } = await readManifest(`${PLUGIN_FOLDER}/plugin.yaml`);
const { contents: bundleManifest = {} } = await readManifest(BUNDLE_MANIFEST);
const tracked = await listTrackedPaths();
const root = await realpath(repositoryRoot);
const bundle = await realpath(await assembleBundle('hermes'));
const hasPython = await run('python3', ['--version']).then(
  () => true,
  () => false
);
const itWithPython = hasPython ? it : it.skip;

/** Loads the plugin in a session opened in a folder, or in none, and hands each call to its tool */
const loadPlugin = async (
  pluginFolder: string,
  session = '',
  calls: HermesCall[] = []
): Promise<HermesLoad> => {
  const { stdout } = await run('python3', [
    '-I',
    '-B',
    '-c',
    RECORDING_CONTEXT,
    join(pluginFolder, '__init__.py'),
    session,
    JSON.stringify(calls),
  ]);

  return JSON.parse(stdout);
};

const expectedRegistrations = async (
  tree: string
): Promise<SkillRegistration[]> => {
  const sources = await listSkillFrontmatters();

  return sources.map(({ relativePath, frontmatter }) => {
    const { name = '', description } = parse<Frontmatter>(frontmatter);

    return {
      name,
      description,
      path: join(tree, 'skills', relativePath),
    };
  });
};

const engineTools = (): HermesTool[] =>
  ENGINE_TOOLS.map(describeTool).map(({ name, description, inputSchema }) => ({
    name,
    schema: { name, description, parameters: inputSchema },
  }));

const byName = <Entry extends { name: string }>(
  left: Entry,
  right: Entry
): number => left.name.localeCompare(right.name);

const isFailure = (answer: string | undefined): boolean => {
  try {
    const parsed: unknown = JSON.parse(answer ?? '');

    return isRecord(parsed) && typeof parsed.error === 'string';
  } catch {
    return false;
  }
};

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

/** A copy of the tracked folders a default branch install receives, which carries no build */
const defaultBranchCopy = async (folders: string[]): Promise<string> => {
  const scratch = await realpath(
    await mkdtemp(join(tmpdir(), 'lagune-hermes-'))
  );

  await Promise.all(
    folders.map((folder) =>
      cp(join(root, folder), join(scratch, folder), { recursive: true })
    )
  );

  return scratch;
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

await describe('the Hermes Agent plugin on the default branch', async () => {
  await itWithPython(
    'registers every published skill under its name, with its description and its file',
    async () => {
      const { skills } = await loadPlugin(join(root, PLUGIN_FOLDER));
      const expected = await expectedRegistrations(root);

      strict.deepStrictEqual(
        [...skills].sort(byName),
        [...expected].sort(byName)
      );
    }
  );

  await itWithPython(
    'registers no engine tool, since the default branch carries no build',
    async () => {
      const scratch = await defaultBranchCopy([PLUGIN_FOLDER, 'skills']);
      const { tools } = await loadPlugin(join(scratch, PLUGIN_FOLDER));

      await rm(scratch, { recursive: true, force: true });

      strict.deepStrictEqual(tools, []);
    }
  );

  await itWithPython(
    'fails the load when the skills are missing, instead of loading with no commands',
    async () => {
      const scratch = await defaultBranchCopy([PLUGIN_FOLDER]);
      const loaded = await loadPlugin(join(scratch, PLUGIN_FOLDER)).then(
        () => true,
        () => false
      );

      await rm(scratch, { recursive: true, force: true });

      strict.strictEqual(loaded, false);
    }
  );
});

await describe('the Hermes Agent plugin branch', async () => {
  await itWithPython(
    'declares every tool it registers, since Hermes validation rejects an undeclared one',
    async () => {
      const { tools } = await loadPlugin(bundle);
      const { provides_tools: declared } = bundleManifest;

      strict.deepStrictEqual(
        tools.map(({ name }) => name).toSorted(),
        isStringArray(declared) ? declared.toSorted() : declared
      );
    }
  );

  await itWithPython(
    'registers every published skill from the skills it carries',
    async () => {
      const { skills } = await loadPlugin(bundle);
      const expected = await expectedRegistrations(bundle);

      strict.deepStrictEqual(
        [...skills].sort(byName),
        [...expected].sort(byName)
      );
    }
  );

  await itWithPython(
    "registers the engine's two tools under the names the skills call, with the engine's own definitions",
    async () => {
      const { tools } = await loadPlugin(bundle);

      strict.deepStrictEqual(
        [...tools].sort(byName),
        engineTools().sort(byName)
      );
    }
  );

  await itWithPython(
    'runs a call from the folder of the session that made it',
    async () => {
      const project = await newProject(['javascript']);
      const { answers } = await loadPlugin(bundle, project, [
        { tool: 'lagune_write', arguments: ADD_PYTHON },
      ]);
      const categories = await readCategories(project);

      strict.strictEqual(isFailure(answers[0]), false);
      strict.deepStrictEqual(categories, ['javascript', 'python']);
    }
  );

  await itWithPython(
    'reports a command the other tool runs as an error, without running it',
    async () => {
      const project = await newProject(['javascript']);
      const { answers } = await loadPlugin(bundle, project, [
        { tool: 'lagune_read', arguments: ADD_PYTHON },
      ]);
      const categories = await readCategories(project);

      strict.strictEqual(isFailure(answers[0]), true);
      strict.deepStrictEqual(categories, ['javascript']);
    }
  );

  await itWithPython(
    'reports a call from a session with no folder as an error',
    async () => {
      const { answers } = await loadPlugin(bundle, '', [
        { tool: 'lagune_write', arguments: ADD_PYTHON },
      ]);

      strict.strictEqual(isFailure(answers[0]), true);
    }
  );
});

await describe('the Hermes Agent install scan', async () => {
  await it('finds no line it rates a critical prompt injection, which would block every install of the repository', async () => {
    const blocked = await Promise.all([...tracked].map(blockedLines));

    strict.deepStrictEqual(blocked.flat(), []);
  });
});

await rm(dirname(bundle), { recursive: true, force: true });
