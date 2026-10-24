import type { HookReturn } from '../../types/core.js';
import { cwd } from 'node:process';
import { validate } from './validate.js';

export const run = (args: string[]): Promise<HookReturn> =>
  validate(cwd(), args[0] ?? '');
