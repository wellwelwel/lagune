import type { MessagePort } from 'node:worker_threads';
import type { HookJob } from '../types/core.js';
import type { EngineTool } from '../types/mcp.js';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { parentPort, workerData } from 'node:worker_threads';
import {
  frozenHandoff,
  frozenRefusal,
  toolCommandLine,
  unprefixedCommand,
} from '../cli/messages.js';
import { parseCliArgs } from '../cli/parse-args.js';
import { answerHook, executeHook } from '../cli/run-hook.js';
import { errorMessage } from '../core/errors.js';
import { hasManifest } from '../core/migrate.js';
import {
  commandRefusal,
  runsCommand,
  toolBehind,
  toolFor,
} from '../mcp/tools.js';
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

const prefixedName = (tool: EngineTool, command: string | undefined): string =>
  runsCommand(tool, command) ? `${tool.prefix} ${command}` : tool.prefix;

/** The routing a manifest-based project keeps, where every prefixed command is the skills-based design's alone */
const answerInstalled = async (): Promise<void> => {
  const tool = toolBehind(subcommand);

  if (tool !== undefined) return refuse(prefixedName(tool, subcommandArgs[0]));
  if (isHookName(subcommand)) return refuse(subcommand);

  const parsed = parseCliArgs(args);
  const route = installedRoute(parsed);

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

const runBehind = async (
  tool: EngineTool,
  [command, ...values]: string[]
): Promise<void> => {
  if (!runsCommand(tool, command))
    throw new Error(commandRefusal(tool, command, toolCommandLine));
  if (isHookName(command))
    return executeHook(entry, { name: command, args: values });

  return run(parseCliArgs([command, ...values]), cwd, packageRoot);
};

const refuseUnprefixed = (name: string | undefined): void => {
  if (name !== undefined && toolFor(name) !== undefined)
    throw new Error(unprefixedCommand(name));
};

const answer = async (): Promise<void> => {
  if (subcommand === 'mcp')
    return runMcp(subcommandArgs[0], cwd, packageRoot, entry);
  if (await hasManifest(cwd)) return answerInstalled();

  const tool = toolBehind(subcommand);

  if (tool !== undefined) return runBehind(tool, subcommandArgs);

  refuseUnprefixed(subcommand);

  const parsed = parseCliArgs(args);

  refuseUnprefixed(parsed.command ?? parsed.unknown);

  return run(parsed, cwd, packageRoot);
};

const main = async (): Promise<void> => {
  try {
    await answer();
  } catch (error) {
    process.stderr.write(`${errorMessage(error)}\n`);
    process.exitCode = 1;
  }
};

/** Answers a hook job when this entry runs as a worker */
const serveHook = async (port: MessagePort): Promise<void> => {
  const job: HookJob = workerData;

  port.postMessage(await answerHook(HOOKS[job.name], job.args));
};

if (parentPort === null) await main();
else await serveHook(parentPort);
