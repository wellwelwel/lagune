import { runHook } from '../../cli/run-hook.js';
import { run } from './cli.js';

/**
 * @example npx lagune interpreter                                         // scans the whole project
 * @example npx lagune interpreter --dir src                               // scans a directory
 * @example npx lagune interpreter --file src/app.js                       // scans a single file
 * @example npx lagune interpreter --lang javascript --pattern 'eval(x)'   // => careful
 * @example npx lagune interpreter --lang python --pattern 'json.loads(x)' // => safe
 */
await runHook(import.meta.url, (args) => run(args));
