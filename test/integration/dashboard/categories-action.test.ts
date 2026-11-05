import type { ActionResult } from '../../../src/types/dashboard/server.js';
import { describe, it, strict } from 'poku';
import { newProject, recorded, runAction } from './__utils__.js';

const record = (project: string, body: unknown): Promise<ActionResult> =>
  runAction('/api/actions/categories', project, body);

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
