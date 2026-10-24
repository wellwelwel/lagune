import {
  mkdir,
  mkdtemp,
  realpath,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join } from 'node:path';
import { afterEach, describe, it, strict } from 'poku';
import { npxBeside, pinnedPath } from '../../../src/bin/fallback.js';

const roots: string[] = [];

const newRoot = async (): Promise<string> => {
  const root = await realpath(await mkdtemp(join(tmpdir(), 'lagune-handoff-')));

  roots.push(root);
  return root;
};

const place = async (path: string): Promise<void> => {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, '');
};

const link = async (target: string, path: string): Promise<void> => {
  await mkdir(dirname(path), { recursive: true });
  await symlink(target, path);
};

afterEach(async () => {
  await Promise.all(
    roots.map((root) => rm(root, { recursive: true, force: true }))
  );

  roots.length = 0;
});

await describe('the npm the hand-off to the frozen version runs', async () => {
  await it('is the one linked beside a POSIX runtime', async () => {
    const root = await newRoot();

    await place(join(root, 'node/bin/node'));
    await place(join(root, 'node/lib/node_modules/npm/bin/npx-cli.js'));
    await link(
      '../lib/node_modules/npm/bin/npx-cli.js',
      join(root, 'node/bin/npx')
    );

    const npx = await npxBeside(join(root, 'node/bin/node'));

    strict.strictEqual(
      npx,
      join(root, 'node/lib/node_modules/npm/bin/npx-cli.js')
    );
  });

  await it('is the one bundled next to a Windows runtime', async () => {
    const root = await newRoot();

    await place(join(root, 'nodejs/node.exe'));
    await place(join(root, 'nodejs/node_modules/npm/bin/npx-cli.js'));

    const npx = await npxBeside(join(root, 'nodejs/node.exe'));

    strict.strictEqual(
      npx,
      join(root, 'nodejs/node_modules/npm/bin/npx-cli.js')
    );
  });

  await it('is none for a runtime without npm, even linked from a folder that holds one', async () => {
    const root = await newRoot();

    await place(join(root, 'deno/bin/deno'));
    await place(join(root, 'node/lib/node_modules/npm/bin/npx-cli.js'));
    await link(join(root, 'deno/bin/deno'), join(root, 'shared/bin/deno'));
    await link(
      join(root, 'node/lib/node_modules/npm/bin/npx-cli.js'),
      join(root, 'shared/bin/npx')
    );

    const npx = await npxBeside(join(root, 'shared/bin/deno'));

    strict.strictEqual(npx, undefined);
  });

  await it("is none when the npx beside the runtime is not npm's own", async () => {
    const root = await newRoot();

    await place(join(root, 'node/bin/node'));
    await place(join(root, 'node/bin/npx'));

    const npx = await npxBeside(join(root, 'node/bin/node'));

    strict.strictEqual(npx, undefined);
  });
});

await describe('the search path the frozen version runs with', async () => {
  await it('leads with the runtime and drops every relative or package folder', () => {
    const inherited = [
      '/usr/bin',
      '.',
      'node_modules/.bin',
      '/work/project/node_modules/.bin',
      '/usr/local/bin',
    ].join(delimiter);

    const path = pinnedPath('/opt/node/bin/node', inherited);

    strict.strictEqual(
      path,
      ['/opt/node/bin', '/usr/bin', '/usr/local/bin'].join(delimiter)
    );
  });
});
