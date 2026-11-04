import type { CheckerSettings } from '../../../src/types/checkers.js';
import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, it, strict } from 'poku';
import { checkerSettings } from '../../../src/core/checkers.js';

const projects: string[] = [];

const projectWith = async (configs?: string): Promise<string> => {
  const project = await mkdtemp(join(tmpdir(), 'lagune-checkers-'));

  projects.push(project);

  if (configs === undefined) return project;

  await mkdir(join(project, '.lagune'));
  await writeFile(join(project, '.lagune', 'configs.json'), configs);

  return project;
};

const secretsSettings = async (configs?: string): Promise<CheckerSettings> =>
  checkerSettings(await projectWith(configs), 'secrets');

afterEach(async () => {
  await Promise.all(
    projects.map((project) => rm(project, { recursive: true, force: true }))
  );

  projects.length = 0;
});

await describe('a checker follows the shared settings unless it sets its own, key by key', async () => {
  const cases: [
    name: string,
    configs: string | undefined,
    expected: CheckerSettings,
  ][] = [
    [
      'respects Git and ignores no path without configs',
      undefined,
      { gitignore: true, ignore: [] },
    ],
    [
      'takes the shared settings',
      '{"checkers":{"gitignore":false,"ignore":["dist"]}}',
      { gitignore: false, ignore: ['dist'] },
    ],
    [
      'replaces the shared list with its own and keeps the shared Git setting',
      '{"checkers":{"gitignore":false,"ignore":["dist"],"secrets":{"ignore":["vendor"]}}}',
      { gitignore: false, ignore: ['vendor'] },
    ],
    [
      'replaces the shared Git setting with its own and keeps the shared list',
      '{"checkers":{"ignore":["dist"],"secrets":{"gitignore":false}}}',
      { gitignore: false, ignore: ['dist'] },
    ],
    [
      'ignores nothing through an empty list of its own',
      '{"checkers":{"ignore":["dist"],"secrets":{"ignore":[]}}}',
      { gitignore: true, ignore: [] },
    ],
    [
      "never takes another checker's settings",
      '{"checkers":{"regex":{"gitignore":false,"ignore":["dist"]}}}',
      { gitignore: true, ignore: [] },
    ],
    [
      'names each path from the project root with forward slashes, once',
      '{"checkers":{"ignore":["./dist/","test\\\\fixtures","a//b","dist"]}}',
      { gitignore: true, ignore: ['dist', 'test/fixtures', 'a/b'] },
    ],
    [
      'keeps each glob pattern as written, from the project root',
      '{"checkers":{"ignore":["packages/*/dist","./**/fixture-?/","[ab]-cache"]}}',
      {
        gitignore: true,
        ignore: ['packages/*/dist', '**/fixture-?', '[ab]-cache'],
      },
    ],
  ];

  for (const [name, configs, expected] of cases)
    await it(name, async () => {
      const settings = await secretsSettings(configs);

      strict.deepStrictEqual(settings, expected);
    });
});

await describe('the checkers settings refuse what they cannot trust, naming the file and why', async () => {
  const cases: [name: string, configs: string, reason: string][] = [
    [
      'a block that is not an object',
      '{"checkers":["dist"]}',
      'sets checkers to something other than an object',
    ],
    [
      'a key that names no checker or setting',
      '{"checkers":{"secret":{}}}',
      'sets "secret" under checkers, which takes only',
    ],
    [
      'a key that would reach the prototype',
      '{"checkers":{"__proto__":{"ignore":["dist"]}}}',
      'sets "__proto__" under checkers',
    ],
    [
      'a checker setting it does not take',
      '{"checkers":{"secrets":{"ignored":["dist"]}}}',
      'sets "ignored" under checkers.secrets',
    ],
    [
      'a Git setting that is not true or false',
      '{"checkers":{"gitignore":"no"}}',
      'sets checkers.gitignore to something other than true or false',
    ],
    [
      'a list that is not a list',
      '{"checkers":{"ignore":"dist"}}',
      'sets checkers.ignore to something other than a list of paths or patterns',
    ],
    [
      'an entry that is not text',
      '{"checkers":{"secrets":{"ignore":[1]}}}',
      'sets checkers.secrets.ignore to something other than a list of paths or patterns',
    ],
    [
      'a path that climbs out',
      '{"checkers":{"ignore":["src/../../etc"]}}',
      'which climbs out of the project',
    ],
    [
      'an absolute path',
      '{"checkers":{"ignore":["/etc"]}}',
      'which is absolute',
    ],
    [
      'a path on a drive',
      '{"checkers":{"ignore":["C:\\\\Windows"]}}',
      'which is absolute',
    ],
    [
      'a drive-relative path',
      '{"checkers":{"ignore":["C:Windows"]}}',
      'which is absolute',
    ],
    [
      'a network path',
      '{"checkers":{"ignore":["\\\\\\\\server\\\\share"]}}',
      'which is absolute',
    ],
    [
      'a path that names nothing',
      '{"checkers":{"ignore":["./"]}}',
      'which names no path inside the project',
    ],
    [
      'a pattern that would take paths back',
      '{"checkers":{"ignore":["!dist"]}}',
      'which starts with !',
    ],
    [
      'a bracket left open',
      '{"checkers":{"ignore":["[ab"]}}',
      'which opens a bracket the checkers cannot read',
    ],
    [
      'a character class it does not read',
      '{"checkers":{"ignore":["[[:alpha:]]x"]}}',
      'which opens a bracket the checkers cannot read',
    ],
    [
      'a leading space',
      '{"checkers":{"ignore":[" dist"]}}',
      'which starts or ends with a space',
    ],
    [
      'a trailing space',
      '{"checkers":{"ignore":["dist "]}}',
      'which starts or ends with a space',
    ],
    [
      'a control character',
      '{"checkers":{"ignore":["dist\\u0007"]}}',
      'which holds a control character',
    ],
    [
      'a null byte',
      '{"checkers":{"ignore":["dist\\u0000"]}}',
      'which holds a control character',
    ],
    [
      'an entry too long to be real',
      JSON.stringify({ checkers: { ignore: ['a'.repeat(1025)] } }),
      'which is longer than 1024 characters',
    ],
    [
      'more entries than it takes',
      JSON.stringify({
        checkers: {
          ignore: Array.from({ length: 1001 }, (_, index) => `p${index}`),
        },
      }),
      'lists more than 1000 paths or patterns in checkers.ignore',
    ],
  ];

  for (const [name, configs, reason] of cases)
    await it(`refuses ${name}`, async () => {
      const project = await projectWith(configs);

      await strict.rejects(
        checkerSettings(project, 'secrets'),
        (error: Error) =>
          error.message.startsWith('.lagune/configs.json ') &&
          error.message.includes(reason)
      );
    });
});

await describe('the checkers settings come only from inside the project', async () => {
  await it('refuses configs reached through a link that leaves the project', async () => {
    const [project, outside] = await Promise.all([
      projectWith(),
      projectWith(),
    ]);

    await writeFile(
      join(outside, 'configs.json'),
      '{"checkers":{"ignore":["src"]}}'
    );
    await mkdir(join(project, '.lagune'));
    await symlink(
      join(outside, 'configs.json'),
      join(project, '.lagune', 'configs.json')
    );

    await strict.rejects(checkerSettings(project, 'secrets'), (error: Error) =>
      error.message.startsWith(
        '.lagune/configs.json must be a file inside this project'
      )
    );
  });

  await it('refuses configs that are not a regular file', async () => {
    const project = await projectWith();

    await mkdir(join(project, '.lagune', 'configs.json'), { recursive: true });

    await strict.rejects(checkerSettings(project, 'secrets'), (error: Error) =>
      error.message.startsWith('.lagune/configs.json is not a regular file')
    );
  });

  await it('refuses configs too large to be state', async () => {
    const project = await projectWith(
      JSON.stringify({
        checkers: { ignore: ['dist'] },
        padding: 'x'.repeat(1024 * 1024),
      })
    );

    await strict.rejects(checkerSettings(project, 'secrets'), (error: Error) =>
      error.message.startsWith('.lagune/configs.json is larger than 1 MiB')
    );
  });
});
