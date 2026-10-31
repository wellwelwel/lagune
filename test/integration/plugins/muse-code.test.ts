import { describe, it, strict } from 'poku';
import { firstFound, listTrackedPaths } from './__utils__.js';

const MANIFEST_LOOKUP = [
  '.muse-plugin/plugin.json',
  '.claude-plugin/plugin.json',
  '.codex-plugin/plugin.json',
];

const MARKETPLACE_LOOKUP = [
  'marketplace.json',
  '.agents/plugins/marketplace.json',
  '.claude-plugin/marketplace.json',
];

const tracked = await listTrackedPaths();

describe('the Muse Code plugin', () => {
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
