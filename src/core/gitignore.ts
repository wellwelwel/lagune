import type { GitignoreChange } from '../types/core.js';
import { join } from 'node:path';
import { removeFileIfPresent, writeFileOverwrite } from './fs-actions.js';
import { readText } from './markdown/read.js';

const SECTION_HEADER = '# Lagune';

const LAGUNE_ENTRIES = [
  '/.lagune/templates/',
  '/.lagune/hooks/',
  '/.lagune/proofs/',
  '/.lagune/specializations.md',
  '/.lagune/skills/*',
  '/**/lagune.*',
  '/**/lagune/',
];

const KEPT_SPECIALIZATION_PREFIX = '!/.lagune/skills/';

const isLaguneLine = (line: string): boolean =>
  line === SECTION_HEADER ||
  LAGUNE_ENTRIES.includes(line) ||
  line.startsWith(KEPT_SPECIALIZATION_PREFIX);

const tidy = (lines: string[]): string =>
  lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

/** Removes the block the Lagune CLI wrote, deleting the file when nothing else remains */
export const removeLaguneBlock = async (
  cwd: string
): Promise<GitignoreChange> => {
  const path = join(cwd, '.gitignore');
  const existing = await readText(path);

  if (existing === null) return 'unchanged';

  const lines = existing.split('\n');

  if (!lines.some((line) => isLaguneLine(line.trimEnd()))) return 'unchanged';

  const kept = tidy(lines.filter((line) => !isLaguneLine(line.trimEnd())));

  if (kept === '') {
    await removeFileIfPresent(path);

    return 'removed';
  }

  await writeFileOverwrite(path, `${kept}\n`);

  return 'updated';
};
