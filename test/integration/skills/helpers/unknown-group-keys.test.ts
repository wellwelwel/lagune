import { describe, it, strict } from 'poku';
import { SKILL_GROUPS } from '../../../../src/hooks/skills/groups.js';
import { unknownGroupKeys } from '../../../../src/hooks/skills/skills.js';

describe('unknownGroupKeys reports keys with no registered group', () => {
  it('returns the unregistered keys in the order requested', () => {
    strict.deepStrictEqual(unknownGroupKeys(SKILL_GROUPS, ['owasp', 'nope']), [
      'nope',
    ]);
  });

  it('returns [] when every key is registered', () => {
    strict.deepStrictEqual(
      unknownGroupKeys(SKILL_GROUPS, ['owasp', 'javascript']),
      []
    );
  });

  it('treats a wrong-case key as unknown', () => {
    strict.deepStrictEqual(unknownGroupKeys(SKILL_GROUPS, ['OWASP']), [
      'OWASP',
    ]);
  });
});
