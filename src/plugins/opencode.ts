import type { EngineRun, EngineTool } from '../types/mcp.js';
import type {
  OpenCodePlugin,
  ServerConfig,
  ServerHooks,
  ServerTool,
  SetupContext,
  SkillEditor,
  SkillInfo,
  SkillSources,
  ToolInfo,
} from '../types/opencode.js';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFrontmatter } from '../core/markdown/frontmatter.js';
import { describeTool, ENGINE_TOOLS, runTool } from '../mcp/tools.js';
import { runFromProject } from './engine.js';

const PLUGIN_ID = 'lagune';
const SKILL_FILE = 'SKILL.md';
const USER_ONLY_FIELD = 'disable-model-invocation';
const SKILLS_FOLDER = fileURLToPath(new URL('../../skills', import.meta.url));
const EVERY_PATTERN = ['*'];

const addSkillsFolder = async (config: ServerConfig): Promise<void> => {
  const skills: SkillSources = (config.skills ??= Object.create(null));

  skills.paths ??= [];

  if (!skills.paths.includes(SKILLS_FOLDER)) skills.paths.push(SKILLS_FOLDER);
};

/** OpenCode shows the model a thrown error, as it does an MCP tool's failure */
const outputOf = (run: EngineRun): string => {
  if (run.failed) throw new Error(run.output);

  return run.output;
};

const serverTool = (tool: EngineTool): ServerTool => {
  const { description, inputSchema } = describeTool(tool);

  return {
    description,
    args: inputSchema.properties,
    execute: async (input, context) => {
      await context.ask({
        permission: tool.name,
        patterns: EVERY_PATTERN,
        always: EVERY_PATTERN,
        metadata: Object.create(null),
      });

      return outputOf(
        await runTool(tool, input, runFromProject(context.directory))
      );
    },
  };
};

const server = async (): Promise<ServerHooks> => ({
  config: addSkillsFolder,
  tool: Object.fromEntries(
    ENGINE_TOOLS.map((tool) => [tool.name, serverTool(tool)])
  ),
});

const readSkill = async (folder: string): Promise<SkillInfo> => {
  const path = join(SKILLS_FOLDER, folder, SKILL_FILE);
  const { fields, body } = readFrontmatter(await readFile(path, 'utf8'));
  const description = fields.get('description');

  return {
    id: folder,
    name: fields.get('name') ?? folder,
    ...(description === undefined ? undefined : { description }),
    ...(fields.get(USER_ONLY_FIELD) === 'true'
      ? { autoinvoke: false }
      : undefined),
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

const registerSkills = async (context: SetupContext): Promise<void> => {
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

const toolInfo = (
  tool: EngineTool,
  context: SetupContext,
  project: string
): ToolInfo => {
  const { name, description, inputSchema } = describeTool(tool);

  return {
    name,
    description,
    input: inputSchema,
    options: { codemode: false },
    execute: async (input, call) => {
      await context.permission?.assert?.({
        sessionID: call.sessionID,
        agent: call.agent,
        action: name,
        resources: EVERY_PATTERN,
        save: EVERY_PATTERN,
        source: { type: 'tool', messageID: call.messageID, id: call.id },
      });

      return {
        content: outputOf(await runTool(tool, input, runFromProject(project))),
      };
    },
  };
};

const registerTools = async (context: SetupContext): Promise<void> => {
  const domain = context.tool;
  const project = context.location?.directory;

  if (typeof domain?.transform !== 'function' || project === undefined) return;

  try {
    await domain.transform((editor) => {
      for (const tool of ENGINE_TOOLS)
        editor.add?.(toolInfo(tool, context, project));
    });
  } catch (error) {
    console.error(
      'Lagune: OpenCode could not register the engine tools.',
      error
    );
  }
};

const setup = async (context: SetupContext): Promise<void> => {
  await registerSkills(context);
  await registerTools(context);
};

const plugin: OpenCodePlugin = { id: PLUGIN_ID, server, setup };

/** OpenCode reads a plugin from its module's default export */
export default plugin;
