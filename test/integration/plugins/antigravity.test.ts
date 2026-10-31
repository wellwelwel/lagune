import { describe, it, strict } from 'poku';
import { isStringArray } from '../../../src/core/collections.js';
import { firstFound, listTrackedPaths, readManifest } from './__utils__.js';

const MANIFEST_LOOKUP = [
  '.antigravity-plugin/plugin.json',
  'plugin.json',
  '.gemini-plugin/plugin.json',
  'gemini-extension.json',
  '.claude-plugin/plugin.json',
];

const LISTING_TEXT_FIELDS = ['displayName', 'description', 'logo'];
const DESCRIPTION_LIMIT = 160;
const MAX_PROMPTS = 3;

const RECOGNIZED_KEYS = [
  '$schema',
  'name',
  'displayName',
  'display_name',
  'description',
  'version',
  'disabled',
  'logo',
  'suggestedPrompts',
  'suggested_prompts',
  'skills',
  'author',
  'homepage',
  'repository',
  'license',
  'keywords',
  'extensions',
];

const LOADED_FROM_AN_ANTIGRAVITY_ROOT = [
  'rules.json',
  'agents.json',
  'mcp.json',
  'mcp_config.json',
];

const { contents = {} } = await readManifest('.antigravity-plugin/plugin.json');
const tracked = await listTrackedPaths();
const prompts = isStringArray(contents.suggestedPrompts)
  ? contents.suggestedPrompts
  : [];

const isFilled = (value: unknown): boolean =>
  typeof value === 'string' && value.trim().length > 0;

describe('the Antigravity plugin manifest', () => {
  it('fills the listing card: a display name, a description, a logo, an author, and one to three prompts', () => {
    strict.deepStrictEqual(
      LISTING_TEXT_FIELDS.filter((field) => !isFilled(contents[field])),
      []
    );
    strict(contents.author !== undefined, 'it names an author');
    strict(prompts.length >= 1 && prompts.length <= MAX_PROMPTS);
    strict(prompts.every(isFilled), 'no prompt is blank');
  });

  it('keeps its description within what a listing card shows', () => {
    strict(
      typeof contents.description === 'string' &&
        [...contents.description].length <= DESCRIPTION_LIMIT
    );
  });

  it('shows a logo the plugin ships', () => {
    strict(
      typeof contents.logo === 'string' && tracked.has(contents.logo),
      'its logo is a tracked file'
    );
  });

  it('holds only keys Antigravity recognizes, so strict validation passes', () => {
    strict.deepStrictEqual(
      Object.keys(contents).filter((key) => !RECOGNIZED_KEYS.includes(key)),
      []
    );
  });
});

describe('the Antigravity plugin', () => {
  it('reads its own manifest, ahead of the Gemini CLI one it fails to import', () => {
    strict.strictEqual(
      firstFound(MANIFEST_LOOKUP, tracked),
      '.antigravity-plugin/plugin.json'
    );
  });

  it('loads nothing from the repository root beside the skills', () => {
    strict.deepStrictEqual(
      LOADED_FROM_AN_ANTIGRAVITY_ROOT.filter((path) => tracked.has(path)),
      []
    );
  });
});
