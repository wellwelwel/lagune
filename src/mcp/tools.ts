import type { EngineTool } from '../types/mcp.js';

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

export const toolFor = (command: unknown): EngineTool | undefined =>
  ENGINE_TOOLS.find((tool) =>
    tool.commands.some((candidate) => candidate === command)
  );

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
