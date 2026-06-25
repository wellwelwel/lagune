import { mkdir, mkdtemp, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { SKILLS_CATALOG } from '../../../src/hooks/skills/catalog.js';
import { discoverSkills } from '../../../src/hooks/skills/discover.js';
import { SKILL_GROUPS } from '../../../src/hooks/skills/groups.js';
import {
  findGroup,
  list,
  merge,
  skillsInGroup,
} from '../../../src/hooks/skills/skills.js';

const packageRoot = new URL('../../../', import.meta.url);

describe('list formats the catalog as a readable listing', () => {
  it('prints one line per sub-skill with its name and tags', () => {
    const output = list([
      { name: 'alpha', tags: ['one', 'two'], groups: [] },
      { name: 'beta', tags: ['three'], groups: [] },
    ]);

    strict.strictEqual(output, 'alpha: one, two\nbeta: three\n');
  });

  it('prints the bare name for a sub-skill with no tags', () => {
    strict.strictEqual(
      list([{ name: 'alpha', tags: [], groups: [] }]),
      'alpha\n'
    );
  });

  for (const entry of SKILLS_CATALOG)
    it('never repeats the name inside its own tags', () => {
      strict(
        !entry.tags.includes(entry.name),
        `${entry.name} should not list its own name as a tag`
      );
    });

  it('reports plainly when the catalog is empty', () => {
    strict.strictEqual(list([]), 'No sub-skills available.\n');
  });
});

describe('merge folds user sub-skills into the built-in catalog', () => {
  it('keeps every built-in when the user adds nothing', () => {
    const builtin = [{ name: 'regex', tags: ['RegExp'], groups: ['owasp'] }];

    strict.deepStrictEqual(merge(builtin, []), builtin);
  });

  it('appends a user sub-skill, carrying its groups through the spread', () => {
    const merged = merge(
      [{ name: 'regex', tags: ['RegExp'], groups: ['owasp'] }],
      [{ name: 'graphql', tags: ['GraphQL'], groups: [] }]
    );

    strict.deepStrictEqual(merged, [
      { name: 'regex', tags: ['RegExp'], groups: ['owasp'] },
      { name: 'graphql', tags: ['GraphQL'], groups: [] },
    ]);
  });

  it('lets the user sub-skill win a collision, replacing the built-in groups', () => {
    const merged = merge(
      [{ name: 'regex', tags: ['RegExp'], groups: ['owasp'] }],
      [{ name: 'regex', tags: ['custom'], groups: [] }]
    );

    strict.deepStrictEqual(merged, [
      { name: 'regex', tags: ['custom'], groups: [] },
    ]);
  });
});

await describe('discoverSkills reads the user catalog and fails closed', async () => {
  const withWorkspace = async (
    contents: string | null,
    assert: (entries: Awaited<ReturnType<typeof discoverSkills>>) => void
  ) => {
    const workspace = await mkdtemp(join(tmpdir(), 'blue-spec-discover-'));

    try {
      if (contents !== null) {
        await mkdir(join(workspace, '.bluespec'), { recursive: true });
        await writeFile(
          join(workspace, '.bluespec', 'skills.json'),
          contents,
          'utf8'
        );
      }

      assert(await discoverSkills(workspace));
    } finally {
      await rm(workspace, { recursive: true, force: true });
    }
  };

  await it('returns [] when the catalog is missing', async () => {
    await withWorkspace(null, (entries) => {
      strict.deepStrictEqual(entries, []);
    });
  });

  await it('returns [] when the catalog is malformed JSON', async () => {
    await withWorkspace('{ not json', (entries) => {
      strict.deepStrictEqual(entries, []);
    });
  });

  await it('parses valid entries and drops malformed ones', async () => {
    await withWorkspace(
      JSON.stringify({
        name: 'blue-spec',
        entries: [
          { name: 'graphql', tags: ['GraphQL', 'gql'] },
          { name: 'broken' },
          { tags: ['no name'] },
        ],
      }),
      (entries) => {
        strict.deepStrictEqual(entries, [
          { name: 'graphql', tags: ['GraphQL', 'gql'], groups: [] },
        ]);
      }
    );
  });

  await it('defaults a missing groups field to an empty array', async () => {
    await withWorkspace(
      JSON.stringify({
        name: 'blue-spec',
        entries: [{ name: 'graphql', tags: ['GraphQL'] }],
      }),
      (entries) => {
        strict.deepStrictEqual(entries, [
          { name: 'graphql', tags: ['GraphQL'], groups: [] },
        ]);
      }
    );
  });

  await it('round-trips a valid groups field', async () => {
    await withWorkspace(
      JSON.stringify({
        name: 'blue-spec',
        entries: [{ name: 'graphql', tags: ['GraphQL'], groups: ['owasp'] }],
      }),
      (entries) => {
        strict.deepStrictEqual(entries, [
          { name: 'graphql', tags: ['GraphQL'], groups: ['owasp'] },
        ]);
      }
    );
  });

  await it('drops an entry whose groups is present but not a string array', async () => {
    await withWorkspace(
      JSON.stringify({
        name: 'blue-spec',
        entries: [{ name: 'graphql', tags: ['GraphQL'], groups: 5 }],
      }),
      (entries) => {
        strict.deepStrictEqual(entries, []);
      }
    );
  });
});

await describe('the catalog and the sub-skill files stay in sync', async () => {
  const skillFiles = (
    await readdir(new URL('spec/skills/', packageRoot))
  ).filter((entry) => entry.endsWith('.md'));
  const fileNames = new Set(
    skillFiles.map((file) => file.replace(/\.md$/, ''))
  );
  const catalogNames = new Set(SKILLS_CATALOG.map((entry) => entry.name));

  for (const name of catalogNames)
    it('points every catalog entry at an existing sub-skill file', () => {
      strict(fileNames.has(name), `${name} has no spec/skills/${name}.md`);
    });

  for (const name of fileNames)
    it('lists every sub-skill file in the catalog', () => {
      strict(
        catalogNames.has(name),
        `spec/skills/${name}.md is not in the catalog`
      );
    });
});

describe('skillsInGroup derives membership by exact key', () => {
  it('returns the sub-skills of a group in catalog order', () => {
    strict.deepStrictEqual(skillsInGroup(SKILLS_CATALOG, 'owasp'), [
      'regex',
      'ssrf',
    ]);
    strict.deepStrictEqual(skillsInGroup(SKILLS_CATALOG, 'javascript'), [
      'javascript',
      'browser',
    ]);
  });

  it('matches the key strictly, never the display label', () => {
    strict.deepStrictEqual(skillsInGroup(SKILLS_CATALOG, 'OWASP'), []);
  });

  it('returns [] for an unknown key', () => {
    strict.deepStrictEqual(skillsInGroup(SKILLS_CATALOG, 'nope'), []);
  });

  it('places a multi-group sub-skill under every one of its keys', () => {
    const catalog = [
      { name: 'shared', tags: [], groups: ['owasp', 'javascript'] },
    ];

    strict.deepStrictEqual(skillsInGroup(catalog, 'owasp'), ['shared']);
    strict.deepStrictEqual(skillsInGroup(catalog, 'javascript'), ['shared']);
  });
});

describe('findGroup resolves a descriptor by exact key', () => {
  it('returns the descriptor for a known key', () => {
    strict.deepStrictEqual(findGroup(SKILL_GROUPS, 'owasp'), {
      key: 'owasp',
      label: 'OWASP',
      description: 'OWASP Top 10 risks',
    });
  });

  it('returns undefined for a wrong-case key', () => {
    strict.strictEqual(findGroup(SKILL_GROUPS, 'OWASP'), undefined);
  });

  it('returns undefined for an unknown key', () => {
    strict.strictEqual(findGroup(SKILL_GROUPS, 'nope'), undefined);
  });
});

describe('the group registry and the catalog stay in sync', () => {
  const groupKeys = new Set(SKILL_GROUPS.map((group) => group.key));

  for (const entry of SKILLS_CATALOG)
    for (const key of entry.groups)
      it('points every catalog group key at a registered group', () => {
        strict(
          groupKeys.has(key),
          `${entry.name} references unknown group ${key}`
        );
      });

  for (const group of SKILL_GROUPS)
    it('claims every registered group with at least one sub-skill', () => {
      strict(
        skillsInGroup(SKILLS_CATALOG, group.key).length > 0,
        `group ${group.key} has no sub-skills`
      );
    });

  it('keeps group keys unique and lowercase', () => {
    strict.strictEqual(groupKeys.size, SKILL_GROUPS.length);

    for (const group of SKILL_GROUPS)
      strict.strictEqual(
        group.key,
        group.key.toLowerCase(),
        `group key ${group.key} is not lowercase`
      );
  });

  for (const entry of SKILLS_CATALOG)
    it('claims every built-in sub-skill in at least one group', () => {
      strict(
        entry.groups.length > 0,
        `built-in ${entry.name} belongs to no group`
      );
    });
});
