import type {
  CliCommand,
  ConfigsAction,
  ParsedCliArgs,
} from '../types/core.js';
import { stdout } from 'node:process';
import {
  changeUsage,
  helpText,
  movedToSkills,
  unknownCommand,
} from '../cli/messages.js';
import { isInteractive } from '../cli/prompt.js';
import { loadVersion } from '../core/version.js';
import { ENGINE_TOOLS } from '../mcp/tools.js';
import { runCatalog } from './catalog.js';
import { runCategoryChange } from './categories.js';
import { runDashboard } from './dashboard.js';
import { runIgnoreChange } from './ignore.js';
import { runList } from './list.js';
import { runMigrate } from './migrate.js';

const print = (line: string): void => {
  stdout.write(`${line}\n`);
};

const printHelp = (): void => print(helpText(ENGINE_TOOLS));

const changeConfigs =
  (action: ConfigsAction) =>
  (args: ParsedCliArgs, cwd: string): Promise<void> => {
    if (args.ignoreRequested && !args.categoriesRequested)
      return runIgnoreChange(action, args.values, args.checker, cwd);
    if (
      args.categoriesRequested &&
      !args.ignoreRequested &&
      args.checker === undefined
    )
      return runCategoryChange(action, args.values, cwd);

    throw new Error(changeUsage(action));
  };

const moved = (command: string) => async (): Promise<void> => {
  throw new Error(movedToSkills(command));
};

const COMMANDS: Record<
  CliCommand,
  (args: ParsedCliArgs, cwd: string, packageRoot: URL) => Promise<void>
> = {
  catalog: (args, cwd, packageRoot) =>
    runCatalog(args.values, cwd, packageRoot),
  add: changeConfigs('add'),
  remove: changeConfigs('remove'),
  list: (args, cwd) => runList(args, cwd),
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
  if (args.version) return print(await loadVersion(packageRoot));
  if (args.help) return printHelp();
  if (args.unknown !== undefined) throw new Error(unknownCommand(args.unknown));
  if (args.command !== undefined)
    return COMMANDS[args.command](args, cwd, packageRoot);
  if (args.bare && isInteractive())
    return runDashboard(cwd, packageRoot, args.port);

  printHelp();
};
