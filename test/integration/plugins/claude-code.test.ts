import { posix } from 'node:path';
import { describe, it, strict } from 'poku';
import {
  listBundledPaths,
  listedEntries,
  readDeclaredServer,
  readManifest,
} from './__utils__.js';

const CLAUDE_BRANCH = {
  source: 'github',
  repo: 'wellwelwel/lagune',
  ref: 'plugin-claude',
};

const manifest = await readManifest('.claude-plugin/plugin.json');
const marketplace = await readManifest('.claude-plugin/marketplace.json');
const entries = listedEntries(marketplace.contents?.plugins);
const bundled = await listBundledPaths('claude');
const engineServer = await readDeclaredServer(
  'scripts/plugins/claude/.mcp.json'
);

describe('the Claude Code marketplace', () => {
  it('installs the plugin from its branch, which carries the engine', () => {
    strict.deepStrictEqual(
      entries.map((entry) => entry.source),
      [CLAUDE_BRANCH]
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

describe('the Claude plugin branch, which the Anthropic directory reviews', () => {
  it('shows the engine tools from the first turn instead of deferring them', () => {
    strict(
      engineServer.alwaysLoad === true,
      'the server opts out of tool search'
    );
  });

  it('carries the icon the manifest names, which the directory takes only at the first submission', () => {
    const icon = manifest.contents?.icon;

    strict(
      typeof icon === 'string' && bundled.has(posix.normalize(icon)),
      'the manifest names an icon the branch carries'
    );
  });
});
