import { runHook } from '../../cli/run-hook.js';
import { run } from './cli.js';

/**
 * @example node ./.bluespec/hooks/network.mjs -u 'http://0x7f000001/'              // => private-target
 * @example node ./.bluespec/hooks/network.mjs -u 'http://example.com/'             // => safe
 * @example node ./.bluespec/hooks/network.mjs -u 'http://[::1]/' -u 'http://a.com' // => private-target, safe
 */
await runHook(import.meta.url, (args) => run(args));
