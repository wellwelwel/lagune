import type { PublishedText } from '../../../src/types/test.js';
import { readdir, readFile } from 'node:fs/promises';
import { describe, it, strict } from 'poku';
import { loadVersion } from '../../../src/core/version.js';
import { ENGINE_TOOLS } from '../../../src/mcp/tools.js';
import { listFolderFiles } from '../plugins/__utils__.js';
import { packageRoot } from './__utils__.js';

const COMMANDS = [
  'lagune',
  'lagune-charter',
  'lagune-detect',
  'lagune-harden',
  'lagune-plan',
  'lagune-prove',
  'lagune-repair',
  'lagune-specialize',
  'lagune-verify',
];

const FILLS_A_TEMPLATE = [
  'lagune-charter',
  'lagune-detect',
  'lagune-harden',
  'lagune-plan',
  'lagune-prove',
  'lagune-specialize',
];

const KEPT_FROM_THE_MODEL = ['lagune-prove', 'lagune-specialize'];

const PUBLISHED_FOLDERS = ['skills', 'catalog'];

const ENGINE_COMMAND = `npx --yes lagune@${await loadVersion(packageRoot)} `;
const ENGINE_CALL = /npx (?:-\S+ )*lagune(?:@\S*)? [^\n`]*/g;
const TOOL_CALL = /(?<![\w@./-])lagune ([a-z][\w-]*)[^\n`]*/g;
const SHORT_FLAG = /(?:^|\s)-[a-zA-Z](?=\s|$)/;
const TOOL_COMMANDS = new Set<string>(
  ENGINE_TOOLS.flatMap((tool) => tool.commands)
);

const folders = (await readdir(new URL('skills/', packageRoot))).toSorted();

const readPublished = async (): Promise<PublishedText[]> => {
  const files = await Promise.all(PUBLISHED_FOLDERS.map(listFolderFiles));

  return Promise.all(
    files.flat().map(async (file) => ({
      file,
      text: await readFile(new URL(file, packageRoot), 'utf8'),
    }))
  );
};

const callsMatching = (
  published: PublishedText[],
  pattern: RegExp
): { file: string; call: string; command: string }[] =>
  published.flatMap(({ file, text }) =>
    [...text.matchAll(pattern)].map(([call, command = '']) => ({
      file,
      call,
      command,
    }))
  );

await describe('the published skills', async () => {
  it('are the nine commands', () => {
    strict.deepStrictEqual(folders, COMMANDS);
  });

  for (const folder of COMMANDS)
    await it(`ship ${folder} with only its own files`, async () => {
      const files = (
        await readdir(new URL(`skills/${folder}/`, packageRoot), {
          recursive: true,
        })
      ).toSorted();
      const expected = [
        'SKILL.md',
        ...(KEPT_FROM_THE_MODEL.includes(folder)
          ? ['agents', 'agents/openai.yaml']
          : []),
        ...(FILLS_A_TEMPLATE.includes(folder) ? ['template.md'] : []),
      ].toSorted();

      strict.deepStrictEqual(files, expected);
    });
});

await describe('every engine call the skills and specializations write', async () => {
  const published = await readPublished();
  const npxCalls = callsMatching(published, ENGINE_CALL);
  const toolCalls = callsMatching(published, TOOL_CALL);
  const callingSkills = published.filter(
    ({ file, text }) =>
      file.endsWith('/SKILL.md') && text.search(TOOL_CALL) !== -1
  );

  it('finds engine calls to check', () => {
    strict(npxCalls.length > 0);
    strict(toolCalls.length > 0);
  });

  it('runs the engine unattended, at the package version, when it falls back to npx', () => {
    strict.deepStrictEqual(
      npxCalls
        .filter(({ call }) => !call.startsWith(ENGINE_COMMAND))
        .map(({ file, call }) => `${file}: ${call}`),
      []
    );
  });

  it('names only commands the Lagune tools run', () => {
    strict.deepStrictEqual(
      toolCalls
        .filter(({ command }) => !TOOL_COMMANDS.has(command))
        .map(({ file, call }) => `${file}: ${call}`),
      []
    );
  });

  it('tells every skill that calls the engine to reach it through the Lagune tools or npx', () => {
    strict(callingSkills.length > 0);
    strict.deepStrictEqual(
      callingSkills
        .filter(
          ({ text }) =>
            !text.includes(`${ENGINE_COMMAND}<subcommand>`) ||
            !ENGINE_TOOLS.every((tool) => text.includes(`\`${tool.name}\``))
        )
        .map(({ file }) => file),
      []
    );
  });

  it('spells out every flag in full', () => {
    strict.deepStrictEqual(
      [...npxCalls, ...toolCalls]
        .filter(({ call }) => SHORT_FLAG.test(call))
        .map(({ file, call }) => `${file}: ${call}`),
      []
    );
  });
});
