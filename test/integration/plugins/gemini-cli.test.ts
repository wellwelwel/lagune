import { describe, it, strict } from 'poku';
import {
  isLeftOutOfArchives,
  listTrackedPaths,
  readManifest,
} from './__utils__.js';

const POLICIES_FOLDER = 'policies/';
const CONTRIBUTOR_GUIDE = 'CLAUDE.md';

const manifest = await readManifest('gemini-extension.json');
const tracked = await listTrackedPaths();

await describe('the Gemini CLI extension', async () => {
  it('carries the version Gemini CLI requires to load it', () => {
    strict.strictEqual(typeof manifest.contents?.version, 'string');
  });

  it('loads no context file into the sessions of the user', () => {
    strict.deepStrictEqual(manifest.contents?.contextFileName, []);
  });

  it('ships no policy rules, which Gemini CLI loads from the repository root', () => {
    strict.deepStrictEqual(
      [...tracked].filter((path) => path.startsWith(POLICIES_FOLDER)),
      []
    );
  });

  await it('installs a release without the contributor guide, which a file read could load as context', async () => {
    const leftOut = await isLeftOutOfArchives(CONTRIBUTOR_GUIDE);

    strict(leftOut, 'release archives leave the contributor guide out');
  });
});
