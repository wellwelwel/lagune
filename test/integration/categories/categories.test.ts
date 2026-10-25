import { describe, it, strict } from 'poku';
import {
  addCategories,
  assertKnownCategories,
  CATEGORIES,
  findCategory,
  removeCategories,
  unknownCategoryKeys,
} from '../../../src/categories/categories.js';

describe('a category resolves by its exact key', () => {
  it('finds a known key and nothing for a wrong case or an unknown key', () => {
    strict.strictEqual(findCategory(CATEGORIES, 'owasp')?.label, 'OWASP');
    strict.strictEqual(findCategory(CATEGORIES, 'OWASP'), undefined);
    strict.strictEqual(findCategory(CATEGORIES, 'nope'), undefined);
  });

  it('reports the keys no category carries, in the order given', () => {
    strict.deepStrictEqual(
      unknownCategoryKeys(CATEGORIES, ['nope', 'owasp', 'OWASP']),
      ['nope', 'OWASP']
    );
  });

  it('rejects an unknown key, naming it and the available categories', () => {
    strict.throws(
      () => assertKnownCategories(CATEGORIES, ['owasp', 'nope']),
      (error: Error) =>
        error.message.includes('Unknown specialization category: nope') &&
        error.message.includes('Available categories: owasp')
    );
  });

  it('accepts known keys and no keys at all', () => {
    strict.doesNotThrow(() =>
      assertKnownCategories(CATEGORIES, ['owasp', 'javascript'])
    );
    strict.doesNotThrow(() => assertKnownCategories(CATEGORIES, []));
  });
});

describe('adding and removing categories', () => {
  it('adds the new keys after the used ones, once each', () => {
    strict.deepStrictEqual(
      addCategories(['owasp'], ['ai', 'owasp', 'ai', 'javascript']),
      {
        categories: ['owasp', 'ai', 'javascript'],
        changed: ['ai', 'javascript'],
        unchanged: ['owasp'],
      }
    );
  });

  it('removes the used keys and reports the unused ones untouched', () => {
    strict.deepStrictEqual(
      removeCategories(['owasp', 'ai'], ['owasp', 'go', 'owasp']),
      { categories: ['ai'], changed: ['owasp'], unchanged: ['go'] }
    );
  });

  it('removes every category down to an empty list', () => {
    strict.deepStrictEqual(
      removeCategories(['owasp'], ['owasp']).categories,
      []
    );
  });
});
