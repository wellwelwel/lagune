import type { ConfigsSchema, PackedPackage } from '../../../src/types/test.js';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { describe, it, strict } from 'poku';
import { CATEGORIES } from '../../../src/categories/categories.js';

const run = promisify(execFile);
const packageRoot = new URL('../../../', import.meta.url);
const schemaFile = new URL('schemas/configs.json', packageRoot);

await describe('the configs schema', async () => {
  const schema: ConfigsSchema = JSON.parse(await readFile(schemaFile, 'utf8'));

  it('accepts exactly the categories the engine registers', () => {
    strict.deepStrictEqual(
      schema.properties.categories.items.enum.toSorted(),
      CATEGORIES.map((category) => category.key).toSorted()
    );
  });

  await it('ships with every npm release, which pins its own copy', async () => {
    const { stdout } = await run(
      'npm',
      ['pack', '--dry-run', '--json', '--ignore-scripts'],
      { cwd: fileURLToPath(packageRoot) }
    );
    // npm 12 keys the report by package name, earlier versions list it
    const [packed]: PackedPackage[] = Object.values(JSON.parse(stdout));

    strict(packed.files.some((file) => file.path === 'schemas/configs.json'));
  });
});
