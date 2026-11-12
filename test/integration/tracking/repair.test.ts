import { mkdir, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { loadTrackingMap } from '../../../src/core/tracking.js';
import { repair, repairEntries } from '../../../src/hooks/repair/repair.js';
import { mapOf, newWorkspace } from './__utils__.js';

describe('repairEntries realigns one entry per item', () => {
  it('registers everything new against an empty map', () => {
    const result = repairEntries(mapOf([]), [
      { name: 'Leaked secret', paths: ['src/config.ts'] },
    ]);

    strict.strictEqual(result.classifications.length, 1);
    strict.strictEqual(result.classifications[0].classification, 'new');
    strict.strictEqual(result.updatedMap.entries.length, 1);
    strict.strictEqual(result.unresolved.length, 0);
  });

  it('leaves an identical entry unchanged and the map intact', () => {
    const map = mapOf([{ name: 'Leaked secret', paths: ['src/config.ts'] }]);
    const result = repairEntries(map, [
      { name: 'Leaked secret', paths: ['src/config.ts'] },
    ]);

    strict.strictEqual(result.classifications[0].classification, 'unchanged');
    strict.deepStrictEqual(result.updatedMap.entries, map.entries);
    strict.strictEqual(result.unresolved.length, 0);
  });

  it('follows a moved path while identity holds', () => {
    const map = mapOf([{ name: 'Leaked secret', paths: ['src/config.ts'] }]);
    const result = repairEntries(map, [
      { name: 'Leaked secret', paths: ['src/settings/config.ts'] },
    ]);

    strict.strictEqual(result.classifications[0].classification, 'moved');
    strict.strictEqual(result.classifications[0].name, 'Leaked secret');
    strict.deepStrictEqual(result.updatedMap.entries[0].paths, [
      'src/settings/config.ts',
    ]);
    strict.strictEqual(result.unresolved.length, 0);
  });

  it('surfaces an unreported item as orphan, never dropping it', () => {
    const map = mapOf([{ name: 'Leaked secret', paths: ['src/config.ts'] }]);
    const result = repairEntries(map, []);

    strict.strictEqual(result.unresolved.length, 1);
    strict.strictEqual(result.unresolved[0].reason, 'orphan');
    strict.strictEqual(result.unresolved[0].name, 'Leaked secret');
    strict.strictEqual(result.updatedMap.entries.length, 1);
  });

  it('flags a same-paths entry under a new name as a rename candidate', () => {
    const map = mapOf([{ name: 'Leaked secret', paths: ['src/config.ts'] }]);
    const result = repairEntries(map, [
      { name: 'Exposed API key', paths: ['src/config.ts'] },
    ]);

    strict.strictEqual(
      result.classifications[0].classification,
      'new',
      'the new name registers as a fresh item'
    );
    strict.strictEqual(result.unresolved.length, 1);
    strict.strictEqual(result.unresolved[0].reason, 'renamed-candidate');
    strict.strictEqual(result.unresolved[0].name, 'Leaked secret');
    strict(
      result.updatedMap.entries.some((entry) => entry.name === 'Leaked secret'),
      'the original entry stays in the map for the agent to decide'
    );
  });
});

describe('a moved file is corrected once for the whole map', () => {
  it('corrects the path on the one entry while its name holds', () => {
    const map = mapOf([
      { name: 'Path traversal in file serving', paths: ['src/server.js'] },
    ]);
    const result = repairEntries(map, [
      { name: 'Path traversal in file serving', paths: ['src/app.js'] },
    ]);
    const entry = result.updatedMap.entries[0];

    strict.strictEqual(result.updatedMap.entries.length, 1);
    strict.strictEqual(entry.name, 'Path traversal in file serving');
    strict.deepStrictEqual(entry.paths, ['src/app.js'], 'paths corrected once');
    strict.strictEqual(result.unresolved.length, 0);
  });
});

await describe('the repair hook logic', async () => {
  await it('registers each reported item in the stored map, classifying it as new', async () => {
    const workspace = await newWorkspace();
    const payload = JSON.stringify({
      entries: [
        { name: 'Leaked secret', paths: ['src/config.ts'] },
        { name: 'Open redirect', paths: ['src/redirect.ts'] },
      ],
    });
    const output = await repair(workspace, payload);
    const parsed: {
      classifications: { classification: string }[];
    } = JSON.parse(output);
    const map = await loadTrackingMap(workspace);

    strict.strictEqual(parsed.classifications.length, 2);
    strict.strictEqual(
      parsed.classifications.every((entry) => entry.classification === 'new'),
      true
    );
    strict.strictEqual(map.entries.length, 2);
  });

  await it('never touches the memory artifacts', async () => {
    const workspace = await newWorkspace();

    await mkdir(join(workspace, '.lagune/memory'), { recursive: true });
    await repair(
      workspace,
      JSON.stringify({
        entries: [{ name: 'Harden uploads', paths: ['src/upload.ts'] }],
      })
    );

    const memory = await readdir(join(workspace, '.lagune/memory'));

    strict.strictEqual(memory.length, 0, 'memory must stay untouched');
  });

  await it('rejects a payload with no entries', async () => {
    const workspace = await newWorkspace();

    await strict.rejects(
      repair(workspace, JSON.stringify({ entries: [] })),
      /entries/
    );
  });

  await it('drops an entry whose paths is not a string array', async () => {
    const workspace = await newWorkspace();

    await repair(
      workspace,
      JSON.stringify({
        entries: [
          { name: 'Leaked secret', paths: 'src/config.ts' },
          { name: 'Open redirect', paths: ['src/redirect.ts'] },
        ],
      })
    );

    const map = await loadTrackingMap(workspace);

    strict.strictEqual(
      map.entries.length,
      1,
      'the entry with a non-array paths fails the guard and never registers'
    );
    strict.strictEqual(map.entries[0].name, 'Open redirect');
  });

  await it('drops an entry with no paths at all', async () => {
    const workspace = await newWorkspace();

    await repair(
      workspace,
      JSON.stringify({
        entries: [
          { name: 'Leaked secret' },
          { name: 'Open redirect', paths: ['src/redirect.ts'] },
        ],
      })
    );

    const map = await loadTrackingMap(workspace);

    strict.strictEqual(map.entries.length, 1);
    strict.strictEqual(map.entries[0].name, 'Open redirect');
  });

  await it('does not rewrite the file when nothing changed', async () => {
    const workspace = await newWorkspace();
    const payload = JSON.stringify({
      entries: [{ name: 'Leaked secret', paths: ['src/config.ts'] }],
    });
    const trackingPath = join(workspace, '.lagune/tracking.json');

    await repair(workspace, payload);

    const firstWrite = await stat(trackingPath);

    await repair(workspace, payload);

    const secondWrite = await stat(trackingPath);

    strict.strictEqual(
      secondWrite.mtimeMs,
      firstWrite.mtimeMs,
      'an identical re-run leaves the file untouched'
    );
  });
});
