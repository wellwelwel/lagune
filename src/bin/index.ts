import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { frozenHandoff, frozenRefusal } from '../cli/messages.js';
import { parseCliArgs } from '../cli/parse-args.js';
import { executeHook } from '../cli/run-hook.js';
import { hasManifest } from '../core/migrate.js';
import {
  FROZEN_VERSION,
  frozenNpx,
  handOff,
  installedRoute,
} from './fallback.js';
import { HOOKS, isHookName } from './hooks.js';
import { runMcp } from './mcp.js';
import { run } from './run.js';

const entry = fileURLToPath(import.meta.url);
const packageRoot = new URL('../../', import.meta.url);
const cwd = process.cwd();
const args = process.argv.slice(2);
const [subcommand, ...subcommandArgs] = args;

const refuse = (command: string): void => {
  process.stderr.write(`${frozenRefusal(command)}\n`);
  process.exitCode = 1;
};

const answer = async (): Promise<void> => {
  if (subcommand === 'mcp')
    return runMcp(subcommandArgs[0], cwd, packageRoot, entry);

  const installed = await hasManifest(cwd);

  if (isHookName(subcommand)) {
    if (installed) return refuse(subcommand);

    return executeHook(HOOKS[subcommand], subcommandArgs);
  }

  const parsed = parseCliArgs(args);
  const route = installed ? installedRoute(parsed) : 'local';

  if (route === 'refused')
    return refuse(
      parsed.categoriesRequested
        ? `${parsed.command} --categories`
        : (parsed.command ?? '')
    );
  if (route === 'local') return run(parsed, cwd, packageRoot);

  const npx = await frozenNpx();

  process.stderr.write(`${frozenHandoff(FROZEN_VERSION)}\n`);
  process.exitCode = await handOff(npx, args);
};

try {
  await answer();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);

  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
