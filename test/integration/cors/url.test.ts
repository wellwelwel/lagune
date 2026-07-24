import { describe, it, strict } from 'poku';
import { validatesUrlWithGreedyWildcard } from '../../../src/hooks/cors/url.js';

describe('validatesUrlWithGreedyWildcard flags bypassable host validators', () => {
  const bypassable = [
    '^https?://.+\\.trusted\\.com',
    'https://.*\\.example\\.com$',
    '^http://.+\\.internal\\.corp/',
    '^https://.{1,}\\.trusted\\.com',
    '^https://.{0,}\\.trusted\\.com',
  ];

  for (const source of bypassable)
    it(`flags ${JSON.stringify(source)}`, () => {
      strict.strictEqual(validatesUrlWithGreedyWildcard(source), true);
    });
});

describe('validatesUrlWithGreedyWildcard leaves sound patterns alone', () => {
  const sound = [
    '^https://app\\.example\\.com$',
    'https://example\\.com/.*',
    '(a+)+$',
    '^[a-z0-9_]{3,20}$',
  ];

  for (const source of sound)
    it(`passes ${JSON.stringify(source)}`, () => {
      strict.strictEqual(validatesUrlWithGreedyWildcard(source), false);
    });
});
