import {
  chmod,
  mkdir,
  mkdtemp,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, it, strict } from 'poku';
import { objectId, readBundle } from '../../../tools/publish-branch.js';

const bundles: string[] = [];

const newBundle = async (): Promise<string> => {
  const bundle = await mkdtemp(join(tmpdir(), 'lagune-bundle-'));

  bundles.push(bundle);
  return bundle;
};

afterEach(async () => {
  await Promise.all(
    bundles.map((bundle) => rm(bundle, { recursive: true, force: true }))
  );

  bundles.length = 0;
});

await describe('publishing a bundle to a plugin branch', async () => {
  await it('names every file by the object id Git gives its content', () => {
    const ids = ['', 'hello\n'].map((content) =>
      objectId(Buffer.from(content))
    );

    strict.deepStrictEqual(ids, [
      'e69de29bb2d1d6434b8b29ae775ad8c2e48c5391',
      'ce013625030ba8dba906f756967f9e9ca394464a',
    ]);
  });

  await it('publishes every file under its bundle path, executable or not', async () => {
    const bundle = await newBundle();

    await mkdir(join(bundle, 'skills/lagune'), { recursive: true });
    await mkdir(join(bundle, 'lib/bin'), { recursive: true });
    await writeFile(join(bundle, 'skills/lagune/SKILL.md'), '# Lagune\n');
    await writeFile(join(bundle, 'lib/bin/index.js'), '#!/usr/bin/env node\n');
    await chmod(join(bundle, 'lib/bin/index.js'), 0o755);

    const published = (await readBundle(bundle))
      .map(({ path, mode }) => ({ path, mode }))
      .sort((left, right) => left.path.localeCompare(right.path));

    strict.deepStrictEqual(published, [
      { path: 'lib/bin/index.js', mode: '100755' },
      { path: 'skills/lagune/SKILL.md', mode: '100644' },
    ]);
  });

  await it('refuses a bundle that carries a symbolic link', async () => {
    const bundle = await newBundle();

    await writeFile(join(bundle, 'README.md'), '# Lagune\n');
    await symlink(join(bundle, 'README.md'), join(bundle, 'linked.md'));

    await strict.rejects(readBundle(bundle));
  });

  await it('refuses a bundle with no files, which would empty the branch', async () => {
    const bundle = await newBundle();

    await mkdir(join(bundle, 'skills'));

    await strict.rejects(readBundle(bundle));
  });
});
