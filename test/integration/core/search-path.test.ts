import { chmod, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { platform } from 'node:process';
import { describe, it, strict } from 'poku';
import { nodeOnSearchPath } from '../../../src/core/search-path.js';

const NODE_BINARY = platform === 'win32' ? 'node.exe' : 'node';
const HAS_EXECUTE_PERMISSION = platform !== 'win32';
const EXECUTABLE = 0o755;
const NOT_EXECUTABLE = 0o644;

const plantNode = async (folder: string, mode: number): Promise<void> => {
  await mkdir(folder, { recursive: true });
  await writeFile(join(folder, NODE_BINARY), '');
  await chmod(join(folder, NODE_BINARY), mode);
};

await describe('the Node.js a plugin runs the engine on', async () => {
  await it('is the first executable one in an absolute folder of the search path that no package or working folder can plant', async () => {
    const root = await mkdtemp(join(tmpdir(), 'lagune-search-path-'));
    const packageBin = join(root, 'project', 'node_modules', '.bin');
    const empty = join(root, 'empty');
    const runtime = join(root, 'runtime', 'bin');
    const later = join(root, 'later', 'bin');

    await plantNode(packageBin, EXECUTABLE);
    await plantNode(runtime, EXECUTABLE);
    await plantNode(later, EXECUTABLE);
    await mkdir(empty);

    const found = await nodeOnSearchPath(
      ['.', 'node_modules/.bin', packageBin, empty, runtime, later].join(
        delimiter
      )
    );

    await rm(root, { recursive: true, force: true });

    strict.strictEqual(found, join(runtime, NODE_BINARY));
  });

  if (HAS_EXECUTE_PERMISSION)
    await it('is never a node file without execute permission', async () => {
      const root = await mkdtemp(join(tmpdir(), 'lagune-search-path-'));
      const unexecutable = join(root, 'unexecutable');
      const runtime = join(root, 'runtime');

      await plantNode(unexecutable, NOT_EXECUTABLE);
      await plantNode(runtime, EXECUTABLE);

      const found = await nodeOnSearchPath(
        [unexecutable, runtime].join(delimiter)
      );

      await rm(root, { recursive: true, force: true });

      strict.strictEqual(found, join(runtime, NODE_BINARY));
    });

  await it('is none when no trusted folder holds one', async () => {
    const found = await nodeOnSearchPath(['.', 'bin'].join(delimiter));

    strict.strictEqual(found, undefined);
  });
});
