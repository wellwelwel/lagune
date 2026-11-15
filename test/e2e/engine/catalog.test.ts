import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { newWorkspace, runEngine } from './__utils__.js';

const packageRoot = new URL('../../../', import.meta.url);
const OPENING = `# GraphQL vulnerabilities

> - This knowledge extends your judgment.
`;
const SOURCE = '> - Source: the GraphQL specification.\n';
const GUIDANCE = '\n## How to act on the result\n\n';
const DETECT =
  '- **In detect (detection):** each unbounded query is a finding.\n';
const VERIFY =
  '- **In verify (proof):** the control holds once the depth is capped.\n';
const OWN_SPECIALIZATION = {
  '.lagune/catalog/graphql.md': `${OPENING}${SOURCE}${GUIDANCE}${DETECT}${VERIFY}`,
};
const READINGS: [string, string[], string][] = [
  [
    'leaves out the source credit and the guidance of every phase when no phase reads it',
    [],
    OPENING,
  ],
  [
    'keeps only the detect guidance for detect',
    ['--phase', 'detect'],
    `${OPENING}${GUIDANCE}${DETECT}`,
  ],
  [
    'keeps only the verify guidance for verify',
    ['--phase', 'verify'],
    `${OPENING}${GUIDANCE}${VERIFY}`,
  ],
  [
    'prints the file as written when asked for it raw',
    ['--raw'],
    `${OPENING}${SOURCE}${GUIDANCE}${DETECT}${VERIFY}`,
  ],
];
const REFUSED_READINGS: [string, string[], string][] = [
  [
    'a phase no specialization addresses',
    ['graphql', '--phase', 'harden'],
    'detect or verify',
  ],
  [
    'a phase in another case',
    ['graphql', '--phase', 'Detect'],
    'detect or verify',
  ],
  ['an empty phase', ['graphql', '--phase', ''], 'detect or verify'],
  [
    'a phase flag with no name',
    ['graphql', '--phase'],
    '--phase needs the name of a phase',
  ],
  ['a phase with no specialization to read', ['--phase', 'detect'], 'usage: '],
  ['a raw read with no specialization to read', ['--raw'], 'usage: '],
  [
    'a raw read narrowed to a phase',
    ['graphql', '--raw', '--phase', 'detect'],
    'usage: ',
  ],
];
const NOTHING_TO_READ: [string, string, string[], string][] = [
  ['an empty specialization', '', [], 'is empty'],
  ['an empty specialization asked for as written', '', ['--raw'], 'is empty'],
  [
    'a specialization of blank lines',
    '\n \n',
    ['--phase', 'detect'],
    'is empty',
  ],
  [
    'a specialization holding only the guidance of a phase, read outside one',
    `${GUIDANCE}${DETECT}${VERIFY}`,
    [],
    'holds nothing for this read',
  ],
  [
    'a specialization holding only the guidance of another phase',
    `${GUIDANCE}${VERIFY}`,
    ['--phase', 'detect'],
    'holds nothing for this read',
  ],
];

const seed = async (
  workspace: string,
  files: Record<string, string>
): Promise<void> => {
  await Promise.all(
    Object.entries(files).map(async ([path, contents]) => {
      await mkdir(join(workspace, path, '..'), { recursive: true });
      await writeFile(join(workspace, path), contents);
    })
  );
};

const builtin = (name: string): Promise<string> =>
  readFile(new URL(`catalog/${name}.md`, packageRoot), 'utf8');

await describe('catalog lists the specializations a project uses', async () => {
  await it('lists only the built-ins of the recorded categories', async () => {
    const workspace = await newWorkspace();

    await seed(workspace, {
      '.lagune/configs.json': '{"categories":["python","ai"]}',
    });

    const run = await runEngine(workspace, ['read', 'catalog']);

    strict.deepStrictEqual(run, {
      stdout: 'llm: AI API, RAG, MCP, Agent\npython: CPython, pickle, Django\n',
      stderr: '',
      code: 0,
    });
  });

  await it('flags the required built-in and lists the own index after it', async () => {
    const workspace = await newWorkspace();

    await seed(workspace, {
      '.lagune/configs.json': JSON.stringify({
        catalog: [{ name: 'graphql', tags: ['GraphQL', 'API'] }],
      }),
      '.lagune/catalog/graphql.md': '# GraphQL vulnerabilities\n',
    });

    const run = await runEngine(workspace, ['read', 'catalog']);
    const lines = run.stdout.trimEnd().split('\n');

    strict.strictEqual(run.code, 0);
    strict.strictEqual(lines[0], 'regex: Regular Expression [required]');
    strict.strictEqual(lines[lines.length - 1], 'graphql: GraphQL, API');
  });

  await it('says so when the project uses no category and has none of its own', async () => {
    const workspace = await newWorkspace();

    await seed(workspace, { '.lagune/configs.json': '{"categories":[]}' });

    const run = await runEngine(workspace, ['read', 'catalog']);

    strict.deepStrictEqual(run, {
      stdout: "No specialization is in this project's catalog.\n",
      stderr: '',
      code: 0,
    });
  });

  await it('fails on a configs file it cannot read instead of listing a default', async () => {
    const workspace = await newWorkspace();

    await seed(workspace, { '.lagune/configs.json': '{"categories": ' });

    const run = await runEngine(workspace, ['read', 'catalog']);

    strict.strictEqual(run.code, 1);
    strict.strictEqual(run.stdout, '');
    strict(run.stderr.includes('.lagune/configs.json'));
  });
});

await describe('catalog <name> prints the specialization the project resolves', async () => {
  await it('prints a built-in whatever the categories', async () => {
    const workspace = await newWorkspace();

    await seed(workspace, { '.lagune/configs.json': '{"categories":[]}' });

    const [run, expected] = await Promise.all([
      runEngine(workspace, ['read', 'catalog', 'regex', '--raw']),
      builtin('regex'),
    ]);

    strict.deepStrictEqual(run, { stdout: expected, stderr: '', code: 0 });
  });

  await it('prints the project own version before the built-in', async () => {
    const workspace = await newWorkspace();

    await seed(workspace, {
      '.lagune/catalog/regex.md': '# Regex, refined for this project\n',
    });

    const run = await runEngine(workspace, ['read', 'catalog', 'regex']);

    strict.deepStrictEqual(run, {
      stdout: '# Regex, refined for this project\n',
      stderr: '',
      code: 0,
    });
  });

  await it('fails on a name no specialization carries', async () => {
    const workspace = await newWorkspace();
    const run = await runEngine(workspace, ['read', 'catalog', 'nope']);

    strict.strictEqual(run.code, 1);
    strict.strictEqual(run.stdout, '');
    strict(run.stderr.includes('catalog'));
  });

  for (const name of [
    '../configs.json',
    '../../package',
    'Regex',
    'regex.md',
    '',
  ])
    await it(`refuses the name ${JSON.stringify(name)} before reading anything`, async () => {
      const workspace = await newWorkspace();

      await seed(workspace, { '.lagune/configs.json': '{"secret":true}' });

      const run = await runEngine(workspace, ['read', 'catalog', name]);

      strict.strictEqual(run.code, 1);
      strict.strictEqual(run.stdout, '');
      strict(run.stderr.includes('is not a specialization name'));
    });

  await it('takes a single name', async () => {
    const workspace = await newWorkspace();
    const run = await runEngine(workspace, ['read', 'catalog', 'regex', 'sql']);

    strict.strictEqual(run.code, 1);
    strict.strictEqual(run.stdout, '');
  });
});

await describe('catalog <name> prints the specialization as its reader needs it', async () => {
  for (const [promise, flags, expected] of READINGS)
    await it(promise, async () => {
      const workspace = await newWorkspace();

      await seed(workspace, OWN_SPECIALIZATION);

      const run = await runEngine(workspace, [
        'read',
        'catalog',
        'graphql',
        ...flags,
      ]);

      strict.deepStrictEqual(run, { stdout: expected, stderr: '', code: 0 });
    });

  for (const [label, contents, flags, reason] of NOTHING_TO_READ)
    await it(`fails on ${label} instead of printing nothing`, async () => {
      const workspace = await newWorkspace();

      await seed(workspace, { '.lagune/catalog/graphql.md': contents });

      const run = await runEngine(workspace, [
        'read',
        'catalog',
        'graphql',
        ...flags,
      ]);

      strict.strictEqual(run.code, 1);
      strict.strictEqual(run.stdout, '');
      strict(run.stderr.includes(reason));
    });

  for (const [label, args, reason] of REFUSED_READINGS)
    await it(`refuses ${label} instead of printing anything`, async () => {
      const workspace = await newWorkspace();

      await seed(workspace, OWN_SPECIALIZATION);

      const run = await runEngine(workspace, ['read', 'catalog', ...args]);

      strict.strictEqual(run.code, 1);
      strict.strictEqual(run.stdout, '');
      strict(run.stderr.includes(reason));
    });
});
