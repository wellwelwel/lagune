import { runHook } from '../../cli/run-hook.js';
import { run } from './cli.js';

/**
 * @example npx lagune repair '{"entries":[{"name":"Leaked secret","paths":["src/config.ts"]}]}'
 */
await runHook(import.meta.url, (args) => run(args));
