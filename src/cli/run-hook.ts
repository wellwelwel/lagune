import type { HookHandler, HookReturn } from '../types/core.js';
import process, { argv, stderr, stdout } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { realPathOf } from '../core/fs-actions.js';

const normalize = (result: HookReturn): { output: string; finding: boolean } =>
  typeof result === 'string'
    ? { output: result, finding: false }
    : { output: result.output, finding: result.hasFinding };

const isExecutedEntry = async (moduleUrl: string): Promise<boolean> => {
  const entry = argv[1];

  if (entry === undefined) return false;
  if (pathToFileURL(entry).href === moduleUrl) return true;

  const [executed, module] = await Promise.all([
    realPathOf(entry),
    realPathOf(fileURLToPath(moduleUrl)),
  ]);

  return executed !== undefined && executed === module;
};

/** Runs the handler over the arguments, printing its result and failing on an error or a finding */
export const executeHook = async (
  handler: HookHandler,
  args: string[]
): Promise<void> => {
  try {
    const { output, finding } = normalize(await handler(args));

    stdout.write(output);
    if (finding) process.exitCode = 1;
  } catch (error) {
    stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
};

/** Runs the handler only when the module is the executed entry, however the path reached it */
export const runHook = async (
  moduleUrl: string,
  handler: HookHandler
): Promise<void> => {
  if (!(await isExecutedEntry(moduleUrl))) return;

  await executeHook(handler, argv.slice(2));
};
