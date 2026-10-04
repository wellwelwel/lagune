import { readFile } from 'node:fs/promises';
import { describe, it, strict } from 'poku';
import { SKILL_GROUPS } from '../../../../src/hooks/skills/groups.js';

const packageRoot = new URL('../../../../', import.meta.url);
const categoriesPage = new URL(
  'website/docs/skill-categories.mdx',
  packageRoot
);
const TABLE_ROW = /^\| [^|`]+\| `([^`]+)` +\|/gm;

await describe('the group registry and its documented tables stay in sync', async () => {
  const page = await readFile(categoriesPage, 'utf8');
  const documented = new Set(
    [...page.matchAll(TABLE_ROW)].map(([, key]) => key)
  );
  const registered = new Set<string>(SKILL_GROUPS.map((group) => group.key));

  for (const group of SKILL_GROUPS)
    it('gives every registered group a row in the categories tables', () => {
      strict(documented.has(group.key), `${group.key} has no documented row`);
    });

  for (const key of documented)
    it('carries no documented row the registry does not list', () => {
      strict(registered.has(key), `${key} is documented but not registered`);
    });
});
