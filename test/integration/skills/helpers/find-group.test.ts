import { describe, it, strict } from 'poku';
import { SKILL_GROUPS } from '../../../../src/hooks/skills/groups.js';
import { findGroup } from '../../../../src/hooks/skills/skills.js';

describe('findGroup resolves a descriptor by exact key', () => {
  it('returns the descriptor for a known key', () => {
    const descriptor = findGroup(SKILL_GROUPS, 'owasp');

    if (!descriptor) throw new Error('expected a descriptor for owasp');

    strict.strictEqual(descriptor.key, 'owasp');
    strict.strictEqual(descriptor.label, 'OWASP');
    strict.strictEqual(typeof descriptor.description, 'string');
    strict.ok(descriptor.description.length > 0);
  });

  it('returns undefined for a wrong-case key', () => {
    strict.strictEqual(findGroup(SKILL_GROUPS, 'OWASP'), undefined);
  });

  it('returns undefined for an unknown key', () => {
    strict.strictEqual(findGroup(SKILL_GROUPS, 'nope'), undefined);
  });
});
