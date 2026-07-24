import { runHook } from '../../cli/run-hook.js';
import { run } from './cli.js';

/**
 * @example node ./.lagune/hooks/cors.mjs                              // scans for bypassable origin allowlists
 * @example node ./.lagune/hooks/cors.mjs -d src                       // scans a directory
 * @example node ./.lagune/hooks/cors.mjs -f src/cors.ts               // scans a single file
 * @example node ./.lagune/hooks/cors.mjs -o '*'                       // => wildcard
 * @example node ./.lagune/hooks/cors.mjs -o 'null'                    // => null
 * @example node ./.lagune/hooks/cors.mjs -o 'https://app.example.com' // => safe
 */
await runHook(import.meta.url, (args) => run(args));
