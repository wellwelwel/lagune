import { describe, it, strict } from 'poku';
import { assessReadings } from '../../../src/hooks/regex/pool.js';

await describe('the worker pool judges each reading as a single thread does', async () => {
  await it('gives every reading its own verdict, with its flags and the repetition limit', async () => {
    const nested = `${'('.repeat(600)}a+${')'.repeat(600)}`;
    const readings = new Map([
      ['exponential', { source: '(a+)+$', flags: '' }],
      ['multiline', { source: '^\\s*#[^\\n]+', flags: 'm' }],
      ['anchored', { source: '^abc$', flags: '' }],
      ['broken', { source: '(', flags: '' }],
      ['repetitive', { source: 'a?a?a?', flags: '' }],
      ['nested', { source: nested, flags: '' }],
    ]);
    const assessments = await assessReadings(readings, 2, 3);

    strict.deepStrictEqual(Object.fromEntries(assessments), {
      exponential: {
        verdict: 'unsafe',
        reason: 'exponential',
        scope: 'search',
      },
      multiline: {
        verdict: 'unsafe',
        reason: 'polynomial of degree 2',
        scope: 'search',
      },
      anchored: { verdict: 'safe' },
      broken: { verdict: 'invalid regex' },
      repetitive: {
        verdict: 'unsafe',
        reason: 'more than 2 quantifiers',
        scope: null,
      },
      nested: {
        verdict: 'undetermined',
        reason: 'work cap reached',
        scope: null,
      },
    });
  });
});
