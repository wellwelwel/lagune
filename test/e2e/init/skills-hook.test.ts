import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { execPath } from 'node:process';
import { describe, it, strict } from 'poku';
import { initInto, newWorkspace } from './__utils__.js';

const writeUserCatalog = (
  workspace: string,
  entries: { name: string; tags: string[] }[]
): Promise<void> =>
  writeFile(
    join(workspace, '.bluespec', 'skills.json'),
    `${JSON.stringify({ name: 'blue-spec', entries }, null, 2)}\n`,
    'utf8'
  );

const runSkills = (workspace: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const child = spawn(execPath, ['.bluespec/hooks/skills.mjs'], {
      cwd: workspace,
    });
    const chunks: string[] = [];

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => chunks.push(chunk));
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve(chunks.join('').trim());
        return;
      }

      reject(new Error(`skills hook exited with code ${code}`));
    });
  });

await describe('the scaffolded skills hook runs without install', async () => {
  await it('lists the available sub-skills', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });

    const output = await runSkills(workspace);

    strict(
      output.includes('regex'),
      'the listing should mention the regex sub-skill'
    );
  });

  await it('lists a user sub-skill from the catalog with its tags', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });
    await writeUserCatalog(workspace, [
      { name: 'graphql', tags: ['GraphQL', 'Apollo', 'gql'] },
    ]);

    const output = await runSkills(workspace);

    strict(
      output.includes('graphql: GraphQL, Apollo, gql'),
      'the listing should include the user sub-skill and its tags'
    );
    strict(
      output.includes('regex'),
      'the built-in sub-skills should still be listed'
    );
  });

  await it('lets a user sub-skill shadow a built-in of the same name', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });
    await writeUserCatalog(workspace, [{ name: 'regex', tags: ['custom'] }]);

    const output = await runSkills(workspace);
    const matches = output
      .split('\n')
      .filter((line) => line.startsWith('regex'));

    strict.strictEqual(matches.length, 1, 'regex should be listed once');
    strict.strictEqual(
      matches[0],
      'regex: custom',
      'the user entry should win'
    );
  });
});
