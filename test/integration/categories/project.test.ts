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

const CONFIGS_FILE = '.lagune/configs.json';
const projects: string[] = [];

const newProject = async (configs?: string): Promise<string> => {
  const project = await mkdtemp(join(tmpdir(), 'lagune-categories-'));

  projects.push(project);

  if (configs === undefined) return project;

  await mkdir(join(project, '.lagune'), { recursive: true });
  await writeFile(join(project, CONFIGS_FILE), configs);

  return project;
};

const contentsOf = (project: string): Promise<string> =>
  readFile(join(project, CONFIGS_FILE), 'utf8');

const SECRET = '{"secret":true}\n';

afterEach(async () => {
  await Promise.all(
    projects.map((project) => rm(project, { recursive: true, force: true }))
  );

  projects.length = 0;
});

await describe('the recorded categories', async () => {
  for (const [label, configs] of [
    ['the file is absent', undefined],
    ['the configs hold only the own catalog', '{"catalog":[]}'],
  ])
    await it(`records no category while ${label}`, async () => {
      const project = await newProject(configs);

      strict.strictEqual(await readProjectCategories(project), undefined);
    });

  await it('keeps an empty category list apart from no record at all', async () => {
    const project = await newProject('{"categories":[]}');

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
        error.message.startsWith('.lagune/configs.json ')
      );
    });
});

await describe('recording categories', async () => {
  await it('creates the file with the recorded categories', async () => {
    const project = await newProject();

    await recordCategories(project, ['owasp', 'ai']);

    strict.deepStrictEqual(JSON.parse(await contentsOf(project)), {
      categories: ['owasp', 'ai'],
    });
  });

  await it('keeps any other field untouched', async () => {
    const project = await newProject(
      JSON.stringify({
        categories: ['owasp'],
        catalog: [{ name: 'graphql', tags: ['GraphQL'] }],
      })
    );

    await recordCategories(project, ['go']);

    strict.deepStrictEqual(JSON.parse(await contentsOf(project)), {
      categories: ['go'],
      catalog: [{ name: 'graphql', tags: ['GraphQL'] }],
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
    await symlink(secret, join(project, CONFIGS_FILE));

    const outcome = await recordCategories(project, ['go']).then(
      () => 'recorded',
      () => 'refused'
    );

    strict.strictEqual(outcome, 'refused');
    strict.strictEqual(await readFile(secret, 'utf8'), SECRET);
  });
});
