import { mkdir, readFile, symlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import {
  loadTrackingMap,
  serializeTrackingMap,
} from '../../../src/core/tracking.js';
import { track } from '../../../src/hooks/track/track.js';
import {
  mapOf,
  newWorkspace,
  seedStateFile,
  seedTrackingMap,
} from './__utils__.js';

const TRACKING = '.lagune/tracking.json';
const LEAKED_SECRET = { name: 'Leaked secret', paths: ['src/config.ts'] };

const isRefusal = (error: Error): boolean =>
  error.message.startsWith(`${TRACKING} `);

await describe('tracking map I/O', async () => {
  await it('returns the empty map when the file is absent', async () => {
    const workspace = await newWorkspace();
    const map = await loadTrackingMap(workspace);

    strict.deepStrictEqual(map, { entries: [] });
  });

  for (const [label, contents] of [
    ['malformed JSON', 'not json{'],
    ['a JSON array', '[]'],
    ['no list of entries', '{}'],
    ['entries that are not a list', '{"entries":"Leaked secret"}'],
    ['an entry with no name', '{"entries":[{"paths":["src/config.ts"]}]}'],
  ])
    await it(`refuses ${label} instead of reading it as an empty map`, async () => {
      const workspace = await newWorkspace();

      await seedStateFile(workspace, TRACKING, contents);

      await strict.rejects(loadTrackingMap(workspace), isRefusal);
    });

  await it('refuses a map that links outside the project', async () => {
    const [workspace, outside] = await Promise.all([
      newWorkspace(),
      newWorkspace(),
    ]);

    await writeFile(join(outside, 'tracking.json'), '{"entries":[]}');
    await mkdir(join(workspace, '.lagune'));
    await symlink(join(outside, 'tracking.json'), join(workspace, TRACKING));

    await strict.rejects(loadTrackingMap(workspace), isRefusal);
  });

  await it('never replaces a map it cannot read, leaving it as it was', async () => {
    const workspace = await newWorkspace();

    await seedStateFile(workspace, TRACKING, 'not json{');

    const outcome = await track(
      workspace,
      JSON.stringify({ entries: [LEAKED_SECRET] })
    ).then(
      () => 'tracked',
      () => 'refused'
    );
    const contents = await readFile(join(workspace, TRACKING), 'utf8');

    strict.strictEqual(outcome, 'refused');
    strict.strictEqual(contents, 'not json{');
  });

  await it('reads back the map it wrote, unchanged', async () => {
    const workspace = await newWorkspace();
    const original = mapOf([LEAKED_SECRET]);

    await seedTrackingMap(workspace, original);

    const reloaded = await loadTrackingMap(workspace);

    strict.deepStrictEqual(reloaded, original);
  });

  await it('normalizes an old-shape map on load, dropping its name and each entry id, phase, and prose', async () => {
    const workspace = await newWorkspace();

    await seedStateFile(
      workspace,
      TRACKING,
      JSON.stringify({
        name: 'lagune',
        entries: [
          {
            id: 'old-1',
            phase: 'detect',
            name: 'Leaked secret',
            evidence: { paths: ['src/config.ts'], note: 'reads the secret' },
          },
        ],
      })
    );

    const map = await loadTrackingMap(workspace);

    strict.deepStrictEqual(map, {
      entries: [{ name: 'Leaked secret', paths: [] }],
    });
  });

  it('serializes with two-space indent and a trailing newline', () => {
    const serialized = serializeTrackingMap(mapOf([]));

    strict.strictEqual(serialized, '{\n  "entries": []\n}\n');
  });
});
