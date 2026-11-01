import { describe, it, strict } from 'poku';
import {
  loadTrackingMap,
  writeTrackingMap,
} from '../../../src/core/tracking.js';
import { track, trackEntries } from '../../../src/hooks/track/track.js';
import { mapOf, newWorkspace } from './__utils__.js';

describe('trackEntries registers and re-reports one item per finding', () => {
  it('registers a reported finding as new', () => {
    const result = trackEntries(mapOf([]), [
      { name: 'Leaked secret', paths: ['src/config.ts'] },
    ]);

    strict.strictEqual(result.classifications[0].classification, 'new');
    strict.strictEqual(result.updatedMap.entries.length, 1);
  });

  it('leaves an identical report unchanged', () => {
    const map = mapOf([{ name: 'Leaked secret', paths: ['src/config.ts'] }]);

    const result = trackEntries(map, [
      { name: 'Leaked secret', paths: ['src/config.ts'] },
    ]);

    strict.strictEqual(result.classifications[0].classification, 'unchanged');
    strict.deepStrictEqual(result.updatedMap.entries, map.entries);
  });

  it('re-reports the same item by name, one entry not two', () => {
    const map = mapOf([
      {
        name: 'Avatar uploads keep the filename',
        paths: ['src/routes/avatar.js'],
      },
    ]);

    const result = trackEntries(map, [
      {
        name: 'Avatar uploads keep the filename',
        paths: ['src/routes/avatar.js'],
      },
    ]);

    strict.strictEqual(result.classifications[0].classification, 'unchanged');
    strict.strictEqual(
      result.updatedMap.entries.length,
      1,
      're-reporting reuses the one entry, never creates a second'
    );
    strict.strictEqual(
      result.updatedMap.entries[0].name,
      'Avatar uploads keep the filename'
    );
  });

  it('re-reporting the same item keeps one entry', () => {
    const map = mapOf([{ name: 'Leaked secret', paths: ['src/config.ts'] }]);

    const afterHarden = trackEntries(map, [
      { name: 'Leaked secret', paths: ['src/config.ts'] },
    ]);
    strict.strictEqual(afterHarden.updatedMap.entries.length, 1);

    const afterVerify = trackEntries(afterHarden.updatedMap, [
      { name: 'Leaked secret', paths: ['src/config.ts'] },
    ]);
    strict.strictEqual(afterVerify.updatedMap.entries[0].name, 'Leaked secret');
    strict.strictEqual(afterVerify.updatedMap.entries.length, 1);
  });

  it('follows a moved path on re-run, no duplicate', () => {
    const map = mapOf([{ name: 'Leaked secret', paths: ['src/config.ts'] }]);

    const result = trackEntries(map, [
      { name: 'Leaked secret', paths: ['src/settings/config.ts'] },
    ]);

    strict.strictEqual(result.classifications[0].classification, 'moved');
    strict.strictEqual(result.classifications[0].name, 'Leaked secret');
    strict.strictEqual(result.updatedMap.entries.length, 1);
    strict.deepStrictEqual(result.updatedMap.entries[0].paths, [
      'src/settings/config.ts',
    ]);
  });

  it('registers any reported item, new name included', () => {
    const result = trackEntries(mapOf([]), [
      { name: 'New item', paths: ['src/x.ts'] },
    ]);

    strict.strictEqual(result.updatedMap.entries.length, 1);
    strict.strictEqual(result.classifications[0].classification, 'new');
    strict.strictEqual(result.updatedMap.entries[0].name, 'New item');
  });

  it('preserves entry order when re-reporting every item', () => {
    const map = mapOf([
      { name: 'Alpha', paths: ['a.ts'] },
      { name: 'Beta', paths: ['b.ts'] },
      { name: 'Gamma', paths: ['c.ts'] },
    ]);

    const result = trackEntries(map, [
      { name: 'Beta', paths: ['b.ts'] },
      { name: 'Gamma', paths: ['c.ts'] },
      { name: 'Alpha', paths: ['a.ts'] },
    ]);

    strict.deepStrictEqual(
      result.updatedMap.entries.map((entry) => entry.name),
      ['Alpha', 'Beta', 'Gamma'],
      're-reporting reuses each entry in place, never reshuffling'
    );
  });

  it('appends a new item at the end, keeping existing positions', () => {
    const map = mapOf([
      { name: 'Alpha', paths: ['a.ts'] },
      { name: 'Beta', paths: ['b.ts'] },
    ]);

    const result = trackEntries(map, [
      { name: 'Alpha', paths: ['a.ts'] },
      { name: 'Beta', paths: ['b.ts'] },
      { name: 'Gamma', paths: ['c.ts'] },
    ]);

    strict.deepStrictEqual(
      result.updatedMap.entries.map((entry) => entry.name),
      ['Alpha', 'Beta', 'Gamma'],
      'the new finding lands last, the existing two keep their indices'
    );
  });

  it('keeps an item the payload did not report, never orphaning it', () => {
    const map = mapOf([
      { name: 'Leaked secret', paths: ['src/config.ts'] },
      { name: 'Open redirect', paths: ['src/routes.ts'] },
    ]);

    const result = trackEntries(map, [
      { name: 'Leaked secret', paths: ['src/config.ts'] },
    ]);

    strict(
      result.updatedMap.entries.some((entry) => entry.name === 'Open redirect'),
      'the unreported item stays in the map, track never removes'
    );
    strict.strictEqual(result.updatedMap.entries.length, 2);
  });
});

await describe('the track hook logic', async () => {
  await it('registers the reported finding in the stored map, keeping every entry the payload did not report', async () => {
    const workspace = await newWorkspace();

    await writeTrackingMap(
      workspace,
      mapOf([{ name: 'Leaked secret', paths: ['src/config.ts'] }])
    );
    await track(
      workspace,
      JSON.stringify({
        entries: [{ name: 'Open redirect', paths: ['src/routes.ts'] }],
      })
    );

    const map = await loadTrackingMap(workspace);

    strict.deepStrictEqual(
      map,
      mapOf([
        { name: 'Leaked secret', paths: ['src/config.ts'] },
        { name: 'Open redirect', paths: ['src/routes.ts'] },
      ])
    );
  });
});
