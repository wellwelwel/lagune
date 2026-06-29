import { describe, it, strict } from 'poku';
import { SKILLS_CATALOG } from '../../../../src/hooks/skills/catalog.js';
import { SKILL_GROUPS } from '../../../../src/hooks/skills/groups.js';
import { skillsInGroup } from '../../../../src/hooks/skills/skills.js';

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
