import type {
  EngineCommand,
  EngineRun,
  EngineRunner,
  EngineTool,
} from '../types/mcp.js';
import { isStringArray, readField } from '../core/collections.js';

const ARGUMENTS_GUIDE =
  'Pass the engine subcommand as command and each of its arguments, without shell quotes, as one item of arguments.';

export const ENGINE_TOOLS: readonly EngineTool[] = [
  {
    name: 'lagune_read',
    prefix: 'read',
    title: 'Lagune engine (read)',
    summary:
      'Runs a Lagune engine command that only reads the project: the catalog, the tracked findings and categories, the memory validation, the CVSS scoring, and the checkers.',
    readOnly: true,
    commands: [
      'catalog',
      'list',
      'validate',
      'cvss',
      'agent',
      'cors',
      'crypto',
      'infra',
      'interpreter',
      'jwt',
      'network',
      'regex',
      'secrets',
    ],
  },
  {
    name: 'lagune_write',
    prefix: 'write',
    title: 'Lagune engine (write)',
    summary:
      "Runs a Lagune engine command that changes the project's .lagune/ state: tracking findings, standing them down, repairing the tracking map, and recording categories and the paths the checkers leave out.",
    readOnly: false,
    commands: ['track', 'untrack', 'repair', 'add', 'remove'],
  },
];

export const findTool = (name: unknown): EngineTool | undefined =>
  ENGINE_TOOLS.find((tool) => tool.name === name);

/** The tool whose commands run behind a prefix on the command line */
export const toolBehind = (prefix: unknown): EngineTool | undefined =>
  ENGINE_TOOLS.find((tool) => tool.prefix === prefix);

export const runsCommand = (
  tool: EngineTool,
  command: unknown
): command is EngineCommand =>
  tool.commands.some((candidate) => candidate === command);

export const toolFor = (command: unknown): EngineTool | undefined =>
  ENGINE_TOOLS.find((tool) => runsCommand(tool, command));

/** Why a tool refuses a command it does not run, naming each tool the way its caller reaches it */
export const commandRefusal = (
  tool: EngineTool,
  command: unknown,
  named: (tool: EngineTool) => string
): string => {
  const owner = toolFor(command);

  if (owner === undefined)
    return `${named(tool)} runs one of: ${tool.commands.join(', ')}.`;

  return `${String(command)} runs through ${named(owner)}, not ${named(tool)}.`;
};

const toolName = (tool: EngineTool): string => tool.name;

/** Runs one call of a tool as its command line, behind the tool's prefix, refusing a command the tool does not run or arguments that are not strings */
export const runTool = async (
  tool: EngineTool,
  input: unknown,
  run: EngineRunner
): Promise<EngineRun> => {
  const command = readField(input, 'command');
  const values = readField(input, 'arguments') ?? [];

  if (!runsCommand(tool, command))
    return { output: commandRefusal(tool, command, toolName), failed: true };
  if (!isStringArray(values))
    return { output: 'arguments must be a list of strings.', failed: true };

  return run([tool.prefix, command, ...values]);
};

export const describeTool = (tool: EngineTool) => ({
  name: tool.name,
  title: tool.title,
  description: `${tool.summary} ${ARGUMENTS_GUIDE}`,
  inputSchema: {
    type: 'object',
    properties: {
      command: { type: 'string', enum: tool.commands },
      arguments: { type: 'array', items: { type: 'string' } },
    },
    required: ['command'],
    additionalProperties: false,
  },
  annotations: {
    title: tool.title,
    readOnlyHint: tool.readOnly,
    destructiveHint: !tool.readOnly,
    openWorldHint: false,
  },
});
