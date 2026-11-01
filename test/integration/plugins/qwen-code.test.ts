import { describe, it, strict } from 'poku';
import {
  firstFound,
  listPackedPaths,
  listTrackedPaths,
  readDeclaredServer,
  readEngineServer,
} from './__utils__.js';

const MANIFEST_LOOKUP = [
  'plugin.json',
  'qwen-extension.json',
  'gemini-extension.json',
  '.claude-plugin/marketplace.json',
  '.qoder-plugin/plugin.json',
  '.claude-plugin/plugin.json',
];

const WORKFLOWS_FOLDER = 'workflows/';
const NPM_MANIFEST = 'scripts/plugins/qwen/qwen-extension.json';
const ENGINE_ENTRY = 'lib/bin/index.js';

const tracked = await listTrackedPaths();
const packed = await listPackedPaths();
const server = await readEngineServer(NPM_MANIFEST);
const engineServer = await readDeclaredServer(NPM_MANIFEST);

describe('the Qwen Code extension', () => {
  it('converts the Gemini CLI manifest, which outranks the plugin picked from the marketplace', () => {
    strict.strictEqual(
      firstFound(MANIFEST_LOOKUP, tracked),
      'gemini-extension.json'
    );
  });

  it('ships no workflows, which Qwen Code loads from the repository root', () => {
    strict.deepStrictEqual(
      [...tracked].filter((path) => path.startsWith(WORKFLOWS_FOLDER)),
      []
    );
  });
});

describe('the Qwen Code extension on npm, which carries the engine', () => {
  it('carries its own manifest, which Qwen Code reads before the Gemini CLI one', () => {
    strict.strictEqual(
      firstFound(MANIFEST_LOOKUP, packed),
      'qwen-extension.json'
    );
  });

  it('starts the engine the package carries from the extension folder, for the workspace', () => {
    strict(packed.has(ENGINE_ENTRY), 'the package carries the engine entry');
    strict.deepStrictEqual(server, {
      command: 'node',
      args: [ENGINE_ENTRY, 'mcp', '${workspacePath}'],
      cwd: '${extensionPath}',
    });
  });

  it('shows the engine tools from the first turn instead of deferring them', () => {
    strict(
      engineServer.alwaysLoadTools === true,
      'the server opts out of tool search'
    );
  });
});
