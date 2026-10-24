import { describe, it, strict } from 'poku';
import { BUILTIN_SPECIALIZATIONS } from '../../../../src/catalog/builtin.js';
import { builtinsIn } from '../../../../src/catalog/catalog.js';
import { CATEGORIES } from '../../../../src/catalog/categories.js';

describe('the categories and the built-in index stay in sync', () => {
  const keys = CATEGORIES.map((category) => category.key);

  it('points every indexed category at a registered one', () => {
    const unregistered = BUILTIN_SPECIALIZATIONS.flatMap((entry) =>
      entry.categories.filter((key) => !keys.includes(key))
    );

    strict.deepStrictEqual(unregistered, []);
  });

  it('claims every category with at least one built-in', () => {
    const empty = keys.filter(
      (key) => builtinsIn(BUILTIN_SPECIALIZATIONS, [key]).length === 0
    );

    strict.deepStrictEqual(empty, []);
  });

  it('keeps category keys unique and lowercase', () => {
    strict.strictEqual(new Set(keys).size, keys.length);
    strict.deepStrictEqual(
      keys.filter((key) => key !== key.toLowerCase()),
      []
    );
  });

  it('claims every built-in in at least one category', () => {
    strict.deepStrictEqual(
      BUILTIN_SPECIALIZATIONS.filter((entry) => entry.categories.length === 0),
      []
    );
  });
});
