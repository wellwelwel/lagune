import type { HookReturn } from '../../types/core.js';
import { cwd } from 'node:process';
import { track } from './track.js';

export const run = (args: string[]): Promise<HookReturn> =>
  track(cwd(), args[0] ?? '');
