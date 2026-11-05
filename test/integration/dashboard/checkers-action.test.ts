import type { ActionResult } from '../../../src/types/dashboard/server.js';
import { describe, it, strict } from 'poku';
import { checkerSettings } from '../../../src/core/checkers.js';
import { newProject, recorded, runAction } from './__utils__.js';

const record = (project: string, body: unknown): Promise<ActionResult> =>
  runAction('/api/actions/checkers', project, body);

await describe('the dashboard records what the hooks leave out as the engine reads it', async () => {
  await it('records the block the hooks then follow, keeping every other config', async () => {
    const project = await newProject(
      '{"categories":["owasp","ai"],"checkers":{"ignore":["dist"]}}'
    );
    const result = await record(project, {
      checkers: {
        ignore: ['./dist/', 'test\\fixtures'],
        secrets: { gitignore: false, ignore: [] },
      },
    });
    const file = JSON.parse((await recorded(project)) ?? '{}');
    const secrets = await checkerSettings(project, 'secrets');
    const regex = await checkerSettings(project, 'regex');

    strict.deepStrictEqual(result, {
      status: 200,
      body: { ok: true, changed: 8 },
    });
    strict.deepStrictEqual(file.categories, ['owasp', 'ai']);
    strict.deepStrictEqual(secrets, { gitignore: false, ignore: [] });
    strict.deepStrictEqual(regex, {
      gitignore: true,
      ignore: ['dist', 'test/fixtures'],
    });
  });

  await it('counts only the hooks whose scan changes', async () => {
    const project = await newProject('{"checkers":{"ignore":["dist"]}}');
    const result = await record(project, {
      checkers: { ignore: ['dist'], jwt: { gitignore: false } },
    });

    strict.deepStrictEqual(result.body, { ok: true, changed: 1 });
  });

  await it('returns every hook to the defaults through an empty block', async () => {
    const project = await newProject(
      '{"checkers":{"gitignore":false,"agent":{"ignore":["vendor"]}}}'
    );
    const result = await record(project, { checkers: {} });
    const agent = await checkerSettings(project, 'agent');

    strict.deepStrictEqual(result.body, { ok: true, changed: 8 });
    strict.deepStrictEqual(agent, { gitignore: true, ignore: [] });
  });

  for (const [label, body] of [
    ['a checker it does not know', { checkers: { secret: {} } }],
    [
      'a prototype key inside the block',
      JSON.parse('{"checkers":{"__proto__":{"ignore":["dist"]}}}'),
    ],
    [
      'a prototype key beside the block',
      JSON.parse('{"checkers":{},"__proto__":{"ignore":["dist"]}}'),
    ],
    ['a path that climbs out', { checkers: { ignore: ['src/../../etc'] } }],
    ['an absolute path', { checkers: { ignore: ['/etc'] } }],
    ['a path on a drive', { checkers: { ignore: ['C:\\Windows'] } }],
    ['a pattern that takes paths back', { checkers: { ignore: ['!dist'] } }],
    ['a null byte', { checkers: { ignore: ['dist\u0000'] } }],
    ['a Git setting that is not true or false', { checkers: { gitignore: 1 } }],
    ['a setting a checker does not take', { checkers: { regex: { on: 1 } } }],
    [
      'more entries than it takes',
      {
        checkers: {
          ignore: Array.from({ length: 1001 }, (_, index) => `p${index}`),
        },
      },
    ],
    ['a field beyond the block', { checkers: {}, categories: ['owasp'] }],
    ['a body without the block', {}],
    ['a block that is not an object', { checkers: ['dist'] }],
    ['a body that is not an object', ['dist']],
  ])
    await it(`rejects ${label} without writing anything`, async () => {
      const project = await newProject();
      const result = await record(project, body);
      const file = await recorded(project);

      strict.strictEqual(result.status, 400);
      strict.strictEqual(file, null);
    });

  await it('refuses to replace a block the hooks themselves refuse', async () => {
    const broken = '{"checkers":{"ignore":["../outside"]}}';
    const project = await newProject(broken);
    const result = await record(project, { checkers: {} });
    const file = await recorded(project);

    strict.strictEqual(result.status, 500);
    strict.strictEqual(file, broken);
  });
});
