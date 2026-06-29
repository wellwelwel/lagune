import { runHook } from '../../cli/run-hook.js';
import { run } from './cli.js';

/**
 * @example node ./.bluespec/hooks/regex.mjs                  // scans the whole project
 * @example node ./.bluespec/hooks/regex.mjs -d src/auth      // scans a directory
 * @example node ./.bluespec/hooks/regex.mjs -f src/auth.ts   // scans a single file
 * @example node ./.bluespec/hooks/regex.mjs -p '(a+)+'       // => unsafe
 * @example node ./.bluespec/hooks/regex.mjs -p 'a?a?a?' -l 2 // => unsafe (custom limit)
 */
await runHook(import.meta.url, (args) => run(args));
