import { mkdir, mkdtemp, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { SKILLS_CATALOG } from '../../../src/hooks/skills/catalog.js';
import { discoverSkills } from '../../../src/hooks/skills/discover.js';
import { list, merge } from '../../../src/hooks/skills/skills.js';

const packageRoot = new URL('../../../', import.meta.url);

describe('list formats the catalog as a readable listing', () => {
  it('prints one line per sub-skill with its name and tags', () => {
    const output = list([
      { name: 'alpha', tags: ['one', 'two'] },
      { name: 'beta', tags: ['three'] },
    ]);

    strict.strictEqual(output, 'alpha: one, two\nbeta: three\n');
  });

  it('prints the bare name for a sub-skill with no tags', () => {
    strict.strictEqual(list([{ name: 'alpha', tags: [] }]), 'alpha\n');
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
    const builtin = [{ name: 'regex', tags: ['RegExp'] }];

    strict.deepStrictEqual(merge(builtin, []), builtin);
  });

  it('appends a user sub-skill that does not collide', () => {
    const merged = merge(
      [{ name: 'regex', tags: ['RegExp'] }],
      [{ name: 'graphql', tags: ['GraphQL'] }]
    );

    strict.deepStrictEqual(merged, [
      { name: 'regex', tags: ['RegExp'] },
      { name: 'graphql', tags: ['GraphQL'] },
    ]);
  });

  it('lets the user sub-skill win a name collision', () => {
    const merged = merge(
      [{ name: 'regex', tags: ['RegExp'] }],
      [{ name: 'regex', tags: ['custom'] }]
    );

    strict.deepStrictEqual(merged, [{ name: 'regex', tags: ['custom'] }]);
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
          { name: 'graphql', tags: ['GraphQL', 'gql'] },
        ]);
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
