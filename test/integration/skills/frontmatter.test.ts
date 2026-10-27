import type { Frontmatter } from '../../../src/types/test.js';
import { describe, it, strict } from 'poku';
import { parse } from 'yaml.min';
import {
  folderOf,
  listFrontmatterSources,
  packageRoot,
  readInstalledSkills,
} from './__utils__.js';

const SKILL_KEYS: Record<keyof Required<Frontmatter>, true> = {
  name: true,
  description: true,
  'argument-hint': true,
  'user-invocable': true,
  'disable-model-invocation': true,
  metadata: true,
};

const { metadata, ...PUBLISHED_KEYS } = SKILL_KEYS;

const ON_REQUEST_ONLY = ['lagune.prove', 'lagune.specialize'];

const isSkill = (relativePath: string): boolean =>
  relativePath.endsWith('SKILL.md');

const published = await listFrontmatterSources(
  new URL('skills/', packageRoot),
  isSkill
);

const development = await listFrontmatterSources(
  new URL('.claude/skills/', packageRoot),
  isSkill
);

const installedSkills = await readInstalledSkills();

const isStringMap = (value: unknown): boolean =>
  typeof value === 'object' &&
  value !== null &&
  Object.values(value).every((entry) => typeof entry === 'string');

const assertMetadata = (metadata: unknown, installed: boolean): void => {
  if (installed) {
    strict(
      isStringMap(metadata),
      'an installed skill carries its provenance as strings'
    );
    return;
  }

  strict.deepStrictEqual(
    metadata,
    { internal: true },
    'metadata carries only the skills.sh internal marker'
  );
};

const assertValid = (
  frontmatter: string,
  allowed: Record<string, true>,
  installed = false
): Frontmatter => {
  const parsed = parse<Frontmatter>(frontmatter);

  strict(
    typeof parsed === 'object' && parsed !== null,
    'frontmatter should parse to an object'
  );

  strict.strictEqual(
    typeof parsed.description,
    'string',
    'description is required and must be a string'
  );

  if ('name' in parsed)
    strict.strictEqual(
      typeof parsed.name,
      'string',
      'name must be a string when present'
    );

  if ('user-invocable' in parsed)
    strict.strictEqual(
      typeof parsed['user-invocable'],
      'boolean',
      'user-invocable must be a boolean when present'
    );

  if ('disable-model-invocation' in parsed)
    strict.strictEqual(
      typeof parsed['disable-model-invocation'],
      'boolean',
      'disable-model-invocation must be a boolean when present'
    );

  if ('metadata' in parsed) assertMetadata(parsed.metadata, installed);

  const unknownKeys = Object.keys(parsed).filter((key) => !(key in allowed));

  strict.deepStrictEqual(
    unknownKeys,
    [],
    `unexpected frontmatter keys: ${unknownKeys.join(', ')}`
  );

  return parsed;
};

describe('every published skill is discoverable and well-formed', () => {
  for (const { relativePath, frontmatter } of published)
    it(`skills/${relativePath} names its folder and stays visible`, () => {
      const parsed = assertValid(frontmatter, PUBLISHED_KEYS);
      const folder = folderOf(relativePath);

      strict.strictEqual(parsed.name, folder);
      strict.strictEqual(typeof parsed['argument-hint'], 'string');
      strict.strictEqual(parsed['user-invocable'], true);
      strict.strictEqual(
        parsed['disable-model-invocation'] === true,
        ON_REQUEST_ONLY.includes(folder),
        'only prove and specialize stay out of model invocation'
      );
    });
});

describe('every repository skill frontmatter is valid and well-typed', () => {
  it('finds SKILL.md files under .claude/skills', () => {
    strict(
      development.length > 0,
      'at least one SKILL.md should declare frontmatter'
    );
  });

  for (const { relativePath, frontmatter } of development)
    it(`.claude/skills/${relativePath} declares only known keys`, () => {
      assertValid(
        frontmatter,
        SKILL_KEYS,
        installedSkills.has(folderOf(relativePath))
      );
    });
});
