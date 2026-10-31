import type { HookResult } from '../../types/core.js';
import type { RegexRequest } from '../../types/hooks/regex.js';
import { cwd } from 'node:process';
import { parseArgs as parseNodeArgs } from 'node:util';
import { resolveTargets } from '../../core/scan/targets.js';
import { format } from './format.js';
import { check } from './regex.js';
import { scan } from './scan.js';

const OPTIONS = {
  pattern: { type: 'string', short: 'p', multiple: true },
  flags: { type: 'string' },
  limit: { type: 'string', short: 'l' },
  dir: { type: 'string', short: 'd', multiple: true },
  file: { type: 'string', short: 'f', multiple: true },
} as const;

const parseLimit = (raw: string | undefined): number | undefined => {
  if (raw === undefined) return undefined;

  if (!/^\d+$/.test(raw))
    throw new Error(
      `repetition limit must be a non-negative integer, got "${raw}"`
    );

  return Number(raw);
};

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

    return {
      mode: 'check',
      patterns,
      flags: values.flags ?? '',
      repetitionLimit,
    };
  }

  if (values.flags !== undefined)
    throw new Error(
      '--flags applies to -p patterns, a scan reads each literal with its own flags'
    );

  return { mode: 'scan', targets, repetitionLimit };
};

const runCheck = (
  patterns: string[],
  flags: string,
  repetitionLimit: number | undefined
): HookResult => {
  const verdicts = patterns.map((pattern) =>
    check(pattern, { repetitionLimit, flags })
  );

  return {
    output: verdicts.join('\n') + '\n',
    hasFinding: verdicts.includes('unsafe'),
  };
};

const runScan = async (
  targets: string[],
  repetitionLimit: number | undefined
): Promise<HookResult> => {
  const root = cwd();
  const paths = await resolveTargets(root, targets);
  const result = await scan(root, paths, repetitionLimit);

  return { output: format(result), hasFinding: result.unsafe.length > 0 };
};

/** Dispatches the parsed request to the per-pattern check or the workspace scan */
export const run = async (args: string[]): Promise<HookResult> => {
  const request = parseArgs(args);

  if (request.mode === 'check')
    return runCheck(request.patterns, request.flags, request.repetitionLimit);

  return runScan(request.targets, request.repetitionLimit);
};
