import { readdir, readFile } from 'node:fs/promises';
import { describe, it, strict } from 'poku';
import { packageRoot } from './__utils__.js';

const COMMANDS = [
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

const FILLS_A_TEMPLATE = [
  'lagune.charter',
  'lagune.detect',
  'lagune.harden',
  'lagune.plan',
  'lagune.prove',
  'lagune.specialize',
];

const ENGINE_CALL = /npx --yes --prefer-offline lagune@(\S+) [^\n`]*/g;
const SHORT_FLAG = /(?:^|\s)-[a-zA-Z](?=\s|$)/;

const { version } = JSON.parse(
  await readFile(new URL('package.json', packageRoot), 'utf8')
);

const folders = (await readdir(new URL('skills/', packageRoot))).toSorted();

const publishedFiles = async (): Promise<string[]> => {
  const skills = await Promise.all(
    folders.map(async (folder) =>
      (await readdir(new URL(`skills/${folder}/`, packageRoot))).map(
        (file) => `skills/${folder}/${file}`
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
  await it('are the nine commands', () => {
    strict.deepStrictEqual(folders, COMMANDS);
  });

  for (const folder of COMMANDS)
    await it(`ship ${folder} with only its own files`, async () => {
      const files = (
        await readdir(new URL(`skills/${folder}/`, packageRoot))
      ).toSorted();

      strict.deepStrictEqual(
        files,
        FILLS_A_TEMPLATE.includes(folder)
          ? ['SKILL.md', 'template.md']
          : ['SKILL.md']
      );
    });
});

await describe('every engine call the skills and specializations write', async () => {
  const calls = await engineCalls();

  await it('finds engine calls to check', () => {
    strict(calls.length > 0);
  });

  await it('carries the package version', () => {
    strict.deepStrictEqual(
      calls
        .filter(
          ({ call }) =>
            !call.startsWith(`npx --yes --prefer-offline lagune@${version} `)
        )
        .map(({ file, call }) => `${file}: ${call}`),
      []
    );
  });

  await it('spells out every flag in full', () => {
    strict.deepStrictEqual(
      calls
        .filter(({ call }) => SHORT_FLAG.test(call))
        .map(({ file, call }) => `${file}: ${call}`),
      []
    );
  });
});
