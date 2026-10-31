import { basename } from 'node:path';
import { describe, it, strict } from 'poku';
import { firstFound, listTrackedPaths, readManifest } from './__utils__.js';

const MANIFEST_LOOKUP = ['kimi.plugin.json', '.kimi-plugin/plugin.json'];

const UNSUPPORTED_FIELDS = [
  'tools',
  'apps',
  'inject',
  'configFile',
  'config_file',
  'bootstrap',
];

const SESSION_FIELDS = [
  'sessionStart',
  'skillInstructions',
  'systemPrompt',
  'systemPromptPath',
  'hooks',
  'commands',
  'mcpServers',
  'agents',
];

const INSTRUCTION_FILES = ['AGENTS.md', 'agents.md'];

const { contents = {} } = await readManifest('.kimi-plugin/plugin.json');
const tracked = await listTrackedPaths();

describe('the Kimi Code plugin manifest', () => {
  it('holds no field Kimi Code reports as unsupported', () => {
    strict.deepStrictEqual(
      UNSUPPORTED_FIELDS.filter((field) => field in contents),
      []
    );
  });

  it('adds only the skills to a session, with no bootstrap, prompt, hook, command, server, or agent', () => {
    strict.deepStrictEqual(
      SESSION_FIELDS.filter((field) => field in contents),
      []
    );
  });
});

describe('the Kimi Code plugin', () => {
  it('reads its own manifest, the first its lookup reaches', () => {
    strict.strictEqual(
      firstFound(MANIFEST_LOOKUP, tracked),
      '.kimi-plugin/plugin.json'
    );
  });

  it('surfaces no instruction file when the agent reads a file the plugin ships', () => {
    strict.deepStrictEqual(
      [...tracked].filter((path) => INSTRUCTION_FILES.includes(basename(path))),
      []
    );
  });
});
