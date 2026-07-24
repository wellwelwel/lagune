import type { HookResult } from '../../types/core.js';
import type { CorsVerdict } from '../../types/hooks/cors.js';
import type { ReportHeadings } from '../../types/scan.js';
import { resolve } from 'node:path';
import { cwd } from 'node:process';
import { parseArgs as parseNodeArgs } from 'node:util';
import { scanReport } from '../../core/scan/driver.js';
import { SOURCE_FILTER } from '../../core/scan/filters.js';
import { formatReport } from '../../core/scan/report.js';
import { check } from './cors.js';
import { analyze } from './scan.js';

const UNSAFE: ReadonlySet<CorsVerdict> = new Set(['wildcard', 'null']);

const OPTIONS = {
  origin: { type: 'string', short: 'o', multiple: true },
  dir: { type: 'string', short: 'd', multiple: true },
  file: { type: 'string', short: 'f', multiple: true },
} as const;

const HEADINGS: ReportHeadings = {
  sentinel: 'no bypassable origin allowlist found\n',
  findings: 'Bypassable origin allowlists found:',
  review:
    'Origin-allowlist patterns with a greedy wildcard (bypassable, review):',
};

const scoreOrigins = (origins: string[]): HookResult => {
  const verdicts = origins.map((origin) => check(origin));

  return {
    output: verdicts.join('\n') + '\n',
    hasFinding: verdicts.some((verdict) => UNSAFE.has(verdict)),
  };
};

const scanSources = async (targets: string[]): Promise<HookResult> => {
  const root = cwd();
  const paths = (targets.length > 0 ? targets : ['.']).map((target) =>
    resolve(root, target)
  );
  const report = await scanReport(root, paths, SOURCE_FILTER, analyze);

  return { output: formatReport(report, HEADINGS), hasFinding: false };
};

export const run = (args: string[]): Promise<HookResult> | HookResult => {
  const { values } = parseNodeArgs({ args, options: OPTIONS, strict: true });
  const origins = values.origin ?? [];
  const targets = [...(values.dir ?? []), ...(values.file ?? [])];

  if (origins.length > 0) {
    if (targets.length > 0)
      throw new Error(
        '-o scores an origin and cannot be combined with -d or -f'
      );

    return scoreOrigins(origins);
  }

  return scanSources(targets);
};
