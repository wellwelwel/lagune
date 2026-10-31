import { describe, it, strict } from 'poku';
import { isRecord } from '../../../src/core/collections.js';
import { readManifest } from './__utils__.js';

const REPOSITORY_ROOT = './';

const manifest = await readManifest('.claude-plugin/plugin.json');
const marketplace = await readManifest('.claude-plugin/marketplace.json');

const listedEntries = (plugins: unknown): Record<string, unknown>[] =>
  Array.isArray(plugins) ? plugins.filter(isRecord) : [];

const entries = listedEntries(marketplace.contents?.plugins);

describe('the Claude Code marketplace', () => {
  it('installs the plugin from the repository root', () => {
    strict.deepStrictEqual(
      entries.map((entry) => entry.source),
      [REPOSITORY_ROOT]
    );
  });

  it('leaves the version to the plugin manifest, which the release moves', () => {
    strict.deepStrictEqual(
      entries.filter((entry) => 'version' in entry).map((entry) => entry.name),
      []
    );
  });
});

describe('the Claude Code plugin manifest', () => {
  it('finds the skills by convention, so the skills CLI groups none under it', () => {
    strict(
      manifest.contents !== undefined && !('skills' in manifest.contents),
      'it parses into an object that lists no skills'
    );
  });
});
