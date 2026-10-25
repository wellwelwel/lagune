import {
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, it, strict } from 'poku';
import { performMigrate } from '../../../src/core/migrate.js';

const projects: string[] = [];

const GITIGNORE = [
  'node_modules',
  '',
  '# Lagune',
  '/.lagune/templates/',
  '/.lagune/hooks/',
  '/.lagune/proofs/',
  '/.lagune/specializations.md',
  '/.lagune/skills/*',
  '!/.lagune/skills/graphql.md',
  '/**/lagune.*',
  '/**/lagune/',
  '',
].join('\n');

const INSTALL: Record<string, string> = {
  '.lagune/manifest.json': JSON.stringify({
    name: 'lagune',
    version: '0.15.0',
    agent: ['claude', 'opencode'],
    categories: ['owasp', 'javascript'],
    files: [
      '.lagune/templates/charter-template.md',
      '.lagune/hooks/regex.mjs',
      '.claude/skills/lagune.detect/SKILL.md',
      '.opencode/commands/lagune.detect.md',
      'src/lagune.ts',
      'src/index.ts',
      '../outside/lagune.md',
    ],
  }),
  '.lagune/templates/charter-template.md': '# template\n',
  '.lagune/hooks/regex.mjs': 'export {};\n',
  '.lagune/specializations.md': 'regex: Regular Expression [required]\n',
  '.lagune/skills/regex.md': '# copy of the built-in\n',
  '.lagune/skills/network.md': '# copy of the built-in\n',
  '.lagune/skills/crypto.md': '# Crypto, refined for this project\n',
  '.lagune/skills/graphql.md': '# GraphQL vulnerabilities\n',
  '.lagune/skills.json': JSON.stringify({
    name: 'lagune',
    entries: [
      { name: 'graphql', tags: ['GraphQL'], groups: [] },
      { name: 'crypto', tags: ['Own crypto'] },
    ],
  }),
  '.lagune/memory/charter.md': '# Demo Security Charter\n',
  '.lagune/tracking.json':
    '{"name":"lagune","entries":[{"name":"Leak","paths":["src/a.ts"]}]}\n',
  '.lagune/proofs/leak/report.md': '# Leak\n',
  '.claude/skills/lagune.detect/SKILL.md': '---\nname: lagune.detect\n---\n',
  '.opencode/commands/lagune.detect.md': '---\ndescription: detect\n---\n',
  'src/lagune.ts': 'export const config = {};\n',
  'src/index.ts': 'export {};\n',
  '.gitignore': GITIGNORE,
};

const newProject = async (files: Record<string, string>): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'lagune-migrate-'));
  const project = join(root, 'project');

  projects.push(root);

  await Promise.all(
    Object.entries(files).map(async ([path, contents]) => {
      await mkdir(dirname(join(project, path)), { recursive: true });
      await writeFile(join(project, path), contents);
    })
  );
  await mkdir(join(root, 'outside'), { recursive: true });
  await writeFile(join(root, 'outside/lagune.md'), 'outside\n');

  return project;
};

const without = (
  files: Record<string, string>,
  path: string
): Record<string, string> =>
  Object.fromEntries(Object.entries(files).filter(([file]) => file !== path));

const linkAt = async (
  project: string,
  path: string,
  target: string
): Promise<void> => {
  await mkdir(dirname(join(project, path)), { recursive: true });
  await symlink(target, join(project, path));
};

const read = (project: string, path: string): Promise<string | null> =>
  readFile(join(project, path), 'utf8').catch(() => null);

const listing = (project: string, dir: string): Promise<string[]> =>
  readdir(join(project, dir)).then(
    (entries) => entries.toSorted(),
    () => []
  );

afterEach(async () => {
  await Promise.all(
    projects.map((root) => rm(root, { recursive: true, force: true }))
  );

  projects.length = 0;
});

await describe('migrate moves a Lagune CLI install to the skills-based layout', async () => {
  await it('keeps only the project state under .lagune/', async () => {
    const project = await newProject(INSTALL);

    await performMigrate(project);

    const [lagune, catalog] = await Promise.all([
      listing(project, '.lagune'),
      listing(project, '.lagune/catalog'),
    ]);

    strict.deepStrictEqual(lagune, [
      'catalog',
      'catalog.json',
      'categories.json',
      'memory',
      'proofs',
      'tracking.json',
    ]);
    strict.deepStrictEqual(catalog, ['crypto.md', 'graphql.md']);
  });

  await it('moves its own specializations intact, indexes them, and records the manifest categories', async () => {
    const project = await newProject(INSTALL);

    await performMigrate(project);

    const [crypto, graphql, catalog, categories] = await Promise.all([
      read(project, '.lagune/catalog/crypto.md'),
      read(project, '.lagune/catalog/graphql.md'),
      read(project, '.lagune/catalog.json'),
      read(project, '.lagune/categories.json'),
    ]);

    strict.strictEqual(crypto, '# Crypto, refined for this project\n');
    strict.strictEqual(graphql, '# GraphQL vulnerabilities\n');
    strict.deepStrictEqual(JSON.parse(catalog ?? '{}'), {
      name: 'lagune',
      entries: [
        { name: 'graphql', tags: ['GraphQL'] },
        { name: 'crypto', tags: ['Own crypto'] },
      ],
    });
    strict.deepStrictEqual(JSON.parse(categories ?? '{}'), {
      name: 'lagune',
      categories: ['owasp', 'javascript'],
    });
  });

  await it('leaves the memory and the tracking map untouched', async () => {
    const project = await newProject(INSTALL);

    await performMigrate(project);

    const [charter, tracking] = await Promise.all([
      read(project, '.lagune/memory/charter.md'),
      read(project, '.lagune/tracking.json'),
    ]);

    strict.strictEqual(charter, INSTALL['.lagune/memory/charter.md']);
    strict.strictEqual(tracking, INSTALL['.lagune/tracking.json']);
  });

  await it('removes the agent commands the manifest lists, and nothing else it lists', async () => {
    const project = await newProject(INSTALL);

    await performMigrate(project);

    const [claude, opencode, config, index, outside] = await Promise.all([
      listing(project, '.claude/skills'),
      listing(project, '.opencode/commands'),
      read(project, 'src/lagune.ts'),
      read(project, 'src/index.ts'),
      read(project, '../outside/lagune.md'),
    ]);

    strict.deepStrictEqual(claude, []);
    strict.deepStrictEqual(opencode, []);
    strict.strictEqual(config, INSTALL['src/lagune.ts']);
    strict.strictEqual(index, INSTALL['src/index.ts']);
    strict.strictEqual(outside, 'outside\n');
  });

  await it('removes the Lagune block from .gitignore and keeps the proofs ignored', async () => {
    const project = await newProject(INSTALL);

    await performMigrate(project);

    const [gitignore, proofs] = await Promise.all([
      read(project, '.gitignore'),
      read(project, '.lagune/proofs/.gitignore'),
    ]);

    strict.strictEqual(gitignore, 'node_modules\n');
    strict.strictEqual(proofs, '*\n');
  });

  await it('deletes a .gitignore that held only the Lagune block', async () => {
    const project = await newProject({
      ...INSTALL,
      '.gitignore': GITIGNORE.replace('node_modules\n', ''),
    });

    await performMigrate(project);

    strict.strictEqual(await read(project, '.gitignore'), null);
  });

  await it('keeps an own specialization in place when its destination already exists', async () => {
    const project = await newProject({
      ...INSTALL,
      '.lagune/catalog/graphql.md': '# Already moved\n',
    });

    const result = await performMigrate(project);
    const [moved, kept] = await Promise.all([
      read(project, '.lagune/catalog/graphql.md'),
      read(project, '.lagune/skills/graphql.md'),
    ]);

    strict.strictEqual(moved, '# Already moved\n');
    strict.strictEqual(kept, '# GraphQL vulnerabilities\n');
    strict.deepStrictEqual(result.migrated && result.kept, [
      '.lagune/skills/graphql.md',
    ]);
  });
});

await describe('migrate changes nothing it cannot account for', async () => {
  await it('reports nothing to migrate without a manifest', async () => {
    const project = await newProject({ '.lagune/memory/charter.md': '# C\n' });

    const result = await performMigrate(project);
    const lagune = await listing(project, '.lagune');

    strict.deepStrictEqual(result, { migrated: false });
    strict.deepStrictEqual(lagune, ['memory']);
  });

  for (const file of ['.lagune/manifest.json', '.lagune/skills.json'])
    await it(`refuses an unreadable ${file} before touching anything`, async () => {
      const project = await newProject({ ...INSTALL, [file]: '{"entries": [' });

      const outcome = await performMigrate(project).then(
        () => 'migrated',
        () => 'refused'
      );
      const [manifest, copy] = await Promise.all([
        read(project, '.lagune/manifest.json'),
        read(project, '.lagune/skills/regex.md'),
      ]);

      strict.strictEqual(outcome, 'refused');
      strict.notStrictEqual(manifest, null);
      strict.strictEqual(copy, '# copy of the built-in\n');
    });
});

await describe('migrate never reaches outside the project', async () => {
  await it('removes a generated folder that is a link, never what it points to', async () => {
    const project = await newProject(
      without(INSTALL, '.lagune/hooks/regex.mjs')
    );

    await linkAt(project, '.lagune/hooks', '../../outside');
    await performMigrate(project);

    const [outside, lagune] = await Promise.all([
      read(project, '../outside/lagune.md'),
      listing(project, '.lagune'),
    ]);

    strict.strictEqual(outside, 'outside\n');
    strict.strictEqual(lagune.includes('hooks'), false);
  });

  await it('leaves alone an agent command whose folder resolves outside the project', async () => {
    const project = await newProject(
      without(INSTALL, '.claude/skills/lagune.detect/SKILL.md')
    );

    await mkdir(join(project, '../outside/agent/skills/lagune.detect'), {
      recursive: true,
    });
    await writeFile(
      join(project, '../outside/agent/skills/lagune.detect/SKILL.md'),
      'shared\n'
    );
    await linkAt(project, '.claude', '../outside/agent');
    await performMigrate(project);

    const shared = await read(
      project,
      '../outside/agent/skills/lagune.detect/SKILL.md'
    );

    strict.strictEqual(shared, 'shared\n');
  });

  for (const file of ['catalog.json', 'categories.json'])
    await it(`refuses a ${file} that is a link before touching anything`, async () => {
      const project = await newProject(INSTALL);
      const shared = '{"name":"lagune"}\n';

      await writeFile(join(project, `../outside/${file}`), shared);
      await linkAt(project, `.lagune/${file}`, `../../outside/${file}`);

      const outcome = await performMigrate(project).then(
        () => 'migrated',
        () => 'refused'
      );
      const [outside, hook] = await Promise.all([
        read(project, `../outside/${file}`),
        read(project, '.lagune/hooks/regex.mjs'),
      ]);

      strict.strictEqual(outcome, 'refused');
      strict.strictEqual(outside, shared);
      strict.strictEqual(hook, INSTALL['.lagune/hooks/regex.mjs']);
    });
});
