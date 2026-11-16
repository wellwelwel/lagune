import type { HookResult } from '../../types/core.js';
import type { ReportHeadings } from '../../types/scan.js';
import { cwd } from 'node:process';
import { parseArgs as parseNodeArgs } from 'node:util';
import { formatReport } from '../../core/scan/report.js';
import { resolveTargets } from '../../core/scan/targets.js';
import { formatHistory } from './history-report.js';
import { HISTORY_LIMITS, scanHistory } from './history.js';
import { scanSecrets } from './scan.js';

const OPTIONS = {
  dir: { type: 'string', short: 'd', multiple: true },
  file: { type: 'string', short: 'f', multiple: true },
  history: { type: 'boolean' },
  before: { type: 'string' },
} as const;

const COMMIT_ID = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/;

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

/** Rotating a credential, never a change to the code, settles a secret only the history holds */
const runHistory = async (before: string | null): Promise<HookResult> => ({
  output: formatHistory(await scanHistory(cwd(), HISTORY_LIMITS, before)),
  hasFinding: false,
});

const continuedFrom = (before: string | undefined): string | null => {
  if (before === undefined) return null;
  if (!COMMIT_ID.test(before))
    throw new Error(
      '--before takes the whole id of the commit a stopped history scan named, 40 or 64 lowercase hexadecimal characters'
    );

  return before;
};

export const run = async (args: string[]): Promise<HookResult> => {
  const { values } = parseNodeArgs({ args, options: OPTIONS, strict: true });
  const targets = [...(values.dir ?? []), ...(values.file ?? [])];
  const scansHistory = values.history === true;

  if (!scansHistory && values.before !== undefined)
    throw new Error(
      '--before continues a history scan from the commit it stopped at: run it with --history'
    );
  if (!scansHistory) return runScan(targets);
  if (targets.length > 0)
    throw new Error(
      '--history scans the whole Git history and takes no --dir or --file: run it on its own'
    );

  return runHistory(continuedFrom(values.before));
};
