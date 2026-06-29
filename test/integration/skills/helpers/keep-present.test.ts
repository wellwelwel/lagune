import { describe, it, strict } from 'poku';
import { SKILLS_CATALOG } from '../../../../src/hooks/skills/catalog.js';
import { keepPresent } from '../../../../src/hooks/skills/skills.js';

describe('keepPresent filters the catalog to present sub-skills', () => {
  it('keeps only the entry whose name is present', () => {
    strict.deepStrictEqual(keepPresent(SKILLS_CATALOG, ['regex']), [
      {
        name: 'regex',
        tags: ['Regular Expression'],
        groups: ['owasp'],
        required: true,
      },
    ]);
  });

  it('returns [] when none are present', () => {
    strict.deepStrictEqual(keepPresent(SKILLS_CATALOG, []), []);
  });
});
