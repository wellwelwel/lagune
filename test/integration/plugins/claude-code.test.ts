import { posix } from 'node:path';
import { describe, it, strict } from 'poku';
import { isRecord, isStringArray } from '../../../src/core/collections.js';
import {
  listBundledPaths,
  listedEntries,
  listFolderFiles,
  listSkillFiles,
  listTrackedPaths,
  readManifest,
} from './__utils__.js';

const REPOSITORY_ROOT = './';
const CARRIED_FOLDERS = ['skills/', 'catalog/', 'lib/bin/'];
const ANOTHER_AGENT_FILE = /^skills\/[^/]+\/agents\//;
const PLUGIN_ROOT = '${CLAUDE_PLUGIN_ROOT}/';

const manifest = await readManifest('.claude-plugin/plugin.json');
const marketplace = await readManifest('.claude-plugin/marketplace.json');
const entries = listedEntries(marketplace.contents?.plugins);
const bundled = await listBundledPaths('claude');
const skillFiles = await listSkillFiles();
const catalogFiles = await listFolderFiles('catalog');
const tracked = await listTrackedPaths();
const serverConfig = await readManifest('scripts/plugins/claude/.mcp.json');
const servers = serverConfig.contents?.mcpServers;
const engineServer = isRecord(servers) ? servers.lagune : undefined;
const serverArguments =
  isRecord(engineServer) && isStringArray(engineServer.args)
    ? engineServer.args
    : [];

describe('the Claude Code marketplace', () => {
  it('installs the plugin from the repository root', () => {
    strict.deepStrictEqual(
      entries.map((entry) => entry.source),
      [REPOSITORY_ROOT]
    );
  });

  it('leaves the version to the plugin manifest, which the release moves', () => {
    strict.deepStrictEqual(
      entries.filter((entry) => 'version' in entry).map((entry) => entry.name),
      []
    );
  });
});

describe('the Claude Code plugin manifest', () => {
  it('finds the skills by convention, so the skills CLI groups none under it', () => {
    strict(
      manifest.contents !== undefined && !('skills' in manifest.contents),
      'it parses into an object that lists no skills'
    );
  });

  it('starts no server from the repository root, which carries no engine build', () => {
    strict(
      manifest.contents !== undefined && !('mcpServers' in manifest.contents),
      'the manifest declares no server'
    );
    strict(!tracked.has('.mcp.json'), 'the repository root holds no server');
  });
});

describe('the Claude plugin branch, which the Anthropic directory reviews', () => {
  it('carries every published skill file Claude Code loads', () => {
    strict(skillFiles.length > 0, 'the published skills hold files');
    strict.deepStrictEqual(
      skillFiles.filter(
        (path) => !ANOTHER_AGENT_FILE.test(path) && !bundled.has(path)
      ),
      []
    );
  });

  it('leaves out the files another agent keeps inside the skill folders', () => {
    strict.deepStrictEqual(
      [...bundled].filter((path) => ANOTHER_AGENT_FILE.test(path)),
      []
    );
  });

  it('carries nothing beside the skills and the engine but the plugin metadata and the licenses', () => {
    strict.deepStrictEqual(
      [...bundled]
        .filter(
          (path) => !CARRIED_FOLDERS.some((folder) => path.startsWith(folder))
        )
        .toSorted(),
      [
        '.claude-plugin/plugin.json',
        '.mcp.json',
        'LICENSE',
        'README.md',
        'assets/logo.png',
        'lib/THIRD_PARTY_LICENSES.txt',
        'package.json',
      ]
    );
  });

  it('carries every built-in specialization the engine reads', () => {
    strict(catalogFiles.length > 0, 'the catalog holds specializations');
    strict.deepStrictEqual(
      catalogFiles.filter((path) => !bundled.has(path)),
      []
    );
  });

  it('starts the engine the branch carries, from the project the user opened', () => {
    const [entry = '', ...rest] = serverArguments;

    strict(
      entry.startsWith(PLUGIN_ROOT) &&
        bundled.has(entry.slice(PLUGIN_ROOT.length)),
      'the server runs an engine entry the branch carries'
    );
    strict.deepStrictEqual(rest, ['mcp', '${CLAUDE_PROJECT_DIR}']);
  });

  it('shows the engine tools from the first turn instead of deferring them', () => {
    strict(
      isRecord(engineServer) && engineServer.alwaysLoad === true,
      'the server opts out of tool search'
    );
  });

  it('carries the icon the manifest names, which the directory takes only at the first submission', () => {
    const icon = manifest.contents?.icon;

    strict(
      typeof icon === 'string' && bundled.has(posix.normalize(icon)),
      'the manifest names an icon the branch carries'
    );
  });
});
