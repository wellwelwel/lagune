import type { HookResult } from '../../types/core.js';
import type { ReportHeadings } from '../../types/scan.js';
import { cwd } from 'node:process';
import { parseArgs as parseNodeArgs } from 'node:util';
import { formatReport } from '../../core/scan/report.js';
import { resolveTargets } from '../../core/scan/targets.js';
import { scanSecrets } from './scan.js';

const OPTIONS = {
  dir: { type: 'string', short: 'd', multiple: true },
  file: { type: 'string', short: 'f', multiple: true },
} as const;

const HEADINGS: ReportHeadings = {
  sentinel: 'no hardcoded secrets found\n',
  findings: 'Hardcoded secrets found:',
  review: 'Secret handling to review manually:',
  advisory: 'Secret handling advisories:',
};

const runScan = async (targets: string[]): Promise<HookResult> => {
  const root = cwd();
  const report = await scanSecrets(root, await resolveTargets(root, targets));

  return {
    output: formatReport(report, HEADINGS),
    hasFinding: report.findings.length > 0,
  };
};

export const run = async (args: string[]): Promise<HookResult> => {
  const { values } = parseNodeArgs({ args, options: OPTIONS, strict: true });
  const targets = [...(values.dir ?? []), ...(values.file ?? [])];

  return runScan(targets);
};
