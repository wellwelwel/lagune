import { describe, it, strict } from 'poku';
import { firstFound, listTrackedPaths } from './__utils__.js';

const MANIFEST_LOOKUP = [
  'plugin.json',
  'qwen-extension.json',
  'gemini-extension.json',
  '.claude-plugin/marketplace.json',
  '.qoder-plugin/plugin.json',
  '.claude-plugin/plugin.json',
];

const WORKFLOWS_FOLDER = 'workflows/';

const tracked = await listTrackedPaths();

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
