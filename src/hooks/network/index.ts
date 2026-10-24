import { runHook } from '../../cli/run-hook.js';
import { run } from './cli.js';

/**
 * @example npx lagune network --url 'http://0x7f000001/'                 // => private-target
 * @example npx lagune network --url 'http://example.com/'                // => safe
 * @example npx lagune network --url 'http://[::1]/' --url 'http://a.com' // => private-target, safe
 */
await runHook(import.meta.url, (args) => run(args));
