import type {
  OpenCodePlugin,
  ServerConfig,
  SetupContext,
  SkillInfo,
} from '../../../src/types/opencode.js';
import type { ReportedRun } from '../../../src/types/test.js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, it, strict } from 'poku';
import { parse } from 'yaml.min';
import { isRecord } from '../../../src/core/collections.js';
import { listFrontmatterSources } from '../skills/__utils__.js';
import { packageRoot, readManifest, repositoryRoot } from './__utils__.js';

const SKILLS = [
  'lagune',
  'lagune.charter',
  'lagune.detect',
  'lagune.harden',
  'lagune.plan',
  'lagune.prove',
  'lagune.repair',
  'lagune.specialize',
  'lagune.verify',
];
const USER_ONLY = ['lagune.prove', 'lagune.specialize'];
const REJECTED = 'lagune.detect';
const OTHER_FOLDER = '/elsewhere/skills';

const skillsFolder = join(repositoryRoot, 'skills');
const { contents = {} } = await readManifest('package.json');
const sources = await listFrontmatterSources(
  new URL('skills/', packageRoot),
  (path) => path.endsWith('/SKILL.md')
);
const frontmatters = new Map(
  sources.map(({ relativePath, frontmatter }) => [
    relativePath.split('/')[0],
    frontmatter,
  ])
);

const isPlugin = (value: unknown): value is OpenCodePlugin =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.server === 'function' &&
  typeof value.setup === 'function';

/** The plugin as OpenCode reaches it, through the entry package.json names */
const loadEntry = async (): Promise<OpenCodePlugin> => {
  const entry: unknown = await import(
    pathToFileURL(join(repositoryRoot, String(contents.main))).href
  );
  const plugin = isRecord(entry) ? entry.default : undefined;

  if (!isPlugin(plugin))
    throw new Error('package.json main default-exports no OpenCode plugin');

  return plugin;
};

const plugin = await loadEntry();

const captureReports = async <Result>(
  run: () => Promise<Result>
): Promise<ReportedRun<Result>> => {
  const original = console.error;
  const reports: unknown[][] = [];

  console.error = (...report: unknown[]) => {
    reports.push(report);
  };

  try {
    return { result: await run(), reports };
  } finally {
    console.error = original;
  }
};

/** Runs setup against a fake 2.x host whose editor calls `accept` before keeping each skill */
const register = async (
  accept: (skill: SkillInfo) => void
): Promise<SkillInfo[]> => {
  const registered: SkillInfo[] = [];

  await plugin.setup({
    skill: {
      transform: async (edit) =>
        edit({
          add: (skill) => {
            accept(skill);
            registered.push(skill);
          },
        }),
    },
  });

  return registered;
};

const idsOf = (skills: SkillInfo[]): string[] =>
  skills.map(({ id }) => id).toSorted();

await describe('the OpenCode 1.x plugin', async () => {
  const hooks = await plugin.server();

  await it('adds the published skills folder once, beside the folders already configured', async () => {
    const config: ServerConfig = { skills: { paths: [OTHER_FOLDER] } };

    await hooks.config(config);
    await hooks.config(config);

    strict.deepStrictEqual(config.skills?.paths, [OTHER_FOLDER, skillsFolder]);
  });

  await it('adds the published skills folder to a configuration that names none', async () => {
    const config: ServerConfig = {};

    await hooks.config(config);

    strict.deepStrictEqual(config, { skills: { paths: [skillsFolder] } });
  });
});

await describe('the OpenCode 2.x plugin', async () => {
  const registered = await register(() => {});
  const texts = await Promise.all(
    registered.map((skill) => readFile(skill.path, 'utf8'))
  );

  it('registers the nine skills under their folder names', () => {
    strict.deepStrictEqual(idsOf(registered), SKILLS);
    strict.deepStrictEqual(
      registered.filter(({ id, name }) => id !== name),
      []
    );
  });

  it('registers each skill with its own file, its description, and its body without the frontmatter', () => {
    registered.forEach((skill, index) => {
      const frontmatter = frontmatters.get(skill.id) ?? '';

      strict.strictEqual(skill.path, join(skillsFolder, skill.id, 'SKILL.md'));
      strict.strictEqual(
        skill.description,
        parse<{ description: string }>(frontmatter).description
      );
      strict.strictEqual(
        texts[index],
        `---\n${frontmatter}\n---\n${skill.content}`
      );
    });
  });

  it('keeps prove and specialize, and only them, out of the model reach', () => {
    const flagged = registered.filter((skill) => 'autoinvoke' in skill);

    strict.deepStrictEqual(idsOf(flagged), USER_ONLY);
    strict.deepStrictEqual(
      flagged.filter(({ autoinvoke }) => autoinvoke !== false),
      []
    );
  });

  await it('keeps registering the other skills when OpenCode rejects one, and names it', async () => {
    const { result, reports } = await captureReports(() =>
      register((skill) => {
        if (skill.id === REJECTED) throw new Error('rejected by the host');
      })
    );

    strict.deepStrictEqual(
      idsOf(result),
      SKILLS.filter((name) => name !== REJECTED)
    );
    strict.strictEqual(reports.length, 1);
    strict(String(reports[0]?.[0]).includes(REJECTED), 'it names the skill');
  });
});

await describe('a host without the 2.x skill editor', async () => {
  const hosts: { label: string; context: SetupContext }[] = [
    { label: 'a setup context without the skill domain', context: {} },
    {
      label: 'the editor without add that OpenCode 1.x hands setup',
      context: { skill: { transform: async (edit) => edit({}) } },
    },
  ];

  for (const { label, context } of hosts)
    await it(`leaves the skills to the config hook, quietly, on ${label}`, async () => {
      const { reports } = await captureReports(() => plugin.setup(context));

      strict.deepStrictEqual(reports, []);
    });
});
