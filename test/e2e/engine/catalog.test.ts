import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { newWorkspace, runEngine } from './__utils__.js';

const packageRoot = new URL('../../../', import.meta.url);

const seed = async (
  workspace: string,
  files: Record<string, string>
): Promise<void> => {
  await Promise.all(
    Object.entries(files).map(async ([path, contents]) => {
      await mkdir(join(workspace, path, '..'), { recursive: true });
      await writeFile(join(workspace, path), contents);
    })
  );
};

const builtin = (name: string): Promise<string> =>
  readFile(new URL(`catalog/${name}.md`, packageRoot), 'utf8');

await describe('catalog lists the specializations a project uses', async () => {
  await it('lists only the built-ins of the recorded categories', async () => {
    const workspace = await newWorkspace();

    await seed(workspace, {
      '.lagune/categories.json': '{"categories":["python","ai"]}',
    });

    const run = await runEngine(workspace, ['catalog']);

    strict.deepStrictEqual(run, {
      stdout: 'llm: AI API, RAG, MCP, Agent\npython: CPython, pickle, Django\n',
      stderr: '',
      code: 0,
    });
  });

  await it('flags the required built-in and lists the own index after it', async () => {
    const workspace = await newWorkspace();

    await seed(workspace, {
      '.lagune/catalog.json': JSON.stringify({
        entries: [{ name: 'graphql', tags: ['GraphQL', 'API'] }],
      }),
      '.lagune/catalog/graphql.md': '# GraphQL vulnerabilities\n',
    });

    const run = await runEngine(workspace, ['catalog']);
    const lines = run.stdout.trimEnd().split('\n');

    strict.strictEqual(run.code, 0);
    strict.strictEqual(lines[0], 'regex: Regular Expression [required]');
    strict.strictEqual(lines[lines.length - 1], 'graphql: GraphQL, API');
  });

  await it('says so when the project uses no category and has none of its own', async () => {
    const workspace = await newWorkspace();

    await seed(workspace, { '.lagune/categories.json': '{"categories":[]}' });

    const run = await runEngine(workspace, ['catalog']);

    strict.deepStrictEqual(run, {
      stdout: "No specialization is in this project's catalog.\n",
      stderr: '',
      code: 0,
    });
  });

  for (const file of ['.lagune/categories.json', '.lagune/catalog.json'])
    await it(`fails on ${file} it cannot read instead of listing a default`, async () => {
      const workspace = await newWorkspace();

      await seed(workspace, { [file]: '{"name": ' });

      const run = await runEngine(workspace, ['catalog']);

      strict.strictEqual(run.code, 1);
      strict.strictEqual(run.stdout, '');
      strict(run.stderr.includes(file));
    });
});

await describe('catalog <name> prints the specialization the project resolves', async () => {
  await it('prints a built-in whatever the categories', async () => {
    const workspace = await newWorkspace();

    await seed(workspace, { '.lagune/categories.json': '{"categories":[]}' });

    const [run, expected] = await Promise.all([
      runEngine(workspace, ['catalog', 'regex']),
      builtin('regex'),
    ]);

    strict.deepStrictEqual(run, { stdout: expected, stderr: '', code: 0 });
  });

  await it('prints the project own version before the built-in', async () => {
    const workspace = await newWorkspace();

    await seed(workspace, {
      '.lagune/catalog/regex.md': '# Regex, refined for this project\n',
    });

    const run = await runEngine(workspace, ['catalog', 'regex']);

    strict.deepStrictEqual(run, {
      stdout: '# Regex, refined for this project\n',
      stderr: '',
      code: 0,
    });
  });

  await it('fails on a name no specialization carries', async () => {
    const workspace = await newWorkspace();
    const run = await runEngine(workspace, ['catalog', 'nope']);

    strict.strictEqual(run.code, 1);
    strict.strictEqual(run.stdout, '');
    strict(run.stderr.includes('catalog'));
  });

  for (const name of [
    '../catalog.json',
    '../../package',
    'Regex',
    'regex.md',
    '',
  ])
    await it(`refuses the name ${JSON.stringify(name)} before reading anything`, async () => {
      const workspace = await newWorkspace();

      await seed(workspace, { '.lagune/catalog.json': '{"secret":true}' });

      const run = await runEngine(workspace, ['catalog', name]);

      strict.strictEqual(run.code, 1);
      strict.strictEqual(run.stdout, '');
      strict(run.stderr.includes('is not a specialization name'));
    });

  await it('takes a single name', async () => {
    const workspace = await newWorkspace();
    const run = await runEngine(workspace, ['catalog', 'regex', 'sql']);

    strict.strictEqual(run.code, 1);
    strict.strictEqual(run.stdout, '');
  });
});
