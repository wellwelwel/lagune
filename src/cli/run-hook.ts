import type { HookHandler, HookReturn } from '../types/core.js';
import process, { argv, stderr, stdout } from 'node:process';
import { pathToFileURL } from 'node:url';

const normalize = (result: HookReturn): { output: string; finding: boolean } =>
  typeof result === 'string'
    ? { output: result, finding: false }
    : { output: result.output, finding: result.hasFinding };

/** Runs the handler only when the module is the executed entry, printing its result */
export const runHook = async (
  moduleUrl: string,
  handler: HookHandler
): Promise<void> => {
  if (moduleUrl !== pathToFileURL(argv[1]).href) return;

  try {
    const { output, finding } = normalize(await handler(argv.slice(2)));

    stdout.write(output);
    if (finding) process.exitCode = 1;
  } catch (error) {
    stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
};
