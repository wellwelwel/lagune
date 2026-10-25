import { readdir } from 'node:fs/promises';
import { describe, it, strict } from 'poku';
import { BUILTIN_SPECIALIZATIONS } from '../../../../src/catalog/builtin.js';

const packageRoot = new URL('../../../../', import.meta.url);

await describe('the built-in index and the catalog files stay in sync', async () => {
  const files = (await readdir(new URL('catalog/', packageRoot)))
    .filter((entry) => entry.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));
  const indexed = BUILTIN_SPECIALIZATIONS.map((entry) => entry.name);

  it('points every indexed name at a file and indexes every file', () => {
    strict.deepStrictEqual(files.toSorted(), indexed.toSorted());
  });
});
