import type { UntrackSummary } from '../../../src/types/core.js';
import { mkdir, readFile, stat, symlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { loadTrackingMap, removeEntries } from '../../../src/core/tracking.js';
import { untrack } from '../../../src/hooks/untrack/untrack.js';
import {
  mapOf,
  newWorkspace,
  seedStateFile,
  seedTrackingMap,
} from './__utils__.js';

const NOW = new Date('2026-07-06T00:00:00.000Z');

const MEMORY_FILES = [
  '.lagune/memory/detect.md',
  '.lagune/memory/plan.md',
  '.lagune/memory/harden.md',
];

const detectWith = (...findings: string[]): string =>
  [
    '# Project Detect Map',
    '',
    '## Findings',
    '',
    ...findings.flatMap((name) => [
      `### ${name}`,
      '',
      `- **What it is:** ${name} detail.`,
      '',
    ]),
  ].join('\n');

const detectWithDanglingMention = (...findings: string[]): string =>
  `${detectWith(...findings)}
## Applied sub-skills

- \`.lagune/skills/config.md\`: surfaced "Leaked secret".
`;

const readMemory = (workspace: string, relativePath: string): Promise<string> =>
  readFile(join(workspace, relativePath), 'utf8');

const untrackNames = async (
  workspace: string,
  names: unknown[]
): Promise<UntrackSummary> =>
  JSON.parse(await untrack(workspace, JSON.stringify({ names }), NOW));

describe('removeEntries drops items by name and reports what it removed', () => {
  it('removes one named entry, leaving the rest in place', () => {
    const map = mapOf([
      { name: 'Leaked secret', paths: ['src/config.ts'] },
      { name: 'Open redirect', paths: ['src/routes.ts'] },
    ]);
    const result = removeEntries(map, ['Leaked secret']);

    strict.deepStrictEqual(result.removed, ['Leaked secret']);
    strict.deepStrictEqual(
      result.updatedMap.entries.map((entry) => entry.name),
      ['Open redirect']
    );
  });

  it('removes a batch in one pass', () => {
    const map = mapOf([
      { name: 'Alpha', paths: ['a.ts'] },
      { name: 'Beta', paths: ['b.ts'] },
      { name: 'Gamma', paths: ['c.ts'] },
    ]);
    const result = removeEntries(map, ['Alpha', 'Gamma']);

    strict.deepStrictEqual(
      result.updatedMap.entries.map((entry) => entry.name),
      ['Beta'],
      'the unrequested item stays in place and in order'
    );
  });

  it('lists a requested name that the map does not hold under notFound', () => {
    const map = mapOf([{ name: 'Leaked secret', paths: ['src/config.ts'] }]);
    const result = removeEntries(map, ['Missing finding']);

    strict.deepStrictEqual(result.removed, []);
    strict.deepStrictEqual(result.notFound, ['Missing finding']);
    strict.strictEqual(result.updatedMap.entries.length, 1);
  });

  it('removing every entry yields the empty map', () => {
    const map = mapOf([
      { name: 'Alpha', paths: ['a.ts'] },
      { name: 'Beta', paths: ['b.ts'] },
    ]);
    const result = removeEntries(map, ['Alpha', 'Beta']);

    strict.strictEqual(result.updatedMap.entries.length, 0);
  });

  it('is idempotent: re-removing a gone name is a no-op', () => {
    const map = mapOf([{ name: 'Open redirect', paths: ['src/routes.ts'] }]);
    const first = removeEntries(map, ['Leaked secret']);
    const second = removeEntries(first.updatedMap, ['Leaked secret']);

    strict.deepStrictEqual(second.removed, []);
    strict.deepStrictEqual(second.notFound, ['Leaked secret']);
    strict.deepStrictEqual(second.updatedMap.entries, first.updatedMap.entries);
  });
});

await describe('the untrack hook logic', async () => {
  await it('removes a named entry from a seeded map and emits JSON', async () => {
    const workspace = await newWorkspace();

    await seedTrackingMap(
      workspace,
      mapOf([
        { name: 'Leaked secret', paths: ['src/config.ts'] },
        { name: 'Open redirect', paths: ['src/routes.ts'] },
      ])
    );

    const summary = await untrackNames(workspace, ['Leaked secret']);
    const map = await loadTrackingMap(workspace);

    strict.deepStrictEqual(summary.removed, ['Leaked secret']);
    strict.deepStrictEqual(
      map.entries.map((entry) => entry.name),
      ['Open redirect']
    );
  });

  await it('rejects a payload with no names', async () => {
    const workspace = await newWorkspace();

    await strict.rejects(
      untrack(workspace, JSON.stringify({ names: [] }), NOW),
      /names/
    );
  });

  await it('rejects an input that does not carry `names` as a list', async () => {
    const workspace = await newWorkspace();

    for (const payload of ['null', '["Leaked secret"]', '{"names":"x"}'])
      await strict.rejects(untrack(workspace, payload, NOW), {
        message: 'the input needs `names` as a list',
      });
  });

  await it('fails closed on a non-string name', async () => {
    const workspace = await newWorkspace();

    await seedTrackingMap(
      workspace,
      mapOf([{ name: 'Leaked secret', paths: ['src/config.ts'] }])
    );

    const summary = await untrackNames(workspace, [42, 'Leaked secret']);

    strict.deepStrictEqual(
      summary.removed,
      ['Leaked secret'],
      'the non-string name is filtered out, the valid one still removes'
    );
  });

  await it('does not rewrite the file when nothing changed', async () => {
    const workspace = await newWorkspace();
    const trackingPath = join(workspace, '.lagune/tracking.json');

    await seedTrackingMap(
      workspace,
      mapOf([{ name: 'Open redirect', paths: ['src/routes.ts'] }])
    );

    const before = await stat(trackingPath);

    await untrackNames(workspace, ['Missing finding']);

    const after = await stat(trackingPath);

    strict.strictEqual(
      after.mtimeMs,
      before.mtimeMs,
      'removing a name the map never held leaves the file untouched'
    );
  });
});

await describe('untrack removes finding sections from the memory artifacts', async () => {
  await it('strips the section from all three files and drops the entry', async () => {
    const workspace = await newWorkspace();
    const body = detectWith('Leaked secret', 'Open redirect');

    await seedTrackingMap(
      workspace,
      mapOf([
        { name: 'Leaked secret', paths: ['src/config.ts'] },
        { name: 'Open redirect', paths: ['src/routes.ts'] },
      ])
    );

    for (const file of MEMORY_FILES) await seedStateFile(workspace, file, body);

    const summary = await untrackNames(workspace, ['Leaked secret']);
    const contents = await Promise.all(
      MEMORY_FILES.map((file) => readMemory(workspace, file))
    );
    const map = await loadTrackingMap(workspace);

    strict.deepStrictEqual(summary.removed, ['Leaked secret']);
    strict.deepStrictEqual(
      summary.prose.map((entry) => entry.status),
      ['edited', 'edited', 'edited'],
      'every memory file was edited'
    );
    strict.deepStrictEqual(
      contents.map((content) => content.includes('### Leaked secret')),
      [false, false, false]
    );
    strict.deepStrictEqual(
      contents.map((content) => content.includes('### Open redirect')),
      [true, true, true]
    );
    strict.deepStrictEqual(
      map.entries.map((entry) => entry.name),
      ['Open redirect']
    );
  });

  await it('tolerates a missing memory file', async () => {
    const workspace = await newWorkspace();
    const body = detectWith('Leaked secret');

    await seedTrackingMap(
      workspace,
      mapOf([{ name: 'Leaked secret', paths: ['src/config.ts'] }])
    );
    await seedStateFile(workspace, '.lagune/memory/detect.md', body);
    await seedStateFile(workspace, '.lagune/memory/plan.md', body);

    const summary = await untrackNames(workspace, ['Leaked secret']);
    const harden = summary.prose.find(
      (entry) => entry.file === '.lagune/memory/harden.md'
    );
    const map = await loadTrackingMap(workspace);

    strict.strictEqual(harden?.status, 'absent', 'the absent file is reported');
    strict.deepStrictEqual(summary.removed, ['Leaked secret']);
    strict.strictEqual(map.entries.length, 0);
  });

  await it('reports a file where the name is already gone as unchanged', async () => {
    const workspace = await newWorkspace();

    await seedStateFile(
      workspace,
      '.lagune/memory/detect.md',
      detectWith('Leaked secret')
    );
    await seedStateFile(
      workspace,
      '.lagune/memory/plan.md',
      detectWith('Other finding')
    );
    await seedStateFile(
      workspace,
      '.lagune/memory/harden.md',
      detectWith('Leaked secret')
    );

    const summary = await untrackNames(workspace, ['Leaked secret']);
    const plan = summary.prose.find(
      (entry) => entry.file === '.lagune/memory/plan.md'
    );

    strict.strictEqual(plan?.status, 'unchanged');
    strict.deepStrictEqual(plan?.removed, []);
  });

  await it('reports a dangling mention without editing the prose that holds it', async () => {
    const workspace = await newWorkspace();

    await seedStateFile(
      workspace,
      '.lagune/memory/detect.md',
      detectWithDanglingMention('Leaked secret', 'Open redirect')
    );

    const summary = await untrackNames(workspace, ['Leaked secret']);
    const entry = summary.prose.find(
      (item) => item.file === '.lagune/memory/detect.md'
    );
    const content = await readMemory(workspace, '.lagune/memory/detect.md');

    strict.strictEqual(entry?.status, 'edited');
    strict.strictEqual(
      entry?.dangling.length,
      1,
      'the lingering sub-skill bullet is flagged'
    );
    strict.strictEqual(entry?.dangling[0].name, 'Leaked secret');
    strict.strictEqual(entry?.dangling[0].text.includes('config.md'), true);
    strict.strictEqual(content.includes('### Leaked secret'), false);
    strict.strictEqual(
      content.includes('surfaced "Leaked secret"'),
      true,
      'the bullet is reported, not rewritten'
    );
  });

  await it('reports no dangling when the name only lived in its own section', async () => {
    const workspace = await newWorkspace();

    await seedStateFile(
      workspace,
      '.lagune/memory/detect.md',
      detectWith('Leaked secret', 'Open redirect')
    );

    const summary = await untrackNames(workspace, ['Leaked secret']);

    strict.deepStrictEqual(
      summary.prose.flatMap((entry) => entry.dangling),
      [],
      'with no cross-reference there is nothing to reconcile'
    );
  });

  await it('flags a lingering mention even when this run edits nothing', async () => {
    const workspace = await newWorkspace();

    await seedStateFile(
      workspace,
      '.lagune/memory/detect.md',
      detectWithDanglingMention('Open redirect')
    );

    const summary = await untrackNames(workspace, ['Leaked secret']);
    const entry = summary.prose.find(
      (item) => item.file === '.lagune/memory/detect.md'
    );

    strict.strictEqual(
      entry?.status,
      'unchanged',
      'the section was already gone, so the file is not rewritten'
    );
    strict.strictEqual(
      entry?.dangling.length,
      1,
      'the residue is still flagged'
    );
  });

  await it('leaves every memory file untouched when nothing matches', async () => {
    const workspace = await newWorkspace();
    const modifiedTimes = async (): Promise<number[]> =>
      (
        await Promise.all(
          MEMORY_FILES.map((file) => stat(join(workspace, file)))
        )
      ).map((stamp) => stamp.mtimeMs);

    await seedTrackingMap(
      workspace,
      mapOf([{ name: 'Open redirect', paths: ['src/routes.ts'] }])
    );

    for (const file of MEMORY_FILES)
      await seedStateFile(workspace, file, detectWith('Open redirect'));

    const before = await modifiedTimes();

    await untrackNames(workspace, ['Missing finding']);

    const after = await modifiedTimes();

    strict.deepStrictEqual(
      after,
      before,
      'a file with no match is never rewritten'
    );
  });
});

await describe('untrack deletes a memory file once its last finding is gone', async () => {
  const filesExist = (
    workspace: string
  ): Promise<{ file: string; exists: boolean }[]> =>
    Promise.all(
      MEMORY_FILES.map(async (file) => ({
        file,
        exists: await stat(join(workspace, file)).then(
          () => true,
          () => false
        ),
      }))
    );

  await it('removes the file and reports it removed when no finding remains', async () => {
    const workspace = await newWorkspace();

    for (const file of MEMORY_FILES)
      await seedStateFile(workspace, file, detectWith('Leaked secret'));

    const summary = await untrackNames(workspace, ['Leaked secret']);
    const present = await filesExist(workspace);

    strict.deepStrictEqual(
      summary.prose.map((entry) => entry.status),
      ['removed', 'removed', 'removed'],
      'every emptied file is deleted, not left as a husk'
    );
    strict.deepStrictEqual(
      present.filter((entry) => entry.exists),
      [],
      'no memory file survives once its last finding is stood down'
    );
  });

  await it('keeps a file that still holds another finding', async () => {
    const workspace = await newWorkspace();

    await seedStateFile(
      workspace,
      '.lagune/memory/detect.md',
      detectWith('Leaked secret', 'Open redirect')
    );

    const summary = await untrackNames(workspace, ['Leaked secret']);
    const detect = summary.prose.find(
      (entry) => entry.file === '.lagune/memory/detect.md'
    );
    const content = await readMemory(workspace, '.lagune/memory/detect.md');

    strict.strictEqual(detect?.status, 'edited');
    strict.strictEqual(content.includes('### Open redirect'), true);
  });

  await it('deletes an emptied file even when a dangling mention lingered', async () => {
    const workspace = await newWorkspace();

    await seedStateFile(
      workspace,
      '.lagune/memory/detect.md',
      detectWithDanglingMention('Leaked secret')
    );

    const summary = await untrackNames(workspace, ['Leaked secret']);
    const entry = summary.prose.find(
      (item) => item.file === '.lagune/memory/detect.md'
    );
    const present = await filesExist(workspace);

    strict.strictEqual(entry?.status, 'removed');
    strict.deepStrictEqual(
      entry?.dangling,
      [],
      'a deleted file has no residue to reconcile'
    );
    strict.strictEqual(
      present.find((item) => item.file === '.lagune/memory/detect.md')?.exists,
      false
    );
  });
});

await describe('untrack stays inside the project', async () => {
  await it('refuses a memory artifact that links outside the project, copying none of it into the history', async () => {
    const [workspace, outside] = await Promise.all([
      newWorkspace(),
      newWorkspace(),
    ]);
    const shared = detectWith('Leaked secret');

    await writeFile(join(outside, 'detect.md'), shared);
    await mkdir(join(workspace, '.lagune/memory'), { recursive: true });
    await symlink(
      join(outside, 'detect.md'),
      join(workspace, '.lagune/memory/detect.md')
    );

    const outcome = await untrackNames(workspace, ['Leaked secret']).then(
      () => 'stood down',
      () => 'refused'
    );
    const [target, history] = await Promise.all([
      readFile(join(outside, 'detect.md'), 'utf8'),
      readFile(join(workspace, '.lagune/memory/history.md'), 'utf8').catch(
        () => null
      ),
    ]);

    strict.strictEqual(outcome, 'refused');
    strict.strictEqual(target, shared);
    strict.strictEqual(history, null);
  });
});
