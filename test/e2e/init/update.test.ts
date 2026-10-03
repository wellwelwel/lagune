import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { loadVersion } from '../../../src/core/assets.js';
import {
  initInto,
  newWorkspace,
  packageRoot,
  updateInto,
} from './__utils__.js';

const read = (workspace: string, relativePath: string): Promise<string> =>
  readFile(join(workspace, relativePath), 'utf8');

const charterCommand = '.claude/skills/lagune.charter/SKILL.md';
const charterMemory = '.lagune/memory/charter.md';
const tracking = '.lagune/tracking.json';

await describe('update refreshes managed files to the installed version', async () => {
  await it('overwrites a hand-edited managed command file', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });
    const shipped = await read(workspace, charterCommand);
    await writeFile(
      join(workspace, charterCommand),
      'user edited this',
      'utf8'
    );

    await updateInto(workspace);

    strict.strictEqual(
      await read(workspace, charterCommand),
      shipped,
      'the managed command should be restored to the shipped content'
    );
  });

  await it('refreshes a built-in sub-skill for an installed category', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, {
      init: true,
      agent: 'claude',
      skills: ['owasp'],
    });
    const shipped = await read(workspace, '.lagune/skills/regex.md');
    await writeFile(
      join(workspace, '.lagune/skills/regex.md'),
      'edited',
      'utf8'
    );

    await updateInto(workspace);

    strict.strictEqual(
      await read(workspace, '.lagune/skills/regex.md'),
      shipped,
      'an installed built-in sub-skill should be refreshed'
    );
  });

  await it('leaves the memory artifacts and the tracking map untouched', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });
    await writeFile(join(workspace, charterMemory), '# my charter', 'utf8');
    await writeFile(join(workspace, tracking), '{ "mine": true }', 'utf8');

    await updateInto(workspace);

    strict.strictEqual(
      await read(workspace, charterMemory),
      '# my charter',
      'the user charter artifact should survive'
    );
    strict.strictEqual(
      await read(workspace, tracking),
      '{ "mine": true }',
      'the tracking map should survive'
    );
  });

  await it('keeps a user-authored sub-skill while refreshing built-ins', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, {
      init: true,
      agent: 'claude',
      skills: ['owasp'],
    });
    await writeFile(
      join(workspace, '.lagune/skills/graphql.md'),
      'my own sub-skill',
      'utf8'
    );

    await updateInto(workspace);

    strict.strictEqual(
      await read(workspace, '.lagune/skills/graphql.md'),
      'my own sub-skill',
      'a self-authored sub-skill should never be touched'
    );
  });

  await it('restamps the version and preserves createdAt', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, {
      init: true,
      agent: 'claude',
      skills: ['owasp'],
    });

    const before: { createdAt: string } = JSON.parse(
      await read(workspace, '.lagune/manifest.json')
    );
    await writeFile(
      join(workspace, '.lagune/manifest.json'),
      JSON.stringify({ ...before, version: '0.0.0-old' }, null, 2),
      'utf8'
    );

    await updateInto(workspace);

    const after: { version: string; createdAt: string; agent: string } =
      JSON.parse(await read(workspace, '.lagune/manifest.json'));
    const version = await loadVersion(packageRoot);

    strict.strictEqual(after.version, version, 'version is restamped');
    strict.strictEqual(
      after.createdAt,
      before.createdAt,
      'the original createdAt is preserved'
    );
    strict.strictEqual(after.agent, 'claude', 'the agent is preserved');
  });

  await it('removes a recorded agent command the installed version no longer produces', async () => {
    const workspace = await newWorkspace();
    const stale = '.github/prompts/lagune.charter.prompt.md';

    await initInto(workspace, { init: true, agent: 'claude' });
    await mkdir(join(workspace, '.github/prompts'), { recursive: true });
    await writeFile(join(workspace, stale), 'legacy prompt file', 'utf8');

    const before: { files: string[] } = JSON.parse(
      await read(workspace, '.lagune/manifest.json')
    );
    await writeFile(
      join(workspace, '.lagune/manifest.json'),
      JSON.stringify({ ...before, files: [...before.files, stale] }, null, 2),
      'utf8'
    );

    await updateInto(workspace);

    await strict.rejects(
      stat(join(workspace, stale)),
      'the stale command should be removed'
    );

    const after: { files: string[] } = JSON.parse(
      await read(workspace, '.lagune/manifest.json')
    );

    strict(!after.files.includes(stale), 'the manifest no longer lists it');
  });

  await it('keeps a user file the manifest happens to record', async () => {
    const workspace = await newWorkspace();
    const recorded = 'docs/security.md';

    await initInto(workspace, { init: true, agent: 'claude' });
    await mkdir(join(workspace, 'docs'), { recursive: true });
    await writeFile(join(workspace, recorded), 'my notes', 'utf8');

    const before: { files: string[] } = JSON.parse(
      await read(workspace, '.lagune/manifest.json')
    );
    await writeFile(
      join(workspace, '.lagune/manifest.json'),
      JSON.stringify(
        { ...before, files: [...before.files, recorded] },
        null,
        2
      ),
      'utf8'
    );

    await updateInto(workspace);

    strict.strictEqual(
      await read(workspace, recorded),
      'my notes',
      'only Lagune-named commands are ever removed'
    );
  });

  await it('leaves a file it never recorded alone', async () => {
    const workspace = await newWorkspace();
    const own = '.github/prompts/mine.prompt.md';

    await initInto(workspace, { init: true, agent: 'claude' });
    await mkdir(join(workspace, '.github/prompts'), { recursive: true });
    await writeFile(join(workspace, own), 'my own prompt', 'utf8');

    await updateInto(workspace);

    strict.strictEqual(
      await read(workspace, own),
      'my own prompt',
      'an unrecorded file is untouched'
    );
  });

  await it('does nothing in a project that was never initialized', async () => {
    const workspace = await newWorkspace();

    await updateInto(workspace);

    await strict.rejects(
      stat(join(workspace, '.lagune/manifest.json')),
      'no manifest should be written without a prior init'
    );
  });
});
