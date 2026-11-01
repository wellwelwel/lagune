import { describe, it, strict } from 'poku';
import { firstFound, listTrackedPaths, occupies } from './__utils__.js';

const MARKETPLACE_LOOKUP = [
  '.factory-plugin/marketplace.json',
  '.claude-plugin/marketplace.json',
];

const LOADED_ONLY_BY_DROID = ['droids', 'output-styles', 'mcp.json'];

const tracked = await listTrackedPaths();

describe('the Factory Droid plugin', () => {
  it('installs through a marketplace of its own, which its lookup reaches before the Claude Code one', () => {
    strict.strictEqual(
      firstFound(MARKETPLACE_LOOKUP, tracked),
      '.factory-plugin/marketplace.json'
    );
  });

  it('loads no droid, output style, or MCP server from the repository root', () => {
    strict.deepStrictEqual(
      LOADED_ONLY_BY_DROID.filter((entry) =>
        [...tracked].some((path) => occupies(path, entry))
      ),
      []
    );
  });
});
