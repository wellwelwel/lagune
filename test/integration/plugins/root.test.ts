import { describe, it, strict } from 'poku';
import { listTracked } from './__utils__.js';

const SYMLINK_MODE = '120000';

const LOADED_FROM_A_PLUGIN_ROOT = [
  'AGENTS.md',
  'AGENT.md',
  'GEMINI.md',
  'QWEN.md',
  '.windsurfrules',
  'plugin.json',
  'marketplace.json',
  'kimi.plugin.json',
  'hooks.json',
  'settings.json',
  'skills.json',
  '.mcp.json',
  'hooks',
  'rules',
  'commands',
  'agents',
  'bin',
  '.github/plugin',
  '.agents/skills',
];

const tracked = await listTracked();

const occupies = (path: string, entry: string): boolean =>
  path === entry || path.startsWith(`${entry}/`);

describe('the repository root, which ships inside every plugin', () => {
  it('tracks no symlink', () => {
    strict.deepStrictEqual(
      tracked
        .filter(({ mode }) => mode === SYMLINK_MODE)
        .map(({ path }) => path),
      []
    );
  });

  it('holds nothing a harness would load beside the skills', () => {
    strict.deepStrictEqual(
      LOADED_FROM_A_PLUGIN_ROOT.filter((entry) =>
        tracked.some(({ path }) => occupies(path, entry))
      ),
      []
    );
  });
});
