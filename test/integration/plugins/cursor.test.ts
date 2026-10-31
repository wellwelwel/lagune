import { describe, it, strict } from 'poku';
import { isRecord } from '../../../src/core/collections.js';
import { listedEntries, listTrackedPaths, readManifest } from './__utils__.js';

const REPOSITORY_ROOT = './';
const RELATIVE_PREFIX = /^\.\//;
// Read from the schemas of cursor/plugins at 4dd1d05, which refuse any other field, and from Cursor's docs, which also require an owner
const PLUGIN_FIELDS = [
  'name',
  'displayName',
  'description',
  'version',
  'minClientVersions',
  'author',
  'publisher',
  'homepage',
  'repository',
  'license',
  'logo',
  'keywords',
  'category',
  'tags',
  'commands',
  'agents',
  'skills',
  'rules',
  'hooks',
  'variables',
  'mcpServers',
];
const MARKETPLACE_FIELDS = ['name', 'owner', 'metadata', 'plugins'];
const MARKETPLACE_REQUIRED = ['name', 'owner', 'plugins'];
const ENTRY_FIELDS = ['name', 'source', 'description', 'minClientVersions'];
const ENTRY_REQUIRED = ['name', 'source'];
const PERSON_FIELDS = ['name', 'email'];

const manifest = await readManifest('.cursor-plugin/plugin.json');
const marketplace = await readManifest('.cursor-plugin/marketplace.json');
const entries = listedEntries(marketplace.contents?.plugins);
const tracked = await listTrackedPaths();

const unknownFields = (value: unknown, accepted: string[]): string[] =>
  isRecord(value)
    ? Object.keys(value).filter((field) => !accepted.includes(field))
    : [];

const missingFields = (value: unknown, required: string[]): string[] =>
  required.filter((field) => !isRecord(value) || value[field] === undefined);

const isPerson = (value: unknown): boolean =>
  isRecord(value) &&
  typeof value.name === 'string' &&
  value.name.length > 0 &&
  unknownFields(value, PERSON_FIELDS).length === 0;

describe('the Cursor plugin manifest', () => {
  it('carries only the fields the Cursor schema accepts', () => {
    const author = manifest.contents?.author;

    strict.deepStrictEqual(unknownFields(manifest.contents, PLUGIN_FIELDS), []);
    strict(
      author === undefined || isPerson(author),
      'its author has a name and at most an email'
    );
  });

  it('shows a logo committed to the repository, by a path from its root', () => {
    const logo = manifest.contents?.logo;

    strict(
      typeof logo === 'string' &&
        tracked.has(logo.replace(RELATIVE_PREFIX, '')),
      'the logo is a tracked file'
    );
  });
});

describe('the Cursor marketplace', () => {
  it('installs the plugin from the repository root', () => {
    strict.deepStrictEqual(
      entries.map((entry) => entry.source),
      [REPOSITORY_ROOT]
    );
  });

  it('carries only the fields the Cursor schema accepts, and every one it requires', () => {
    const contents = marketplace.contents;

    strict.deepStrictEqual(unknownFields(contents, MARKETPLACE_FIELDS), []);
    strict.deepStrictEqual(missingFields(contents, MARKETPLACE_REQUIRED), []);
    strict(
      isPerson(contents?.owner),
      'its owner has a name and at most an email'
    );
    strict.deepStrictEqual(
      entries.flatMap((entry) => unknownFields(entry, ENTRY_FIELDS)),
      []
    );
    strict.deepStrictEqual(
      entries.flatMap((entry) => missingFields(entry, ENTRY_REQUIRED)),
      []
    );
  });
});
