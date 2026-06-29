import type { RegexRequest } from '../../types/hooks/regex.js';
import { resolve } from 'node:path';
import { cwd } from 'node:process';
import { parseArgs as parseNodeArgs } from 'node:util';
import { format } from './format.js';
import { check, parseLimit } from './regex.js';
import { scan } from './scan.js';

const OPTIONS = {
  pattern: { type: 'string', short: 'p', multiple: true },
  limit: { type: 'string', short: 'l' },
  dir: { type: 'string', short: 'd', multiple: true },
  file: { type: 'string', short: 'f', multiple: true },
} as const;

/** Reads the flags into a check or scan request, rejecting conflicting modes */
export const parseArgs = (args: string[]): RegexRequest => {
  const { values } = parseNodeArgs({ args, options: OPTIONS, strict: true });
  const patterns = values.pattern ?? [];
  const targets = [...(values.dir ?? []), ...(values.file ?? [])];
  const repetitionLimit = parseLimit(values.limit);

  if (patterns.length > 0) {
    if (targets.length > 0)
      throw new Error(
        '-p checks a pattern and cannot be combined with -d or -f'
      );

    return { mode: 'check', patterns, repetitionLimit };
  }

  return { mode: 'scan', targets, repetitionLimit };
};

const runCheck = (
  patterns: string[],
  repetitionLimit: number | undefined
): string =>
  patterns.map((pattern) => check(pattern, { repetitionLimit })).join('\n') +
  '\n';

const runScan = async (
  targets: string[],
  repetitionLimit: number | undefined
): Promise<string> => {
  const root = cwd();
  const paths = (targets.length > 0 ? targets : ['.']).map((target) =>
    resolve(root, target)
  );

  return format(await scan(root, paths, repetitionLimit));
};

/** Dispatches the parsed request to the per-pattern check or the workspace scan */
export const run = async (args: string[]): Promise<string> => {
  const request = parseArgs(args);

  if (request.mode === 'check')
    return runCheck(request.patterns, request.repetitionLimit);

  return runScan(request.targets, request.repetitionLimit);
};
