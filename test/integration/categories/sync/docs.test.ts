import { readFile } from 'node:fs/promises';
import { describe, it, strict } from 'poku';
import { CATEGORIES } from '../../../../src/categories/categories.js';

const packageRoot = new URL('../../../../', import.meta.url);
const categoriesPage = new URL('website/docs/categories.mdx', packageRoot);
const TABLE_ROW = /^\| [^|`]+\| `([^`]+)` +\|/gm;

await describe('the categories and their documented tables stay in sync', async () => {
  const page = await readFile(categoriesPage, 'utf8');
  const documented = new Set(
    [...page.matchAll(TABLE_ROW)].map(([, key]) => key)
  );
  const registered = new Set<string>(
    CATEGORIES.map((category) => category.key)
  );

  for (const category of CATEGORIES)
    it('gives every category a row in the tables', () => {
      strict(
        documented.has(category.key),
        `${category.key} has no documented row`
      );
    });

  for (const key of documented)
    it('carries no documented row the registry does not list', () => {
      strict(registered.has(key), `${key} is documented but not registered`);
    });
});
