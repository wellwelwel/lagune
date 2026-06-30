import type { HookResult } from '../../types/core.js';
import type {
  NetworkRequest,
  NetworkVerdict,
} from '../../types/hooks/network.js';
import { parseArgs as parseNodeArgs } from 'node:util';
import { check } from './network.js';

const UNSAFE: ReadonlySet<NetworkVerdict> = new Set([
  'private-target',
  'parser-divergent',
]);

const OPTIONS = {
  url: { type: 'string', short: 'u', multiple: true },
} as const;

/** Reads the flags into a request, requiring at least one destination */
export const parseArgs = (args: string[]): NetworkRequest => {
  const { values } = parseNodeArgs({ args, options: OPTIONS, strict: true });
  const urls = values.url ?? [];

  if (urls.length === 0)
    throw new Error('the network hook needs at least one -u <url-or-host>');

  return { urls };
};

/** Scores each destination, one verdict per line, flagging unsafe targets */
export const run = (args: string[]): HookResult => {
  const { urls } = parseArgs(args);
  const verdicts = urls.map((url) => check(url));

  return {
    output: verdicts.join('\n') + '\n',
    hasFinding: verdicts.some((verdict) => UNSAFE.has(verdict)),
  };
};
