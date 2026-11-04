import { symlink } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { resolveTargets } from '../../../src/core/scan/targets.js';
import { newWorkspace } from './__utils__.js';

await describe('a scan target is judged by where it really sits', async () => {
  await it('keeps a target that does not exist inside a project reached through a link', async () => {
    const [workspace, links] = await Promise.all([
      newWorkspace(),
      newWorkspace(),
    ]);
    const project = join(links, 'project');

    await symlink(workspace, project);

    const targets = await resolveTargets(project, [
      'missing',
      'src/missing.ts',
    ]);

    strict.deepStrictEqual(targets, [
      join(project, 'missing'),
      join(project, 'src', 'missing.ts'),
    ]);
  });

  await it('refuses a target that does not exist below a link that leaves the project', async () => {
    const [workspace, outside] = await Promise.all([
      newWorkspace(),
      newWorkspace(),
    ]);

    await symlink(outside, join(workspace, 'elsewhere'));

    await strict.rejects(
      resolveTargets(workspace, ['elsewhere/missing.ts']),
      (error: Error) =>
        error.message.endsWith('"elsewhere/missing.ts" is outside it')
    );
  });
});
