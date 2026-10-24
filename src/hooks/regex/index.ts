import { runHook } from '../../cli/run-hook.js';
import { run } from './cli.js';

/**
 * @example npx lagune regex                              // scans the whole project
 * @example npx lagune regex --dir src/auth               // scans a directory
 * @example npx lagune regex --file src/auth.ts           // scans a single file
 * @example npx lagune regex --pattern '^(a+)+$'          // => unsafe
 * @example npx lagune regex --pattern 'a?a?a?' --limit 2 // => unsafe (custom limit)
 */
await runHook(import.meta.url, (args) => run(args));
