import { describe, it, strict } from 'poku';
import { merge } from '../../../../src/hooks/skills/skills.js';

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

  it('preserves required on a built-in carried through the merge', () => {
    const merged = merge(
      [{ name: 'regex', tags: ['RegExp'], groups: ['owasp'], required: true }],
      []
    );

    strict.deepStrictEqual(merged, [
      { name: 'regex', tags: ['RegExp'], groups: ['owasp'], required: true },
    ]);
  });

  it('drops required when the user overrides a required built-in', () => {
    const merged = merge(
      [{ name: 'regex', tags: ['RegExp'], groups: ['owasp'], required: true }],
      [{ name: 'regex', tags: ['custom'], groups: [] }]
    );

    strict.deepStrictEqual(merged, [
      { name: 'regex', tags: ['custom'], groups: [] },
    ]);
  });
});
