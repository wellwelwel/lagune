import { runHook } from '../../cli/run-hook.js';
import { run } from './cli.js';

/**
 * @example node ./.lagune/hooks/jwt.mjs                                                  // scans the whole project
 * @example node ./.lagune/hooks/jwt.mjs -d src/auth                                      // scans a directory
 * @example node ./.lagune/hooks/jwt.mjs -f src/session.ts                                // scans a single file
 * @example node ./.lagune/hooks/jwt.mjs -l javascript -p 'jwt.verify(token, secret)'     // => unpinned
 * @example node ./.lagune/hooks/jwt.mjs -l python -p 'jwt.decode(t, k, algorithms=["HS256"])' // => safe
 */
await runHook(import.meta.url, (args) => run(args));
