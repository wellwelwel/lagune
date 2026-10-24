import type { HookReturn } from '../../types/core.js';
import { cwd } from 'node:process';
import { untrack } from './untrack.js';

export const run = (args: string[]): Promise<HookReturn> =>
  untrack(cwd(), args[0] ?? '', new Date());
