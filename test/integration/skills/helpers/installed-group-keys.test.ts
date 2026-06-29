import { describe, it, strict } from 'poku';
import { SKILLS_CATALOG } from '../../../../src/hooks/skills/catalog.js';
import { SKILL_GROUPS } from '../../../../src/hooks/skills/groups.js';
import { installedGroupKeys } from '../../../../src/hooks/skills/skills.js';

describe('installedGroupKeys lists groups with a present built-in', () => {
  it('claims a group once any of its sub-skills is present', () => {
    strict.deepStrictEqual(
      installedGroupKeys(SKILL_GROUPS, SKILLS_CATALOG, ['regex', 'network']),
      ['owasp']
    );
  });

  it('claims every group whose sub-skills are present', () => {
    strict.deepStrictEqual(
      installedGroupKeys(SKILL_GROUPS, SKILLS_CATALOG, [
        'regex',
        'network',
        'javascript',
      ]),
      ['owasp', 'javascript']
    );
  });

  it('claims a group from a single present member', () => {
    strict.deepStrictEqual(
      installedGroupKeys(SKILL_GROUPS, SKILLS_CATALOG, ['regex']),
      ['owasp']
    );
  });

  it('claims every group a multi-group member belongs to, in registry order', () => {
    strict.deepStrictEqual(
      installedGroupKeys(SKILL_GROUPS, SKILLS_CATALOG, ['browser']),
      ['lovable', 'javascript']
    );
  });

  it('returns [] when nothing is present', () => {
    strict.deepStrictEqual(
      installedGroupKeys(SKILL_GROUPS, SKILLS_CATALOG, []),
      []
    );
  });
});
