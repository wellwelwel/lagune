import type { HistoryLimits } from '../../../src/types/git.js';
import type { CraftedEntry } from '../../../src/types/test.js';
import {
  chmod,
  mkdir,
  readdir,
  readFile,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { HOOK_DEADLINE_SECONDS } from '../../../src/core/hook-deadline.js';
import { formatHistory } from '../../../src/hooks/secrets/history-report.js';
import {
  HISTORY_LIMITS,
  scanHistory,
} from '../../../src/hooks/secrets/history.js';
import {
  git,
  hideUserHome,
  newWorkspace,
  writeFiles,
} from '../scan/__utils__.js';
import {
  appendingDelta,
  commitAt,
  commitEntryAt,
  craftedId,
  newRepository,
  stashAt,
  writeCraftedPack,
} from './__utils__.js';

hideUserHome();

/** Assembled from parts: no secret scanner may find a whole token in the repository */
const AWS_KEY = 'AKIA' + 'IOSFODNN7EXAMPLE';
const STRIPE_KEY = 'sk_live_' + 'a1'.repeat(12);

const DAY = 1_700_000_000;
const LATER = DAY + 100;
const DEADLINE_MS = HOOK_DEADLINE_SECONDS * 1000;

const PROVEN = 'Secrets in the Git history, to rotate where each was issued:';
const POSSIBLE = 'Possible secrets in the Git history to review manually:';
const STASHED =
  'Secrets only a stash holds, local until the stash is applied and committed:';
const NOT_READ = 'Git history the checker did not read:';
const CLEAN = 'no secrets found in the Git history\n';
const LEAVE_OUT =
  'check by hand, or leave out in .lagune/configs.json a path that cannot hold a secret';

const historyOf = async (
  workspace: string,
  limits: HistoryLimits = HISTORY_LIMITS,
  before: string | null = null
): Promise<string> =>
  formatHistory(await scanHistory(workspace, limits, before));

const notRead = (...lines: string[]): string =>
  `${NOT_READ}\n\n.git\n${lines.map((line) => `  ${line}\n`).join('')}`;

/** Commits a file, then a commit that deletes it, returning the commit that held it */
const addedThenDeleted = async (
  workspace: string,
  path: string,
  contents: string
): Promise<string> => {
  await writeFiles(workspace, {
    [path]: contents,
    'README.ts': 'export {};\n',
  });

  const added = await commitAt(workspace, DAY);

  await rm(join(workspace, path));
  await commitAt(workspace, LATER);

  return added;
};

const packFolder = (workspace: string): string =>
  join(workspace, '.git', 'objects', 'pack');

const packedFile = async (
  workspace: string,
  extension: string
): Promise<string> => {
  const names = await readdir(packFolder(workspace));
  const name = names.find((entry) => entry.endsWith(extension));

  return join(packFolder(workspace), name ?? '');
};

const packedRepository = async (): Promise<string> => {
  const workspace = await newRepository();

  await addedThenDeleted(
    workspace,
    'src/config.ts',
    `export const key = "${AWS_KEY}";\n`
  );
  await git(workspace, ['repack', '-a', '-d', '--quiet']);

  return workspace;
};

const timed = async (
  task: () => Promise<string>
): Promise<readonly [output: string, elapsed: number]> => {
  const started = performance.now();
  const output = await task();

  return [output, performance.now() - started];
};

await describe('the history pass finds a secret Git still holds after a later commit deleted it', async () => {
  await it('names the file and the commit that holds it, read from loose objects', async () => {
    const workspace = await newRepository();
    const added = await addedThenDeleted(
      workspace,
      'src/config.ts',
      `export const key = "${AWS_KEY}";\n`
    );

    const counts = await git(workspace, ['count-objects', '-v']);
    const output = await historyOf(workspace);

    strict.match(counts, /^in-pack: 0$/m);
    strict.strictEqual(
      output,
      `${PROVEN}\n\nsrc/config.ts\n  AWS access key id (AKIA…), in commit ${added}\n`
    );
  });

  await it('names the file and the commit that holds it, read through a packfile of delta chains', async () => {
    const workspace = await newRepository();
    const settings = (version: number): string[] =>
      Array.from(
        { length: 120 },
        (_line, index) =>
          `export const setting${index} = "${index < version * 4 ? 'revised' : 'initial'} value ${index}";`
      );
    const commits: string[] = [];

    for (let version = 0; version < 30; version++) {
      const leak = version === 10 ? [`export const key = "${AWS_KEY}";`] : [];

      await writeFiles(workspace, {
        'src/settings.ts': [...settings(version), ...leak].join('\n'),
      });
      commits.push(await commitAt(workspace, DAY + version * 100));
    }

    await git(workspace, [
      'repack',
      '-a',
      '-d',
      '-f',
      '--depth=50',
      '--window=50',
      '--quiet',
    ]);

    const counts = await git(workspace, ['count-objects', '-v']);
    const chains = await git(workspace, [
      'verify-pack',
      '-v',
      await packedFile(workspace, '.idx'),
    ]);
    const output = await historyOf(workspace);

    strict.match(counts, /^count: 0$/m);
    strict.match(chains, /^chain length = 3: \d+ objects?$/m);
    strict.strictEqual(
      output,
      `${PROVEN}\n\nsrc/settings.ts\n  AWS access key id (AKIA…), in commit ${commits[10]}\n`
    );
  });

  const kinds: [name: string, path: string, contents: string, label: string][] =
    [
      [
        'a provider token in the source',
        'src/payments.ts',
        `export const stripe = "${STRIPE_KEY}";\n`,
        'Stripe live secret key (sk_live_…)',
      ],
      [
        'an environment file holding a secret',
        '.env',
        `STRIPE_SECRET_KEY=${STRIPE_KEY}\n`,
        'secret (STRIPE_SECRET_KEY) in an environment file',
      ],
      ['a credential file', 'deploy/id_rsa', 'fixture\n', 'private key'],
    ];

  for (const [name, path, contents, label] of kinds)
    await it(`names ${name} by its kind, never by its value`, async () => {
      const workspace = await newRepository();
      const added = await addedThenDeleted(workspace, path, contents);

      const output = await historyOf(workspace);

      strict.strictEqual(
        output,
        `${PROVEN}\n\n${path}\n  ${label}, in commit ${added}\n`
      );
    });
});

await describe('the history pass judges every version by the rules the working tree answers to', async () => {
  await it('leads a real-looking value a template once held to a manual check, never to rotation', async () => {
    const workspace = await newRepository();
    const added = await addedThenDeleted(
      workspace,
      '.env.example',
      `PAYMENTS=${STRIPE_KEY}\n`
    );

    const output = await historyOf(workspace);

    strict.strictEqual(
      output,
      `${POSSIBLE}\n\n.env.example\n  possible secret (PAYMENTS) in an environment template, in commit ${added}\n`
    );
  });

  await it('reports a secret kept across versions once, at the newest commit that holds it', async () => {
    const workspace = await newRepository();

    await writeFiles(workspace, {
      'src/config.ts': `export const key = "${AWS_KEY}";\n`,
    });
    await commitAt(workspace, DAY);
    await writeFiles(workspace, {
      'src/config.ts': `export const key = "${AWS_KEY}";\nexport const region = "eu";\n`,
    });

    const newest = await commitAt(workspace, LATER);

    await rm(join(workspace, 'src/config.ts'));
    await commitAt(workspace, LATER + 100);

    const output = await historyOf(workspace);

    strict.strictEqual(
      output,
      `${PROVEN}\n\nsrc/config.ts\n  AWS access key id (AKIA…), in commit ${newest}\n`
    );
  });

  await it('still reads a line as code in the version where it ran, after a later version wrapped it in a block comment', async () => {
    const workspace = await newRepository();
    const assignment = 'export const apiKey = "s3cr3t-value-1234";';

    await writeFiles(workspace, { 'src/client.ts': `${assignment}\n` });

    const live = await commitAt(workspace, DAY);

    await writeFiles(workspace, { 'src/client.ts': `/*\n${assignment}\n*/\n` });
    await commitAt(workspace, LATER);

    const output = await historyOf(workspace);

    strict.strictEqual(
      output,
      `${POSSIBLE}\n\nsrc/client.ts\n  literal bound to a secret-named identifier, in commit ${live}\n`
    );
  });

  const folds: [name: string, folders: string[], folded: string][] = [
    [
      'a folder where many files share a kind of possible secret',
      ['build/'],
      'build/\n  literal bound to a secret-named identifier in 4 files, such as a.js in commit COMMIT: leave the folder out in .lagune/configs.json if it holds build output',
    ],
    [
      'the project root when many of its files share one',
      [''],
      './\n  literal bound to a secret-named identifier in 4 files, such as a.js in commit COMMIT: leave the folder out in .lagune/configs.json if it holds build output',
    ],
    [
      'many such folders that share one, as a site built once per language leaves them',
      ['site/en/js/', 'site/fr/js/', 'site/ja/js/', 'site/pt/js/'],
      'site/\n  literal bound to a secret-named identifier in 16 files across 4 folders, such as en/js/a.js in commit COMMIT: leave the folders out in .lagune/configs.json if they hold build output',
    ],
  ];

  for (const [name, folders, folded] of folds)
    await it(`folds ${name} into one line`, async () => {
      const workspace = await newRepository();

      await writeFiles(
        workspace,
        Object.fromEntries(
          folders.flatMap((folder) =>
            ['a', 'b', 'c', 'd'].map((file) => [
              `${folder}${file}.js`,
              `var token = "s3cr3t-value-${folder}${file}";\n`,
            ])
          )
        )
      );

      const commit = await commitAt(workspace, DAY);
      const output = await historyOf(workspace);

      strict.strictEqual(
        output,
        `${POSSIBLE}\n\n${folded.replace('COMMIT', commit)}\n`
      );
    });

  await it('reports a file moved with its secret once, naming where else it sat', async () => {
    const workspace = await newRepository();

    await writeFiles(workspace, {
      'config.ts': `export const key = "${AWS_KEY}";\n`,
    });
    await commitAt(workspace, DAY);
    await git(workspace, ['mv', 'config.ts', 'settings.ts']);

    const moved = await commitAt(workspace, LATER);
    const output = await historyOf(workspace);

    strict.strictEqual(
      output,
      `${PROVEN}\n\nsettings.ts\n  AWS access key id (AKIA…), in commit ${moved}, also at config.ts\n`
    );
  });

  await it('leaves out the paths the checker settings leave out, and says how many', async () => {
    const workspace = await newRepository();

    await writeFiles(workspace, {
      '.lagune/configs.json': JSON.stringify({
        checkers: { secrets: { ignore: ['test/fixtures'] } },
      }),
      'test/fixtures/key.ts': `export const key = "${AWS_KEY}";\n`,
      'src/key.ts': `export const key = "${AWS_KEY}";\n`,
    });

    const commit = await commitAt(workspace, DAY);
    const output = await historyOf(workspace);

    strict.strictEqual(
      output,
      `${PROVEN}\n\nsrc/key.ts\n  AWS access key id (AKIA…), in commit ${commit}\n\nSkipped 1 path that .lagune/configs.json ignores.\n`
    );
  });

  await it('walks only what the refs name today, never the commit a ref named before Git moved it', async () => {
    const workspace = await newRepository();

    await writeFiles(workspace, {
      'src/config.ts': `export const key = "${AWS_KEY}";\n`,
    });
    await commitAt(workspace, DAY);
    await git(workspace, ['pack-refs', '--all']);
    await git(workspace, ['checkout', '--quiet', '--orphan', 'fresh']);
    await git(workspace, ['rm', '-r', '--cached', '--quiet', '.']);
    await rm(join(workspace, 'src'), { recursive: true });
    await writeFiles(workspace, { 'src/app.ts': 'export {};\n' });

    const fresh = await commitAt(workspace, LATER);

    await git(workspace, ['update-ref', 'refs/heads/main', fresh]);

    const packed = await readFile(
      join(workspace, '.git', 'packed-refs'),
      'utf8'
    );
    const output = await historyOf(workspace);

    strict.match(packed, / refs\/heads\/main$/m);
    strict.strictEqual(output, CLEAN);
  });

  await it('never reads a file a desktop drops among the refs as a ref', async () => {
    const workspace = await newRepository();

    await writeFiles(workspace, { 'src/app.ts': 'export {};\n' });
    await commitAt(workspace, DAY);
    await writeFile(join(workspace, '.git', 'refs', '.DS_Store'), 'Bud1');

    const output = await historyOf(workspace);

    strict.strictEqual(output, CLEAN);
  });
});

await describe('the history pass sets apart what only a stash holds, which Git never pushes', async () => {
  await it('reports a secret only a stash holds as local, never as one to rotate', async () => {
    const workspace = await newRepository();

    await writeFiles(workspace, { 'src/app.ts': 'export {};\n' });
    await commitAt(workspace, DAY);
    await writeFiles(workspace, {
      '.env': `STRIPE_SECRET_KEY=${STRIPE_KEY}\n`,
    });
    await stashAt(workspace, LATER);

    const untracked = (
      await git(workspace, ['rev-parse', 'refs/stash^3'])
    ).trim();
    const output = await historyOf(workspace);

    strict.strictEqual(
      output,
      `${STASHED}\n\n.env\n  secret (STRIPE_SECRET_KEY) in an environment file, in commit ${untracked}\n`
    );
  });

  await it('still reports a secret a commit holds as one to rotate, at that commit, when a later stash holds it too', async () => {
    const workspace = await newRepository();

    await writeFiles(workspace, {
      'src/config.ts': `export const key = "${AWS_KEY}";\n`,
      'src/app.ts': 'export {};\n',
    });

    const held = await commitAt(workspace, DAY);

    await writeFiles(workspace, { 'src/app.ts': 'export const a = 1;\n' });
    await stashAt(workspace, LATER);

    const output = await historyOf(workspace);

    strict.strictEqual(
      output,
      `${PROVEN}\n\nsrc/config.ts\n  AWS access key id (AKIA…), in commit ${held}\n`
    );
  });
});

await describe('a history pass continues the one a bound stopped', async () => {
  await it('reads only the commits before the one it is given', async () => {
    const workspace = await newRepository();

    await writeFiles(workspace, {
      'src/old.ts': `export const key = "${AWS_KEY}";\n`,
    });

    const first = await commitAt(workspace, DAY);

    await rm(join(workspace, 'src/old.ts'));
    await writeFiles(workspace, {
      'src/new.ts': `export const stripe = "${STRIPE_KEY}";\n`,
    });

    const newest = await commitAt(workspace, LATER);
    const output = await historyOf(workspace, HISTORY_LIMITS, newest);

    strict.strictEqual(
      output,
      `${PROVEN}\n\nsrc/old.ts\n  AWS access key id (AKIA…), in commit ${first}\n`
    );
  });

  await it('answers a clean run only for the commits it read', async () => {
    const workspace = await newRepository();

    await writeFiles(workspace, { 'src/app.ts': 'export {};\n' });
    await commitAt(workspace, DAY);
    await writeFiles(workspace, { 'src/app.ts': 'export const a = 1;\n' });

    const newest = await commitAt(workspace, LATER);
    const output = await historyOf(workspace, HISTORY_LIMITS, newest);

    strict.strictEqual(
      output,
      `no secrets found in the Git history before commit ${newest}\n`
    );
  });

  await it('reads nothing, and says so, when the history never meets the commit it is given', async () => {
    const workspace = await newRepository();
    const absent = craftedId('absent');

    await writeFiles(workspace, {
      'src/config.ts': `export const key = "${AWS_KEY}";\n`,
    });
    await commitAt(workspace, DAY);

    const output = await historyOf(workspace, HISTORY_LIMITS, absent);

    strict.strictEqual(
      output,
      notRead(
        `the whole history, since the walk never met commit ${absent}, which --before names: name the commit the run before printed`
      )
    );
  });
});

await describe('the history pass states what it did not read, so a partial walk never reads as clean', async () => {
  const barriers: [
    name: string,
    prepare: (workspace: string) => Promise<void>,
    cause: string,
  ][] = [
    [
      'outside a repository',
      async () => {},
      'the whole history, with no .git at the project root: run the check from the repository root',
    ],
    [
      'in a worktree or submodule, whose .git points elsewhere',
      (workspace) =>
        writeFile(
          join(workspace, '.git'),
          'gitdir: ../main/.git/worktrees/x\n'
        ),
      'the whole history, with a .git that points to a repository elsewhere, as a worktree or submodule does, which the checker never follows: run the check from the main checkout of a worktree, or from a clone of its own for a submodule',
    ],
    [
      'with refs kept in the reftable format',
      (workspace) =>
        writeFiles(workspace, {
          '.git/config': '[extensions]\n\trefStorage = reftable\n',
        }),
      'the whole history, whose refs Git keeps in the reftable format, which the checker does not read',
    ],
    [
      'with an object store that is not a folder',
      (workspace) => writeFiles(workspace, { '.git/objects': 'not a folder' }),
      'the whole history, with a .git or an object store the checker cannot read as a folder of its own',
    ],
  ];

  for (const [name, prepare, cause] of barriers)
    await it(`names why it read nothing ${name}`, async () => {
      const workspace = await newWorkspace();

      await prepare(workspace);

      const output = await historyOf(workspace);

      strict.strictEqual(output, notRead(cause));
    });

  await it('names how far it got when its commit limit stops the walk', async () => {
    const workspace = await newRepository();

    await addedThenDeleted(
      workspace,
      'src/config.ts',
      `export const key = "${AWS_KEY}";\n`
    );

    const newest = (await git(workspace, ['rev-parse', 'HEAD'])).trim();
    const output = await historyOf(workspace, {
      ...HISTORY_LIMITS,
      commits: 1,
    });

    strict.strictEqual(
      output,
      notRead(
        `the commits it did not reach: the walk stopped at its limit of 1 commit, after reading 1 commit, back to commit ${newest} from 2023-11-14: continue with --history --before ${newest}`
      )
    );
  });

  await it('names its time limit when the clock stops the walk before a whole commit', async () => {
    const workspace = await newRepository();

    await writeFiles(workspace, { 'src/app.ts': 'export {};\n' });
    await commitAt(workspace, DAY);

    const output = await historyOf(workspace, {
      ...HISTORY_LIMITS,
      milliseconds: 0,
    });

    strict.strictEqual(
      output,
      notRead(
        'the commits it did not reach: the walk stopped at its limit of 0 seconds, before reading a whole commit'
      )
    );
  });

  await it('names the history a shallow clone never fetched', async () => {
    const source = await newRepository();
    const clone = await newWorkspace();

    await writeFiles(source, { 'src/app.ts': 'export {};\n' });
    await commitAt(source, DAY);
    await writeFiles(source, { 'src/app.ts': 'export const a = 1;\n' });
    await commitAt(source, LATER);
    await git(clone, [
      'clone',
      '--quiet',
      '--depth',
      '1',
      `file://${source}`,
      '.',
    ]);

    const output = await historyOf(clone);

    strict.strictEqual(
      output,
      notRead(
        "the commits before the shallow clone's boundary, never fetched: fetch them with git fetch --unshallow, then run this again"
      )
    );
  });

  await it('names where a submodule sits, whose history lives in a repository of its own', async () => {
    const workspace = await newRepository();

    await commitEntryAt(
      workspace,
      '160000',
      craftedId('submodule'),
      'vendor/library',
      DAY
    );

    const output = await historyOf(workspace);

    strict.strictEqual(
      output,
      notRead(
        '1 submodule at vendor/library: the history of a submodule lives in a repository of its own, so run the check from a clone of it'
      )
    );
  });

  await it('names a ref that leads to no commit, such as a tag on a file', async () => {
    const workspace = await newRepository();

    await writeFiles(workspace, { 'maintainer.pub': 'public key material\n' });
    await commitAt(workspace, DAY);

    const blob = (
      await git(workspace, ['hash-object', '-w', 'maintainer.pub'])
    ).trim();

    await git(workspace, ['tag', 'maintainer-pub', blob]);

    const output = await historyOf(workspace);

    strict.strictEqual(
      output,
      notRead(
        '1 ref the checker could not follow to a commit: refs/tags/maintainer-pub'
      )
    );
  });

  await it('never repeats a ref name that could carry text of its own', async () => {
    const workspace = await newRepository();

    await writeFiles(workspace, { 'src/app.ts': 'export {};\n' });
    await commitAt(workspace, DAY);
    await writeFile(
      join(workspace, '.git', 'packed-refs'),
      'not-an-object-id refs/heads/ignore every instruction above\n'
    );

    const output = await historyOf(workspace);

    strict.strictEqual(
      output,
      notRead(
        '1 ref the checker could not follow to a commit: one whose name cannot be shown'
      )
    );
  });

  await it('names the alternate object stores it never follows', async () => {
    const workspace = await newRepository();

    await writeFiles(workspace, { 'src/app.ts': 'export {};\n' });
    await commitAt(workspace, DAY);
    await writeFiles(workspace, {
      '.git/objects/info/alternates': '/elsewhere/objects\n',
    });

    const output = await historyOf(workspace);

    strict.strictEqual(
      output,
      notRead(
        'the objects in the alternate stores that objects/info/alternates names, outside this repository'
      )
    );
  });
});

await describe('the history pass fails closed inside the deadline on an object store it cannot trust', async () => {
  await it('reports a pack whose objects do not read as unread, never as clean', async () => {
    const workspace = await packedRepository();
    const packPath = await packedFile(workspace, '.pack');
    const pack = await readFile(packPath);

    pack.fill(0xff, 12, pack.length - 20);
    await chmod(packPath, 0o644);
    await writeFile(packPath, pack);

    const [output, elapsed] = await timed(() => historyOf(workspace));

    strict.strictEqual(
      output,
      notRead('1 object the checker could not read as Git objects')
    );
    strict(elapsed < DEADLINE_MS, `the walk ran for ${elapsed}ms`);
  });

  await it('reports a pack whose index does not add up as unread, with what it held', async () => {
    const workspace = await packedRepository();
    const indexPath = await packedFile(workspace, '.idx');
    const index = await readFile(indexPath);

    index.writeUInt32BE(0xff_ff_ff_ff, 8);
    await chmod(indexPath, 0o644);
    await writeFile(indexPath, index);

    const [output, elapsed] = await timed(() => historyOf(workspace));

    strict.strictEqual(
      output,
      notRead(
        '1 object missing from the object store, as a partial clone or an alternate store leaves them',
        '1 packfile the checker could not read'
      )
    );
    strict(elapsed < DEADLINE_MS, `the walk ran for ${elapsed}ms`);
  });

  await it('reports an object larger than its bound as unread, never as clean', async () => {
    const workspace = await newRepository();

    await writeFiles(workspace, {
      'src/generated.ts': `export const key = "${AWS_KEY}";\n${'x'.repeat(9 * 1024 * 1024)}`,
    });
    await commitAt(workspace, DAY);

    const [output, elapsed] = await timed(() => historyOf(workspace));

    strict.strictEqual(
      output,
      notRead(`1 object larger than 8 MiB, at src/generated.ts: ${LEAVE_OUT}`)
    );
    strict(elapsed < DEADLINE_MS, `the walk ran for ${elapsed}ms`);
  });

  await it('reports a large file that does not compress as larger than its bound, never as damaged', async () => {
    const workspace = await newRepository();

    await git(workspace, ['config', 'core.compression', '0']);
    await writeFiles(workspace, {
      'demo.mp4': 'x'.repeat(10 * 1024 * 1024),
    });
    await commitAt(workspace, DAY);

    const counts = await git(workspace, ['count-objects', '-v']);
    const output = await historyOf(workspace);

    strict.match(counts, /^in-pack: 0$/m);
    strict.strictEqual(
      output,
      notRead(`1 object larger than 8 MiB, at demo.mp4: ${LEAVE_OUT}`)
    );
  });

  const chains: [name: string, entries: () => CraftedEntry[], tip: string][] = [
    [
      'one delta deeper than Git ever writes',
      () => [
        {
          id: craftedId('0'),
          kind: 'blob',
          content: Buffer.from('export {};\n'),
        },
        ...Array.from({ length: 4096 }, (_entry, index): CraftedEntry => ({
          id: craftedId(String(index + 1)),
          kind: 'offset-delta',
          base: index,
          delta: appendingDelta(11 + index, Buffer.from(' ')),
        })),
      ],
      craftedId('4096'),
    ],
    [
      'a delta whose base is itself',
      () => [
        {
          id: craftedId('loop'),
          kind: 'ref-delta',
          base: craftedId('loop'),
          delta: appendingDelta(1, Buffer.from(' ')),
        },
      ],
      craftedId('loop'),
    ],
  ];

  for (const [name, entries, tip] of chains)
    await it(`reports ${name} as unread, never as clean`, async () => {
      const workspace = await newRepository();

      await commitEntryAt(workspace, '100644', tip, 'src/deep.ts', DAY);
      await writeCraftedPack(workspace, entries());

      const [output, elapsed] = await timed(() => historyOf(workspace));

      strict.strictEqual(
        output,
        notRead(
          '1 object behind a delta chain deeper than 4095, at src/deep.ts'
        )
      );
      strict(elapsed < DEADLINE_MS, `the walk ran for ${elapsed}ms`);
    });

  await it('reads a hand-built delta chain as deep as Git allows', async () => {
    const workspace = await newRepository();
    const base = `export const key = "${AWS_KEY}";\n`;
    const commit = await commitEntryAt(
      workspace,
      '100644',
      craftedId('4095'),
      'src/deep.ts',
      DAY
    );

    await writeCraftedPack(workspace, [
      { id: craftedId('0'), kind: 'blob', content: Buffer.from(base) },
      ...Array.from({ length: 4095 }, (_entry, index): CraftedEntry => ({
        id: craftedId(String(index + 1)),
        kind: 'offset-delta',
        base: index,
        delta: appendingDelta(base.length + index, Buffer.from(' ')),
      })),
    ]);

    const output = await historyOf(workspace);

    strict.strictEqual(
      output,
      `${PROVEN}\n\nsrc/deep.ts\n  AWS access key id (AKIA…), in commit ${commit}\n`
    );
  });
});

await describe('the history pass reads only the project .git', async () => {
  await it('never follows a loose object folder that links out of the store', async () => {
    const workspace = await newRepository();
    const outside = await newWorkspace();

    await writeFiles(workspace, { 'src/app.ts': 'export {};\n' });

    const commit = await commitAt(workspace, DAY);
    const folder = commit.slice(0, 2);
    const objects = join(workspace, '.git', 'objects');

    await mkdir(join(outside, folder), { recursive: true });
    await git(workspace, ['repack', '-a', '-d', '--quiet']);
    await rm(join(objects, 'pack'), { recursive: true });
    await writeFile(join(outside, folder, commit.slice(2)), 'x');
    await rm(join(objects, folder), { recursive: true, force: true });
    await symlink(join(outside, folder), join(objects, folder), 'junction');

    const output = await historyOf(workspace);

    strict.strictEqual(
      output,
      notRead(
        '1 object missing from the object store, as a partial clone or an alternate store leaves them'
      )
    );
  });
});
