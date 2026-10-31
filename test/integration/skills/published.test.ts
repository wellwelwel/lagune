import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, strict } from 'poku';
import { loadVersion } from '../../../src/core/version.js';
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

const ENGINE_COMMAND = `npx --yes lagune@${await loadVersion(packageRoot)} `;
const ENGINE_CALL = /npx (?:-\S+ )*lagune(?:@\S*)? [^\n`]*/g;
const SHORT_FLAG = /(?:^|\s)-[a-zA-Z](?=\s|$)/;

const repositoryRoot = fileURLToPath(packageRoot);
const folders = (await readdir(new URL('skills/', packageRoot))).toSorted();

const publishedFiles = async (): Promise<string[]> => {
  const skills = await Promise.all(
    folders.map(async (folder) =>
      (
        await readdir(new URL(`skills/${folder}/`, packageRoot), {
          recursive: true,
          withFileTypes: true,
        })
      )
        .filter((entry) => entry.isFile())
        .map((entry) =>
          relative(repositoryRoot, join(entry.parentPath, entry.name))
            .split(sep)
            .join('/')
        )
    )
  );
  const catalog = (await readdir(new URL('catalog/', packageRoot))).map(
    (file) => `catalog/${file}`
  );

  return [...skills.flat(), ...catalog];
};

const engineCalls = async (): Promise<{ file: string; call: string }[]> => {
  const files = await publishedFiles();
  const texts = await Promise.all(
    files.map((file) => readFile(new URL(file, packageRoot), 'utf8'))
  );

  return files.flatMap((file, index) =>
    [...texts[index].matchAll(ENGINE_CALL)].map(([call]) => ({ file, call }))
  );
};

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
  const calls = await engineCalls();

  it('finds engine calls to check', () => {
    strict(calls.length > 0);
  });

  it('runs the engine unattended, at the package version', () => {
    strict.deepStrictEqual(
      calls
        .filter(({ call }) => !call.startsWith(ENGINE_COMMAND))
        .map(({ file, call }) => `${file}: ${call}`),
      []
    );
  });

  it('spells out every flag in full', () => {
    strict.deepStrictEqual(
      calls
        .filter(({ call }) => SHORT_FLAG.test(call))
        .map(({ file, call }) => `${file}: ${call}`),
      []
    );
  });
});
