import type { CitedAnchor, Command, Digest } from '../types.ts';
import { readFile } from 'node:fs/promises';
import { parseAnchor } from '../anchor.ts';
import { fail } from '../fail.ts';
import { formatCount } from '../format.ts';
import { stripRoot } from '../paths.ts';

const ANCHOR_SPAN = /`([^`\s:]{1,512}:[^`\s]{1,15})`/g;

const citedAnchors = (document: string): CitedAnchor[] =>
  [...document.matchAll(ANCHOR_SPAN)].map((match) => ({
    text: match[0],
    anchor: parseAnchor(match[1]),
  }));

const anchorProblem = (
  digests: Digest[],
  { text, anchor }: CitedAnchor
): string | null => {
  if (anchor === null) return `${text}: invalid line range`;

  const entry = digests
    .map((digest) => digest.byPath.get(stripRoot(digest, anchor.path)))
    .find((found) => found !== undefined);

  if (entry === undefined) return `${text}: no such file`;
  if (entry.kind !== 'text') return `${text}: ${entry.kind} file`;

  const end = anchor.range.end ?? anchor.range.start;

  return end > entry.lines.length
    ? `${text}: the file has ${entry.lines.length} lines`
    : null;
};

export const anchors: Command = async (digests, options) => {
  const document = await readFile(
    options.synthesis ?? fail('anchors needs --synthesis'),
    'utf8'
  );
  const cited = citedAnchors(document);
  const problems = cited.flatMap((citation) => {
    const problem = anchorProblem(digests, citation);

    return problem === null ? [] : [`  ${problem}`];
  });

  if (problems.length > 0) process.exitCode = 1;

  return [
    `${formatCount(cited.length)} anchors, ${formatCount(problems.length)} broken`,
    ...problems,
  ];
};
