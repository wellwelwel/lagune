import type { ImageSize } from '../../../src/types/test.js';
import { readFile } from 'node:fs/promises';
import { describe, it, strict } from 'poku';
import { parse } from 'yaml.min';
import { isRecord } from '../../../src/core/collections.js';
import { folderOf, listFrontmatterSources } from '../skills/__utils__.js';
import {
  firstFound,
  listedEntries,
  listTrackedPaths,
  packageRoot,
  readManifest,
} from './__utils__.js';

const MANIFEST_LOOKUP = [
  '.codex-plugin/plugin.json',
  '.claude-plugin/plugin.json',
  '.cursor-plugin/plugin.json',
];

const MARKETPLACE_LOOKUP = [
  '.agents/plugins/marketplace.json',
  '.agents/plugins/api_marketplace.json',
  '.claude-plugin/marketplace.json',
  '.cursor-plugin/marketplace.json',
];

const TEXT_LIMITS = [
  ['displayName', 30],
  ['shortDescription', 30],
  ['longDescription', 4000],
  ['developerName', 80],
] as const;

const DIRECTORY_CATEGORIES = [
  'Productivity',
  'Creativity',
  'Developer Tools',
  'Business & Operations',
  'Data & Analytics',
  'Communication',
  'Education & Research',
  'Security',
  'Finance',
  'Healthcare',
  'Travel',
  'Entertainment',
  'Other',
];

const CAPABILITY_COUNT = 20;
const CAPABILITY_LENGTH = 120;
const PROMPT_COUNT = 3;
const PROMPT_LENGTH = 128;
const ICON_FIELDS = ['composerIcon', 'logo'];
const VIEW_BOX = /viewBox="([^"]+)"/;
const KEEPS_FROM_THE_MODEL = { policy: { allow_implicit_invocation: false } };

const tracked = await listTrackedPaths();
const manifest = await readManifest('.codex-plugin/plugin.json');
const marketplace = await readManifest('.agents/plugins/marketplace.json');
const listing = isRecord(manifest.contents?.interface)
  ? manifest.contents.interface
  : {};
const entries = listedEntries(marketplace.contents?.plugins);
const skills = await listFrontmatterSources(
  new URL('skills/', packageRoot),
  (relativePath) => relativePath.endsWith('SKILL.md')
);

const stringsOf = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((entry) => typeof entry === 'string')
    : [];

const measureImage = async (path: string): Promise<ImageSize> => {
  const image = await readFile(new URL(path, packageRoot));

  if (path.endsWith('.png'))
    return { width: image.readUInt32BE(16), height: image.readUInt32BE(20) };

  const [, , width, height] = (
    image.toString('utf8').match(VIEW_BOX)?.[1] ?? ''
  )
    .split(/\s+/)
    .map(Number);

  return { width, height };
};

const readPolicy = async (folder: string): Promise<unknown> => {
  const text = await readFile(
    new URL(`skills/${folder}/agents/openai.yaml`, packageRoot),
    'utf8'
  ).catch(() => undefined);

  return text === undefined ? undefined : parse<unknown>(text);
};

const isKeptFromTheModel = (frontmatter: string): boolean => {
  const parsed = parse<unknown>(frontmatter);

  return isRecord(parsed) && parsed['disable-model-invocation'] === true;
};

describe('the Codex plugin', () => {
  it('reads its own manifest, the first its lookup reaches', () => {
    strict.strictEqual(
      firstFound(MANIFEST_LOOKUP, tracked),
      '.codex-plugin/plugin.json'
    );
  });

  it('installs through its own marketplace, the first its lookup reaches', () => {
    strict.strictEqual(
      firstFound(MARKETPLACE_LOOKUP, tracked),
      '.agents/plugins/marketplace.json'
    );
  });

  it('installs the plugin from the repository root', () => {
    strict.deepStrictEqual(
      entries.map((entry) => entry.source),
      [{ source: 'local', path: './' }]
    );
  });

  it('declares no hooks, so a hook file at the root never reaches Codex', () => {
    strict.deepStrictEqual(manifest.contents?.hooks, {});
  });
});

await describe('the Codex directory listing', async () => {
  for (const [field, limit] of TEXT_LIMITS)
    it(`fills ${field} within ${limit} characters`, () => {
      const value = listing[field];
      const text = typeof value === 'string' ? value : '';

      strict(text.trim().length > 0, `${field} is filled`);
      strict(text.length <= limit, `${text.length} characters`);
    });

  it('files Lagune under a directory category, in the manifest and in the marketplace entry that overrides it', () => {
    const categories = [listing, ...entries].map(({ category }) =>
      String(category)
    );

    strict.deepStrictEqual(
      categories.filter((category) => !DIRECTORY_CATEGORIES.includes(category)),
      []
    );
  });

  it('lists its capabilities within the count and length limits', () => {
    const capabilities = stringsOf(listing.capabilities);

    strict(capabilities.length > 0 && capabilities.length <= CAPABILITY_COUNT);
    strict.deepStrictEqual(
      capabilities.filter((label) => label.length > CAPABILITY_LENGTH),
      []
    );
  });

  it('offers starter prompts within the count and length limits', () => {
    const prompts = stringsOf(listing.defaultPrompt);

    strict(prompts.length > 0 && prompts.length <= PROMPT_COUNT);
    strict.deepStrictEqual(
      prompts.filter((prompt) => prompt.length > PROMPT_LENGTH),
      []
    );
  });

  for (const field of ICON_FIELDS)
    await it(`points ${field} at a square image the plugin ships`, async () => {
      const path = String(listing[field]).replace(/^\.\//, '');
      const { width, height } = await measureImage(path);

      strict(tracked.has(path), `${path} is tracked`);
      strict(width > 0 && width === height, `${width} by ${height}`);
    });
});

await describe('the commands Codex keeps from the model', async () => {
  const folders = skills.map(({ relativePath }) => folderOf(relativePath));
  const policies = await Promise.all(folders.map(readPolicy));
  const keptByCodex = Object.fromEntries(
    folders
      .map((folder, index) => [folder, policies[index]])
      .filter(([, policy]) => policy !== undefined)
  );
  const keptByEveryAgent = Object.fromEntries(
    skills
      .filter(({ frontmatter }) => isKeptFromTheModel(frontmatter))
      .map(({ relativePath }) => [folderOf(relativePath), KEEPS_FROM_THE_MODEL])
  );

  it('are exactly the ones every other agent keeps from it', () => {
    strict.deepStrictEqual(keptByCodex, keptByEveryAgent);
  });
});
