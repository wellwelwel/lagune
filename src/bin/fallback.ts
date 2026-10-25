import type { InstalledRoute, ParsedCliArgs } from '../types/core.js';
import { spawn } from 'node:child_process';
import { basename, delimiter, dirname, isAbsolute, join } from 'node:path';
import { env, execPath } from 'node:process';
import { handoffUnavailable } from '../cli/messages.js';
import { realPathOf } from '../core/fs-actions.js';

export const FROZEN_VERSION = '0.15.0';

const FROZEN_ENGINE = ['--yes', '--prefer-offline', `lagune@${FROZEN_VERSION}`];
const SKILLS_ONLY_COMMANDS = new Set(['catalog']);
const CATEGORY_COMMANDS = new Set(['add', 'remove', 'list']);
const NPX_ENTRY = 'npx-cli.js';

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

/** Where npm installs beside Node.js: a link in its bin folder, or a copy next to node.exe on Windows */
const npxLayouts = (runtimeFolder: string): string[] => [
  join(runtimeFolder, 'npx'),
  join(runtimeFolder, 'node_modules', 'npm', 'bin', NPX_ENTRY),
];

/** The npx of the npm installed with the runtime, never one a search path, a shared folder, or the project could plant */
export const npxBeside = async (
  runtime: string
): Promise<string | undefined> => {
  const realRuntime = await realPathOf(runtime);

  if (realRuntime === undefined) return undefined;

  const entries = await Promise.all(
    npxLayouts(dirname(realRuntime)).map(realPathOf)
  );

  return entries.find(
    (entry) => entry !== undefined && basename(entry) === NPX_ENTRY
  );
};

const isPackageBinFolder = (entry: string): boolean =>
  basename(entry) === '.bin' && basename(dirname(entry)) === 'node_modules';

/** The search path the frozen version runs with, led by the runtime and free of relative or package folders */
export const pinnedPath = (
  runtime: string,
  inherited: string | undefined
): string =>
  [
    dirname(runtime),
    ...(inherited ?? '')
      .split(delimiter)
      .filter((entry) => isAbsolute(entry) && !isPackageBinFolder(entry)),
  ].join(delimiter);

const pathKey = (): string =>
  Object.keys(env).find((key) => key.toUpperCase() === 'PATH') ?? 'PATH';

const pinnedEnv = (): NodeJS.ProcessEnv => {
  const key = pathKey();
  const pinned: NodeJS.ProcessEnv = Object.assign(Object.create(null), env);

  pinned[key] = pinnedPath(execPath, env[key]);

  return pinned;
};

/** The npx the hand-off runs, failing before anything runs when the runtime brings none */
export const frozenNpx = async (): Promise<string> => {
  const npx = await npxBeside(execPath);

  if (npx === undefined) throw new Error(handoffUnavailable(FROZEN_VERSION));

  return npx;
};

/** Runs the frozen version with the same arguments, resolving with its exit code */
export const handOff = (npx: string, args: string[]): Promise<number> =>
  new Promise((resolve, reject) => {
    const child = spawn(execPath, [npx, ...FROZEN_ENGINE, ...args], {
      stdio: 'inherit',
      shell: false,
      env: pinnedEnv(),
    });

    child.once('error', reject);
    child.once('close', (code) => resolve(code ?? 1));
  });
