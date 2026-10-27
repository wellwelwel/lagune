import type { Command, Entry, LineTest, Match, Options } from '../types.ts';
import { fail } from '../fail.ts';
import { clip, displayPath, formatCount, omitted } from '../format.ts';
import { matchPatterns } from '../pattern/match.ts';
import { selectedEntries } from '../selection.ts';

const MAX_LINE_WIDTH = 240;
const DEFAULT_LIMIT = 60;

const termMatcherFor = (options: Options): LineTest => {
  const terms = options.caseSensitive
    ? options.terms
    : options.terms.map((term) => term.toLowerCase());

  return (line) => {
    const haystack = options.caseSensitive ? line : line.toLowerCase();

    return terms.some((term) => haystack.includes(term));
  };
};

const matchesIn = (
  entry: Entry,
  matchesTerm: LineTest,
  patternLines: Set<number>
): Match[] =>
  entry.lines.flatMap((line, index) =>
    patternLines.has(index + 1) || matchesTerm(line)
      ? [{ entry, line: index + 1 }]
      : []
  );

const contextOf = (match: Match, context: number): string[] => {
  const first = Math.max(1, match.line - context);
  const last = Math.min(match.entry.lines.length, match.line + context);

  return match.entry.lines
    .slice(first - 1, last)
    .map(
      (line, index) =>
        `  ${first + index}${first + index === match.line ? ':' : '-'} ${clip(line, MAX_LINE_WIDTH)}`
    );
};

export const search: Command = async (digests, options) => {
  if (options.terms.includes('')) fail('--term cannot be empty');
  if (options.terms.length === 0 && options.patterns.length === 0)
    fail('search needs at least one --term or --pattern');

  const candidates = digests.flatMap((digest) =>
    selectedEntries(digest, options).map((entry) => ({ digest, entry }))
  );
  const patternLines = await matchPatterns(
    candidates.map(({ entry }) => entry),
    options.patterns,
    options.caseSensitive
  );
  const matchesTerm = termMatcherFor(options);
  const hits = candidates
    .map(({ digest, entry }, index) => ({
      digest,
      entry,
      found: matchesIn(entry, matchesTerm, patternLines[index]),
    }))
    .filter(({ found }) => found.length > 0);
  const total = hits.reduce((sum, { found }) => sum + found.length, 0);
  const header = `${formatCount(total)} matches in ${formatCount(hits.length)} files`;

  if (options.filesOnly) {
    const ranked = [...hits].sort(
      (left, right) => right.found.length - left.found.length
    );
    const limit = options.limit ?? DEFAULT_LIMIT;

    return [
      header,
      ...ranked
        .slice(0, limit)
        .map(
          ({ digest, entry, found }) =>
            `  ${displayPath(digests, digest, entry.path)}  ${formatCount(found.length)}`
        ),
      ...omitted(ranked.length - limit, ', narrow with --under or --ext'),
    ];
  }

  const limit = options.limit ?? DEFAULT_LIMIT;
  const blocks = hits.reduce<{ lines: string[]; shown: number }>(
    (state, { digest, entry, found }) => {
      const budget = Math.min(options.perFile, limit - state.shown);

      if (budget <= 0) return state;

      const shown = found.slice(0, budget);

      return {
        shown: state.shown + shown.length,
        lines: [
          ...state.lines,
          `${displayPath(digests, digest, entry.path)}  (${formatCount(found.length)})`,
          ...shown.flatMap((match) => contextOf(match, options.context)),
          ...omitted(
            found.length - shown.length,
            ' in this file, narrow the search or read it'
          ),
        ],
      };
    },
    { lines: [], shown: 0 }
  );

  return [
    header,
    ...blocks.lines,
    ...omitted(
      total - blocks.shown,
      ', list files with --files-only, or narrow with --under or --ext'
    ),
  ];
};
