import { describe, it, strict } from 'poku';
import { isRecord, isStringArray } from '../../../src/core/collections.js';
import { ENGINE_TOOLS } from '../../../src/mcp/tools.js';
import {
  firstFound,
  listBundledPaths,
  readDeclaredServer,
  readManifest,
} from './__utils__.js';

const OVERLAY = 'scripts/plugins/antigravity';

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

const { contents = {} } = await readManifest(
  `${OVERLAY}/.antigravity-plugin/plugin.json`
);
const server = await readDeclaredServer(`${OVERLAY}/mcp_config.json`);
const bundled = await listBundledPaths('antigravity');
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
      typeof contents.logo === 'string' && bundled.has(contents.logo),
      'its branch carries the logo'
    );
  });

  it('holds only keys Antigravity recognizes, so strict validation passes', () => {
    strict.deepStrictEqual(
      Object.keys(contents).filter((key) => !RECOGNIZED_KEYS.includes(key)),
      []
    );
  });
});

describe('the Antigravity plugin branch', () => {
  it('carries its own manifest, the first one Antigravity looks up', () => {
    strict.strictEqual(
      firstFound(MANIFEST_LOOKUP, bundled),
      '.antigravity-plugin/plugin.json'
    );
  });

  it('loads both engine tools up front, instead of behind a tool search', () => {
    const declared = isRecord(server.tools) ? server.tools : {};

    strict.deepStrictEqual(
      ENGINE_TOOLS.map(({ name }) => name).filter(
        (name) => !isRecord(declared[name]) || declared[name].eager !== true
      ),
      []
    );
  });
});
