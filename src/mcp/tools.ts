import type { EngineRun, EngineRunner, EngineTool } from '../types/mcp.js';
import { isStringArray, readField } from '../core/collections.js';

const ARGUMENTS_GUIDE =
  'Pass the engine subcommand as command and each of its arguments, without shell quotes, as one item of arguments.';

export const ENGINE_TOOLS: readonly EngineTool[] = [
  {
    name: 'lagune_read',
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
    title: 'Lagune engine (write)',
    summary:
      "Runs a Lagune engine command that changes the project's .lagune/ state: tracking findings, standing them down, repairing the tracking map, and recording categories.",
    readOnly: false,
    commands: ['track', 'untrack', 'repair', 'add', 'remove'],
  },
];

export const findTool = (name: unknown): EngineTool | undefined =>
  ENGINE_TOOLS.find((tool) => tool.name === name);

const toolFor = (command: unknown): EngineTool | undefined =>
  ENGINE_TOOLS.find((tool) =>
    tool.commands.some((candidate) => candidate === command)
  );

const refusal = (tool: EngineTool, command: unknown): string => {
  const owner = toolFor(command);

  if (owner === undefined)
    return `${tool.name} runs one of: ${tool.commands.join(', ')}.`;

  return `${String(command)} runs through ${owner.name}, not ${tool.name}.`;
};

/** Runs one call of a tool, refusing a command the tool does not run or arguments that are not strings */
export const runTool = async (
  tool: EngineTool,
  input: unknown,
  run: EngineRunner
): Promise<EngineRun> => {
  const command = readField(input, 'command');
  const values = readField(input, 'arguments') ?? [];

  if (typeof command !== 'string' || toolFor(command) !== tool)
    return { output: refusal(tool, command), failed: true };
  if (!isStringArray(values))
    return { output: 'arguments must be a list of strings.', failed: true };

  return run(command, values);
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
