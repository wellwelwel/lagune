import { describe, it, strict } from 'poku';
import { groupKeysForSkill } from '../../../../src/hooks/skills/skills.js';

describe('groupKeysForSkill narrows candidates to a sub-skill', () => {
  const catalog = [
    { name: 'shared', tags: [], groups: ['owasp', 'javascript'] },
  ];

  it('keeps the single candidate key whose group has the sub-skill', () => {
    strict.deepStrictEqual(
      groupKeysForSkill(catalog, 'shared', ['javascript']),
      ['javascript']
    );
  });

  it('keeps every candidate key whose group has the sub-skill', () => {
    strict.deepStrictEqual(
      groupKeysForSkill(catalog, 'shared', ['owasp', 'javascript']),
      ['owasp', 'javascript']
    );
  });

  it('returns [] for a name absent from the catalog', () => {
    strict.deepStrictEqual(
      groupKeysForSkill(catalog, 'missing', ['owasp', 'javascript']),
      []
    );
  });
});
