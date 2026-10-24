import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { newWorkspace, runEngine } from './__utils__.js';

const CATALOG_FILE = '.lagune/catalog.json';

const seedCatalog = async (
  workspace: string,
  contents: string
): Promise<void> => {
  await mkdir(join(workspace, '.lagune'), { recursive: true });
  await writeFile(join(workspace, CATALOG_FILE), contents);
};

const recorded = async (workspace: string): Promise<unknown> =>
  JSON.parse(await readFile(join(workspace, CATALOG_FILE), 'utf8')).categories;

const catalogText = (workspace: string): Promise<string | null> =>
  readFile(join(workspace, CATALOG_FILE), 'utf8').catch(() => null);

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

  await it('keeps the own index untouched', async () => {
    const workspace = await newWorkspace();
    const entries = [{ name: 'graphql', tags: ['GraphQL'] }];

    await seedCatalog(workspace, JSON.stringify({ name: 'lagune', entries }));
    await runEngine(workspace, ['add', '--categories', 'go']);

    const catalog = JSON.parse((await catalogText(workspace)) ?? '{}');

    strict.deepStrictEqual(catalog.entries, entries);
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
      const catalog = await catalogText(workspace);

      strict.strictEqual(run.code, 1);
      strict.strictEqual(catalog, null);
    });

  await it('refuses to record over a catalog file it cannot read', async () => {
    const workspace = await newWorkspace();

    await seedCatalog(workspace, '{"entries": [');

    const run = await runEngine(workspace, ['add', '--categories', 'go']);
    const catalog = await catalogText(workspace);

    strict.strictEqual(run.code, 1);
    strict.strictEqual(catalog, '{"entries": [');
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

    await seedCatalog(workspace, '{"categories":["go"]}');

    const run = await runEngine(workspace, ['list', '--categories']);

    strict.match(run.stdout, /owasp +\[available\] /);
    strict.match(run.stdout, /go +\[used\] /);
    strict(run.stdout.includes('Recorded in .lagune/catalog.json.'));
  });

  await it('needs a target outside a terminal', async () => {
    const workspace = await newWorkspace();
    const run = await runEngine(workspace, ['list']);

    strict.strictEqual(run.code, 1);
    strict.strictEqual(run.stdout, '');
  });
});
