import { runHook } from '../../cli/run-hook.js';
import { run } from './cli.js';

/**
 * @example npx lagune cors                                    // scans for bypassable origin allowlists
 * @example npx lagune cors --dir src                          // scans a directory
 * @example npx lagune cors --file src/cors.ts                 // scans a single file
 * @example npx lagune cors --origin '*'                       // => wildcard
 * @example npx lagune cors --origin 'null'                    // => null
 * @example npx lagune cors --origin 'https://app.example.com' // => safe
 */
await runHook(import.meta.url, (args) => run(args));
