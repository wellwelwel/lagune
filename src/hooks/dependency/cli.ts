import type { HookResult } from '../../types/core.js';
import type { ReportHeadings } from '../../types/scan.js';
import { cwd } from 'node:process';
import { parseArgs as parseNodeArgs } from 'node:util';
import { formatReport } from '../../core/scan/report.js';
import { scanDependencies } from './scan.js';

const OPTIONS = {
  dir: { type: 'string', short: 'd', multiple: true },
  file: { type: 'string', short: 'f', multiple: true },
} as const;

const HEADINGS: ReportHeadings = {
  sentinel: 'no dependency risks found\n',
  findings: 'Dependency risks found:',
  review: 'Dependency risks to review manually:',
  advisory: 'Dependency hardening advisories:',
};

export const run = async (args: string[]): Promise<HookResult> => {
  const { values } = parseNodeArgs({ args, options: OPTIONS, strict: true });
  const report = await scanDependencies(cwd(), [
    ...(values.dir ?? []),
    ...(values.file ?? []),
  ]);

  return {
    output: formatReport(report, HEADINGS),
    hasFinding: report.findings.length > 0,
  };
};
