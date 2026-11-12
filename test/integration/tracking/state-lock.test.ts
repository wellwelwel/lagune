import {
  chmod,
  mkdir,
  readdir,
  readFile,
  stat,
  symlink,
  utimes,
  writeFile,
} from 'node:fs/promises';
import { join } from 'node:path';
import { platform } from 'node:process';
import { describe, it, strict } from 'poku';
import { withStateLock } from '../../../src/core/state-lock.js';
import {
  loadTrackingMap,
  writeTrackingMap,
} from '../../../src/core/tracking.js';
import { track } from '../../../src/hooks/track/track.js';
import { untrack } from '../../../src/hooks/untrack/untrack.js';
import { git } from '../scan/__utils__.js';
import {
  mapOf,
  newWorkspace,
  seedStateFile,
  seedTrackingMap,
} from './__utils__.js';

const ENGINE = '.lagune/.tmp';
const LOCK = '.lagune/.tmp/lock';
const NOW = new Date('2026-07-06T00:00:00.000Z');
const LEAKED_SECRET = { name: 'Leaked secret', paths: ['src/config.ts'] };
const OPEN_REDIRECT = { name: 'Open redirect', paths: ['src/routes.ts'] };
const TRACK_LEAKED_SECRET = JSON.stringify({ entries: [LEAKED_SECRET] });
const MEMORY_FILES = [
  '.lagune/memory/detect.md',
  '.lagune/memory/plan.md',
  '.lagune/memory/harden.md',
];
const DETECT = [
  '# Project Detect Map',
  '',
  '## Findings',
  '',
  '### Leaked secret',
  '',
  '- **What it is:** A token sits in source.',
  '',
  '### Open redirect',
  '',
  '- **What it is:** A redirect follows any URL.',
  '',
].join('\n');
const itWithPermissionBits = platform === 'win32' ? it.skip : it;

const listing = async (workspace: string, folder: string): Promise<string[]> =>
  (await readdir(join(workspace, folder))).toSorted();

const gitStatus = (workspace: string): Promise<string> =>
  git(workspace, ['status', '--porcelain', '--untracked-files=all']);

const plantLock = async (
  workspace: string,
  holder: string,
  since: Date
): Promise<void> => {
  await mkdir(join(workspace, LOCK), { recursive: true });
  await writeFile(join(workspace, LOCK, 'holder'), holder);
  await utimes(join(workspace, LOCK), since, since);
};

await describe('a write that finds the state lock taken', async () => {
  await it('recovers the lock a crashed write left behind, along with all it held', async () => {
    const workspace = await newWorkspace();

    await plantLock(workspace, 'crashed writer', new Date(Date.now() - 60_000));
    await track(workspace, TRACK_LEAKED_SECRET);

    const [map, engine] = await Promise.all([
      loadTrackingMap(workspace),
      listing(workspace, ENGINE),
    ]);

    strict.deepStrictEqual(map, mapOf([LEAKED_SECRET]));
    strict.deepStrictEqual(engine, ['.gitignore']);
  });

  await it('gives up on a lock held past the wait, leaving the lock and writing nothing', async () => {
    const workspace = await newWorkspace();

    await plantLock(workspace, 'another writer', new Date());

    const outcome = await withStateLock(
      workspace,
      (state) => writeTrackingMap(state, mapOf([LEAKED_SECRET])),
      { staleMs: 60_000, waitMs: 200 }
    ).then(
      () => 'written',
      (error: Error) => error.message
    );
    const [holder, state] = await Promise.all([
      readFile(join(workspace, LOCK, 'holder'), 'utf8'),
      listing(workspace, '.lagune'),
    ]);

    strict(outcome.startsWith(`${LOCK} `), outcome);
    strict.strictEqual(holder, 'another writer');
    strict.deepStrictEqual(state, ['.tmp']);
  });
});

await describe('what a write leaves in .lagune/', async () => {
  await it('sweeps the break claim a crashed write left behind', async () => {
    const workspace = await newWorkspace();

    await mkdir(join(workspace, ENGINE, 'lock.break'), { recursive: true });
    await track(workspace, TRACK_LEAKED_SECRET);

    const engine = await listing(workspace, ENGINE);

    strict.deepStrictEqual(engine, ['.gitignore']);
  });

  await it('leaves only the state files and the engine folder once untrack rewrites the memory', async () => {
    const workspace = await newWorkspace();

    await seedTrackingMap(workspace, mapOf([LEAKED_SECRET, OPEN_REDIRECT]));
    await Promise.all(
      MEMORY_FILES.map((file) => seedStateFile(workspace, file, DETECT))
    );
    await untrack(
      workspace,
      JSON.stringify({ names: [LEAKED_SECRET.name] }),
      NOW
    );

    const [state, memory, engine] = await Promise.all([
      listing(workspace, '.lagune'),
      listing(workspace, '.lagune/memory'),
      listing(workspace, ENGINE),
    ]);

    strict.deepStrictEqual(state, ['.tmp', 'memory', 'tracking.json']);
    strict.deepStrictEqual(memory, [
      'detect.md',
      'harden.md',
      'history.md',
      'plan.md',
    ]);
    strict.deepStrictEqual(engine, ['.gitignore']);
  });

  await it('releases the lock when the write fails', async () => {
    const workspace = await newWorkspace();
    const outcome = await withStateLock(workspace, () =>
      Promise.reject(new Error('the write failed'))
    ).catch((error: Error) => error.message);
    const engine = await listing(workspace, ENGINE);

    strict.strictEqual(outcome, 'the write failed');
    strict.deepStrictEqual(engine, ['.gitignore']);
  });

  await it('shows Git none of its own files, while a write runs or after it ends', async () => {
    const workspace = await newWorkspace();

    await git(workspace, ['init', '--quiet']);

    const during = await withStateLock(workspace, async (state) => {
      await writeFile(join(state.scratch, 'tracking.json'), '{"entries":[]}');

      return gitStatus(workspace);
    });
    const after = await gitStatus(workspace);

    strict.strictEqual(during, '');
    strict.strictEqual(after, '');
  });
});

await describe('a state write stays on the project it serves', async () => {
  await it('refuses a state folder that links outside the project, writing nothing there', async () => {
    const [workspace, outside] = await Promise.all([
      newWorkspace(),
      newWorkspace(),
    ]);

    await symlink(outside, join(workspace, '.lagune'));

    const outcome = await track(workspace, TRACK_LEAKED_SECRET).then(
      () => 'tracked',
      () => 'refused'
    );
    const written = await readdir(outside);

    strict.strictEqual(outcome, 'refused');
    strict.deepStrictEqual(written, []);
  });

  await it('refuses an engine folder that is a link, never hiding what it points to from Git', async () => {
    const workspace = await newWorkspace();

    await mkdir(join(workspace, 'src'));
    await mkdir(join(workspace, '.lagune'));
    await symlink(join(workspace, 'src'), join(workspace, ENGINE));

    const outcome = await track(workspace, TRACK_LEAKED_SECRET).then(
      () => 'tracked',
      () => 'refused'
    );
    const [source, state] = await Promise.all([
      listing(workspace, 'src'),
      listing(workspace, '.lagune'),
    ]);

    strict.strictEqual(outcome, 'refused');
    strict.deepStrictEqual(source, []);
    strict.deepStrictEqual(state, ['.tmp']);
  });

  await itWithPermissionBits(
    'never widens the permissions of a state file it replaces',
    async () => {
      const workspace = await newWorkspace();
      const tracking = join(workspace, '.lagune/tracking.json');

      await seedTrackingMap(workspace, mapOf([]));
      await chmod(tracking, 0o600);
      await track(workspace, TRACK_LEAKED_SECRET);

      const { mode } = await stat(tracking);

      strict.strictEqual(mode & 0o777, 0o600);
    }
  );
});
