import type { ActionResult } from '../../../src/types/dashboard/server.js';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, it, strict } from 'poku';
import { ACTIONS } from '../../../src/dashboard/server/actions.js';

const packageRoot = new URL('../../../', import.meta.url);
const projects: string[] = [];

const newProject = async (categories?: string): Promise<string> => {
  const project = await mkdtemp(join(tmpdir(), 'lagune-action-'));

  projects.push(project);

  if (categories === undefined) return project;

  await mkdir(join(project, '.lagune'), { recursive: true });
  await writeFile(join(project, '.lagune/categories.json'), categories);

  return project;
};

const record = (project: string, body: unknown): Promise<ActionResult> => {
  const handler = ACTIONS.get('/api/actions/categories');

  if (handler === undefined)
    throw new Error('the categories action is missing');

  return handler(body, { cwd: project, packageRoot });
};

const recorded = (project: string): Promise<string | null> =>
  readFile(join(project, '.lagune/categories.json'), 'utf8').catch(() => null);

afterEach(async () => {
  await Promise.all(
    projects.map((project) => rm(project, { recursive: true, force: true }))
  );

  projects.length = 0;
});

await describe('the dashboard records the chosen categories as add and remove do', async () => {
  await it('adds to the default while none is recorded', async () => {
    const project = await newProject();
    const result = await record(project, { categories: ['owasp', 'ai'] });
    const file = JSON.parse((await recorded(project)) ?? '{}');

    strict.deepStrictEqual(result, {
      status: 200,
      body: { ok: true, added: 1, removed: 0 },
    });
    strict.deepStrictEqual(file.categories, ['owasp', 'ai']);
  });

  await it('removes what is no longer chosen, down to an empty list', async () => {
    const project = await newProject('{"categories":["owasp","go"]}');
    const result = await record(project, { categories: [] });
    const file = JSON.parse((await recorded(project)) ?? '{}');

    strict.deepStrictEqual(result.body, { ok: true, added: 0, removed: 2 });
    strict.deepStrictEqual(file.categories, []);
  });

  for (const [label, body] of [
    ['an unknown category', { categories: ['bogus'] }],
    ['a field beyond the categories', { categories: [], agent: 'claude' }],
    ['a prototype key', JSON.parse('{"__proto__":{"categories":[]}}')],
    ['categories that are not a list', { categories: 'owasp' }],
    ['a body that is not an object', ['owasp']],
  ])
    await it(`rejects ${label} without writing anything`, async () => {
      const project = await newProject();
      const result = await record(project, body);
      const file = await recorded(project);

      strict.strictEqual(result.status, 400);
      strict.strictEqual(file, null);
    });
});
