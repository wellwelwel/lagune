import type {
  AutomatonJob,
  GrowthReport,
  MatchScope,
  ParsedPattern,
  RankedReason,
  RegexAssessment,
  RegexNode,
  RegexSafetyOptions,
  RegexVerdict,
} from '../../types/hooks/regex.js';
import { amplifies } from './amplification/amplification.js';
import { createMeter, isCapReached } from './budget.js';
import { analyzeJob, grows, outgrows } from './growth/growth.js';
import { backreferenceCases } from './syntax/backreferences.js';
import { foldLookaheads } from './syntax/narrowing.js';
import { parsePattern } from './syntax/syntax.js';
import { repeatsUnbounded } from './syntax/tree.js';

const DEFAULT_REPETITION_LIMIT = 25;

const AMPLIFICATION_LIMIT = 200;

const WORK_CAP = 18_000_000;

const CAPPED: RegexAssessment = {
  verdict: 'undetermined',
  reason: 'work cap reached',
  scope: null,
};

const AMPLIFIED: RankedReason = {
  reason: `amplification score above ${AMPLIFICATION_LIMIT}`,
  rank: 1,
  scope: 'search',
};

const isValid = (source: string, flags: string): boolean => {
  try {
    new RegExp(source, flags);
    return true;
  } catch {
    return false;
  }
};

const parseWithinCap = (
  source: string,
  flags: string
): ParsedPattern | null => {
  try {
    return parsePattern(source, flags);
  } catch (error) {
    if (isCapReached(error)) return null;

    throw error;
  }
};

const growthReason = (growth: GrowthReport, scope: MatchScope): RankedReason =>
  growth.exponential
    ? { reason: 'exponential', rank: Infinity, scope }
    : {
        reason: `polynomial of degree ${growth.degree}`,
        rank: growth.degree,
        scope,
      };

const stronger = (
  current: RankedReason | null,
  candidate: RankedReason | null
): RankedReason | null =>
  candidate !== null && (current === null || candidate.rank > current.rank)
    ? candidate
    : current;

/** Names the worst growth of a tree, the search winning a tie, or its amplification when neither scope grows */
const treeReason = (
  root: RegexNode,
  parsed: ParsedPattern,
  captures: ReadonlyMap<number, RegexNode>
): RankedReason | null => {
  const meter = createMeter(WORK_CAP);
  const job = (scope: MatchScope): AutomatonJob => ({
    root,
    captures,
    direction: 'forward',
    flags: parsed.flags,
    scope,
    meter,
  });

  if (repeatsUnbounded(root, captures)) {
    const search = analyzeJob(job('search'));

    if (search.exponential) return growthReason(search, 'search');

    const whole = analyzeJob(job('whole match'));
    const [growth, scope]: [GrowthReport, MatchScope] = outgrows(whole, search)
      ? [whole, 'whole match']
      : [search, 'search'];

    if (grows(growth)) return growthReason(growth, scope);
  }

  return amplifies(job('search'), AMPLIFICATION_LIMIT) ? AMPLIFIED : null;
};

const foldedCaptures = (
  parsed: ParsedPattern
): ReadonlyMap<number, RegexNode> =>
  new Map(
    [...parsed.captures].map(([index, body]) => [index, foldLookaheads(body)])
  );

/** Judges a regex in both matching scopes and names the strongest reason it is ReDoS-prone, if any */
export const assess = (
  source: string,
  options: RegexSafetyOptions = Object.create(null)
): RegexAssessment => {
  const flags = options.flags ?? '';

  if (!isValid(source, flags)) return { verdict: 'invalid regex' };

  const parsed = parseWithinCap(source, flags);

  if (parsed === null) return CAPPED;

  const repetitionLimit = options.repetitionLimit ?? DEFAULT_REPETITION_LIMIT;
  const captures = foldedCaptures(parsed);
  let reason: RankedReason | null =
    parsed.quantifiers > repetitionLimit
      ? {
          reason: `more than ${repetitionLimit} quantifiers`,
          rank: 0,
          scope: null,
        }
      : null;
  let capped = false;

  for (const root of backreferenceCases(parsed).map(foldLookaheads)) {
    try {
      reason = stronger(reason, treeReason(root, parsed, captures));
    } catch (error) {
      if (!isCapReached(error)) throw error;

      capped = true;
    }

    if (reason?.rank === Infinity && reason.scope === 'search') break;
  }

  if (reason !== null)
    return { verdict: 'unsafe', reason: reason.reason, scope: reason.scope };

  return capped ? CAPPED : { verdict: 'safe' };
};

/** Classifies a regex as `safe`, ReDoS-prone `unsafe`, `undetermined`, or `invalid regex` */
export const check = (
  source: string,
  options?: RegexSafetyOptions
): RegexVerdict => assess(source, options).verdict;
