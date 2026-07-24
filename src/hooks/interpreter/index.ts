import { runHook } from '../../cli/run-hook.js';
import { run } from './cli.js';

/**
 * @example node ./.lagune/hooks/interpreter.mjs                              // scans the whole project
 * @example node ./.lagune/hooks/interpreter.mjs -d src                       // scans a directory
 * @example node ./.lagune/hooks/interpreter.mjs -f src/app.js                // scans a single file
 * @example node ./.lagune/hooks/interpreter.mjs -l javascript -p 'eval(x)'   // => careful
 * @example node ./.lagune/hooks/interpreter.mjs -l python -p 'json.loads(x)' // => safe
 */
await runHook(import.meta.url, (args) => run(args));
