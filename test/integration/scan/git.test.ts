import type { WalkResult } from '../../../src/types/scan.js';
import { mkdir, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { env, pid } from 'node:process';
import { describe, it, strict } from 'poku';
import { SOURCE_FILTER } from '../../../src/core/scan/filters.js';
import { walkTargets } from '../../../src/core/scan/walk.js';
import { git, newWorkspace, writeFiles } from './__utils__.js';

const NO_HOME = join(tmpdir(), `lagune-no-home-${pid}`);

env.HOME = NO_HOME;
env.USERPROFILE = NO_HOME;
delete env.XDG_CONFIG_HOME;

const scan = (
  workspace: string,
  targets: readonly string[] = ['.']
): Promise<WalkResult> =>
  walkTargets(
    workspace,
    targets.map((target) => join(workspace, target)),
    SOURCE_FILTER
  );

const sorted = ({ files, skipped }: WalkResult): WalkResult => ({
  files: files.toSorted(),
  skipped: skipped.toSorted(),
});

const repository = async (
  files: Readonly<Record<string, string>>
): Promise<string> => {
  const workspace = await newWorkspace();

  await mkdir(join(workspace, '.git'));
  await writeFiles(workspace, files);

  return workspace;
};

const trackedRepository = async (
  init: readonly string[],
  files: Readonly<Record<string, string>>,
  tracked: readonly string[]
): Promise<string> => {
  const workspace = await newWorkspace();

  await git(workspace, init);
  await writeFiles(workspace, files);
  await git(workspace, ['add', '--force', ...tracked]);

  return workspace;
};

const withHome = async <Result>(
  home: string,
  configHome: string | undefined,
  task: () => Promise<Result>
): Promise<Result> => {
  env.HOME = home;
  env.USERPROFILE = home;

  if (configHome === undefined) delete env.XDG_CONFIG_HOME;
  else env.XDG_CONFIG_HOME = configHome;

  try {
    return await task();
  } finally {
    env.HOME = NO_HOME;
    env.USERPROFILE = NO_HOME;
    delete env.XDG_CONFIG_HOME;
  }
};

await describe('a scan leaves out what Git ignores', async () => {
  await it('skips the untracked files and folders each .gitignore ignores, read from its own folder', async () => {
    const workspace = await repository({
      '.gitignore': 'dist/\n*.log.js\n',
      'src/app.js': '',
      'src/debug.log.js': '',
      'dist/bundle.js': '',
      'packages/web/.gitignore': '/out\n',
      'packages/web/out/page.js': '',
      'packages/web/src/out/page.js': '',
      'packages/api/out/page.js': '',
    });

    const result = sorted(await scan(workspace));

    strict.deepStrictEqual(result, {
      files: [
        '.gitignore',
        join('packages', 'api', 'out', 'page.js'),
        join('packages', 'web', '.gitignore'),
        join('packages', 'web', 'src', 'out', 'page.js'),
        join('src', 'app.js'),
      ].toSorted(),
      skipped: [
        'dist',
        join('packages', 'web', 'out'),
        join('src', 'debug.log.js'),
      ].toSorted(),
    });
  });

  await it('lets a later rule or a deeper .gitignore take back what an earlier one ignored', async () => {
    const workspace = await repository({
      '.gitignore': '*.gen.js\n!keep.gen.js\n',
      'drop.gen.js': '',
      'keep.gen.js': '',
      'sub/.gitignore': '!*.gen.js\n',
      'sub/back.gen.js': '',
    });

    const result = sorted(await scan(workspace));

    strict.deepStrictEqual(result, {
      files: [
        '.gitignore',
        'keep.gen.js',
        join('sub', '.gitignore'),
        join('sub', 'back.gen.js'),
      ].toSorted(),
      skipped: ['drop.gen.js'],
    });
  });

  await it('never takes back a file inside a folder it ignores', async () => {
    const workspace = await repository({
      '.gitignore': 'build/\n!build/keep.js\n',
      'build/keep.js': '',
    });

    const result = sorted(await scan(workspace));

    strict.deepStrictEqual(result, {
      files: ['.gitignore'],
      skipped: ['build'],
    });
  });
});

await describe('a scan reads each ignore pattern the way Git does', async () => {
  const cases: [
    name: string,
    rules: string,
    files: readonly string[],
    skipped: readonly string[],
  ][] = [
    ['? stands for one character', '?.js\n', ['a.js', 'ab.js'], ['a.js']],
    [
      'a bracket takes a set, a range, or what is outside them',
      '[ab].js\n[d-f]x.js\n[!z]y.js\n',
      ['a.js', 'c.js', 'ex.js', 'gx.js', 'zy.js', 'qy.js'],
      ['a.js', 'ex.js', 'qy.js'],
    ],
    [
      'a leading **/ matches at any depth',
      '**/cache\n',
      ['cache/a.js', 'deep/er/cache/b.js', 'caches/c.js'],
      ['cache', join('deep', 'er', 'cache')],
    ],
    [
      'a trailing /** matches what is inside a folder, never the folder itself',
      'logs/**\n',
      ['logs/a.js', 'logs/deep/b.js'],
      [join('logs', 'a.js'), join('logs', 'deep')],
    ],
    [
      'a middle /**/ matches zero or more folders',
      'a/**/z.js\n',
      ['a/z.js', 'a/b/c/z.js', 'a/b/y.js'],
      [join('a', 'z.js'), join('a', 'b', 'c', 'z.js')],
    ],
    [
      'a trailing slash matches folders alone',
      'only/\n',
      ['only/a.js', 'x/only'],
      ['only'],
    ],
    [
      'a backslash keeps # and ! literal, and a comment ignores nothing',
      '\\#notes.js\n\\!bang.js\n# plain.js\n',
      ['#notes.js', '!bang.js', 'plain.js'],
      ['!bang.js', '#notes.js'],
    ],
    [
      'trailing spaces drop unless escaped, and a CRLF line ends like LF',
      'space.js   \ntail.js\\ \r\ncrlf.js\r\n',
      ['space.js', 'tail.js ', 'tail.js', 'crlf.js'],
      ['crlf.js', 'space.js', 'tail.js '],
    ],
    ['an unclosed bracket ignores nothing', '[ab.js\n', ['a.js', '[ab.js'], []],
  ];

  for (const [name, rules, files, skipped] of cases)
    await it(name, async () => {
      const workspace = await repository({
        '.gitignore': rules,
        ...Object.fromEntries(files.map((file) => [file, ''])),
      });

      const result = await scan(workspace);

      strict.deepStrictEqual(result.skipped.toSorted(), skipped.toSorted());
    });
});

await describe('a scan keeps every file Git tracks', async () => {
  const formats: [
    name: string,
    init: readonly string[],
    after: readonly string[][],
  ][] = [
    ['in the default index', ['init', '--quiet'], []],
    [
      'in an index of version 4',
      ['init', '--quiet'],
      [['update-index', '--index-version', '4']],
    ],
    [
      'in a SHA-256 repository',
      ['init', '--quiet', '--object-format=sha256'],
      [],
    ],
  ];

  for (const [name, init, after] of formats)
    await it(`even inside a folder or under a pattern Git ignores, ${name}`, async () => {
      const workspace = await trackedRepository(
        init,
        {
          '.gitignore': 'generated/\n*.local.js\n',
          'generated/tracked.js': '',
          'generated/tracked-too.js': '',
          'generated/untracked.js': '',
          'config.local.js': '',
          'other.local.js': '',
        },
        ['generated/tracked.js', 'generated/tracked-too.js', 'config.local.js']
      );

      for (const args of after) await git(workspace, args);

      const result = sorted(await scan(workspace));

      strict.deepStrictEqual(result, {
        files: [
          '.gitignore',
          'config.local.js',
          join('generated', 'tracked-too.js'),
          join('generated', 'tracked.js'),
        ].toSorted(),
        skipped: [
          join('generated', 'untracked.js'),
          'other.local.js',
        ].toSorted(),
      });
    });
});

await describe('a scan follows the ignore files Git reads beyond the project tree', async () => {
  await it('reads the local exclude file, never an excludes file the project points Git at', async () => {
    const workspace = await repository({
      '.git/info/exclude': 'local.js\n',
      'project-excludes': 'project.js\n',
      'local.js': '',
      'project.js': '',
    });

    await writeFile(
      join(workspace, '.git', 'config'),
      `[core]\n\texcludesFile = ${join(workspace, 'project-excludes')}\n`
    );

    const result = sorted(await scan(workspace));

    strict.deepStrictEqual(result, {
      files: ['project-excludes', 'project.js'],
      skipped: ['local.js'],
    });
  });

  await it('reads the user excludes file Git configures, or its default place when none is set', async () => {
    const [home, workspace] = await Promise.all([
      newWorkspace(),
      repository({ 'default.js': '', 'configured.js': '' }),
    ]);

    await writeFiles(home, {
      'xdg/git/ignore': 'default.js\n',
      'global-ignore': 'configured.js\n',
    });

    const unconfigured = await withHome(home, join(home, 'xdg'), () =>
      scan(workspace)
    );

    await writeFiles(home, {
      '.gitconfig':
        '[user]\n\tname = x\n[core]\n\texcludesFile = "~/global-ignore" ; the user file\n',
    });

    const configured = await withHome(home, join(home, 'xdg'), () =>
      scan(workspace)
    );

    strict.deepStrictEqual(
      [unconfigured.skipped, configured.skipped],
      [['default.js'], ['configured.js']]
    );
  });
});

await describe('a scan skips nothing when it cannot trust what Git would ignore', async () => {
  const rules = { '.gitignore': 'dist/\n', 'dist/app.js': '' };
  const cases: [name: string, prepare: () => Promise<string>][] = [
    [
      'outside a Git repository',
      async () => {
        const workspace = await newWorkspace();

        await writeFiles(workspace, rules);

        return workspace;
      },
    ],
    [
      'when .git is a file pointing elsewhere',
      async () => {
        const workspace = await newWorkspace();

        await writeFiles(workspace, { ...rules, '.git': 'gitdir: ../other\n' });

        return workspace;
      },
    ],
    [
      'when the index is not one it can read',
      () => repository({ ...rules, '.git/index': 'DIRC not an index' }),
    ],
    [
      'when the index splits its entries into another file',
      async () => {
        const workspace = await trackedRepository(
          ['init', '--quiet'],
          { ...rules, 'kept.js': '' },
          ['kept.js']
        );

        await git(workspace, ['update-index', '--split-index']);

        return workspace;
      },
    ],
  ];

  for (const [name, prepare] of cases)
    await it(name, async () => {
      const workspace = await prepare();

      const result = await scan(workspace);

      strict.deepStrictEqual(result.skipped, []);
    });
});

await describe('a scan reads no ignore file it cannot read safely', async () => {
  await it('ignores nothing through a linked .gitignore, as Git does', async () => {
    const workspace = await repository({
      'rules.txt': 'dist/\n',
      'dist/app.js': '',
    });

    await symlink(join(workspace, 'rules.txt'), join(workspace, '.gitignore'));

    const result = await scan(workspace);

    strict.deepStrictEqual(result.skipped, []);
  });

  await it('ignores nothing through a .gitignore too large to read', async () => {
    const workspace = await repository({
      '.gitignore': `dist/\n${'#'.repeat(300 * 1024)}\n`,
      'dist/app.js': '',
    });

    const result = await scan(workspace);

    strict.deepStrictEqual(result.skipped, []);
  });

  await it('finishes on a pattern built to make a matcher backtrack', async () => {
    const name = `${'a'.repeat(200)}.js`;
    const workspace = await repository({
      '.gitignore': '*a*a*a*a*a*a*a*a*a*a*b\n',
      [name]: '',
    });

    const result = sorted(await scan(workspace));

    strict.deepStrictEqual(result, {
      files: ['.gitignore', name].toSorted(),
      skipped: [],
    });
  });
});

await describe('a scan reads whatever path it is named, ignored or not', async () => {
  await it('scans a folder or file Git ignores and still skips what Git ignores below a named folder Git keeps', async () => {
    const workspace = await repository({
      '.gitignore': 'dist/\nout/\n',
      'dist/app.js': '',
      'dist/inner/deep.js': '',
      'packages/out/page.js': '',
      'packages/main.js': '',
    });

    const results = await Promise.all([
      scan(workspace, ['dist']),
      scan(workspace, ['dist/inner']),
      scan(workspace, ['dist/app.js']),
      scan(workspace, ['packages']),
    ]);

    strict.deepStrictEqual(results.map(sorted), [
      {
        files: [join('dist', 'app.js'), join('dist', 'inner', 'deep.js')],
        skipped: [],
      },
      { files: [join('dist', 'inner', 'deep.js')], skipped: [] },
      { files: [join('dist', 'app.js')], skipped: [] },
      {
        files: [join('packages', 'main.js')],
        skipped: [join('packages', 'out')],
      },
    ]);
  });
});
