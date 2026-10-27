import type {
  Alphabet,
  AutomatonJob,
  CodeSet,
  CompiledJob,
  Components,
  Digraph,
  GrowthReport,
  JobReport,
  OrderedAutomaton,
  RegexNode,
  SeparateLook,
} from '../../../types/hooks/regex.js';
import { compile } from '../automaton/compile.js';
import {
  ancestorsOf,
  cyclicStates,
  stronglyConnected,
} from '../automaton/graph.js';
import {
  lookaheadFrom,
  readerOf,
  sureLookahead,
} from '../automaton/lookahead.js';
import {
  buildOrdered,
  consultedStates,
  decidingStates,
  orderedGraph,
} from '../automaton/ordered.js';
import { EMPTY_SET, overlaps, union } from '../syntax/codeset.js';
import { assessGrowth } from './ambiguity.js';
import { buildProduct } from './product.js';

const STEADY: GrowthReport = { exponential: false, degree: 0 };

const lookCache = new WeakMap<RegexNode, JobReport>();

export const grows = ({ exponential, degree }: GrowthReport): boolean =>
  exponential || degree >= 2;

/** Tells whether one growth is stronger than another: exponential first, then the higher degree */
export const outgrows = (left: GrowthReport, right: GrowthReport): boolean =>
  left.exponential === right.exponential
    ? left.degree > right.degree
    : left.exponential;

const groupChars = (
  graph: Digraph,
  alphabet: Alphabet,
  group: readonly number[]
): CodeSet => {
  const inside = new Set(group);
  let chars = EMPTY_SET;

  for (const node of group)
    for (
      let edge = graph.offsets[node];
      edge < graph.offsets[node + 1];
      edge += 1
    )
      if (inside.has(graph.targets[edge]))
        chars = union(chars, alphabet.pieceSets[graph.labels[edge]]);

  return chars;
};

const cycleChars = (
  graph: Digraph,
  alphabet: Alphabet,
  components: Components,
  keep: (group: readonly number[]) => boolean
): CodeSet =>
  components.members
    .filter(keep)
    .reduce(
      (chars, group) => union(chars, groupChars(graph, alphabet, group)),
      EMPTY_SET
    );

const loopsBefore = (
  ordered: OrderedAutomaton,
  graph: Digraph,
  components: Components,
  cyclic: Uint8Array,
  alphabet: Alphabet,
  look: number
): CodeSet => {
  const ancestors = ancestorsOf(
    graph,
    Uint8Array.from(ordered.states, (state) =>
      state.marks.includes(look) ? 1 : 0
    )
  );

  return cycleChars(graph, alphabet, components, (group) =>
    group.some((state) => cyclic[state] && ancestors[state])
  );
};

const preciseGrowth = (
  job: AutomatonJob,
  ordered: OrderedAutomaton,
  alphabet: Alphabet,
  graph: Digraph,
  ancestors: Uint8Array
): GrowthReport => {
  const relevant = consultedStates(ordered, (state) => ancestors[state] === 1);
  const lookahead = lookaheadFrom(
    readerOf(ordered, alphabet, relevant),
    ordered,
    alphabet,
    relevant,
    job.meter
  );

  return assessGrowth(
    buildProduct(
      ordered,
      lookahead,
      ancestors,
      ancestorsOf(graph, decidingStates(ordered)),
      job.meter
    ),
    job.meter
  );
};

const lookGrowth = (report: JobReport, repeated: boolean): GrowthReport => {
  if (report.exponential) return { exponential: true, degree: report.degree };
  if (repeated) return { exponential: false, degree: report.degree + 1 };

  return grows(report) ? report : STEADY;
};

const judge = (
  job: AutomatonJob,
  { epsilon, alphabet, past }: CompiledJob
): JobReport => {
  const ordered = buildOrdered(epsilon, alphabet, past, job.meter);
  const graph = orderedGraph(ordered);
  const components = stronglyConnected(graph);
  const cyclic = cyclicStates(graph, components);
  const ancestors = ancestorsOf(graph, cyclic);
  const coarse = assessGrowth(
    buildProduct(
      ordered,
      sureLookahead(alphabet.pieceKinds.length, new Set()),
      ancestors,
      new Uint8Array(ordered.states.length),
      job.meter
    ),
    job.meter
  );
  const growth = grows(coarse)
    ? preciseGrowth(job, ordered, alphabet, graph, ancestors)
    : coarse;
  const cyclicChars =
    job.scope === 'submatch'
      ? cycleChars(graph, alphabet, components, (group) =>
          group.some((state) => cyclic[state] === 1)
        )
      : EMPTY_SET;

  if (growth.exponential) return { ...growth, cyclicChars };

  const strongest = epsilon.looks.reduce((current, look, index) => {
    const report = analyzeLook(look, job);
    const repeated =
      report.degree >= 1 &&
      overlaps(
        loopsBefore(ordered, graph, components, cyclic, alphabet, index),
        report.cyclicChars
      );
    const candidate = lookGrowth(report, repeated);

    return outgrows(candidate, current) ? candidate : current;
  }, growth);

  return {
    exponential: strongest.exponential,
    degree: strongest.degree,
    cyclicChars,
  };
};

/** Judges one oriented tree in its scope, refining lookbehinds only when the coarse automaton shows growth */
export const analyzeJob = (job: AutomatonJob): JobReport => {
  const coarse = judge(job, compile(job, false));

  if (!grows(coarse)) return coarse;

  const recalled = compile(job, true);

  if (!recalled.past.recalling) return coarse;

  return judge(job, recalled);
};

const analyzeLook = (look: SeparateLook, outer: AutomatonJob): JobReport => {
  const cached = lookCache.get(look.body);

  if (cached) return cached;

  const report = analyzeJob({
    root: look.body,
    captures: outer.captures,
    direction: look.direction,
    flags: outer.flags,
    scope: 'submatch',
    meter: outer.meter,
  });

  lookCache.set(look.body, report);
  return report;
};
