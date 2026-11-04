import type {
  CharacterRange,
  IgnoreList,
  IgnoreRule,
  MatchBudget,
  PathToken,
  PatternToken,
  SegmentPattern,
} from '../../types/git.js';
import { deepFreeze } from '../collections.js';

const STAR: PatternToken = deepFreeze({ kind: 'star' });

const ANY: PatternToken = deepFreeze({ kind: 'any' });

const GLOBSTAR: PathToken = deepFreeze({ kind: 'globstar' });

const ANY_SEGMENT: PathToken = deepFreeze({ kind: 'segment', pattern: [STAR] });

const trimTrailingSpaces = (line: string): string => {
  let end = 0;

  for (let index = 0; index < line.length; index++) {
    if (line[index] === '\\') {
      index++;
      end = Math.min(index + 1, line.length);
      continue;
    }

    if (line[index] !== ' ') end = index + 1;
  }

  return line.slice(0, end);
};

const readCharacter = (
  source: string,
  index: number
): readonly [code: number, next: number] | null => {
  if (source[index] !== '\\')
    return index < source.length ? [source.charCodeAt(index), index + 1] : null;

  return index + 1 < source.length
    ? [source.charCodeAt(index + 1), index + 2]
    : null;
};

const parseClass = (
  source: string,
  start: number
): readonly [token: PatternToken, next: number] | null => {
  const negated = source[start] === '!' || source[start] === '^';
  const ranges: CharacterRange[] = [];
  let index = negated ? start + 1 : start;

  while (index < source.length) {
    if (source[index] === ']' && ranges.length > 0)
      return [{ kind: 'class', negated, ranges }, index + 1];

    if (source[index] === '[' && source[index + 1] === ':') return null;

    const low = readCharacter(source, index);

    if (low === null) return null;

    const isRange =
      source[low[1]] === '-' &&
      low[1] + 1 < source.length &&
      source[low[1] + 1] !== ']';
    const high = isRange ? readCharacter(source, low[1] + 1) : low;

    if (high === null) return null;

    ranges.push([low[0], high[0]]);
    index = high[1];
  }

  return null;
};

const literalAt = (
  segment: string,
  index: number
): readonly [token: PatternToken, next: number] | null => {
  const character = readCharacter(segment, index);

  return character === null
    ? null
    : [{ kind: 'literal', code: character[0] }, character[1]];
};

const tokenize = (segment: string): SegmentPattern | null => {
  const tokens: PatternToken[] = [];
  let index = 0;

  while (index < segment.length) {
    if (segment[index] === '*') {
      if (tokens.at(-1)?.kind !== 'star') tokens.push(STAR);
      index++;
      continue;
    }

    if (segment[index] === '?') {
      tokens.push(ANY);
      index++;
      continue;
    }

    const parsed: readonly [PatternToken, number] | null =
      segment[index] === '['
        ? parseClass(segment, index + 1)
        : literalAt(segment, index);

    if (parsed === null) return null;

    tokens.push(parsed[0]);
    index = parsed[1];
  }

  return tokens;
};

const segmentToken = (segment: string): PathToken | null => {
  const pattern = tokenize(segment);

  return pattern === null ? null : { kind: 'segment', pattern };
};

const nameTokens = (name: string): PathToken[] | null => {
  const token = segmentToken(name);

  return token === null ? null : [token];
};

const anchoredTokens = (segments: readonly string[]): PathToken[] | null => {
  if (segments.includes('')) return null;

  const tokens: PathToken[] = [];

  for (const segment of segments) {
    const token = segment === '**' ? GLOBSTAR : segmentToken(segment);

    if (token === null) return null;

    tokens.push(token);
  }

  if (tokens.length > 1 && tokens.at(-1)?.kind === 'globstar')
    return [...tokens.slice(0, -1), ANY_SEGMENT, GLOBSTAR];

  return tokens;
};

/** Reads one line of a Git ignore file into a rule, or none for a blank line, a comment, or a pattern it cannot read */
const parseIgnoreLine = (line: string): IgnoreRule | null => {
  if (line.startsWith('#')) return null;

  const trimmed = trimTrailingSpaces(line);
  const negated = trimmed.startsWith('!');
  const body = negated ? trimmed.slice(1) : trimmed;
  const directoryOnly = body.endsWith('/');
  const pattern = directoryOnly ? body.slice(0, -1) : body;

  if (pattern === '') return null;

  const anchored = pattern.includes('/');
  const unrooted = pattern.startsWith('/') ? pattern.slice(1) : pattern;
  const tokens = anchored
    ? anchoredTokens(unrooted.split('/'))
    : nameTokens(pattern);

  return tokens === null ? null : { negated, directoryOnly, anchored, tokens };
};

export const parseIgnoreText = (text: string): IgnoreRule[] =>
  (text.startsWith('\uFEFF') ? text.slice(1) : text)
    .split('\n')
    .flatMap((line) => {
      const rule = parseIgnoreLine(
        line.endsWith('\r') ? line.slice(0, -1) : line
      );

      return rule === null ? [] : [rule];
    });

const matchesWithStars = <Token>(
  tokens: readonly Token[],
  length: number,
  isStar: (token: Token) => boolean,
  matchesAt: (token: Token, index: number) => boolean,
  budget: MatchBudget
): boolean => {
  let token = 0;
  let unit = 0;
  let starToken = -1;
  let starUnit = 0;

  while (unit < length) {
    budget.remaining--;

    if (budget.remaining <= 0) return false;

    if (token < tokens.length && isStar(tokens[token])) {
      starToken = token;
      starUnit = unit;
      token++;
      continue;
    }

    if (token < tokens.length && matchesAt(tokens[token], unit)) {
      token++;
      unit++;
      continue;
    }

    if (starToken === -1) return false;

    token = starToken + 1;
    starUnit++;
    unit = starUnit;
  }

  while (token < tokens.length && isStar(tokens[token])) token++;

  return token === tokens.length;
};

const matchesCharacter = (token: PatternToken, code: number): boolean => {
  if (token.kind === 'any') return true;
  if (token.kind === 'literal') return token.code === code;
  if (token.kind === 'star') return false;

  const inRange = token.ranges.some(
    ([low, high]) => code >= low && code <= high
  );

  return inRange !== token.negated;
};

const segmentMatches = (
  pattern: SegmentPattern,
  name: string,
  budget: MatchBudget
): boolean =>
  matchesWithStars(
    pattern,
    name.length,
    (token) => token.kind === 'star',
    (token, index) => matchesCharacter(token, name.charCodeAt(index)),
    budget
  );

const pathMatches = (
  tokens: readonly PathToken[],
  segments: readonly string[],
  budget: MatchBudget
): boolean =>
  matchesWithStars(
    tokens,
    segments.length,
    (token) => token.kind === 'globstar',
    (token, index) =>
      token.kind === 'segment' &&
      segmentMatches(token.pattern, segments[index], budget),
    budget
  );

const ruleMatches = (
  rule: IgnoreRule,
  segments: readonly string[],
  isDirectory: boolean,
  budget: MatchBudget
): boolean =>
  (isDirectory || !rule.directoryOnly) &&
  pathMatches(
    rule.tokens,
    rule.anchored ? segments : segments.slice(-1),
    budget
  );

const verdictOf = (
  lists: readonly IgnoreList[],
  segments: readonly string[],
  isDirectory: boolean,
  budget: MatchBudget
): boolean => {
  for (let index = lists.length - 1; index >= 0; index--) {
    const { base, rules } = lists[index];
    const below = segments.slice(base.length);
    const rule = rules.findLast((candidate) =>
      ruleMatches(candidate, below, isDirectory, budget)
    );

    if (rule !== undefined) return !rule.negated;
  }

  return false;
};

/** Whether the lists, weakest first, ignore a path given by its segments from the project root, never once the budget runs out */
export const isIgnored = (
  lists: readonly IgnoreList[],
  segments: readonly string[],
  isDirectory: boolean,
  budget: MatchBudget
): boolean =>
  verdictOf(lists, segments, isDirectory, budget) && budget.remaining > 0;
