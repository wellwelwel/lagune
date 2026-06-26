import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
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

const writeUserSkillFile = async (
  workspace: string,
  name: string
): Promise<void> => {
  const dir = join(workspace, '.bluespec', 'skills');

  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, `${name}.md`), `# ${name}\n`, 'utf8');
};

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

await describe('the scaffolded skills hook lists what is installed', async () => {
  await it('lists an installed built-in sub-skill', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, {
      init: true,
      agent: 'claude',
      skills: ['owasp'],
    });

    const output = await runSkills(workspace);

    strict(
      output.includes('regex'),
      'the listing should mention the installed regex sub-skill'
    );
  });

  await it('omits a built-in whose category was not installed', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, {
      init: true,
      agent: 'claude',
      skills: ['owasp'],
    });

    const output = await runSkills(workspace);

    strict(
      !output.includes('javascript'),
      'an uninstalled category is not listed'
    );
  });

  await it('lists a user sub-skill present on disk with its tags', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, {
      init: true,
      agent: 'claude',
      skills: ['owasp'],
    });
    await writeUserCatalog(workspace, [
      { name: 'graphql', tags: ['GraphQL', 'Apollo', 'gql'] },
    ]);
    await writeUserSkillFile(workspace, 'graphql');

    const output = await runSkills(workspace);

    strict(
      output.includes('graphql: GraphQL, Apollo, gql'),
      'the listing should include the user sub-skill and its tags'
    );
    strict(
      output.includes('regex'),
      'the installed built-in sub-skills should still be listed'
    );
  });

  await it('omits a user catalog entry with no file on disk', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, {
      init: true,
      agent: 'claude',
      skills: ['owasp'],
    });
    await writeUserCatalog(workspace, [{ name: 'ghost', tags: ['nofile'] }]);

    const output = await runSkills(workspace);

    strict(
      !output.includes('ghost'),
      'a catalog entry without its .md file is not listed'
    );
  });

  await it('lets a user sub-skill shadow a built-in of the same name', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, {
      init: true,
      agent: 'claude',
      skills: ['owasp'],
    });
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
