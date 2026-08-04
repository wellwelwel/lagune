import { readFile } from 'node:fs/promises';
import { describe, it, strict } from 'poku';
import { SKILLS_CATALOG } from '../../../../src/hooks/skills/catalog.js';

const packageRoot = new URL('../../../../', import.meta.url);
const catalogPage = new URL('website/docs/commands/skills.mdx', packageRoot);
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

await describe('the catalog and its documented table stay in sync', async () => {
  const documented = await readDocumentedRows();

  for (const entry of SKILLS_CATALOG) {
    it('gives every catalog entry a row in the table', () => {
      strict(
        documented.has(entry.name),
        `${entry.name} has no row in the catalog table`
      );
    });

    it('documents the categories the catalog assigns', () => {
      if (!documented.has(entry.name)) return;

      strict.deepStrictEqual(
        documented.get(entry.name),
        entry.groups,
        `${entry.name} lists different categories in the table`
      );
    });
  }

  const catalogNames = new Set(SKILLS_CATALOG.map((entry) => entry.name));

  for (const name of documented.keys())
    it('carries no table row the catalog does not list', () => {
      strict(catalogNames.has(name), `${name} is documented but not built in`);
    });
});
