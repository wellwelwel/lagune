import { readdir } from 'node:fs/promises';
import { sep } from 'node:path';
import { describe, it, strict } from 'poku';
import { deepFreeze } from '../../../src/core/collections.js';

const packageRoot = new URL('../../../', import.meta.url);
const SHARED_SOURCES = [
  'src/bin/hooks.ts',
  'src/core/checkers.ts',
  'src/core/git/',
  'src/core/scan/',
  'src/hooks/',
];

const isPlainContainer = (value: unknown): value is object =>
  Array.isArray(value) ||
  (typeof value === 'object' &&
    value !== null &&
    Object.getPrototypeOf(value) === Object.prototype);

const isDeeplyFrozen = (value: unknown): boolean =>
  !isPlainContainer(value) ||
  (Object.isFrozen(value) && Object.values(value).every(isDeeplyFrozen));

const modulesOf = async (source: string): Promise<string[]> => {
  if (!source.endsWith('/')) return [source];

  const entries = await readdir(new URL(source, packageRoot), {
    recursive: true,
  });

  return entries
    .filter((entry) => entry.endsWith('.ts'))
    .map((entry) => `${source}${entry.split(sep).join('/')}`);
};

const tablesOf = async (module: string): Promise<[string, unknown][]> => {
  const exported: Record<string, unknown> = await import(
    new URL(module, packageRoot).href
  );

  return Object.entries(exported)
    .filter(([, value]) => isPlainContainer(value))
    .map(([name, value]): [string, unknown] => [
      `${name} from ${module}`,
      value,
    ]);
};

await describe('a table the hooks share across modules refuses changes at runtime', async () => {
  const modules = (await Promise.all(SHARED_SOURCES.map(modulesOf))).flat();
  const tables = (await Promise.all(modules.map(tablesOf))).flat();

  for (const [name, table] of tables)
    it(`freezes ${name} and everything nested in it`, () => {
      strict.strictEqual(isDeeplyFrozen(table), true);
    });
});

describe('freezing a table keeps what it holds working', () => {
  it('freezes nested lists and records while a global regex inside them still matches', () => {
    const table = deepFreeze({ rules: [{ detail: 'leak', regex: /a/g }] });
    const [rule] = table.rules;

    strict.strictEqual(isDeeplyFrozen(table), true);
    strict.strictEqual(rule.regex.test('a'), true);
  });
});
