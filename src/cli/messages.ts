import type { Category, CategoryChange } from '../types/categories.js';
import type { MigratedConfig, MigrateSummary } from '../types/core.js';
import type { EngineCommand, EngineTool } from '../types/mcp.js';
import { allOf } from '../core/collections.js';
import { CONFIGS_FILE } from '../core/configs.js';
import { toolFor } from '../mcp/tools.js';
import { color } from './colors.js';

const ENGINE_COMMAND = 'npx lagune';
const INSTALL_PAGE = 'https://lagune.ai/docs';
const MIGRATE_PAGE = 'https://lagune.ai/docs/commands/migrate';
const NOT_DONE = 'Report it as not done and never do its work by hand.';

const GLYPH = {
  added: color.blue('+'),
  moved: color.blue('↻'),
  kept: color.dim('·'),
  removed: color.blue('-'),
};

export const banner = (): string => `\n🪼 ${color.bold(color.blue('Lagune'))}`;

const done = (text: string): string => `${color.blue('✓')} ${text}`;

const heading = (text: string): string => color.blue(text);

const bullet = (text: string): string => `  ${color.blue('•')} ${text}`;

const definitions = (rows: [string, string][]): string[] => {
  const width = Math.max(...rows.map(([term]) => term.length));

  return rows.map(([term, description]) =>
    bullet(`${term.padEnd(width)}  ${description}`)
  );
};

const capitalized = (word: string): string =>
  `${word.charAt(0).toUpperCase()}${word.slice(1)}`;

/** How a person reaches a tool's commands: the engine command, then the tool's prefix */
export const toolCommandLine = (tool: EngineTool): string =>
  `${ENGINE_COMMAND} ${tool.prefix}`;

/** A command as a person types it, behind the prefix of the tool that runs it */
const commandLine = (command: string): string => {
  const tool = toolFor(command);

  return tool === undefined
    ? `${ENGINE_COMMAND} ${command}`
    : `${toolCommandLine(tool)} ${command}`;
};

const helpUsage = (tools: readonly EngineTool[]): string[] => [
  `${ENGINE_COMMAND} [--port <number>]`,
  ...tools.map((tool) => `${toolCommandLine(tool)} <command> [<arguments...>]`),
  `${ENGINE_COMMAND} dashboard [--port <number>]`,
  `${ENGINE_COMMAND} migrate`,
  `${ENGINE_COMMAND} mcp [<project>]`,
];

const HELP_TOOL_COMMANDS: Partial<Record<EngineCommand, [string, string]>> = {
  catalog: [
    'catalog [<name>]',
    "List this project's specializations, or print one by name",
  ],
  list: [
    'list [--findings] [--categories]',
    'List tracked findings or specialization categories (asks which)',
  ],
  add: [
    'add --categories [<category...>]',
    'Record specialization categories for this project',
  ],
  remove: [
    'remove --categories [<category...>]',
    'Drop specialization categories from this project',
  ],
};

const HELP_COMMANDS: [string, string][] = [
  ['dashboard', 'Serve a live view of .lagune/ and open it in the browser'],
  [
    'migrate',
    'Move a manifest-based Lagune project to the skills-based layout',
  ],
  ['mcp', "Serve the engine's commands to an agent over MCP, from the project"],
];

const HELP_OPTIONS: [string, string][] = [
  [
    '--categories <...>',
    'With add, remove, or list, the categories (no value to choose interactively)',
  ],
  ['--findings', 'With list, show the tracked findings'],
  [
    '--port <1024-65535>',
    'With dashboard, the port to serve on (default: random)',
  ],
  ['--help', 'Show this help'],
  ['--version', 'Show the version'],
];

const toolCommands = (tool: EngineTool): string[] => {
  const described = tool.commands
    .map((command) => HELP_TOOL_COMMANDS[command])
    .filter((row) => row !== undefined);
  const listed = tool.commands.filter(
    (command) => HELP_TOOL_COMMANDS[command] === undefined
  );

  return [
    heading(`${capitalized(tool.prefix)} commands`),
    ...definitions(described),
    ...(listed.length === 0 ? [] : [bullet(listed.join(color.dim(', ')))]),
    '',
  ];
};

export const helpText = (tools: readonly EngineTool[]): string =>
  [
    banner(),
    color.dim('A defensive, security-first workflow for your project.'),
    '',
    heading('Usage'),
    ...helpUsage(tools).map(bullet),
    '',
    ...tools.flatMap(toolCommands),
    heading('Other commands'),
    ...definitions(HELP_COMMANDS),
    '',
    heading('Options'),
    ...definitions(HELP_OPTIONS),
    '',
    heading('Agent commands'),
    bullet(`Install and update them for your agent at ${INSTALL_PAGE}`),
  ].join('\n');

export const unknownCommand = (command: string): string =>
  [
    `Unknown command: ${command}`,
    `Run ${ENGINE_COMMAND} --help to see the commands.`,
  ].join('\n');

export const unprefixedCommand = (command: string): string =>
  `${command} runs only as ${commandLine(command)}.`;

export const movedToSkills = (command: string): string =>
  `${command} is gone: install and update Lagune's commands for your agent at ${INSTALL_PAGE}`;

export const categoriesUsage = (command: string): string =>
  [
    `usage: ${commandLine(command)} --categories <category...>`,
    `Run ${commandLine('list')} --categories to see every category.`,
  ].join('\n');

export const listUsage = (): string =>
  [
    `usage: ${commandLine('list')} --findings`,
    `       ${commandLine('list')} --categories`,
  ].join('\n');

export const catalogUsage = (): string =>
  `usage: ${commandLine('catalog')} [<name>]`;

export const invalidSpecializationName = (name: string): string =>
  `"${name}" is not a specialization name: a name uses only lowercase letters, digits, and hyphens.`;

export const noSpecialization = (name: string): string =>
  `No specialization is named "${name}". Run ${commandLine('catalog')} to list the ones this project uses.`;

export const noProjectFolder = (project: string): string =>
  `The MCP server runs from the project folder, and ${project} is not a folder.`;

export const notAProjectFolder = (project: string): string =>
  `The MCP server runs from the project folder, and ${project} is Lagune's own folder or the root of the file system, never a project. The agent started the server outside the project, so the commands run the engine through npx instead.`;

export const noServedProject = (): string =>
  'The MCP server runs from the project folder, and the agent named none: it started the server outside the project and listed no single project folder as its root. The commands run the engine through npx instead.';

export const noNodeForEngine = (): string =>
  "Lagune's engine runs on Node.js, and none was found on this computer's search path. Install Node.js (LTS), then restart your agent.";

export const hookStalled = (hook: string, seconds: number): string =>
  `${hook} gave no answer within ${seconds} seconds. A very large or crafted input can stall it. ${NOT_DONE}`;

export const hookStopped = (hook: string): string =>
  `${hook} stopped without an answer. ${NOT_DONE}`;

export const frozenHandoff = (version: string): string =>
  `This project runs on the manifest-based Lagune, which keeps working: lagune@${version} answers here. To move the project to the skills-based Lagune, see ${MIGRATE_PAGE}`;

export const frozenRefusal = (command: string): string =>
  `This project runs on the manifest-based Lagune, which keeps working here, but ${command} is part of the skills-based Lagune the project has not moved to yet. To move it, see ${MIGRATE_PAGE}`;

export const handoffLoop = (version: string): string =>
  `lagune@${version} answered with this skills-based Lagune instead of the manifest-based Lagune, so the hand-off stopped rather than starting itself again. Remove the copy that carries that version, such as a linked one, then run this again. To move the project to the skills-based Lagune, see ${MIGRATE_PAGE}`;

export const handoffUnavailable = (version: string): string =>
  `This project runs on the manifest-based Lagune, which keeps working with lagune@${version}, but this runtime brings no npm to start it. Run npx lagune@${version} yourself with the same arguments. To move the project to the skills-based Lagune, see ${MIGRATE_PAGE}`;

const footer = (...middle: string[]): string =>
  ['Enter to confirm', ...middle, 'Esc to cancel'].join(' · ');

export const selectFooter = (): string => footer();

export const categoriesSelectFooter = (): string => footer('empty to skip');

export const listSelectTitle = (): string => 'What do you want to list?';

export const listSelectHint = (): string => 'Arrow keys to move.';

export const categoriesSelectTitle = (): string =>
  'Which specialization categories do you want?';

export const categoriesSelectHint = (): string =>
  'Space to toggle, arrow keys to move.';

export const nothingSelected = (): string => color.dim('Nothing selected.');

const usedLine = (used: string[]): string =>
  used.length === 0
    ? 'This project uses no category.'
    : `This project uses ${allOf(used)}.`;

export const categoryList = (
  categories: Category[],
  used: string[],
  recorded: boolean
): string => {
  const keyWidth = Math.max(
    ...categories.map((category) => category.key.length)
  );
  const rows = categories.map((category) => {
    const key = category.key.padEnd(keyWidth);
    const state = used.includes(category.key)
      ? color.green('[used]     ')
      : color.dim('[available]');

    return bullet(`${key}  ${state}  ${category.description}`);
  });
  const origin = recorded
    ? `Recorded in ${CONFIGS_FILE}.`
    : `No category is recorded yet, so this project uses the default: ${allOf(used)}.`;

  return [heading('Categories'), ...rows, '', color.dim(origin)].join('\n');
};

export const categoriesRecorded = (
  action: 'add' | 'remove',
  change: CategoryChange
): string => {
  const verb = action === 'add' ? 'Added' : 'Removed';
  const untouched = action === 'add' ? 'Already used' : 'Not used';

  return [
    ...(change.changed.length > 0
      ? [
          done(
            `${verb} ${allOf(change.changed)} ${color.dim(`· ${CONFIGS_FILE}`)}`
          ),
        ]
      : []),
    ...(change.unchanged.length > 0
      ? [color.dim(`${untouched}: ${allOf(change.unchanged)}.`)]
      : []),
    usedLine(change.categories),
  ].join('\n');
};

export const findingsReport = (names: string[]): string => {
  if (names.length === 0) return color.dim('No findings tracked yet.');

  return [heading('Findings'), ...names.map(bullet)].join('\n');
};

export const migrateNothing = (): string =>
  color.dim(
    'No manifest-based Lagune found here, so there is nothing to migrate.'
  );

export const migrateBlueSpecFirst = (version: string): string =>
  `This project is still on Blue Spec, Lagune's former name. Move it to the manifest-based Lagune with ${color.blue(`npx lagune@${version} migrate`)}, then run this again.`;

const removedLine = (path: string): string => `  ${GLYPH.removed} ${path}`;

const movedLine = (from: string, to: string): string =>
  `  ${GLYPH.moved} ${from} ${color.dim(`→ ${to}`)}`;

const keptLine = (path: string): string =>
  `  ${GLYPH.kept} ${path} ${color.dim('(kept: its destination already exists)')}`;

const GITIGNORE_NOTES: Record<MigrateSummary['gitignore'], string> = {
  removed: 'Removed .gitignore, which held only the Lagune block',
  updated: 'Removed the Lagune block from .gitignore',
  unchanged: '',
};

const CONFIG_NOTES: Record<MigratedConfig, string> = {
  categories: 'the categories',
  catalog: 'the index of your own specializations',
};

const migrateNotes = (summary: MigrateSummary): string[] => [
  ...(summary.configs.length === 0
    ? []
    : [
        done(
          `Recorded ${allOf(summary.configs.map((config) => CONFIG_NOTES[config]))} in ${CONFIGS_FILE}`
        ),
      ]),
  ...(summary.gitignore === 'unchanged'
    ? []
    : [done(GITIGNORE_NOTES[summary.gitignore])]),
  ...(summary.proofs
    ? [done('Kept .lagune/proofs/ out of commits with its own .gitignore')]
    : []),
];

const migrateSteps = (summary: MigrateSummary): string[] =>
  [
    ...(summary.manifest ? ['Commit this change on its own'] : []),
    `Install Lagune's commands for your agent at ${INSTALL_PAGE}`,
    `Follow the rest of the move at ${MIGRATE_PAGE}`,
  ].map((step, index) => `  ${color.dim(String(index + 1))}  ${step}`);

export const migrateReport = (summary: MigrateSummary): string =>
  [
    ...(summary.removed.length > 0
      ? [heading('Removed'), ...summary.removed.map(removedLine), '']
      : []),
    ...(summary.moved.length > 0 || summary.kept.length > 0
      ? [
          heading('Moved'),
          ...summary.moved.map((file) => movedLine(file.from, file.to)),
          ...summary.kept.map(keptLine),
          '',
        ]
      : []),
    done(
      `Moved to the skills-based layout ${color.dim('·')} ${summary.removed.length} removed${color.dim(`, ${summary.moved.length} moved`)}`
    ),
    ...migrateNotes(summary),
    '',
    color.bold('Next steps'),
    ...migrateSteps(summary),
  ].join('\n');
