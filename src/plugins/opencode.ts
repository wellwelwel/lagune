import type {
  OpenCodePlugin,
  ServerConfig,
  ServerHooks,
  SetupContext,
  SkillEditor,
  SkillInfo,
} from '../types/opencode.js';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFrontmatter } from '../core/markdown/frontmatter.js';

const PLUGIN_ID = 'lagune';
const SKILL_FILE = 'SKILL.md';
const USER_ONLY_FIELD = 'disable-model-invocation';
const SKILLS_FOLDER = fileURLToPath(new URL('../../skills', import.meta.url));

const addSkillsFolder = async (config: ServerConfig): Promise<void> => {
  config.skills ??= {};
  config.skills.paths ??= [];

  if (!config.skills.paths.includes(SKILLS_FOLDER))
    config.skills.paths.push(SKILLS_FOLDER);
};

const server = async (): Promise<ServerHooks> => ({ config: addSkillsFolder });

const readSkill = async (folder: string): Promise<SkillInfo> => {
  const path = join(SKILLS_FOLDER, folder, SKILL_FILE);
  const { fields, body } = readFrontmatter(await readFile(path, 'utf8'));
  const description = fields.get('description');

  return {
    id: folder,
    name: fields.get('name') ?? folder,
    ...(description === undefined ? {} : { description }),
    ...(fields.get(USER_ONLY_FIELD) === 'true' ? { autoinvoke: false } : {}),
    path,
    content: body,
  };
};

const readSkills = async (): Promise<SkillInfo[]> => {
  const entries = await readdir(SKILLS_FOLDER, { withFileTypes: true });

  return Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => readSkill(entry.name))
  );
};

const register = (editor: SkillEditor, skill: SkillInfo): void => {
  try {
    editor.add?.(skill);
  } catch (error) {
    console.error(`Lagune: OpenCode rejected the ${skill.name} skill.`, error);
  }
};

const setup = async (context: SetupContext): Promise<void> => {
  const domain = context.skill;

  if (typeof domain?.transform !== 'function') return;

  try {
    const skills = await readSkills();

    await domain.transform((editor) => {
      for (const skill of skills) register(editor, skill);
    });
  } catch (error) {
    console.error('Lagune: OpenCode could not register the skills.', error);
  }
};

const plugin: OpenCodePlugin = { id: PLUGIN_ID, server, setup };

/** OpenCode reads a plugin from its module's default export */
export default plugin;
