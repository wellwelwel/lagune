import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, it, strict } from 'poku';
import {
  catalogEntries,
  readOwnIndex,
  readSpecialization,
} from '../../../src/catalog/project.js';

const packageRoot = new URL('../../../', import.meta.url);
const projects: string[] = [];

const newProject = async (
  files: Record<string, string> = {}
): Promise<string> => {
  const project = await mkdtemp(join(tmpdir(), 'lagune-catalog-'));

  projects.push(project);

  await Promise.all(
    Object.entries(files).map(async ([path, contents]) => {
      await mkdir(dirname(join(project, path)), { recursive: true });
      await writeFile(join(project, path), contents);
    })
  );

  return project;
};

const writeOwn = async (project: string, name: string): Promise<void> => {
  await mkdir(join(project, '.lagune/catalog'), { recursive: true });
  await writeFile(join(project, `.lagune/catalog/${name}.md`), `# ${name}\n`);
};

const SECRET = '{"secret":true}\n';

const secretOutside = async (): Promise<string> => {
  const outside = await newProject();
  const secret = join(outside, 'secret.json');

  await writeFile(secret, SECRET);

  return secret;
};

afterEach(async () => {
  await Promise.all(
    projects.map((project) => rm(project, { recursive: true, force: true }))
  );

  projects.length = 0;
});

await describe('the own index file', async () => {
  await it('reads no own specialization while the file is absent', async () => {
    const project = await newProject();

    strict.deepStrictEqual(await readOwnIndex(project), []);
  });

  for (const [label, contents] of [
    ['malformed JSON', '{"entries": ['],
    ['a JSON array', '[]'],
  ])
    await it(`refuses ${label}, naming the file`, async () => {
      const project = await newProject({ '.lagune/catalog.json': contents });

      await strict.rejects(readOwnIndex(project), (error: Error) =>
        error.message.startsWith('.lagune/catalog.json ')
      );
    });

  await it('drops every entry it cannot read, a hostile name included', async () => {
    const project = await newProject({
      '.lagune/catalog.json': JSON.stringify({
        entries: [
          { name: 'graphql', tags: ['GraphQL'] },
          { name: '../../etc/passwd', tags: ['x'] },
          { name: 'Upper', tags: [] },
          { name: 'notags' },
          'graphql',
        ],
      }),
    });

    strict.deepStrictEqual(await readOwnIndex(project), [
      { name: 'graphql', tags: ['GraphQL'] },
    ]);
  });
});

await describe('the catalog a project uses', async () => {
  await it('holds the OWASP built-ins while no category is recorded', async () => {
    const [unrecorded, recorded] = await Promise.all([
      newProject(),
      newProject({ '.lagune/categories.json': '{"categories":["owasp"]}' }),
    ]);

    strict.deepStrictEqual(
      await catalogEntries(unrecorded),
      await catalogEntries(recorded)
    );
  });

  await it('lists an own specialization only while its file exists', async () => {
    const project = await newProject({
      '.lagune/categories.json': '{"categories":[]}',
      '.lagune/catalog.json': JSON.stringify({
        entries: [
          { name: 'graphql', tags: ['GraphQL'] },
          { name: 'ghost', tags: ['Missing'] },
        ],
      }),
    });

    await writeOwn(project, 'graphql');
    await writeOwn(project, 'unindexed');

    strict.deepStrictEqual(await catalogEntries(project), [
      { name: 'graphql', tags: ['GraphQL'] },
    ]);
  });

  await it('never lists or prints an own specialization that resolves outside the project', async () => {
    const project = await newProject({
      '.lagune/categories.json': '{"categories":[]}',
      '.lagune/catalog.json': JSON.stringify({
        entries: [{ name: 'leak', tags: [] }],
      }),
    });
    const secret = await secretOutside();

    await mkdir(join(project, '.lagune/catalog'), { recursive: true });
    await symlink(secret, join(project, '.lagune/catalog/leak.md'));

    const [entries, printed] = await Promise.all([
      catalogEntries(project),
      readSpecialization(project, packageRoot, 'leak'),
    ]);

    strict.deepStrictEqual(entries, []);
    strict.strictEqual(printed, undefined);
  });

  await it('lets an own specialization replace the built-in of the same name', async () => {
    const project = await newProject({
      '.lagune/categories.json': '{"categories":["ai"]}',
      '.lagune/catalog.json': JSON.stringify({
        entries: [{ name: 'llm', tags: ['Own LLM'] }],
      }),
    });

    await writeOwn(project, 'llm');

    strict.deepStrictEqual(await catalogEntries(project), [
      { name: 'llm', tags: ['Own LLM'] },
    ]);
  });
});
