import { cwd } from 'node:process';
import { runHook } from '../../cli/run-hook.js';
import { validate } from './validate.js';

/**
 * @example node ./.lagune/hooks/validate.mjs charter   // validates one memory artifact
 * @example node ./.lagune/hooks/validate.mjs           // validates every memory artifact present
 */
await runHook(import.meta.url, (args) => validate(cwd(), args[0] ?? ''));
