import { runHook } from '../../cli/run-hook.js';
import { run } from './cli.js';

/**
 * @example npx lagune untrack '{"names":["Leaked secret"]}'
 */
await runHook(import.meta.url, (args) => run(args));
