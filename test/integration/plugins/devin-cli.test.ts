import { describe, it, strict } from 'poku';
import { firstFound, listTrackedPaths, readManifest } from './__utils__.js';

const MANIFEST_LOOKUP = [
  '.devin-plugin/plugin.json',
  '.claude-plugin/plugin.json',
  'plugin.json',
];

const DESCRIPTION_MIN = 60;
const DESCRIPTION_MAX = 130;
const SHORT_DESCRIPTION_MAX = 40;
const LOGO_SEGMENT = /^[\w-]+$/;
const LOGO_EXTENSIONS = ['.svg', '.png', '.jpg', '.jpeg', '.webp'];

const tracked = await listTrackedPaths();
const manifest = await readManifest('.devin-plugin/plugin.json');
const description = String(manifest.contents?.description ?? '');
const shortDescription = String(manifest.contents?.shortDescription ?? '');
const logo = String(manifest.contents?.logo ?? '');

describe('the Devin CLI plugin', () => {
  it('reads its own manifest, the first its lookup reaches', () => {
    strict.strictEqual(
      firstFound(MANIFEST_LOOKUP, tracked),
      '.devin-plugin/plugin.json'
    );
  });

  it('describes itself in one sentence the marketplace card fits', () => {
    strict(description.length >= DESCRIPTION_MIN, 'at least 60 characters');
    strict(description.length <= DESCRIPTION_MAX, 'at most 130 characters');
    strict(!description.endsWith('.'), 'no final period');
  });

  it('keeps its short description within the marketplace limit', () => {
    strict(shortDescription.length > 0, 'it has one');
    strict(
      shortDescription.length <= SHORT_DESCRIPTION_MAX,
      'at most 40 characters'
    );
  });

  it('shows a logo the marketplace accepts, shipped inside the plugin', () => {
    const extension = logo.slice(logo.lastIndexOf('.'));
    const segments = logo.slice(0, logo.lastIndexOf('.')).split('/');

    strict(LOGO_EXTENSIONS.includes(extension), 'an image the card renders');
    strict(
      segments.every((segment) => LOGO_SEGMENT.test(segment)),
      'a relative path the marketplace accepts'
    );
    strict(tracked.has(logo), 'a file the plugin ships');
  });
});
