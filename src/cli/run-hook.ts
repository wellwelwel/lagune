import type {
  HookHandler,
  HookJob,
  HookOutcome,
  HookReturn,
} from '../types/core.js';
import process, { stderr, stdout } from 'node:process';
import { Worker } from 'node:worker_threads';
import { errorMessage } from '../core/errors.js';
import { hookStalled, hookStopped } from './messages.js';

const HOOK_DEADLINE_SECONDS = 45;

const answered = (result: HookReturn): HookOutcome =>
  typeof result === 'string'
    ? { kind: 'answered', output: result, hasFinding: false }
    : {
        kind: 'answered',
        output: result.output,
        hasFinding: result.hasFinding,
      };

/** Turns a handler's result or error into an outcome */
export const answerHook = async (
  handler: HookHandler,
  args: string[]
): Promise<HookOutcome> => {
  try {
    return answered(await handler(args));
  } catch (error) {
    return { kind: 'failed', message: errorMessage(error) };
  }
};

/** Runs a hook in a worker, terminated at the deadline whatever its input */
export const runHook = (
  entry: string,
  job: HookJob,
  deadlineMs = HOOK_DEADLINE_SECONDS * 1000
): Promise<HookOutcome> =>
  new Promise((resolve) => {
    const worker = new Worker(entry, { workerData: job });

    const settle = (outcome: HookOutcome): void => {
      clearTimeout(deadline);
      resolve(outcome);
      worker.terminate();
    };

    const deadline = setTimeout(() => settle({ kind: 'stalled' }), deadlineMs);

    worker.once('message', settle);
    worker.once('error', (error) =>
      settle({ kind: 'failed', message: errorMessage(error) })
    );
    worker.once('exit', () => settle({ kind: 'stopped' }));
  });

const fail = (message: string): void => {
  stderr.write(`${message}\n`);
  process.exitCode = 1;
};

/** Prints the hook's answer, failing on an error, a finding, or no answer */
export const executeHook = async (
  entry: string,
  job: HookJob
): Promise<void> => {
  const outcome = await runHook(entry, job);

  if (outcome.kind === 'stalled')
    return fail(hookStalled(job.name, HOOK_DEADLINE_SECONDS));
  if (outcome.kind === 'stopped') return fail(hookStopped(job.name));
  if (outcome.kind === 'failed') return fail(outcome.message);

  stdout.write(outcome.output);
  if (outcome.hasFinding) process.exitCode = 1;
};
