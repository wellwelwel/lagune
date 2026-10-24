import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, it, strict } from 'poku';
import {
  catalogEntries,
  readProjectCatalog,
  recordCategories,
} from '../../../src/catalog/project.js';

const projects: string[] = [];

const newProject = async (catalog?: string): Promise<string> => {
  const project = await mkdtemp(join(tmpdir(), 'lagune-catalog-'));

  projects.push(project);

  if (catalog === undefined) return project;

  await mkdir(join(project, '.lagune'), { recursive: true });
  await writeFile(join(project, '.lagune/catalog.json'), catalog);

  return project;
};

const writeOwn = async (project: string, name: string): Promise<void> => {
  await mkdir(join(project, '.lagune/catalog'), { recursive: true });
  await writeFile(join(project, `.lagune/catalog/${name}.md`), `# ${name}\n`);
};

afterEach(async () => {
  await Promise.all(
    projects.map((project) => rm(project, { recursive: true, force: true }))
  );

  projects.length = 0;
});

await describe('the project catalog file', async () => {
  await it('records no category while the file is absent', async () => {
    const project = await newProject();

    strict.deepStrictEqual(await readProjectCatalog(project), {
      categories: undefined,
      entries: [],
    });
  });

  await it('keeps an empty category list apart from no record at all', async () => {
    const project = await newProject(
      '{"name":"lagune","categories":[],"entries":[]}'
    );

    strict.deepStrictEqual((await readProjectCatalog(project)).categories, []);
  });

  for (const [label, contents] of [
    ['malformed JSON', '{"categories": ['],
    ['a JSON array', '[]'],
    ['categories that are not names', '{"categories":"owasp"}'],
  ])
    await it(`refuses ${label}, naming the file`, async () => {
      const project = await newProject(contents);

      await strict.rejects(readProjectCatalog(project), (error: Error) =>
        error.message.startsWith('.lagune/catalog.json ')
      );
    });

  await it('drops every entry it cannot read, a hostile name included', async () => {
    const project = await newProject(
      JSON.stringify({
        entries: [
          { name: 'graphql', tags: ['GraphQL'] },
          { name: '../../etc/passwd', tags: ['x'] },
          { name: 'Upper', tags: [] },
          { name: 'notags' },
          'graphql',
        ],
      })
    );

    strict.deepStrictEqual((await readProjectCatalog(project)).entries, [
      { name: 'graphql', tags: ['GraphQL'] },
    ]);
  });
});

await describe('the catalog a project uses', async () => {
  await it('holds the OWASP built-ins while no category is recorded', async () => {
    const [unrecorded, recorded] = await Promise.all([
      newProject(),
      newProject('{"categories":["owasp"]}'),
    ]);

    strict.deepStrictEqual(
      await catalogEntries(unrecorded),
      await catalogEntries(recorded)
    );
  });

  await it('lists an own specialization only while its file exists', async () => {
    const project = await newProject(
      JSON.stringify({
        categories: [],
        entries: [
          { name: 'graphql', tags: ['GraphQL'] },
          { name: 'ghost', tags: ['Missing'] },
        ],
      })
    );

    await writeOwn(project, 'graphql');
    await writeOwn(project, 'unindexed');

    strict.deepStrictEqual(await catalogEntries(project), [
      { name: 'graphql', tags: ['GraphQL'] },
    ]);
  });

  await it('lets an own specialization replace the built-in of the same name', async () => {
    const project = await newProject(
      JSON.stringify({
        categories: ['ai'],
        entries: [{ name: 'llm', tags: ['Own LLM'] }],
      })
    );

    await writeOwn(project, 'llm');

    strict.deepStrictEqual(await catalogEntries(project), [
      { name: 'llm', tags: ['Own LLM'] },
    ]);
  });
});

await describe('recording categories', async () => {
  await it('creates the file with an empty index', async () => {
    const project = await newProject();

    await recordCategories(project, ['owasp', 'ai']);

    strict.deepStrictEqual(
      JSON.parse(await readFile(join(project, '.lagune/catalog.json'), 'utf8')),
      { name: 'lagune', categories: ['owasp', 'ai'], entries: [] }
    );
  });

  await it('keeps the own index and any other field untouched', async () => {
    const project = await newProject(
      JSON.stringify({
        name: 'lagune',
        entries: [{ name: 'graphql', tags: ['GraphQL'] }],
        note: 'kept',
      })
    );

    await recordCategories(project, ['go']);

    strict.deepStrictEqual(
      JSON.parse(await readFile(join(project, '.lagune/catalog.json'), 'utf8')),
      {
        name: 'lagune',
        entries: [{ name: 'graphql', tags: ['GraphQL'] }],
        note: 'kept',
        categories: ['go'],
      }
    );
  });

  await it('refuses to overwrite a file it cannot read', async () => {
    const project = await newProject('{"entries": [');
    const outcome = await recordCategories(project, ['go']).then(
      () => 'recorded',
      () => 'refused'
    );
    const contents = await readFile(
      join(project, '.lagune/catalog.json'),
      'utf8'
    );

    strict.strictEqual(outcome, 'refused');
    strict.strictEqual(contents, '{"entries": [');
  });
});
