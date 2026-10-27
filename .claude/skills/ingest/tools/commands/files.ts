import type { Command } from '../types.ts';
import { displayPath, formatCount, omitted, tokens } from '../format.ts';
import { selectedEntries } from '../selection.ts';
import { sumStats } from '../stats.ts';

const DEFAULT_LIMIT = 200;

export const files: Command = async (digests, options) => {
  const rows = digests.flatMap((digest) =>
    selectedEntries(digest, options).map((entry) => ({ digest, entry }))
  );
  const sorted =
    options.sort === 'size'
      ? [...rows].sort(
          (left, right) => right.entry.characters - left.entry.characters
        )
      : rows;
  const limit = options.limit ?? DEFAULT_LIMIT;
  const total = sumStats(rows.map(({ entry }) => entry));

  return [
    `${formatCount(total.files)} files, ${tokens(total.characters)}`,
    ...sorted
      .slice(0, limit)
      .map(
        ({ digest, entry }) =>
          `  ${displayPath(digests, digest, entry.path)}  ${formatCount(entry.lines.length)} lines, ${tokens(entry.characters)}`
      ),
    ...omitted(
      sorted.length - limit,
      ', narrow with --under, --ext, or --name'
    ),
  ];
};
