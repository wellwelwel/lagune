import { runHook } from '../../cli/run-hook.js';
import { run } from './cli.js';

/**
 * @example npx lagune crypto                                                 // scans the whole project
 * @example npx lagune crypto --dir src/auth                                  // scans a directory
 * @example npx lagune crypto --file src/hash.ts                              // scans a single file
 * @example npx lagune crypto --lang javascript --pattern 'createHash("md5")' // => review
 * @example npx lagune crypto --lang python --pattern 'hashlib.md5(data)'     // => review
 */
await runHook(import.meta.url, (args) => run(args));
