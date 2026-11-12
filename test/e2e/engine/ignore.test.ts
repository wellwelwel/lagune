import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { newWorkspace, runEngine } from './__utils__.js';

const CONFIGS_SCHEMA = 'https://lagune.ai/schemas/configs.json';

const projectWith = async (configs: string): Promise<string> => {
  const workspace = await newWorkspace();

  await mkdir(join(workspace, '.lagune'));
  await writeFile(join(workspace, '.lagune', 'configs.json'), configs);

  return workspace;
};

const configsOf = async (workspace: string): Promise<unknown> =>
  JSON.parse(
    await readFile(join(workspace, '.lagune', 'configs.json'), 'utf8')
  );

await describe('recording the paths the checkers leave out', async () => {
  await it('records shared paths and patterns from the project root, keeping the rest of the configs', async () => {
    const workspace = await projectWith('{"categories":["owasp"]}');
    const { code } = await runEngine(workspace, [
      'write',
      'add',
      '--ignore',
      './test/fixtures/',
      'vendor',
      'packages/*/dist',
    ]);
    const configs = await configsOf(workspace);

    strict.deepStrictEqual(
      [code, configs],
      [
        0,
        {
          $schema: CONFIGS_SCHEMA,
          categories: ['owasp'],
          checkers: { ignore: ['test/fixtures', 'vendor', 'packages/*/dist'] },
        },
      ]
    );
  });

  await it('starts a checker list of its own from the shared one, leaving the other checkers on the shared one', async () => {
    const workspace = await projectWith('{"checkers":{"ignore":["vendor"]}}');
    const added = await runEngine(workspace, [
      'write',
      'add',
      '--ignore',
      'build',
      '--checker',
      'secrets',
    ]);
    const removed = await runEngine(workspace, [
      'write',
      'remove',
      '--ignore',
      'vendor',
      '--checker',
      'regex',
    ]);
    const configs = await configsOf(workspace);

    strict.deepStrictEqual(
      [added.code, removed.code, configs],
      [
        0,
        0,
        {
          $schema: CONFIGS_SCHEMA,
          checkers: {
            ignore: ['vendor'],
            secrets: { ignore: ['vendor', 'build'] },
            regex: { ignore: [] },
          },
        },
      ]
    );
  });

  const refusals: [name: string, configs: string, args: string[]][] = [
    ['a path outside the project', '{}', ['--ignore', '../outside']],
    ['a pattern that would take paths back', '{}', ['--ignore', '!dist']],
    ['a bracket left open', '{}', ['--ignore', '[ab']],
    ['an unknown checker', '{}', ['--ignore', 'vendor', '--checker', 'nope']],
    ['no path', '{}', ['--ignore']],
    [
      'categories and paths at once',
      '{}',
      ['--categories', 'ai', '--ignore', 'vendor'],
    ],
    [
      'a checker for categories',
      '{}',
      ['--categories', 'ai', '--checker', 'secrets'],
    ],
    [
      'configs it cannot trust',
      '{"checkers":{"ignore":"vendor"}}',
      ['--ignore', 'build'],
    ],
  ];

  for (const [name, configs, args] of refusals)
    await it(`refuses ${name}, leaving the configs as they were`, async () => {
      const workspace = await projectWith(configs);
      const { code } = await runEngine(workspace, ['write', 'add', ...args]);
      const after = await readFile(
        join(workspace, '.lagune', 'configs.json'),
        'utf8'
      );

      strict.deepStrictEqual([code, after], [1, configs]);
    });
});
