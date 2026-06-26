import type { ScaffoldResult, SkillGroup } from '../types/core.js';

export const helpText = (agentKeys: string[]): string =>
  [
    'Blue Spec: a defensive, security-first workflow for your project.',
    '',
    'Usage:',
    '  npx blue-spec init <agent> [--skills <category...>]',
    '  npx blue-spec add --skills',
    '  npx blue-spec remove --skills',
    '  npx blue-spec list [--findings] [--skills]',
    '',
    'Commands:',
    '  init <agent>    Scaffold Blue Spec into the current project',
    '  add             Install security specializations, by category',
    '  remove          Uninstall security specializations, by category',
    '  list            List tracked findings or specialization categories (asks which)',
    '',
    'Options:',
    '  --skills <...>    Security specializations, by category (no value to choose interactively)',
    '  --findings        With list, show the tracked findings',
    '  -h, --help        Show this help',
    '  -v, --version     Show the version',
    '',
    `Available agents: ${agentKeys.join(', ')}`,
  ].join('\n');

export const addUsage = (): string =>
  [
    'usage: npx blue-spec add --skills',
    'options:',
    '  --skills   security specializations to install (run with no value to choose interactively)',
    'run `npx blue-spec list` to see available categories',
  ].join('\n');

export const removeUsage = (): string =>
  [
    'usage: npx blue-spec remove --skills',
    'options:',
    '  --skills   security specializations to uninstall (run with no value to choose interactively)',
    'run `npx blue-spec list` to see available categories',
  ].join('\n');

export const unknownCategories = (
  keys: string[],
  availableKeys: string[]
): string =>
  [
    `Unknown specialization ${keys.length === 1 ? 'category' : 'categories'}: ${keys.join(', ')}`,
    `Available categories: ${availableKeys.join(', ')}`,
  ].join('\n');

export const noAgentSelected = (agentKeys: string[]): string => {
  const first = agentKeys[0];

  return [
    'No agent selected.',
    `Pass an agent (available: ${agentKeys.join(', ')}).`,
    `Example: npx blue-spec init ${first}`,
  ].join('\n');
};

export const agentSelectTitle = (): string => 'Which agent are you using?';

export const agentSelectHint = (): string =>
  'Type to filter, arrow keys to move, Enter to confirm.';

export const selectionAborted = (): string => 'No agent selected: cancelled.';

export const listSelectTitle = (): string => 'What do you want to list?';

export const listSelectHint = (): string =>
  'Arrow keys to move, Enter to confirm.';

export const skillsSelectTitle = (): string =>
  'Which security specializations do you want?';

export const skillsSelectHint = (): string =>
  'Space to toggle, arrow keys to move, Enter to confirm, empty to skip.';

export const createdLine = (path: string): string => `  created  ${path}`;

export const skippedLine = (path: string): string =>
  `  skipped  ${path} (already exists)`;

export const removedLine = (path: string): string => `  removed  ${path}`;

export const notInstalledLine = (path: string): string =>
  `  skipped  ${path} (not installed)`;

export const keptLine = (path: string, keptBy: string): string =>
  `  kept     ${path} (still used by ${keptBy})`;

export const categoryList = (
  groups: SkillGroup[],
  installedKeys: string[]
): string => {
  if (groups.length === 0) return 'No specialization categories available.\n';

  const installed = new Set(installedKeys);
  const keyWidth = Math.max(...groups.map((group) => group.key.length));

  const lines = groups.map((group) => {
    const state = installed.has(group.key) ? '[installed]' : '[available]';

    return `  ${group.key.padEnd(keyWidth)}  ${state}  ${group.description}`;
  });

  return `${lines.join('\n')}\n`;
};

export const addSummary = (created: number, skipped: number): string => {
  if (created === 0)
    return skipped === 0
      ? 'No specializations to install.'
      : 'Specializations already installed: nothing to do.';

  return `Specializations installed: ${created} added, ${skipped} already present.`;
};

export const removeSummary = (
  removed: number,
  notInstalled: number,
  kept: number
): string => {
  const keptNote = kept === 0 ? '' : `, ${kept} kept (still used elsewhere)`;

  if (removed === 0)
    return kept > 0
      ? `Specializations removed: 0${keptNote}.`
      : notInstalled === 0
        ? 'No specializations to remove.'
        : 'Specializations not installed: nothing to do.';

  return `Specializations removed: ${removed}${keptNote}.`;
};

export const summaryLine = (
  agentDisplayName: string,
  result: ScaffoldResult
): string => {
  if (result.created.length === 0)
    return `Blue Spec is already initialized for ${agentDisplayName}: nothing to do.`;

  return `Blue Spec initialized for ${agentDisplayName}: ${result.created.length} created, ${result.skipped.length} skipped.`;
};

export const nextSteps = (agentDisplayName: string): string =>
  [
    '',
    'Next steps:',
    `  1. Open ${agentDisplayName} in this project.`,
    '  2. Run /bluespec.charter to set your security rules.',
    '  3. Run /bluespec.detect to map what your project does and where the risks are.',
    '  4. Run /bluespec.plan to turn those findings into a prioritized fix plan.',
    '  5. Run /bluespec.harden to apply the fixes, then /bluespec.verify to prove they hold.',
  ].join('\n');
