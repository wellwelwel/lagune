import type {
  AutomatonJob,
  Lookahead,
  RegexNode,
  ScoreLayout,
  WorkMeter,
} from '../../../types/hooks/regex.js';
import { lookaheadFrom } from '../automaton/lookahead.js';
import { reachCap } from '../budget.js';
import { someNode } from '../syntax/tree.js';
import { attemptBound } from './attempts.js';
import { confirms } from './confirmation.js';
import { quietRanges, steadyRanges, walkOf } from './groups.js';
import { consultedFor, layoutOf, readerFor, sureOf } from './layout.js';
import { walkScore } from './score.js';

const EXACT_NODES = 20_000;

const LOOSE_NODES = 200_000;

const LEVEL_NODES = 700_000;

/** Settles a score past the ceiling: by a witness the engine order confirms, or by walking the input that follows */
const pastCeiling = (
  layout: ScoreLayout,
  witness: readonly number[],
  ceiling: number,
  meter: WorkMeter
): number => {
  if (confirms(layout, witness, ceiling, meter)) return ceiling + 1;

  const precise = walkScore(
    layout,
    lookaheadFrom(
      readerFor(layout),
      layout.ordered,
      layout.alphabet,
      consultedFor(layout),
      meter
    ),
    ceiling + 1,
    meter,
    { limit: EXACT_NODES, quiet: [], level: [] }
  );

  return precise.complete || precise.score > ceiling
    ? precise.score
    : reachCap();
};

/** Bounds a score by a walk with every steady run leveled, or Infinity once the walk outgrows its limits */
const walkBound = (
  layout: ScoreLayout,
  sure: Lookahead,
  room: number,
  meter: WorkMeter
): number => {
  const walk = walkScore(layout, sure, room + 1, meter, {
    limit: LEVEL_NODES,
    quiet: [],
    level: steadyRanges(walkOf(layout, sure, 0)),
  });

  return walk.complete ? walk.score : Infinity;
};

const searchBound = (job: AutomatonJob, room: number): number => {
  const layout = layoutOf(job);
  const sure = sureOf(layout);
  const bound = attemptBound(layout, sure, room + 1, job.meter);

  return bound <= room ? bound : walkBound(layout, sure, room, job.meter);
};

const isBackreference = (node: RegexNode): boolean =>
  node.kind === 'backreference';

/** Bounds a score with every steady run leveled, a top-level alternation by the sum of its branches */
const leveledBound = (
  job: AutomatonJob,
  layout: ScoreLayout,
  sure: Lookahead,
  ceiling: number
): number => {
  const { root } = job;

  if (root.kind !== 'alternation' || someNode(root, isBackreference))
    return walkBound(layout, sure, ceiling, job.meter);

  let total = 0;

  for (const branch of root.branches) {
    total += searchBound({ ...job, root: branch }, ceiling - total);

    if (total > ceiling) return total;
  }

  return total;
};

/** Tells whether a search scores past the ceiling, settling it by the cheapest sound means that reaches a verdict */
export const amplifies = (job: AutomatonJob, ceiling: number): boolean => {
  const cap = ceiling + 1;
  const layout = layoutOf(job);
  const sure = sureOf(layout);

  if (attemptBound(layout, sure, cap, job.meter) <= ceiling) return false;

  const exact = walkScore(layout, sure, cap, job.meter, {
    limit: EXACT_NODES,
    quiet: [],
    level: [],
  });

  if (exact.complete) return false;
  if (exact.score > ceiling)
    return pastCeiling(layout, exact.witness, ceiling, job.meter) > ceiling;
  if (leveledBound(job, layout, sure, ceiling) <= ceiling) return false;

  const loose = walkScore(layout, sure, cap, job.meter, {
    limit: LOOSE_NODES,
    quiet: quietRanges(walkOf(layout, sure, 0)),
    level: [],
  });

  if (loose.complete) return false;
  if (loose.score > ceiling)
    return pastCeiling(layout, loose.witness, ceiling, job.meter) > ceiling;

  return reachCap();
};
