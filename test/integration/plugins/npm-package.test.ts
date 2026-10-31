import { readdir } from 'node:fs/promises';
import { join, posix, relative, sep } from 'node:path';
import { describe, it, strict } from 'poku';
import { isRecord } from '../../../src/core/collections.js';
import { listPackedPaths, readManifest, repositoryRoot } from './__utils__.js';

const packed = await listPackedPaths();
const { contents = {} } = await readManifest('package.json');
const skillEntries = await readdir(join(repositoryRoot, 'skills'), {
  recursive: true,
  withFileTypes: true,
});
const skillFiles = skillEntries
  .filter((entry) => entry.isFile())
  .map((entry) =>
    relative(repositoryRoot, join(entry.parentPath, entry.name))
      .split(sep)
      .join('/')
  );
const entryPoints = [
  contents.main,
  ...(isRecord(contents.bin) ? Object.values(contents.bin) : []),
];

describe('the npm package, which the harnesses that install from npm receive', () => {
  it('carries every published skill file', () => {
    strict(skillFiles.length > 0, 'the published skills hold files');
    strict.deepStrictEqual(
      skillFiles.filter((path) => !packed.has(path)),
      []
    );
  });

  it('carries the OpenCode entry and the engine that package.json names', () => {
    strict.deepStrictEqual(
      entryPoints.filter(
        (path) => typeof path !== 'string' || !packed.has(posix.normalize(path))
      ),
      []
    );
  });
});
