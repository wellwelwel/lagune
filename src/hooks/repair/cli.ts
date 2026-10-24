import type { HookReturn } from '../../types/core.js';
import { cwd } from 'node:process';
import { repair } from './repair.js';

export const run = (args: string[]): Promise<HookReturn> =>
  repair(cwd(), args[0] ?? '');
