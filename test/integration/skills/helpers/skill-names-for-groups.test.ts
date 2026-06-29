import { describe, it, strict } from 'poku';
import { SKILLS_CATALOG } from '../../../../src/hooks/skills/catalog.js';
import { skillNamesForGroups } from '../../../../src/hooks/skills/skills.js';

describe('skillNamesForGroups collects sub-skills across keys', () => {
  it('returns the sub-skills of a single key in catalog order', () => {
    strict.deepStrictEqual(skillNamesForGroups(SKILLS_CATALOG, ['owasp']), [
      'regex',
      'network',
      'interpreter',
      'path',
      'upload',
      'access-control',
      'credential-endpoint',
      'federation',
      'http-request',
      'transport',
      'crypto',
      'api-endpoint',
      'payment',
      'xml',
      'csv',
      'container',
      'serverless',
    ]);
  });

  it('merges multiple keys, preserving catalog order over key order', () => {
    strict.deepStrictEqual(
      skillNamesForGroups(SKILLS_CATALOG, ['owasp', 'javascript']),
      [
        'regex',
        'javascript',
        'browser',
        'network',
        'interpreter',
        'path',
        'upload',
        'access-control',
        'credential-endpoint',
        'federation',
        'http-request',
        'transport',
        'crypto',
        'api-endpoint',
        'payment',
        'xml',
        'csv',
        'container',
        'serverless',
      ]
    );
  });

  it('returns [] for no keys', () => {
    strict.deepStrictEqual(skillNamesForGroups(SKILLS_CATALOG, []), []);
  });

  it('lists a multi-group sub-skill once when several of its keys match', () => {
    const catalog = [
      { name: 'shared', tags: [], groups: ['owasp', 'javascript'] },
    ];

    strict.deepStrictEqual(
      skillNamesForGroups(catalog, ['owasp', 'javascript']),
      ['shared']
    );
  });
});
