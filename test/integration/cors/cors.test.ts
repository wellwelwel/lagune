import { describe, it, strict } from 'poku';
import { check } from '../../../src/hooks/cors/cors.js';

describe('check scores allowed origins', () => {
  const cases: Array<[string, 'wildcard' | 'null' | 'safe']> = [
    ['*', 'wildcard'],
    ['null', 'null'],
    ['NULL', 'null'],
    ['https://app.example.com', 'safe'],
    ['http://localhost:3000', 'safe'],
    ['Access-Control-Allow-Origin: *', 'wildcard'],
    ['https://*.example.com', 'wildcard'],
    ['https://api.*.example.com', 'wildcard'],
    ['https://example.com:*', 'wildcard'],
  ];

  for (const [origin, verdict] of cases)
    it(`scores ${JSON.stringify(origin)} as ${verdict}`, () => {
      strict.strictEqual(check(origin), verdict);
    });
});
