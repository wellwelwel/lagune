import type { ListTarget, ParsedCliArgs } from '../types/core.js';
import { stdout } from 'node:process';
import { banner, findingsReport, listUsage } from '../cli/messages.js';
import { isInteractive, promptForListTarget } from '../cli/prompt.js';
import { loadTrackingMap } from '../core/tracking.js';
import { categoriesReport } from './categories.js';

const TARGETS: ListTarget[] = ['findings', 'categories'];

const REQUESTED: Record<ListTarget, (args: ParsedCliArgs) => boolean> = {
  findings: (args) => args.findingsRequested,
  categories: (args) => args.categoriesRequested,
};

const chosenTargets = async (args: ParsedCliArgs): Promise<ListTarget[]> => {
  const requested = TARGETS.filter((target) => REQUESTED[target](args));

  if (requested.length > 0) return requested;
  if (!isInteractive()) throw new Error(listUsage());

  const chosen = await promptForListTarget();

  return chosen === undefined ? [] : [chosen];
};

const findingsBody = async (cwd: string): Promise<string> => {
  const map = await loadTrackingMap(cwd);

  return findingsReport(map.entries.map((entry) => entry.name));
};

const REPORTS: Record<ListTarget, (cwd: string) => Promise<string>> = {
  findings: findingsBody,
  categories: categoriesReport,
};

export const runList = async (
  args: ParsedCliArgs,
  cwd: string
): Promise<void> => {
  const targets = await chosenTargets(args);

  if (targets.length === 0) return;

  const bodies = await Promise.all(
    targets.map((target) => REPORTS[target](cwd))
  );

  stdout.write(`${[banner(), '', bodies.join('\n\n')].join('\n')}\n`);
};
