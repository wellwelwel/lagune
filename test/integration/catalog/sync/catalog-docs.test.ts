import { readFile } from 'node:fs/promises';
import { describe, it, strict } from 'poku';
import { BUILTIN_SPECIALIZATIONS } from '../../../../src/catalog/builtin.js';

const packageRoot = new URL('../../../../', import.meta.url);
const catalogPage = new URL('website/docs/commands/catalog.mdx', packageRoot);
const TABLE_ROW = /^\| `([^`]+)` +\|([^|]+)\|/gm;
const INLINE_CODE = /`([^`]+)`/g;

const readDocumentedRows = async (): Promise<Map<string, string[]>> => {
  const page = await readFile(catalogPage, 'utf8');
  const rows = new Map<string, string[]>();

  for (const [, name, categories] of page.matchAll(TABLE_ROW))
    rows.set(
      name,
      [...categories.matchAll(INLINE_CODE)].map(([, key]) => key)
    );

  return rows;
};

await describe('the built-in index and its documented table stay in sync', async () => {
  const documented = await readDocumentedRows();

  for (const entry of BUILTIN_SPECIALIZATIONS) {
    it('gives every built-in a row in the table', () => {
      strict(
        documented.has(entry.name),
        `${entry.name} has no row in the table`
      );
    });

    it('documents the categories the index assigns', () => {
      if (!documented.has(entry.name)) return;

      strict.deepStrictEqual(
        documented.get(entry.name),
        entry.categories,
        `${entry.name} lists different categories in the table`
      );
    });
  }

  const builtinNames = new Set(
    BUILTIN_SPECIALIZATIONS.map((entry) => entry.name)
  );

  for (const name of documented.keys())
    it('carries no table row the index does not list', () => {
      strict(builtinNames.has(name), `${name} is documented but not built in`);
    });
});
