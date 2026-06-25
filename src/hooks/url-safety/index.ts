import { runHook } from '../../cli/run-hook.js';
import { check } from './url-safety.js';

/**
 * @example node ./.bluespec/hooks/url-safety.mjs 'http://0x7f000001/'   // => private-target
 * @example node ./.bluespec/hooks/url-safety.mjs 'http://example.com/'  // => safe
 */
await runHook(import.meta.url, (args) => {
  if (args[0] === undefined)
    throw new Error(
      'url-safety hook needs a url or host as its first argument'
    );

  return `${check(args[0])}\n`;
});
