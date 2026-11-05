import type { CheckerName } from '../types/checkers.js';
import type { ConfigsAction } from '../types/core.js';
import { stdout } from 'node:process';
import {
  banner,
  ignorePatternProblem,
  ignoreRecorded,
  ignoreUsage,
  tooManyIgnored,
  unknownChecker,
} from '../cli/messages.js';
import {
  CHECKERS,
  checkersRecord,
  checkersWithOwnList,
  ignoreListOf,
  isCheckerName,
  MAX_IGNORE_ENTRIES,
  readIgnorePattern,
  withIgnoreList,
} from '../core/checker-rules.js';
import { checkersConfigOf } from '../core/checkers.js';
import { changeList } from '../core/collections.js';
import { readConfigs, recordConfigs } from '../core/configs.js';

const checkerNamed = (name: string | undefined): CheckerName | undefined => {
  if (name === undefined || isCheckerName(name)) return name;

  throw new Error(unknownChecker(name, CHECKERS));
};

const projectPatterns = (
  action: ConfigsAction,
  requested: readonly string[]
): string[] => {
  if (requested.length === 0) throw new Error(ignoreUsage(action));

  return requested.map((entry) => {
    const read = readIgnorePattern(entry);

    if ('problem' in read)
      throw new Error(ignorePatternProblem(entry, read.problem));

    return read.pattern;
  });
};

/** Records the paths and patterns every checker, or one checker, leaves out of its scans, a checker's first own list starting from the shared one */
export const runIgnoreChange = async (
  action: ConfigsAction,
  requested: readonly string[],
  checkerName: string | undefined,
  cwd: string
): Promise<void> => {
  const checker = checkerNamed(checkerName);
  const patterns = projectPatterns(action, requested);
  const config = checkersConfigOf(await readConfigs(cwd));
  const change = changeList(action, ignoreListOf(config, checker), patterns);

  if (change.values.length > MAX_IGNORE_ENTRIES)
    throw new Error(tooManyIgnored(MAX_IGNORE_ENTRIES));

  const updated = withIgnoreList(config, checker, change.values);
  const report = ignoreRecorded(
    action,
    change,
    checker,
    checkersWithOwnList(updated)
  );

  await recordConfigs(cwd, { checkers: checkersRecord(updated) });

  stdout.write(`${banner()}\n\n${report}\n`);
};
