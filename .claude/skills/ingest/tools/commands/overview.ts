import type { Command, Digest, Entry, Stats } from '../types.ts';
import { posix } from 'node:path';
import { formatCount, omitted, tokens } from '../format.ts';
import { hasHidden } from '../hidden.ts';
import { extensionOf } from '../paths.ts';
import { groupBy, sumStats } from '../stats.ts';

const LANDMARKS = new Set([
  'agents.md',
  'architecture.md',
  'cargo.toml',
  'claude.md',
  'contributing.md',
  'docker-compose.yml',
  'dockerfile',
  'go.mod',
  'makefile',
  'package.json',
  'pyproject.toml',
  'readme.md',
]);

const TOP_ENTRIES = 12;

const groupStats = (
  entries: Entry[],
  keyOf: (entry: Entry) => string
): [string, Stats][] => {
  const groups = groupBy(entries, keyOf);

  return [...groups.entries()]
    .map(([key, group]): [string, Stats] => [key, sumStats(group)])
    .sort(([, left], [, right]) => right.characters - left.characters);
};

const topLevelOf = (entry: Entry): string => {
  const slash = entry.path.indexOf('/');

  return slash < 0 ? '(root files)' : `${entry.path.slice(0, slash)}/`;
};

const statsLine = (name: string, stats: Stats): string =>
  `  ${name}  ${formatCount(stats.files)} files, ${tokens(stats.characters)}`;

const overviewOf = (digest: Digest): string[] => {
  const text = digest.entries.filter((entry) => entry.kind === 'text');
  const content = text.filter((entry) => !entry.noise);
  const noise = text.filter((entry) => entry.noise);
  const hidden = text.filter(hasHidden);
  const countOf = (kind: Entry['kind']): number =>
    digest.entries.filter((entry) => entry.kind === kind).length;
  const landmarks = content.filter(
    (entry) =>
      entry.path.split('/').length <= 3 &&
      LANDMARKS.has(posix.basename(entry.path).toLowerCase())
  );
  const largest = [...content]
    .sort((left, right) => right.characters - left.characters)
    .slice(0, TOP_ENTRIES);
  const total = sumStats(content);
  const noiseTotal = sumStats(noise);

  return [
    `${digest.root}  (${digest.file})`,
    `  ${formatCount(digest.bytes)} bytes, ${formatCount(digest.entries.length)} entries: ${formatCount(text.length)} text, ${formatCount(countOf('binary'))} binary, ${formatCount(countOf('empty'))} empty, ${formatCount(countOf('symlink'))} symlinks`,
    `  content: ${formatCount(total.files)} files, ${tokens(total.characters)}`,
    `  noise: ${formatCount(noiseTotal.files)} files, ${tokens(noiseTotal.characters)} (left out unless --noise)`,
    ...(hidden.length > 0
      ? [
          `  hidden characters (control, zero-width, or bidirectional) in ${formatCount(hidden.length)} files:`,
          ...hidden.slice(0, TOP_ENTRIES).map((entry) => `    ${entry.path}`),
        ]
      : []),
    '',
    'Top level',
    ...groupStats(content, topLevelOf).map(([name, stats]) =>
      statsLine(name, stats)
    ),
    '',
    'Extensions',
    ...groupStats(content, (entry) => extensionOf(entry.path))
      .slice(0, TOP_ENTRIES)
      .map(([name, stats]) => statsLine(name, stats)),
    '',
    'Landmarks',
    ...landmarks
      .slice(0, TOP_ENTRIES * 2)
      .map(
        (entry) =>
          `  ${entry.path}  ${formatCount(entry.lines.length)} lines, ${tokens(entry.characters)}`
      ),
    ...omitted(
      landmarks.length - TOP_ENTRIES * 2,
      ', list them with files --name'
    ),
    '',
    'Largest files',
    ...largest.map(
      (entry) =>
        `  ${entry.path}  ${formatCount(entry.lines.length)} lines, ${tokens(entry.characters)}`
    ),
  ];
};

export const overview: Command = async (digests) =>
  digests.flatMap((digest, index) => [
    ...(index > 0 ? [''] : []),
    ...overviewOf(digest),
  ]);
