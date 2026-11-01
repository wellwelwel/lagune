import { describe, it, strict } from 'poku';
import {
  firstFound,
  listedEntries,
  listTrackedPaths,
  readManifest,
} from './__utils__.js';

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

const DEFAULT_BRANCH_ROOT = './';

const tracked = await listTrackedPaths();
const marketplacePath = firstFound(MARKETPLACE_LOOKUP, tracked) ?? '';
const marketplace = await readManifest(marketplacePath);
const entries = listedEntries(marketplace.contents?.plugins);

describe('the Copilot CLI plugin', () => {
  it('reads the Claude Code manifest, the first its lookup reaches', () => {
    strict.strictEqual(
      firstFound(MANIFEST_LOOKUP, tracked),
      '.claude-plugin/plugin.json'
    );
  });

  it('installs through a marketplace of its own, which its lookup reaches before the Claude Code one', () => {
    strict.strictEqual(marketplacePath, '.plugin/marketplace.json');
  });

  it('installs from the default branch, since Copilot CLI hands a plugin server no project folder', () => {
    strict.deepStrictEqual(
      entries.map(({ source }) => source),
      [DEFAULT_BRANCH_ROOT]
    );
  });

  it('starts no MCP or language server from the repository root', () => {
    strict.deepStrictEqual(
      SERVER_CONFIGS.filter((path) => tracked.has(path)),
      []
    );
  });
});
