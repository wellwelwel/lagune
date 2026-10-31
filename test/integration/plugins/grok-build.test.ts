import { describe, it, strict } from 'poku';
import { firstFound, listTrackedPaths } from './__utils__.js';

const MANIFEST_LOOKUP = [
  'plugin.json',
  '.grok-plugin/plugin.json',
  '.claude-plugin/plugin.json',
];

const MARKETPLACE_LOOKUP = [
  '.grok-plugin/marketplace.json',
  '.grok-plugin/plugin.json',
  '.claude-plugin/marketplace.json',
  '.claude-plugin/plugin.json',
];

const tracked = await listTrackedPaths();

describe('the Grok Build plugin', () => {
  it('reads the Claude Code manifest, the first its lookup reaches', () => {
    strict.strictEqual(
      firstFound(MANIFEST_LOOKUP, tracked),
      '.claude-plugin/plugin.json'
    );
  });

  it('installs through the Claude Code marketplace, the first its lookup reaches', () => {
    strict.strictEqual(
      firstFound(MARKETPLACE_LOOKUP, tracked),
      '.claude-plugin/marketplace.json'
    );
  });
});
