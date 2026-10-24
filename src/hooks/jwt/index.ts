import { runHook } from '../../cli/run-hook.js';
import { run } from './cli.js';

/**
 * @example npx lagune jwt                                                                  // scans the whole project
 * @example npx lagune jwt --dir src/auth                                                   // scans a directory
 * @example npx lagune jwt --file src/session.ts                                            // scans a single file
 * @example npx lagune jwt --lang javascript --pattern 'jwt.verify(token, secret)'          // => unpinned
 * @example npx lagune jwt --lang python --pattern 'jwt.decode(t, k, algorithms=["HS256"])' // => safe
 */
await runHook(import.meta.url, (args) => run(args));
