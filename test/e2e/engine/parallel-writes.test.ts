import type { TrackingEntry, TrackingMap } from '../../../src/types/core.js';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { newWorkspace, runEngine } from './__utils__.js';

const WRITERS = 12;

const byName = (left: TrackingEntry, right: TrackingEntry): number =>
  left.name.localeCompare(right.name);

const readState = (workspace: string, file: string): Promise<string> =>
  readFile(join(workspace, '.lagune', file), 'utf8');

const listing = async (workspace: string, folder: string): Promise<string[]> =>
  (await readdir(join(workspace, folder))).toSorted();

await describe('engine writes that run at the same time', async () => {
  await it('keeps every finding that concurrent track calls report, leaving nothing of their own behind', async () => {
    const workspace = await newWorkspace();
    const findings: TrackingEntry[] = Array.from(
      { length: WRITERS },
      (_, index) => ({ name: `Finding ${index}`, paths: [`src/${index}.ts`] })
    );
    const runs = await Promise.all(
      findings.map((finding) =>
        runEngine(workspace, [
          'write',
          'track',
          JSON.stringify({ entries: [finding] }),
        ])
      )
    );
    const tracking: TrackingMap = JSON.parse(
      await readState(workspace, 'tracking.json')
    );
    const [state, engine] = await Promise.all([
      listing(workspace, '.lagune'),
      listing(workspace, '.lagune/.tmp'),
    ]);

    strict.deepStrictEqual(
      runs.map((run) => run.code),
      findings.map(() => 0)
    );
    strict.deepStrictEqual(
      tracking.entries.toSorted(byName),
      findings.toSorted(byName)
    );
    strict.deepStrictEqual(state, ['.tmp', 'tracking.json']);
    strict.deepStrictEqual(engine, ['.gitignore']);
  });

  await it('keeps every path that concurrent add calls leave out, leaving nothing of their own behind', async () => {
    const workspace = await newWorkspace();
    const paths = Array.from(
      { length: WRITERS },
      (_, index) => `vendor/${index}`
    );
    const runs = await Promise.all(
      paths.map((path) =>
        runEngine(workspace, ['write', 'add', '--ignore', path])
      )
    );
    const configs: { checkers: { ignore: string[] } } = JSON.parse(
      await readState(workspace, 'configs.json')
    );
    const [state, engine] = await Promise.all([
      listing(workspace, '.lagune'),
      listing(workspace, '.lagune/.tmp'),
    ]);

    strict.deepStrictEqual(
      runs.map((run) => run.code),
      paths.map(() => 0)
    );
    strict.deepStrictEqual(
      configs.checkers.ignore.toSorted(),
      paths.toSorted()
    );
    strict.deepStrictEqual(state, ['.tmp', 'configs.json']);
    strict.deepStrictEqual(engine, ['.gitignore']);
  });
});
