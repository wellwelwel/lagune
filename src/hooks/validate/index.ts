import { runHook } from '../../cli/run-hook.js';
import { run } from './cli.js';

/**
 * @example npx lagune validate charter // validates one memory artifact
 * @example npx lagune validate         // validates every memory artifact present
 */
await runHook(import.meta.url, (args) => run(args));
