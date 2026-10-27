import { describe, it, strict } from 'poku';
import { languageOf } from '../../../src/core/scan/language.js';

describe('languageOf reads single-file component extensions as JavaScript', () => {
  for (const file of ['a.vue', 'b.svelte', 'c.marko', 'd.riot'])
    it(`reads ${file} as JavaScript`, () => {
      strict.strictEqual(languageOf(file), 'javascript');
    });
});
