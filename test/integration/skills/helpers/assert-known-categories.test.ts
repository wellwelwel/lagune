import { describe, it, strict } from 'poku';
import { SKILL_GROUPS } from '../../../../src/hooks/skills/groups.js';
import { assertKnownCategories } from '../../../../src/hooks/skills/skills.js';

describe('assertKnownCategories rejects unregistered category keys', () => {
  it('throws naming the unregistered key and the available categories', () => {
    strict.throws(
      () => assertKnownCategories(SKILL_GROUPS, ['owasp', 'nope']),
      (error: Error) =>
        error.message.includes('Unknown specialization category: nope') &&
        error.message.includes('Available categories: owasp')
    );
  });

  it('passes when every key is registered', () => {
    strict.doesNotThrow(() =>
      assertKnownCategories(SKILL_GROUPS, ['owasp', 'javascript'])
    );
  });

  it('passes for no keys', () => {
    strict.doesNotThrow(() => assertKnownCategories(SKILL_GROUPS, []));
  });
});
