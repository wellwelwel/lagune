import { readFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, strict } from 'poku';

const repositoryRoot = fileURLToPath(new URL('../../../', import.meta.url));
const BRIDGE = join(repositoryRoot, 'website', 'src', 'data', 'lagune.ts');
const SOURCE = join(repositoryRoot, 'src');

const runtimeSpecifiers = (text: string): string[] =>
  text
    .split(';')
    .map((statement) => statement.trim())
    .filter(
      (statement) =>
        (statement.startsWith('import ') || statement.startsWith('export ')) &&
        !statement.startsWith('import type ') &&
        !statement.startsWith('export type ') &&
        statement.includes(" from '")
    )
    .map((statement) =>
      statement.slice(statement.lastIndexOf(" from '") + 7, -1)
    );

const moduleFile = (from: string, specifier: string): string =>
  join(dirname(from), `${specifier.replace(/\.js$/, '')}.ts`);

const bundledFromBridge = async (): Promise<Map<string, string[]>> => {
  const bundled = new Map<string, string[]>();
  const queue = [BRIDGE];

  for (const file of queue) {
    if (bundled.has(file)) continue;

    const specifiers = runtimeSpecifiers(await readFile(file, 'utf8')).filter(
      (specifier) => specifier.startsWith('.')
    );

    bundled.set(file, specifiers);
    queue.push(
      ...specifiers
        .map((specifier) => moduleFile(file, specifier))
        .filter((path) => path.startsWith(SOURCE))
    );
  }

  return bundled;
};

await describe('the engine modules the website bundles', async () => {
  await it('import one another with no .js extension, which the website bundler cannot resolve to TypeScript', async () => {
    const bundled = await bundledFromBridge();
    const unresolvable = [...bundled].flatMap(([file, specifiers]) =>
      specifiers
        .filter((specifier) => specifier.endsWith('.js'))
        .map((specifier) => `${relative(repositoryRoot, file)}: ${specifier}`)
    );

    strict.deepStrictEqual(unresolvable, []);
  });
});
