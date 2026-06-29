import { describe, it, strict } from 'poku';
import { SKILLS_CATALOG } from '../../../../src/hooks/skills/catalog.js';
import { list } from '../../../../src/hooks/skills/skills.js';

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

  it('suffixes a required entry that has tags', () => {
    strict.strictEqual(
      list([
        {
          name: 'regex',
          tags: ['Regular Expression'],
          groups: [],
          required: true,
        },
      ]),
      'regex: Regular Expression [required]\n'
    );
  });

  it('suffixes a required entry that has no tags', () => {
    strict.strictEqual(
      list([{ name: 'alpha', tags: [], groups: [], required: true }]),
      'alpha [required]\n'
    );
  });

  it('leaves a non-required entry unsuffixed', () => {
    strict.strictEqual(
      list([{ name: 'alpha', tags: ['one'], groups: [], required: false }]),
      'alpha: one\n'
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
