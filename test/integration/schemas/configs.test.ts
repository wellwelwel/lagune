import type { ConfigsSchema } from '../../../src/types/test.js';
import { readFile } from 'node:fs/promises';
import { describe, it, strict } from 'poku';
import { CATEGORIES } from '../../../src/categories/categories.js';
import { CHECKERS } from '../../../src/core/checkers.js';
import { listPackedPaths, packageRoot } from '../plugins/__utils__.js';

const schemaFile = new URL('schemas/configs.json', packageRoot);

await describe('the configs schema', async () => {
  const schema: ConfigsSchema = JSON.parse(await readFile(schemaFile, 'utf8'));

  it('accepts exactly the categories the engine registers', () => {
    strict.deepStrictEqual(
      schema.properties.categories.items.enum.toSorted(),
      CATEGORIES.map((category) => category.key).toSorted()
    );
  });

  it('takes the shared settings and exactly the checkers the engine runs', () => {
    strict.deepStrictEqual(
      Object.keys(schema.properties.checkers.properties).toSorted(),
      ['gitignore', 'ignore', ...CHECKERS].toSorted()
    );
  });

  await it('ships with every npm release, which pins its own copy', async () => {
    const packed = await listPackedPaths();

    strict(packed.has('schemas/configs.json'));
  });
});
