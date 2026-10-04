import { lstat, readFile, readlink, rm, writeFile } from 'node:fs/promises';
import { isAbsolute, join } from 'node:path';
import { describe, it, strict } from 'poku';
import {
  initInto,
  newWorkspace,
  pullInto,
  readManifest,
  updateInto,
} from './__utils__.js';

const claudeCharter = '.claude/skills/lagune.charter/SKILL.md';
const codexCharter = '.agents/skills/lagune.charter/SKILL.md';
const geminiCharter = '.gemini/commands/lagune.charter.toml';

const read = (workspace: string, relativePath: string): Promise<string> =>
  readFile(join(workspace, relativePath), 'utf8');

const isSymlink = async (
  workspace: string,
  relativePath: string
): Promise<boolean> =>
  (await lstat(join(workspace, relativePath))).isSymbolicLink();

await describe('a later install reuses the first through symlinks', async () => {
  await it('links the second same-format agent to the first install', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });
    await initInto(workspace, { init: true, agent: 'codex' });

    strict(
      !(await isSymlink(workspace, claudeCharter)),
      'the first install holds the real file'
    );
    strict(
      await isSymlink(workspace, codexCharter),
      'the second install is a symlink'
    );

    const target = await readlink(join(workspace, codexCharter));

    strict(!isAbsolute(target), 'the link is relative');
    strict.strictEqual(
      await read(workspace, codexCharter),
      await read(workspace, claudeCharter),
      'the link resolves to the source contents'
    );
  });

  await it('makes whichever agent came first the source', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'codex' });
    await initInto(workspace, { init: true, agent: 'claude' });

    strict(
      !(await isSymlink(workspace, codexCharter)),
      'codex holds the real file when it comes first'
    );
    strict(
      await isSymlink(workspace, claudeCharter),
      'claude links to codex when it comes second'
    );
  });

  await it('keeps a real file for an agent whose format renders differently', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });
    await initInto(workspace, { init: true, agent: 'gemini' });

    strict(
      !(await isSymlink(workspace, geminiCharter)),
      'a different rendering never links'
    );
  });

  await it('records the linked commands in the manifest files', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });
    await initInto(workspace, { init: true, agent: 'codex' });

    const manifest = await readManifest(workspace);

    strict(
      Array.isArray(manifest.files) && manifest.files.includes(codexCharter),
      'a linked command is recorded like any other file'
    );
  });

  await it('survives a re-init of the linked agent', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });
    await initInto(workspace, { init: true, agent: 'codex' });
    await initInto(workspace, { init: true, agent: 'codex' });

    strict(await isSymlink(workspace, codexCharter), 'the link is untouched');
  });

  await it('converts a duplicated copy into a link on update', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });
    await initInto(workspace, { init: true, agent: 'codex' });
    await rm(join(workspace, codexCharter));
    await writeFile(
      join(workspace, codexCharter),
      await read(workspace, claudeCharter),
      'utf8'
    );

    await updateInto(workspace);

    strict(
      await isSymlink(workspace, codexCharter),
      'update re-establishes the link'
    );
  });

  await it('restores the source on update when edited through a link', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });

    const shipped = await read(workspace, claudeCharter);

    await initInto(workspace, { init: true, agent: 'codex' });
    await writeFile(join(workspace, codexCharter), 'edited', 'utf8');
    await updateInto(workspace);

    strict.strictEqual(
      await read(workspace, claudeCharter),
      shipped,
      'the source is restored'
    );
    strict(await isSymlink(workspace, codexCharter), 'the link remains');
  });

  await it('pull restores a deleted source and the links keep resolving', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });
    const shipped = await read(workspace, claudeCharter);
    await initInto(workspace, { init: true, agent: 'codex' });

    await rm(join(workspace, '.claude'), { recursive: true, force: true });
    await pullInto(workspace);

    strict(
      !(await isSymlink(workspace, claudeCharter)),
      'the source is rebuilt as a real file'
    );
    strict.strictEqual(
      await read(workspace, codexCharter),
      shipped,
      'the link resolves again'
    );
  });

  await it('falls back to a real file when the source files are missing', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });
    const shipped = await read(workspace, claudeCharter);

    await rm(join(workspace, '.claude'), { recursive: true, force: true });
    await initInto(workspace, { init: true, agent: 'codex' });

    strict(
      !(await isSymlink(workspace, codexCharter)),
      'a missing source falls back to a copy'
    );
    strict.strictEqual(
      await read(workspace, codexCharter),
      shipped,
      'the copy carries the same contents'
    );
  });
});
