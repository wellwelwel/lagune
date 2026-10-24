import { runHook } from '../../cli/run-hook.js';
import { run } from './cli.js';

/**
 * @example npx lagune secrets                      // scans the whole project
 * @example npx lagune secrets --dir src            // scans a directory
 * @example npx lagune secrets --file src/config.ts // scans a single file
 */
await runHook(import.meta.url, (args) => run(args));
