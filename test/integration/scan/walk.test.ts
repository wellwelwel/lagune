import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { SOURCE_FILTER } from '../../../src/core/scan/filters.js';
import { walk } from '../../../src/core/scan/walk.js';
import { createFiles, newWorkspace } from './__utils__.js';

const walkSources = async (paths: readonly string[]): Promise<string[]> => {
  const workspace = await newWorkspace();

  await createFiles(workspace, paths);

  return (await walk(workspace, workspace, SOURCE_FILTER)).toSorted();
};

await describe('a source walk lists the files a hook reads', async () => {
  await it('skips common non-source extensions, test files, and env files', async () => {
    const files = await walkSources([
      'app.js',
      'app.test.js',
      'app.spec.ts',
      'data.json',
      'notes.md',
      '.env',
      '.env.production',
    ]);

    strict.deepStrictEqual(files, ['app.js']);
  });

  await it('skips unambiguous dependency and cache dirs across ecosystems', async () => {
    const files = await walkSources([
      'app.js',
      ...[
        'node_modules',
        '.next',
        '__pycache__',
        '.venv',
        'Pods',
        'pkg.egg-info',
      ].map((dir) => join(dir, 'noise.js')),
    ]);

    strict.deepStrictEqual(files, ['app.js']);
  });

  await it('walks ambiguous dirs that may hold real source', async () => {
    const files = await walkSources(
      ['dist', 'build', 'bin', 'vendor'].map((dir) => join(dir, 'tool.js'))
    );

    strict.deepStrictEqual(files, [
      join('bin', 'tool.js'),
      join('build', 'tool.js'),
      join('dist', 'tool.js'),
      join('vendor', 'tool.js'),
    ]);
  });

  await it('ignores the root .lagune dir and any lagune-* dir', async () => {
    const files = await walkSources([
      'kept.js',
      ...['.lagune', 'lagune-detect', 'src/lagune-cache'].map((dir) =>
        join(dir, 'noise.js')
      ),
    ]);

    strict.deepStrictEqual(files, ['kept.js']);
  });

  await it('walks a .lagune dir that is not at the project root', async () => {
    const files = await walkSources([join('pkg', '.lagune', 'r.js')]);

    strict.deepStrictEqual(files, [join('pkg', '.lagune', 'r.js')]);
  });
});
