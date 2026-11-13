import type { CheckerSettings } from '../../../src/types/checkers.js';
import type { WalkResult } from '../../../src/types/scan.js';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { platform } from 'node:process';
import { describe, it, strict } from 'poku';
import { SOURCE_FILTER } from '../../../src/core/scan/filters.js';
import { walkTargets } from '../../../src/core/scan/walk.js';
import { git, hideUserHome, newWorkspace, writeFiles } from './__utils__.js';

const FILE_NAMES_HOLD_ASTERISKS = platform !== 'win32';

hideUserHome();

const scan = (
  workspace: string,
  settings: CheckerSettings,
  targets: readonly string[] = ['.']
): Promise<WalkResult> =>
  walkTargets(
    workspace,
    targets.map((target) => join(workspace, target)),
    SOURCE_FILTER,
    settings
  );

const repository = async (
  files: Readonly<Record<string, string>>
): Promise<string> => {
  const workspace = await newWorkspace();

  await mkdir(join(workspace, '.git'));
  await writeFiles(workspace, files);

  return workspace;
};

/** Runs a case only where the file system can name every file it creates */
const itNaming = (files: readonly string[]): typeof it.skip =>
  FILE_NAMES_HOLD_ASTERISKS || files.every((file) => !file.includes('*'))
    ? it
    : it.skip;

await describe('a scan leaves out the paths the checker settings ignore', async () => {
  await it('skips each folder and file a setting names from the project root, even one Git tracks, apart from what Git ignores', async () => {
    const workspace = await newWorkspace();

    await git(workspace, ['init', '--quiet']);
    await writeFiles(workspace, {
      '.gitignore': 'dist/\n',
      'dist/app.js': '',
      'src/app.js': '',
      'src/fixtures/bad.js': '',
      'test/fixtures/bad.js': '',
      'generated.js': '',
    });
    await git(workspace, [
      'add',
      '--force',
      'test/fixtures/bad.js',
      'generated.js',
    ]);

    const result = await scan(workspace, {
      gitignore: true,
      ignore: ['test/fixtures', 'generated.js'],
    });

    strict.deepStrictEqual(result, {
      files: [
        '.gitignore',
        join('src', 'app.js'),
        join('src', 'fixtures', 'bad.js'),
      ].toSorted((left, right) => left.localeCompare(right)),
      skipped: {
        git: ['dist'],
        configs: ['generated.js', join('test', 'fixtures')],
      },
    });
  });

  await it('scans what Git ignores when the Git setting is off', async () => {
    const workspace = await repository({
      '.gitignore': 'dist/\n',
      'dist/app.js': '',
    });
    const result = await scan(workspace, { gitignore: false, ignore: [] });

    strict.deepStrictEqual(result, {
      files: ['.gitignore', join('dist', 'app.js')],
      skipped: { git: [], configs: [] },
    });
  });

  await it('scans a named path the settings ignore, and anything inside one', async () => {
    const workspace = await repository({
      'test/fixtures/bad.js': '',
      'test/fixtures/deep/worse.js': '',
    });
    const settings = { gitignore: true, ignore: ['test/fixtures'] };
    const results = await Promise.all([
      scan(workspace, settings, ['test/fixtures']),
      scan(workspace, settings, ['test/fixtures/deep']),
      scan(workspace, settings, ['test/fixtures/bad.js']),
      scan(workspace, settings, ['test']),
    ]);

    strict.deepStrictEqual(
      results.map(({ files, skipped }) => [files, skipped.configs]),
      [
        [
          [
            join('test', 'fixtures', 'bad.js'),
            join('test', 'fixtures', 'deep', 'worse.js'),
          ],
          [],
        ],
        [[join('test', 'fixtures', 'deep', 'worse.js')], []],
        [[join('test', 'fixtures', 'bad.js')], []],
        [[], [join('test', 'fixtures')]],
      ]
    );
  });
});

await describe('a scan reads each ignore entry as a glob pattern from the project root', async () => {
  const cases: [
    name: string,
    pattern: string,
    files: readonly string[],
    skipped: readonly string[],
  ][] = [
    [
      '* stands for any folder name',
      'packages/*/dist',
      [
        'packages/web/dist/a.js',
        'packages/api/dist/b.js',
        'packages/web/src/dist/c.js',
        'dist/d.js',
      ],
      [join('packages', 'api', 'dist'), join('packages', 'web', 'dist')],
    ],
    [
      'a leading **/ reaches any depth, the root included',
      '**/dist',
      [
        'dist/a.js',
        'packages/web/dist/b.js',
        'packages/web/src/dist/c.js',
        'distribution/d.js',
      ],
      [
        'dist',
        join('packages', 'web', 'dist'),
        join('packages', 'web', 'src', 'dist'),
      ],
    ],
    [
      'a name with * stays at the project root',
      '*.generated.ts',
      ['a.generated.ts', 'deep/b.generated.ts', 'c.ts'],
      ['a.generated.ts'],
    ],
    [
      'a name with * reaches any depth after **/',
      '**/*.generated.ts',
      ['a.generated.ts', 'deep/b.generated.ts', 'c.ts'],
      ['a.generated.ts', join('deep', 'b.generated.ts')],
    ],
    [
      '? stands for one character',
      'fixture-?',
      ['fixture-a/a.js', 'fixture-1/b.js', 'fixture-ab/c.js'],
      ['fixture-1', 'fixture-a'],
    ],
    [
      'a bracket stands for one character of its set',
      '[ab]-cache',
      ['a-cache/a.js', 'b-cache/b.js', 'c-cache/c.js'],
      ['a-cache', 'b-cache'],
    ],
    [
      'a bracket keeps a glob character literal',
      '[*]x',
      ['*x/a.js', 'yx/b.js'],
      ['*x'],
    ],
    [
      'a trailing /** reaches what a folder holds, never the folder itself',
      'dist/**',
      ['dist/a.js', 'dist/deep/b.js'],
      [join('dist', 'a.js'), join('dist', 'deep')],
    ],
  ];

  for (const [name, pattern, files, skipped] of cases)
    await itNaming(files)(name, async () => {
      const workspace = await repository(
        Object.fromEntries(files.map((file) => [file, '']))
      );
      const result = await scan(workspace, {
        gitignore: true,
        ignore: [pattern],
      });

      strict.deepStrictEqual(
        result.skipped.configs.toSorted(),
        skipped.toSorted()
      );
    });

  await it('scans a named folder a pattern ignores', async () => {
    const workspace = await repository({ 'packages/web/dist/a.js': '' });
    const result = await scan(
      workspace,
      { gitignore: true, ignore: ['**/dist'] },
      ['packages/web/dist']
    );

    strict.deepStrictEqual(result, {
      files: [join('packages', 'web', 'dist', 'a.js')],
      skipped: { git: [], configs: [] },
    });
  });

  await it('stops instead of scanning on when the patterns take too long to match', async () => {
    const workspace = await repository(
      Object.fromEntries(
        Array.from({ length: 10 }, (_, index) => [
          `${'a'.repeat(248)}${index}.js`,
          '',
        ])
      )
    );
    const patterns = Array.from(
      { length: 1000 },
      (_, index) => `*${'a'.repeat(1000)}b${index}`
    );

    await strict.rejects(
      scan(workspace, { gitignore: false, ignore: patterns }),
      (error: Error) =>
        error.message.startsWith(
          '.lagune/configs.json ignores paths through patterns too costly to match'
        )
    );
  });
});
