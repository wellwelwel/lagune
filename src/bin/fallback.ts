import type { InstalledRoute, ParsedCliArgs } from '../types/core.js';
import { spawn } from 'node:child_process';
import { platform } from 'node:process';
import { handoffRefused } from '../cli/messages.js';

export const FROZEN_VERSION = '0.15.0';

const FROZEN_ENGINE = ['--yes', '--prefer-offline', `lagune@${FROZEN_VERSION}`];
const SKILLS_ONLY_COMMANDS = new Set(['catalog']);
const CATEGORY_COMMANDS = new Set(['add', 'remove', 'list']);
const SHELL_INERT_ARGUMENT = /^[\w./:@=-]+$/;

/** Who answers a project the Lagune CLI installed: this design, the frozen version, or no one */
export const installedRoute = (args: ParsedCliArgs): InstalledRoute => {
  if (args.command === 'migrate' || args.unknown !== undefined) return 'local';
  if (args.command !== undefined && SKILLS_ONLY_COMMANDS.has(args.command))
    return 'refused';
  if (
    args.categoriesRequested &&
    args.command !== undefined &&
    CATEGORY_COMMANDS.has(args.command)
  )
    return 'refused';

  return 'frozen';
};

const windowsCommand = (args: string[]): string => {
  if (!args.every((arg) => SHELL_INERT_ARGUMENT.test(arg)))
    throw new Error(handoffRefused(FROZEN_VERSION));

  return ['npx', ...FROZEN_ENGINE, ...args].join(' ');
};

/** Runs the frozen version with the same arguments, resolving with its exit code */
export const handOff = (args: string[]): Promise<number> =>
  new Promise((resolve, reject) => {
    const child =
      platform === 'win32'
        ? spawn(windowsCommand(args), { stdio: 'inherit', shell: true })
        : spawn('npx', [...FROZEN_ENGINE, ...args], { stdio: 'inherit' });

    child.once('error', reject);
    child.once('close', (code) => resolve(code ?? 1));
  });
