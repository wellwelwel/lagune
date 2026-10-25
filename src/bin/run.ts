import type { CategoryAction } from '../types/catalog.js';
import type { CliCommand, ParsedCliArgs } from '../types/core.js';
import { stdout } from 'node:process';
import {
  categoriesUsage,
  helpText,
  movedToSkills,
  unknownCommand,
} from '../cli/messages.js';
import { isInteractive } from '../cli/prompt.js';
import { loadVersion } from '../core/version.js';
import { runCatalog } from './catalog.js';
import { runCategoryChange } from './categories.js';
import { runDashboard } from './dashboard.js';
import { HOOKS } from './hooks.js';
import { runList } from './list.js';
import { runMigrate } from './migrate.js';

const print = (line: string): void => {
  stdout.write(`${line}\n`);
};

const printHelp = (version: string): void =>
  print(helpText(Object.keys(HOOKS), version));

const changeCategories =
  (action: CategoryAction) =>
  (
    args: ParsedCliArgs,
    cwd: string,
    _packageRoot: URL,
    version: string
  ): Promise<void> => {
    if (!args.categoriesRequested)
      throw new Error(categoriesUsage(action, version));

    return runCategoryChange(action, args.values, cwd, version);
  };

const moved = (command: string) => async (): Promise<void> => {
  throw new Error(movedToSkills(command));
};

const COMMANDS: Record<
  CliCommand,
  (
    args: ParsedCliArgs,
    cwd: string,
    packageRoot: URL,
    version: string
  ) => Promise<void>
> = {
  catalog: (args, cwd, packageRoot, version) =>
    runCatalog(args.values, cwd, packageRoot, version),
  add: changeCategories('add'),
  remove: changeCategories('remove'),
  list: (args, cwd, _packageRoot, version) => runList(args, cwd, version),
  dashboard: (args, cwd, packageRoot) =>
    runDashboard(cwd, packageRoot, args.port),
  migrate: (_args, cwd) => runMigrate(cwd),
  init: moved('init'),
  pull: moved('pull'),
  update: moved('update'),
};

export const run = async (
  args: ParsedCliArgs,
  cwd: string,
  packageRoot: URL
): Promise<void> => {
  const version = await loadVersion(packageRoot);

  if (args.version) return print(version);
  if (args.help) return printHelp(version);
  if (args.unknown !== undefined)
    throw new Error(unknownCommand(args.unknown, version));
  if (args.command !== undefined)
    return COMMANDS[args.command](args, cwd, packageRoot, version);
  if (args.bare && isInteractive())
    return runDashboard(cwd, packageRoot, args.port);

  printHelp(version);
};
