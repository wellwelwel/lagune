import type { HookHandler, HookReturn } from '../types/core.js';
import process, { stderr, stdout } from 'node:process';

const normalize = (result: HookReturn): { output: string; finding: boolean } =>
  typeof result === 'string'
    ? { output: result, finding: false }
    : { output: result.output, finding: result.hasFinding };

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
