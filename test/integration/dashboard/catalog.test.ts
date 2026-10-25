import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, it, strict } from 'poku';
import { buildData } from '../../../src/dashboard/server/data/build/data.js';

const projects: string[] = [];

const dataOf = async (files: Record<string, string>) => {
  const project = await mkdtemp(join(tmpdir(), 'lagune-dashboard-'));

  projects.push(project);

  await Promise.all(
    Object.entries(files).map(async ([path, contents]) => {
      await mkdir(dirname(join(project, path)), { recursive: true });
      await writeFile(join(project, path), contents);
    })
  );

  return buildData(join(project, '.lagune'));
};

afterEach(async () => {
  await Promise.all(
    projects.map((project) => rm(project, { recursive: true, force: true }))
  );

  projects.length = 0;
});

await describe('the dashboard shows whatever .lagune/ holds', async () => {
  await it('starts empty, with the default categories, when there is no artifact', async () => {
    const data = await dataOf({});

    strict.strictEqual(data.artifacts, false);
    strict.deepStrictEqual(data.categories, {
      used: ['owasp'],
      recorded: false,
    });
  });

  await it('counts any memory artifact as content', async () => {
    const data = await dataOf({
      '.lagune/memory/charter.md': '# Demo Security Charter\n',
    });

    strict.strictEqual(data.artifacts, true);
  });

  await it('reads nothing an agent skill install writes', async () => {
    const [plain, installed] = await Promise.all([
      dataOf({}),
      dataOf({
        'skills-lock.json': '{"version":1,"skills":{}}',
        '.claude/skills/lagune.detect/SKILL.md':
          '---\nname: lagune.detect\n---\n',
      }),
    ]);

    strict.deepStrictEqual(installed, plain);
  });
});

await describe('the dashboard catalog follows the project catalog', async () => {
  await it('lists the applied specializations first, then the rest of the catalog', async () => {
    const data = await dataOf({
      '.lagune/categories.json': JSON.stringify({ categories: ['python'] }),
      '.lagune/catalog.json': JSON.stringify({
        entries: [{ name: 'graphql', tags: ['GraphQL'] }],
      }),
      '.lagune/catalog/graphql.md': '# GraphQL vulnerabilities\n',
      '.lagune/memory/detect.md': [
        '# Demo Detect Map',
        '',
        '## Applied specializations',
        '',
        '- regex: the validator under "Email validation"',
        '',
      ].join('\n'),
    });

    strict.deepStrictEqual(
      data.catalog.map((item) => [item.name, item.applied, item.inCatalog]),
      [
        ['regex', true, false],
        ['python', false, true],
        ['graphql', false, true],
      ]
    );
    strict.deepStrictEqual(data.categories, {
      used: ['python'],
      recorded: true,
    });
  });
});
