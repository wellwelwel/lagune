import type { PublishedText } from '../../../src/types/test.js';
import { readFile } from 'node:fs/promises';
import { describe, it, strict } from 'poku';
import { BUILTIN_SPECIALIZATIONS } from '../../../src/catalog/builtin.js';
import { specializationLoadPrompt } from '../../../src/dashboard/shared/specialization-meta.js';
import { runsCommand, toolBehind, toolFor } from '../../../src/mcp/tools.js';
import { listFolderFiles, packageRoot } from '../plugins/__utils__.js';

const SITE_FOLDERS = ['website/docs', 'website/src'];
const SITE_FILE = /\.(?:mdx?|tsx?)$/;
const ENGINE_COMMAND =
  /npx (?:--yes )?lagune(?:@\S+)? ([a-z][\w-]*)(?: ([a-z][\w-]*))?/g;

const readSite = async (): Promise<PublishedText[]> => {
  const files = (await Promise.all(SITE_FOLDERS.map(listFolderFiles)))
    .flat()
    .filter((file) => SITE_FILE.test(file));

  return Promise.all(
    files.map(async (file) => ({
      file,
      text: await readFile(new URL(file, packageRoot), 'utf8'),
    }))
  );
};

/** Whether the engine answers a command in the form it is shown: behind the prefix of the tool that runs it, or bare when no tool runs it */
const isAnswered = (first: string, second: string | undefined): boolean => {
  const tool = toolBehind(first);

  if (tool !== undefined)
    return second === undefined || runsCommand(tool, second);

  return toolFor(first) === undefined;
};

await describe('every engine command the site shows', async () => {
  const pages = await readSite();
  const prompts = BUILTIN_SPECIALIZATIONS.map(({ name }) => ({
    file: `the prompt that loads ${name}`,
    text: specializationLoadPrompt(name),
  }));
  const commands = [...pages, ...prompts].flatMap(({ file, text }) =>
    [...text.matchAll(ENGINE_COMMAND)].map(([command, first, second]) => ({
      file,
      command,
      first,
      second,
    }))
  );

  it('finds engine commands to check', () => {
    strict(commands.some(({ first }) => toolBehind(first) !== undefined));
  });

  it('runs a command a tool runs behind that tool prefix', () => {
    strict.deepStrictEqual(
      commands
        .filter(({ first, second }) => !isAnswered(first, second))
        .map(({ file, command }) => `${file}: ${command}`),
      []
    );
  });
});
