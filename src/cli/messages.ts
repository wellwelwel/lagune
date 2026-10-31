import type { Category, CategoryChange } from '../types/categories.js';
import type { MigrateSummary } from '../types/core.js';
import { allOf } from '../core/collections.js';
import { CONFIGS_FILE } from '../core/configs.js';
import { color } from './colors.js';

const ENGINE_COMMAND = 'npx lagune';
const SKILLS_ADD = 'npx skills add wellwelwel/lagune';
const SKILLS_UPDATE = 'npx skills update';

export const MIGRATE_PAGE = 'https://lagune.ai/docs/commands/migrate';

const GLYPH = {
  added: color.blue('+'),
  moved: color.blue('↻'),
  kept: color.dim('·'),
  removed: color.blue('-'),
};

export const banner = (): string => `\n🌊 ${color.bold(color.blue('Lagune'))}`;

const done = (text: string): string => `${color.blue('✓')} ${text}`;

const heading = (text: string): string => color.blue(text);

const bullet = (text: string): string => `  ${color.blue('•')} ${text}`;

const definitions = (rows: [string, string][]): string[] => {
  const width = Math.max(...rows.map(([term]) => term.length));

  return rows.map(([term, description]) =>
    bullet(`${term.padEnd(width)}  ${description}`)
  );
};

const HELP_USAGE: string[] = [
  `${ENGINE_COMMAND} [--port <number>]`,
  `${ENGINE_COMMAND} catalog [<name>]`,
  `${ENGINE_COMMAND} add --categories [<category...>]`,
  `${ENGINE_COMMAND} remove --categories [<category...>]`,
  `${ENGINE_COMMAND} list [--findings] [--categories]`,
  `${ENGINE_COMMAND} dashboard [--port <number>]`,
  `${ENGINE_COMMAND} migrate`,
  `${ENGINE_COMMAND} mcp [<project>]`,
  `${ENGINE_COMMAND} <hook> [<arguments...>]`,
];

const HELP_COMMANDS: [string, string][] = [
  ['catalog', "List this project's specializations, or print one by name"],
  ['add', 'Record specialization categories for this project'],
  ['remove', 'Drop specialization categories from this project'],
  ['list', 'List tracked findings or specialization categories (asks which)'],
  ['dashboard', 'Serve a live view of .lagune/ and open it in the browser'],
  [
    'migrate',
    'Move a project the Lagune CLI installed to the skills-based layout',
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

export const helpText = (hooks: string[]): string =>
  [
    banner(),
    color.dim('A defensive, security-first workflow for your project.'),
    '',
    heading('Usage'),
    ...HELP_USAGE.map(bullet),
    '',
    heading('Commands'),
    ...definitions(HELP_COMMANDS),
    '',
    heading('Hooks'),
    bullet(hooks.join(color.dim(', '))),
    '',
    heading('Options'),
    ...definitions(HELP_OPTIONS),
    '',
    heading('Agent skills'),
    bullet(`Install them with ${SKILLS_ADD}`),
    bullet(`Update them with ${SKILLS_UPDATE}`),
  ].join('\n');

export const unknownCommand = (command: string): string =>
  [
    `Unknown command: ${command}`,
    `Run ${ENGINE_COMMAND} --help to see the commands.`,
  ].join('\n');

export const movedToSkills = (command: string): string =>
  [
    `${command} moved to the skills CLI, which installs and updates Lagune's commands:`,
    `  ${SKILLS_ADD}`,
    `  ${SKILLS_UPDATE}`,
  ].join('\n');

export const categoriesUsage = (command: string): string =>
  [
    `usage: ${ENGINE_COMMAND} ${command} --categories <category...>`,
    `Run ${ENGINE_COMMAND} list --categories to see every category.`,
  ].join('\n');

export const listUsage = (): string =>
  [
    `usage: ${ENGINE_COMMAND} list --findings`,
    `       ${ENGINE_COMMAND} list --categories`,
  ].join('\n');

export const catalogUsage = (): string =>
  `usage: ${ENGINE_COMMAND} catalog [<name>]`;

export const invalidSpecializationName = (name: string): string =>
  `"${name}" is not a specialization name: a name uses only lowercase letters, digits, and hyphens.`;

export const noSpecialization = (name: string): string =>
  `No specialization is named "${name}". Run ${ENGINE_COMMAND} catalog to list the ones this project uses.`;

export const noProjectFolder = (project: string): string =>
  `The MCP server runs from the project folder, and ${project} is not a folder.`;

export const frozenHandoff = (version: string): string =>
  `This project was installed by the Lagune CLI and keeps working with it: lagune@${version} answers here. To move the project to the skills-based Lagune, see ${MIGRATE_PAGE}`;

export const frozenRefusal = (command: string): string =>
  `This project was installed by the Lagune CLI, which keeps working here, but ${command} is part of the skills-based Lagune the project has not moved to yet. To move it, see ${MIGRATE_PAGE}`;

export const handoffUnavailable = (version: string): string =>
  `This project was installed by the Lagune CLI, which keeps working with lagune@${version}, but this runtime brings no npm to start it. Run npx lagune@${version} yourself with the same arguments. To move the project to the skills-based Lagune, see ${MIGRATE_PAGE}`;

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
    'No Lagune CLI install found here, so there is nothing to migrate.'
  );

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
    ...(summary.gitignore === 'unchanged'
      ? []
      : [done(GITIGNORE_NOTES[summary.gitignore])]),
    '',
    color.bold('Next steps'),
    `  ${color.dim('1')}  Commit this change on its own`,
    `  ${color.dim('2')}  Install Lagune's commands with ${color.blue(SKILLS_ADD)}`,
    `  ${color.dim('3')}  Follow the rest of the move at ${MIGRATE_PAGE}`,
  ].join('\n');
