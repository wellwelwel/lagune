import type {
  Lookahead,
  OrderedAutomaton,
  Product,
  StepEvent,
  WorkMeter,
} from '../../../types/hooks/regex.js';
import { toDigraph } from '../automaton/graph.js';
import { predecessorsOf, runsInOrder } from '../automaton/lookahead.js';
import { spend } from '../budget.js';

/** The piece of the alphabet a product edge label reads */
export const labelPiece = (product: Product, label: number): number =>
  Math.floor(label / (product.wildcard + 1));

/** The class of the input left to read that a product edge label assumes */
export const labelClass = (product: Product, label: number): number =>
  label % (product.wildcard + 1);

/** Pairs every prioritized state that can reach a cycle with the class of the input left to read, or the wildcard once no decision ahead depends on it */
export const buildProduct = (
  ordered: OrderedAutomaton,
  lookahead: Lookahead,
  leadsToCycle: Uint8Array,
  needsClass: Uint8Array,
  meter: WorkMeter
): Product => {
  const wildcard = lookahead.classCount;
  const stride = wildcard + 1;
  const nodeIds = new Map<number, number>();
  const nodeState: number[] = [];
  const nodeClass: number[] = [];
  const sources: number[] = [];
  const targets: number[] = [];
  const labels: number[] = [];
  const blocked: number[] = [];

  const nodeOf = (state: number, klass: number): number => {
    const key = state * stride + klass;
    const known = nodeIds.get(key);

    if (known !== undefined) return known;

    nodeIds.set(key, nodeState.length);
    nodeState.push(state);
    nodeClass.push(klass);
    spend(meter, 1);
    return nodeState.length - 1;
  };

  /** Links a node along the steps that run in backtracking order to those that can reach a cycle */
  const connect = (
    node: number,
    events: readonly StepEvent[],
    piece: number,
    klass: number
  ): void => {
    const next = klass % wildcard;
    const current = nodeClass[node] % wildcard;

    blocked.length = 0;

    for (const event of events) {
      if (!runsInOrder(event, lookahead, current, next, blocked)) continue;
      if (!leadsToCycle[event.target]) continue;

      sources.push(node);
      targets.push(
        nodeOf(event.target, needsClass[event.target] ? klass : wildcard)
      );
      labels.push(piece * stride + klass);
      spend(meter, 1);
    }
  };

  for (const start of ordered.starts) {
    if (!leadsToCycle[start]) continue;

    if (!needsClass[start]) {
      nodeOf(start, wildcard);
      continue;
    }

    for (let klass = 0; klass < wildcard; klass += 1) nodeOf(start, klass);
  }

  for (let node = 0; node < nodeState.length; node += 1) {
    const state = ordered.states[nodeState[node]];
    const klass = nodeClass[node];

    for (const [piece, events] of state.events) {
      if (klass === wildcard) {
        connect(node, events, piece, wildcard);
        continue;
      }

      for (const next of predecessorsOf(lookahead, klass, piece))
        connect(node, events, piece, next);
    }
  }

  return {
    graph: toDigraph(nodeState.length, sources, targets, labels),
    wildcard,
  };
};
