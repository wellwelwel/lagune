import { posix } from 'node:path';
import { describe, it, strict } from 'poku';
import { isRecord } from '../../../src/core/collections.js';
import { listPackedPaths, listSkillFiles, readManifest } from './__utils__.js';

const packed = await listPackedPaths();
const { contents = {} } = await readManifest('package.json');
const skillFiles = await listSkillFiles();
const entryPoints = [
  contents.main,
  ...(isRecord(contents.bin) ? Object.values(contents.bin) : []),
];

describe('the npm package, which the agents that install from npm receive', () => {
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
