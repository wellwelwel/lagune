import { describe, it, strict } from 'poku';
import { listTracked } from './__utils__.js';

const MANIFEST_LOOKUP = [
  '.plugin/plugin.json',
  'plugin.json',
  '.github/plugin/plugin.json',
  '.claude-plugin/plugin.json',
];

const MARKETPLACE_LOOKUP = [
  'marketplace.json',
  '.plugin/marketplace.json',
  '.github/plugin/marketplace.json',
  '.claude-plugin/marketplace.json',
];

const SERVER_CONFIGS = [
  '.mcp.json',
  '.github/mcp.json',
  '.lsp.json',
  'lsp.json',
  '.github/lsp.json',
];

const tracked = new Set((await listTracked()).map(({ path }) => path));

const firstFound = (lookup: string[]): string | undefined =>
  lookup.find((path) => tracked.has(path));

describe('the Copilot CLI plugin', () => {
  it('reads the Claude Code manifest, the first its lookup reaches', () => {
    strict.strictEqual(
      firstFound(MANIFEST_LOOKUP),
      '.claude-plugin/plugin.json'
    );
  });

  it('installs through the Claude Code marketplace, the first its lookup reaches', () => {
    strict.strictEqual(
      firstFound(MARKETPLACE_LOOKUP),
      '.claude-plugin/marketplace.json'
    );
  });

  it('starts no MCP or language server from the repository root', () => {
    strict.deepStrictEqual(
      SERVER_CONFIGS.filter((path) => tracked.has(path)),
      []
    );
  });
});
