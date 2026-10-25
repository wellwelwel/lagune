import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, it, strict } from 'poku';
import {
  readProjectCategories,
  recordCategories,
} from '../../../src/categories/project.js';

const CATEGORIES_FILE = '.lagune/categories.json';
const projects: string[] = [];

const newProject = async (categories?: string): Promise<string> => {
  const project = await mkdtemp(join(tmpdir(), 'lagune-categories-'));

  projects.push(project);

  if (categories === undefined) return project;

  await mkdir(join(project, '.lagune'), { recursive: true });
  await writeFile(join(project, CATEGORIES_FILE), categories);

  return project;
};

const contentsOf = (project: string): Promise<string> =>
  readFile(join(project, CATEGORIES_FILE), 'utf8');

const SECRET = '{"secret":true}\n';

afterEach(async () => {
  await Promise.all(
    projects.map((project) => rm(project, { recursive: true, force: true }))
  );

  projects.length = 0;
});

await describe('the categories file', async () => {
  await it('records no category while the file is absent', async () => {
    const project = await newProject();

    strict.strictEqual(await readProjectCategories(project), undefined);
  });

  await it('keeps an empty category list apart from no record at all', async () => {
    const project = await newProject('{"name":"lagune","categories":[]}');

    strict.deepStrictEqual(await readProjectCategories(project), []);
  });

  for (const [label, contents] of [
    ['malformed JSON', '{"categories": ['],
    ['a JSON array', '[]'],
    ['categories that are not names', '{"categories":"owasp"}'],
  ])
    await it(`refuses ${label}, naming the file`, async () => {
      const project = await newProject(contents);

      await strict.rejects(readProjectCategories(project), (error: Error) =>
        error.message.startsWith('.lagune/categories.json ')
      );
    });
});

await describe('recording categories', async () => {
  await it('creates the file with the recorded categories', async () => {
    const project = await newProject();

    await recordCategories(project, ['owasp', 'ai']);

    strict.deepStrictEqual(JSON.parse(await contentsOf(project)), {
      name: 'lagune',
      categories: ['owasp', 'ai'],
    });
  });

  await it('keeps any other field untouched', async () => {
    const project = await newProject(
      JSON.stringify({ name: 'lagune', categories: ['owasp'], note: 'kept' })
    );

    await recordCategories(project, ['go']);

    strict.deepStrictEqual(JSON.parse(await contentsOf(project)), {
      name: 'lagune',
      categories: ['go'],
      note: 'kept',
    });
  });

  await it('refuses to overwrite a file it cannot read', async () => {
    const project = await newProject('{"categories": [');
    const outcome = await recordCategories(project, ['go']).then(
      () => 'recorded',
      () => 'refused'
    );

    strict.strictEqual(outcome, 'refused');
    strict.strictEqual(await contentsOf(project), '{"categories": [');
  });

  await it('refuses to write through a link, leaving its target untouched', async () => {
    const [project, outside] = await Promise.all([newProject(), newProject()]);
    const secret = join(outside, 'secret.json');

    await writeFile(secret, SECRET);
    await mkdir(join(project, '.lagune'), { recursive: true });
    await symlink(secret, join(project, CATEGORIES_FILE));

    const outcome = await recordCategories(project, ['go']).then(
      () => 'recorded',
      () => 'refused'
    );

    strict.strictEqual(outcome, 'refused');
    strict.strictEqual(await readFile(secret, 'utf8'), SECRET);
  });
});
