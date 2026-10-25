import type { Category } from '../../../src/types/categories.js';
import type { SelectCategoriesDeps } from '../../../src/types/core.js';
import { describe, it, strict } from 'poku';
import { selectCategories } from '../../../src/cli/select-categories.js';

const CATEGORIES: Category[] = [
  { key: 'owasp', label: 'OWASP', description: 'OWASP risks' },
  { key: 'python', label: 'Python', description: 'Python risks' },
];

const terminal = (
  interactive: boolean,
  picked: string[]
): { deps: SelectCategoriesDeps; prompted: () => boolean } => {
  let prompted = false;

  return {
    deps: {
      isInteractive: () => interactive,
      promptForCategories: () => {
        prompted = true;
        return Promise.resolve(picked);
      },
    },
    prompted: () => prompted,
  };
};

await describe('choosing the categories to act on', async () => {
  await it('takes the values given, without asking', async () => {
    const { deps, prompted } = terminal(true, ['python']);
    const result = await selectCategories(
      { requested: ['owasp'], categories: CATEGORIES, locked: [] },
      deps
    );

    strict.deepStrictEqual(result, ['owasp']);
    strict.strictEqual(prompted(), false);
  });

  await it('needs the values outside a terminal', async () => {
    const { deps, prompted } = terminal(false, ['python']);
    const result = await selectCategories(
      { requested: [], categories: CATEGORIES, locked: [] },
      deps
    );

    strict.strictEqual(result, undefined);
    strict.strictEqual(prompted(), false);
  });

  await it('chooses nothing when every category is already used', async () => {
    const { deps, prompted } = terminal(true, ['python']);
    const result = await selectCategories(
      { requested: [], categories: CATEGORIES, locked: ['owasp', 'python'] },
      deps
    );

    strict.deepStrictEqual(result, []);
    strict.strictEqual(prompted(), false);
  });

  await it('asks in a terminal and returns the choice', async () => {
    const { deps, prompted } = terminal(true, ['python']);
    const result = await selectCategories(
      { requested: [], categories: CATEGORIES, locked: ['owasp'] },
      deps
    );

    strict.deepStrictEqual(result, ['python']);
    strict.strictEqual(prompted(), true);
  });
});
