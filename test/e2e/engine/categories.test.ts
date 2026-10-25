import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { newWorkspace, runEngine } from './__utils__.js';

const CATEGORIES_FILE = '.lagune/categories.json';
const CATALOG_FILE = '.lagune/catalog.json';

const seed = async (
  workspace: string,
  file: string,
  contents: string
): Promise<void> => {
  await mkdir(join(workspace, '.lagune'), { recursive: true });
  await writeFile(join(workspace, file), contents);
};

const textOf = (workspace: string, file: string): Promise<string | null> =>
  readFile(join(workspace, file), 'utf8').catch(() => null);

const recorded = async (workspace: string): Promise<unknown> =>
  JSON.parse((await textOf(workspace, CATEGORIES_FILE)) ?? '{}').categories;

await describe('add and remove record the categories a project uses', async () => {
  await it('starts the first add from the default', async () => {
    const workspace = await newWorkspace();
    const run = await runEngine(workspace, [
      'add',
      '--categories',
      'javascript',
      'ai',
    ]);
    const categories = await recorded(workspace);

    strict.strictEqual(run.code, 0);
    strict.deepStrictEqual(categories, ['owasp', 'javascript', 'ai']);
  });

  await it('starts the first remove from the default, leaving an empty list', async () => {
    const workspace = await newWorkspace();
    const run = await runEngine(workspace, ['remove', '--categories', 'owasp']);
    const [categories, catalog] = await Promise.all([
      recorded(workspace),
      runEngine(workspace, ['catalog']),
    ]);

    strict.strictEqual(run.code, 0);
    strict.deepStrictEqual(categories, []);
    strict.strictEqual(
      catalog.stdout,
      "No specialization is in this project's catalog.\n"
    );
  });

  await it('records the default itself when the add changes nothing', async () => {
    const workspace = await newWorkspace();
    const run = await runEngine(workspace, ['add', '--categories', 'owasp']);
    const categories = await recorded(workspace);

    strict.strictEqual(run.code, 0);
    strict.deepStrictEqual(categories, ['owasp']);
  });

  await it('never touches the own index', async () => {
    const workspace = await newWorkspace();
    const index = JSON.stringify({
      name: 'lagune',
      entries: [{ name: 'graphql', tags: ['GraphQL'] }],
    });

    await seed(workspace, CATALOG_FILE, index);

    const run = await runEngine(workspace, ['add', '--categories', 'go']);
    const [categories, catalog] = await Promise.all([
      recorded(workspace),
      textOf(workspace, CATALOG_FILE),
    ]);

    strict.strictEqual(run.code, 0);
    strict.deepStrictEqual(categories, ['owasp', 'go']);
    strict.strictEqual(catalog, index);
  });

  for (const args of [
    ['add', '--categories', 'bogus'],
    ['add', '--categories'],
    ['remove', '--categories'],
    ['add', 'javascript'],
  ])
    await it(`fails on ${args.join(' ')} without writing anything`, async () => {
      const workspace = await newWorkspace();
      const run = await runEngine(workspace, args);
      const [categories, catalog] = await Promise.all([
        textOf(workspace, CATEGORIES_FILE),
        textOf(workspace, CATALOG_FILE),
      ]);

      strict.strictEqual(run.code, 1);
      strict.strictEqual(categories, null);
      strict.strictEqual(catalog, null);
    });

  await it('refuses to record over a categories file it cannot read', async () => {
    const workspace = await newWorkspace();

    await seed(workspace, CATEGORIES_FILE, '{"categories": [');

    const run = await runEngine(workspace, ['add', '--categories', 'go']);
    const categories = await textOf(workspace, CATEGORIES_FILE);

    strict.strictEqual(run.code, 1);
    strict.strictEqual(categories, '{"categories": [');
  });
});

await describe('list --categories shows every category and the ones in use', async () => {
  await it('marks the default as used while none is recorded', async () => {
    const workspace = await newWorkspace();
    const run = await runEngine(workspace, ['list', '--categories']);

    strict.strictEqual(run.code, 0);
    strict.match(run.stdout, /owasp +\[used\] /);
    strict.match(run.stdout, /javascript +\[available\] /);
    strict(run.stdout.includes('No category is recorded yet'));
  });

  await it('marks the recorded categories and says they are recorded', async () => {
    const workspace = await newWorkspace();

    await seed(workspace, CATEGORIES_FILE, '{"categories":["go"]}');

    const run = await runEngine(workspace, ['list', '--categories']);

    strict.match(run.stdout, /owasp +\[available\] /);
    strict.match(run.stdout, /go +\[used\] /);
    strict(run.stdout.includes('Recorded in .lagune/categories.json.'));
  });

  await it('needs a target outside a terminal', async () => {
    const workspace = await newWorkspace();
    const run = await runEngine(workspace, ['list']);

    strict.strictEqual(run.code, 1);
    strict.strictEqual(run.stdout, '');
  });
});
