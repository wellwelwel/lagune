import type { LegacyCommand } from '../types/core.js';
import { join } from 'node:path';
import { existingWithin, listingWithin } from './fs-actions.js';
import { readText } from './markdown/read.js';

/** Every folder the manifest-based Lagune wrote an agent command into, across all of its releases */
const COMMAND_FOLDERS = [
  '.adal/skills',
  '.agent/skills',
  '.agents/commands',
  '.agents/skills',
  '.aider-desk/skills',
  '.amazonq/prompts',
  '.augment/commands',
  '.autohand/skills',
  '.bob/commands',
  '.claude/skills',
  '.cline/skills',
  '.clinerules/workflows',
  '.codeartsdoer/skills',
  '.codebuddy/commands',
  '.codemaker/skills',
  '.codestudio/skills',
  '.codex/skills',
  '.commandcode/skills',
  '.continue/prompts',
  '.cortex/skills',
  '.cospec/commands',
  '.crush/commands',
  '.crush/skills',
  '.cursor/skills',
  '.devin/skills',
  '.factory/commands',
  '.factory/skills',
  '.firebender/commands',
  '.forge/commands',
  '.gemini/commands',
  '.github/prompts',
  '.github/skills',
  '.goose/recipes',
  '.hermes/skills',
  '.iflow/commands',
  '.inferencesh/skills',
  '.jazz/skills',
  '.junie/commands',
  '.kilo/skills',
  '.kilocode/workflows',
  '.kimi/skills',
  '.kiro/prompts',
  '.kode/skills',
  '.lingma/skills',
  '.mcpjam/skills',
  '.moxby/skills',
  '.mux/skills',
  '.neovate/commands',
  '.ona/skills',
  '.opencode/commands',
  '.openhands/skills',
  '.pi/prompts',
  '.pochi/skills',
  '.qoder/commands',
  '.qwen/commands',
  '.reasonix/skills',
  '.roo/commands',
  '.rovodev/skills',
  '.shai/commands',
  '.shai/skills',
  '.tabnine/agent/commands',
  '.terramind/skills',
  '.tinycloud/skills',
  '.trae/skills',
  '.vibe/skills',
  '.windsurf/workflows',
  '.xum/skills',
  '.zcode/skills',
  '.zencoder/skills',
  'agent/skills',
  'data/skills',
  'skills',
];

const COMMAND_NAME =
  /^lagune(\.(?:charter|detect|harden|plan|prove|repair|specialize|verify))?(\.(?:md|mdc|toml|yaml|prompt|prompt\.md))?$/;

/** Only the manifest-based /lagune names this file, never the skills-based one installed under the same name */
const MAIN_COMMAND_MARK = '.lagune/specializations.md';

const commandOf = (folder: string, name: string): LegacyCommand[] => {
  const match = COMMAND_NAME.exec(name);

  if (match === null) return [];

  const [, subcommand, extension] = match;
  const path = `${folder}/${name}`;
  const main = subcommand === undefined;

  if (extension === undefined)
    return [{ path: `${path}/`, main, source: `${path}/SKILL.md` }];

  return [{ path, main, source: path }];
};

const commandsIn = async (
  cwd: string,
  folder: string
): Promise<LegacyCommand[]> =>
  (await listingWithin(cwd, join(cwd, folder))).flatMap((name) =>
    commandOf(folder, name)
  );

const readWithin = async (cwd: string, path: string): Promise<string> => {
  const real = await existingWithin(cwd, join(cwd, path));
  const text = real === undefined ? null : await readText(real);

  return text ?? '';
};

const isLegacy = async (
  cwd: string,
  command: LegacyCommand
): Promise<boolean> =>
  !command.main ||
  (await readWithin(cwd, command.source)).includes(MAIN_COMMAND_MARK);

/** The agent commands the manifest-based Lagune wrote, found under its names in its folders, keeping the skills-based /lagune */
export const legacyCommands = async (cwd: string): Promise<string[]> => {
  const found = (
    await Promise.all(COMMAND_FOLDERS.map((folder) => commandsIn(cwd, folder)))
  ).flat();
  const legacy = await Promise.all(
    found.map((command) => isLegacy(cwd, command))
  );

  return found
    .filter((_command, index) => legacy[index])
    .map((command) => command.path);
};
