import type { PluginBundle } from '../../../src/types/test.js';
import { readFile } from 'node:fs/promises';
import { describe, it, strict } from 'poku';
import { parse } from 'yaml.min';
import { isRecord, isStringArray } from '../../../src/core/collections.js';
import {
  isOverlay,
  listBundledPaths,
  listedEntries,
  listFolderFiles,
  listSkillFiles,
  packageRoot,
  readEngineServer,
  readManifests,
} from './__utils__.js';

const CARRIED_FOLDERS = ['skills/', 'catalog/', 'lib/bin/'];
const CARRIED_FILES = [
  'LICENSE',
  'README.md',
  'lib/THIRD_PARTY_LICENSES.txt',
  'package.json',
];
const ENGINE_ENTRY = 'lib/bin/index.js';
const SKILL_AGENT_FILE = /^skills\/[^/]+\/agents\//;
const REPOSITORY = 'wellwelwel/lagune';
const BRANCH_PREFIX = 'plugin-';
const PUBLISHING_JOBS = {
  branch: 'plugin-branches',
  'release archive': 'plugin-assets',
} as const;

const BUNDLES: PluginBundle[] = [
  {
    plugin: 'claude',
    agent: 'Claude Code',
    route: 'branch',
    metadata: ['.claude-plugin/plugin.json', '.mcp.json', 'assets/logo.png'],
    declaration: '.mcp.json',
    server: {
      command: 'node',
      args: [
        '${CLAUDE_PLUGIN_ROOT}/lib/bin/index.js',
        'mcp',
        '${CLAUDE_PROJECT_DIR}',
      ],
    },
  },
  {
    plugin: 'cursor',
    agent: 'Cursor CLI',
    route: 'branch',
    metadata: [
      '.cursor-plugin/marketplace.json',
      '.cursor-plugin/plugin.json',
      'assets/logo.png',
      'mcp.json',
    ],
    declaration: 'mcp.json',
    server: {
      command: 'node',
      args: ['${CURSOR_PLUGIN_ROOT}/lib/bin/index.js', 'mcp'],
    },
  },
  {
    plugin: 'droid',
    agent: 'Factory Droid',
    route: 'branch',
    metadata: ['.factory-plugin/plugin.json', 'mcp.json'],
    declaration: 'mcp.json',
    server: {
      command: 'node',
      args: ['${DROID_PLUGIN_ROOT}/lib/bin/index.js', 'mcp'],
    },
  },
  {
    plugin: 'gemini',
    agent: 'Gemini CLI',
    route: 'release archive',
    metadata: ['gemini-extension.json'],
    declaration: 'gemini-extension.json',
    server: {
      command: 'node',
      args: [ENGINE_ENTRY, 'mcp', '${workspacePath}'],
      cwd: '${extensionPath}',
    },
  },
  {
    plugin: 'grok',
    agent: 'Grok Build',
    route: 'branch',
    metadata: ['.claude-plugin/plugin.json', '.mcp.json', 'assets/logo.png'],
    declaration: '.mcp.json',
    server: {
      command: 'node',
      args: ['${GROK_PLUGIN_ROOT}/lib/bin/index.js', 'mcp'],
    },
  },
  {
    plugin: 'muse',
    agent: 'Muse Code',
    route: 'branch',
    metadata: [
      '.claude-plugin/marketplace.json',
      '.claude-plugin/plugin.json',
      '.mcp.json',
      'assets/logo.png',
    ],
    declaration: '.mcp.json',
    server: {
      command: 'node',
      args: ['${PLUGIN_ROOT}/lib/bin/index.js', 'mcp'],
    },
  },
];

const skillFiles = await listSkillFiles();
const catalogFiles = await listFolderFiles('catalog');
const manifests = await readManifests();
const workflow = parse<unknown>(
  await readFile(
    new URL('.github/workflows/cd_publish.yml', packageRoot),
    'utf8'
  )
);

const publishedBy = (job: string): string[] | undefined => {
  const jobs = isRecord(workflow) ? workflow.jobs : undefined;
  const definition = isRecord(jobs) ? jobs[job] : undefined;
  const strategy = isRecord(definition) ? definition.strategy : undefined;
  const matrix = isRecord(strategy) ? strategy.matrix : undefined;

  return isRecord(matrix) && isStringArray(matrix.plugin)
    ? matrix.plugin.toSorted()
    : undefined;
};

const pointsAtThisRepository = (source: Record<string, unknown>): boolean =>
  source.repo === REPOSITORY ||
  source.url === `https://github.com/${REPOSITORY}.git`;

const branchSources = (): Record<string, unknown>[] =>
  manifests
    .filter(({ path }) => !isOverlay(path))
    .flatMap(({ contents }) => listedEntries(contents?.plugins))
    .map(({ source }) => source)
    .filter(isRecord)
    .filter(({ ref }) => typeof ref === 'string');

describe('the plugin bundles', () => {
  it('are exactly the ones each release publishes, by route', () => {
    strict.deepStrictEqual(
      Object.values(PUBLISHING_JOBS).map(publishedBy),
      Object.keys(PUBLISHING_JOBS).map((route) =>
        BUNDLES.filter((bundle) => bundle.route === route)
          .map(({ plugin }) => plugin)
          .toSorted()
      )
    );
  });

  it('are the branches the default branch sends its marketplaces to, all of this repository', () => {
    const published = BUNDLES.filter(({ route }) => route === 'branch').map(
      ({ plugin }) => `${BRANCH_PREFIX}${plugin}`
    );
    const sources = branchSources();

    strict(sources.length > 0, 'a marketplace points at a plugin branch');
    strict.deepStrictEqual(
      sources.filter(
        (source) =>
          !pointsAtThisRepository(source) ||
          !published.includes(String(source.ref))
      ),
      []
    );
  });
});

for (const bundle of BUNDLES) {
  const bundled = await listBundledPaths(bundle.plugin);
  const server = await readEngineServer(
    `scripts/plugins/${bundle.plugin}/${bundle.declaration}`
  );

  describe(`the ${bundle.agent} plugin ${bundle.route}`, () => {
    it(`carries every published skill file ${bundle.agent} loads`, () => {
      strict(skillFiles.length > 0, 'the published skills hold files');
      strict.deepStrictEqual(
        skillFiles.filter(
          (path) => !SKILL_AGENT_FILE.test(path) && !bundled.has(path)
        ),
        []
      );
    });

    it('leaves out the files another agent keeps inside the skill folders', () => {
      strict.deepStrictEqual(
        [...bundled].filter((path) => SKILL_AGENT_FILE.test(path)),
        []
      );
    });

    it('carries nothing beside the skills and the engine but its metadata and the licenses', () => {
      strict.deepStrictEqual(
        [...bundled]
          .filter(
            (path) => !CARRIED_FOLDERS.some((folder) => path.startsWith(folder))
          )
          .toSorted(),
        [...CARRIED_FILES, ...bundle.metadata].toSorted()
      );
    });

    it('carries every built-in specialization the engine reads', () => {
      strict(catalogFiles.length > 0, 'the catalog holds specializations');
      strict.deepStrictEqual(
        catalogFiles.filter((path) => !bundled.has(path)),
        []
      );
    });

    it('starts the engine it carries, for the project the user opened', () => {
      strict(bundled.has(ENGINE_ENTRY), 'it carries the engine entry');
      strict.deepStrictEqual(server, bundle.server);
    });
  });
}
