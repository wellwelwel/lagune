import { describe, it, strict } from 'poku';
import { SKILLS_CATALOG } from '../../../../src/hooks/skills/catalog.js';
import { skillsInGroup } from '../../../../src/hooks/skills/skills.js';

describe('skillsInGroup derives membership by exact key', () => {
  it('returns the sub-skills of a group in catalog order', () => {
    strict.deepStrictEqual(skillsInGroup(SKILLS_CATALOG, 'owasp'), [
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
      'secrets',
      'api-endpoint',
      'payment',
      'xml',
      'csv',
      'container',
      'serverless',
    ]);
    strict.deepStrictEqual(skillsInGroup(SKILLS_CATALOG, 'infra'), [
      'container',
      'infra',
      'serverless',
    ]);
    strict.deepStrictEqual(skillsInGroup(SKILLS_CATALOG, 'javascript'), [
      'javascript',
      'browser',
    ]);
  });

  it('matches the key strictly, never the display label', () => {
    strict.deepStrictEqual(skillsInGroup(SKILLS_CATALOG, 'OWASP'), []);
  });

  it('returns [] for an unknown key', () => {
    strict.deepStrictEqual(skillsInGroup(SKILLS_CATALOG, 'nope'), []);
  });

  it('places a multi-group sub-skill under every one of its keys', () => {
    const catalog = [
      { name: 'shared', tags: [], groups: ['owasp', 'javascript'] },
    ];

    strict.deepStrictEqual(skillsInGroup(catalog, 'owasp'), ['shared']);
    strict.deepStrictEqual(skillsInGroup(catalog, 'javascript'), ['shared']);
  });
});
