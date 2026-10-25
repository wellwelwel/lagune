import { access } from 'node:fs/promises';
import { describe, it, strict } from 'poku';
import { CATEGORIES } from '../../../src/categories/categories.js';
import { categoryIcon } from '../../../src/dashboard/shared/specialization-meta.js';

const publicDir = new URL(
  '../../../src/dashboard/client/public/',
  import.meta.url
);

const exists = (icon: string): Promise<boolean> =>
  access(new URL(`.${icon}`, publicDir)).then(
    () => true,
    () => false
  );

await describe('the shared icons folder carries every category logo', async () => {
  const missing = (
    await Promise.all(
      CATEGORIES.map(async (category) =>
        (await exists(categoryIcon(category.key))) ? [] : [category.key]
      )
    )
  ).flat();

  it('gives every category an icon', () => {
    strict.deepStrictEqual(missing, []);
  });
});
