import { describe, it, strict } from 'poku';
import { removeLaguneBlock } from '../../../src/core/gitignore.js';
import { newWorkspace, readGitignore, writeGitignore } from './__utils__.js';

const BLOCK = [
  '# Lagune',
  '/.lagune/templates/',
  '/.lagune/hooks/',
  '/.lagune/proofs/',
  '/.lagune/specializations.md',
  '/.lagune/skills/*',
  '!/.lagune/skills/graphql.md',
  '/**/lagune.*',
  '/**/lagune/',
].join('\n');

const absent = (workspace: string): Promise<boolean> =>
  readGitignore(workspace).then(
    () => false,
    () => true
  );

await describe('removing the block the Lagune CLI wrote to .gitignore', async () => {
  await it('keeps every line of the project around it', async () => {
    const workspace = await newWorkspace();

    await writeGitignore(workspace, `node_modules\n\n${BLOCK}\n\n.env\n`);

    const outcome = await removeLaguneBlock(workspace);
    const contents = await readGitignore(workspace);

    strict.strictEqual(outcome, 'updated');
    strict.strictEqual(contents, 'node_modules\n\n.env\n');
  });

  await it('deletes a file that held only the block', async () => {
    const workspace = await newWorkspace();

    await writeGitignore(workspace, `${BLOCK}\n`);

    const outcome = await removeLaguneBlock(workspace);
    const gone = await absent(workspace);

    strict.strictEqual(outcome, 'removed');
    strict.strictEqual(gone, true);
  });

  await it('leaves a file without the block untouched', async () => {
    const workspace = await newWorkspace();

    await writeGitignore(workspace, 'node_modules\n/lagune-notes.md\n');

    const outcome = await removeLaguneBlock(workspace);
    const contents = await readGitignore(workspace);

    strict.strictEqual(outcome, 'unchanged');
    strict.strictEqual(contents, 'node_modules\n/lagune-notes.md\n');
  });

  await it('does nothing when there is no .gitignore', async () => {
    const workspace = await newWorkspace();

    strict.strictEqual(await removeLaguneBlock(workspace), 'unchanged');
  });
});
