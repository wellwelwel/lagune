import type { Command, Digest, Options } from '../types.ts';
import { posix } from 'node:path';
import { formatCount, omitted, tokens } from '../format.ts';
import { scopeFor, selectedEntries } from '../selection.ts';
import { groupBy, sumStats } from '../stats.ts';

const DEFAULT_LIMIT = 200;

const ancestorsOf = (path: string): string[] => {
  const parts = path.split('/').slice(0, -1);

  return parts.map((_, index) => parts.slice(0, index + 1).join('/'));
};

const treeOf = (digest: Digest, options: Options): string[] => {
  const entries = selectedEntries(digest, options);
  const filesByDirectory = groupBy(entries, (entry) =>
    posix.dirname(entry.path)
  );
  const directories = groupBy(
    entries.flatMap((entry) =>
      ancestorsOf(entry.path).map((directory) => ({ directory, entry }))
    ),
    ({ directory }) => directory
  );

  const childrenOf = (parent: string): string[] =>
    [...directories.keys()]
      .filter((directory) => posix.dirname(directory) === parent)
      .sort();

  const render = (parent: string, level: number): string[] => {
    const indent = '  '.repeat(level + 1);
    const nested = childrenOf(parent).flatMap((directory) => {
      const stats = sumStats(
        (directories.get(directory) ?? []).map(({ entry }) => entry)
      );
      const line = `${indent}${posix.basename(directory)}/  ${formatCount(stats.files)} files, ${tokens(stats.characters)}`;

      return level + 1 < options.depth
        ? [line, ...render(directory, level + 1)]
        : [line];
    });
    const files = (filesByDirectory.get(parent) ?? []).map(
      (entry) =>
        `${indent}${posix.basename(entry.path)}  ${tokens(entry.characters)}`
    );

    return [...nested, ...files];
  };

  const starts = scopeFor(digest, options.scope).under;

  return (starts.length > 0 ? starts : ['']).flatMap((start) =>
    start === ''
      ? [`${digest.root}/`, ...render('.', 0)]
      : [`${digest.root}/${start}/`, ...render(start, 0)]
  );
};

export const tree: Command = async (digests, options) => {
  const lines = digests.flatMap((digest) => treeOf(digest, options));
  const limit = options.limit ?? DEFAULT_LIMIT;

  return [
    ...lines.slice(0, limit),
    ...omitted(lines.length - limit, ', narrow with --under or lower --depth'),
  ];
};
