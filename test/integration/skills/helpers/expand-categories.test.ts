import { describe, it, strict } from 'poku';
import { SKILL_GROUPS } from '../../../../src/hooks/skills/groups.js';
import { expandCategories } from '../../../../src/hooks/skills/skills.js';

describe('expandCategories resolves the reserved all selector', () => {
  it('returns every registered key in registry order for all', () => {
    strict.deepStrictEqual(
      expandCategories(SKILL_GROUPS, ['all']),
      SKILL_GROUPS.map((group) => group.key)
    );
  });

  it('expands all even when mixed with other keys', () => {
    strict.deepStrictEqual(
      expandCategories(SKILL_GROUPS, ['owasp', 'all']),
      SKILL_GROUPS.map((group) => group.key)
    );
  });

  it('returns the keys unchanged when all is absent', () => {
    strict.deepStrictEqual(expandCategories(SKILL_GROUPS, ['owasp']), [
      'owasp',
    ]);
  });

  it('returns [] for no keys', () => {
    strict.deepStrictEqual(expandCategories(SKILL_GROUPS, []), []);
  });
});
