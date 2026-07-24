import { runHook } from '../../cli/run-hook.js';
import { run } from './cli.js';

/**
 * @example node ./.lagune/hooks/crypto.mjs                                    // scans the whole project
 * @example node ./.lagune/hooks/crypto.mjs -d src/auth                        // scans a directory
 * @example node ./.lagune/hooks/crypto.mjs -f src/hash.ts                     // scans a single file
 * @example node ./.lagune/hooks/crypto.mjs -l javascript -p 'createHash("md5")' // => review
 * @example node ./.lagune/hooks/crypto.mjs -l python -p 'hashlib.md5(data)'     // => review
 */
await runHook(import.meta.url, (args) => run(args));
