import { describe, it, strict } from 'poku';
import { isRecord } from '../../../src/core/collections.js';
import {
  firstFound,
  listBundledPaths,
  listedEntries,
  listTrackedPaths,
  readManifest,
} from './__utils__.js';

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
const marketplacePath = firstFound(MARKETPLACE_LOOKUP, tracked) ?? '';
const marketplace = await readManifest(marketplacePath);
const entries = listedEntries(marketplace.contents?.plugins);
const bundled = await listBundledPaths('muse');
const branchMarketplace = await readManifest(
  'scripts/plugins/muse/.claude-plugin/marketplace.json'
);
const branchEntries = listedEntries(branchMarketplace.contents?.plugins);

describe('the Muse Code plugin', () => {
  it('reads the Claude Code manifest, the first its lookup reaches', () => {
    strict.strictEqual(
      firstFound(MANIFEST_LOOKUP, tracked),
      '.claude-plugin/plugin.json'
    );
  });

  it('installs through the Codex marketplace, the first its lookup reaches', () => {
    strict.strictEqual(marketplacePath, '.agents/plugins/marketplace.json');
  });

  it('lists the plugin from a local source, since it skips a URL source as no Git source', () => {
    strict.deepStrictEqual(
      entries.map(({ source }) => isRecord(source) && source.source),
      ['local']
    );
  });
});

describe('the Muse Code plugin branch, which carries the engine', () => {
  it('installs through the Claude Code marketplace it carries, the first its lookup reaches there', () => {
    strict.strictEqual(
      firstFound(MARKETPLACE_LOOKUP, bundled),
      '.claude-plugin/marketplace.json'
    );
  });

  it('lists the branch itself as the plugin', () => {
    strict.deepStrictEqual(
      branchEntries.map(({ source }) => source),
      ['./']
    );
  });
});
