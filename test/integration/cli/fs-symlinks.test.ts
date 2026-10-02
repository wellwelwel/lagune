import { lstat, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import {
  readSymlinkTarget,
  removeSymlinkIfPresent,
  writeSymlinkIfAbsent,
  writeSymlinkOverwrite,
} from '../../../src/core/fs-actions.js';
import { newWorkspace } from './__utils__.js';

const seedSource = async (workspace: string): Promise<string> => {
  const source = join(workspace, 'source.md');

  await writeFile(source, 'the source contents', 'utf8');
  return source;
};

await describe('symlink file actions', async () => {
  await it('creates a link and resolves the source through it', async () => {
    const workspace = await newWorkspace();

    await seedSource(workspace);

    const link = join(workspace, 'link.md');
    const outcome = await writeSymlinkIfAbsent(link, 'source.md');

    strict.strictEqual(outcome.status, 'linked');
    strict((await lstat(link)).isSymbolicLink());
    strict.strictEqual(await readSymlinkTarget(link), 'source.md');
    strict.strictEqual(await readFile(link, 'utf8'), 'the source contents');
  });

  await it('skips a link that already points at the same target', async () => {
    const workspace = await newWorkspace();

    await seedSource(workspace);

    const link = join(workspace, 'link.md');

    await writeSymlinkIfAbsent(link, 'source.md');
    const outcome = await writeSymlinkIfAbsent(link, 'source.md');

    strict.strictEqual(outcome.status, 'skipped');
  });

  await it('re-points a link that drifted to another target', async () => {
    const workspace = await newWorkspace();

    await seedSource(workspace);

    const link = join(workspace, 'link.md');

    await writeSymlinkIfAbsent(link, 'elsewhere.md');
    const outcome = await writeSymlinkIfAbsent(link, 'source.md');

    strict.strictEqual(outcome.status, 'linked');
    strict.strictEqual(await readSymlinkTarget(link), 'source.md');
  });

  await it('never replaces a real file in the if-absent mode', async () => {
    const workspace = await newWorkspace();

    await seedSource(workspace);

    const occupied = join(workspace, 'occupied.md');

    await writeFile(occupied, 'user contents', 'utf8');
    const outcome = await writeSymlinkIfAbsent(occupied, 'source.md');

    strict.strictEqual(outcome.status, 'skipped');
    strict.strictEqual(await readFile(occupied, 'utf8'), 'user contents');
  });

  await it('replaces a real file in the overwrite mode', async () => {
    const workspace = await newWorkspace();

    await seedSource(workspace);

    const occupied = join(workspace, 'occupied.md');

    await writeFile(occupied, 'stale copy', 'utf8');
    await writeSymlinkOverwrite(occupied, 'source.md');

    strict((await lstat(occupied)).isSymbolicLink());
    strict.strictEqual(await readFile(occupied, 'utf8'), 'the source contents');
  });

  await it('removes only symlinks, leaving real files alone', async () => {
    const workspace = await newWorkspace();
    const source = await seedSource(workspace);
    const link = join(workspace, 'link.md');

    await writeSymlinkIfAbsent(link, 'source.md');

    strict.strictEqual(await removeSymlinkIfPresent(link), true);
    strict.strictEqual(await removeSymlinkIfPresent(source), false);
    strict.strictEqual(await readFile(source, 'utf8'), 'the source contents');
  });
});
