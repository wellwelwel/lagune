import type {
  Alphabet,
  BackScratch,
  GatedEdge,
  Lookahead,
  OrderedAutomaton,
  ReverseReader,
  StepEvent,
  StepGate,
  StepMove,
  WorkMeter,
} from '../../../types/hooks/regex.js';
import { spend } from '../budget.js';
import { reach } from './graph.js';
import { addRuns, createRunTable, findRuns, hashRuns } from './intern.js';
import { BOUNDARY, maskOf } from './kinds.js';

const NO_GATES: readonly StepGate[] = [];

const STAMP_LIMIT = 2 ** 30;

const forwardEdges = (
  ordered: OrderedAutomaton,
  alphabet: Alphabet,
  state: number,
  visit: (piece: number, target: number, gates: readonly StepGate[]) => void
): void => {
  const sink = ordered.states.length;

  if (state === sink) {
    alphabet.pieceKinds.forEach((_, piece) => visit(piece, sink, NO_GATES));
    return;
  }

  const { context, events, exits } = ordered.states[state];

  for (const [piece, list] of events)
    for (const event of list)
      if (event.type === 'move' && event.certain && event.context === context)
        visit(piece, event.target, event.gates);

  for (const exit of exits)
    alphabet.pieceKinds.forEach((kind, piece) => {
      if ((exit.kinds & maskOf(kind)) !== 0) visit(piece, sink, exit.gates);
    });
};

const depthOf = (gates: readonly StepGate[]): number =>
  gates.reduce((deepest, gate) => Math.max(deepest, gate.depth), 0);

const holds = (
  gates: readonly StepGate[],
  accepting: ReadonlySet<number>
): boolean => {
  for (const gate of gates)
    if (accepting.has(gate.state) === gate.negative) return false;

  return true;
};

const reverseEdges = (
  ordered: OrderedAutomaton,
  alphabet: Alphabet,
  included: Uint8Array
): { plain: Map<number, number[]>[]; gated: GatedEdge[][] } => {
  const plain = alphabet.pieceKinds.map(() => new Map<number, number[]>());
  const gated: GatedEdge[][] = alphabet.pieceKinds.map(() => []);

  for (let state = 0; state < included.length; state += 1) {
    if (!included[state]) continue;

    forwardEdges(ordered, alphabet, state, (piece, target, gates) => {
      if (gates.length > 0) {
        gated[piece].push({
          source: state,
          target,
          gates,
          depth: depthOf(gates),
        });
        return;
      }

      const sources = plain[piece].get(target);

      if (sources) sources.push(state);
      else plain[piece].set(target, [state]);
    });
  }

  return {
    plain,
    gated: gated.map((edges) =>
      edges.toSorted((left, right) => left.depth - right.depth)
    ),
  };
};

const createBackScratch = (size: number): BackScratch => ({
  marks: new Int32Array(size),
  seen: new Int32Array(size),
  generation: 0,
});

const reserveStamps = (scratch: BackScratch): number => {
  if (scratch.generation >= STAMP_LIMIT) {
    scratch.marks.fill(0);
    scratch.seen.fill(0);
    scratch.generation = 0;
  }

  scratch.generation += 2;
  return scratch.generation;
};

const holdsIn = (
  gates: readonly StepGate[],
  seen: Int32Array,
  stamp: number
): boolean => {
  for (const gate of gates)
    if ((seen[gate.state] === stamp) === gate.negative) return false;

  return true;
};

/** Lists, sorted, the states that reach one of the given states by reading one piece, gated steps once their lookaheads hold */
const stepBack = (
  states: readonly number[],
  plain: ReadonlyMap<number, number[]>,
  gated: readonly GatedEdge[],
  scratch: BackScratch
): number[] => {
  const stamp = reserveStamps(scratch);
  const current = stamp - 1;
  const found: number[] = [];

  for (const state of states) scratch.marks[state] = current;

  for (const state of states)
    for (const source of plain.get(state) ?? []) {
      if (scratch.seen[source] === stamp) continue;

      scratch.seen[source] = stamp;
      found.push(source);
    }

  for (const { source, target, gates } of gated) {
    if (scratch.marks[target] !== current || scratch.seen[source] === stamp)
      continue;
    if (!holdsIn(gates, scratch.seen, stamp)) continue;

    scratch.seen[source] = stamp;
    found.push(source);
  }

  return found.sort((left, right) => left - right);
};

const acceptingAtEnd = (
  ordered: OrderedAutomaton,
  included: Uint8Array
): number[] => {
  const boundary = maskOf(BOUNDARY);
  const sink = ordered.states.length;
  const plain = new Set<number>([sink]);

  ordered.states.forEach((state, id) => {
    if (!included[id]) return;

    for (const exit of state.exits)
      if ((exit.kinds & boundary) !== 0 && exit.gates.length === 0)
        plain.add(id);
  });

  const gatedExits = ordered.states
    .flatMap((state, id) =>
      included[id]
        ? state.exits
            .filter(
              (exit) => (exit.kinds & boundary) !== 0 && exit.gates.length > 0
            )
            .map((exit) => ({
              id,
              gates: exit.gates,
              depth: depthOf(exit.gates),
            }))
        : []
    )
    .toSorted((left, right) => left.depth - right.depth);

  for (const { id, gates } of gatedExits)
    if (holds(gates, plain)) plain.add(id);

  return [...plain].toSorted((left, right) => left - right);
};

const minimize = (
  outputs: readonly string[],
  next: readonly number[],
  pieces: number,
  meter: WorkMeter
): Int32Array => {
  const firstIds = new Map<string, number>();
  let classOf = new Int32Array(outputs.length);

  outputs.forEach((output, state) => {
    const known = firstIds.get(output);

    classOf[state] = known ?? firstIds.size;
    if (known === undefined) firstIds.set(output, firstIds.size);
  });

  let count = firstIds.size;
  const signature: number[] = [];

  for (;;) {
    const ids = createRunTable();
    const refined = new Int32Array(outputs.length);

    spend(meter, outputs.length * pieces);

    for (let state = 0; state < outputs.length; state += 1) {
      signature[0] = classOf[state];

      for (let piece = 0; piece < pieces; piece += 1)
        signature[piece + 1] = classOf[next[state * pieces + piece]];

      const hash = hashRuns(0, signature, pieces + 1);
      const known = findRuns(ids, 0, signature, pieces + 1, hash);

      refined[state] =
        known === -1 ? addRuns(ids, 0, signature, pieces + 1, hash) : known;
    }

    if (ids.count === count) return classOf;

    classOf = refined;
    count = ids.count;
  }
};

/** Lays the prioritized steps out backward, keeping only what can reach the relevant states or the end of input */
export const readerOf = (
  ordered: OrderedAutomaton,
  alphabet: Alphabet,
  relevant: ReadonlySet<number>
): ReverseReader => {
  const sink = ordered.states.length;
  const included = reach(sink + 1, [...relevant, sink], (state, visit) =>
    forwardEdges(ordered, alphabet, state, (_, target, gates) => {
      visit(target);

      for (const gate of gates) visit(gate.state);
    })
  );

  return {
    ...reverseEdges(ordered, alphabet, included),
    start: acceptingAtEnd(ordered, included),
  };
};

/** Reads one concrete input backward, listing for each position the states that succeed on the input left from it */
export const acceptanceAlong = (
  ordered: OrderedAutomaton,
  { plain, gated, start }: ReverseReader,
  pieces: readonly number[],
  meter: WorkMeter
): Set<number>[] => {
  const scratch = createBackScratch(ordered.states.length + 1);
  const accepting = [start];

  for (let index = pieces.length - 1; index >= 0; index -= 1) {
    const current = accepting[accepting.length - 1];

    spend(meter, current.length + 1);
    accepting.push(
      stepBack(current, plain[pieces[index]], gated[pieces[index]], scratch)
    );
  }

  return accepting.toReversed().map((states) => new Set(states));
};

/** Builds, from a backward reader, the machine that tells for every remaining input which prioritized steps would already succeed */
export const lookaheadFrom = (
  { plain, gated, start }: ReverseReader,
  ordered: OrderedAutomaton,
  alphabet: Alphabet,
  relevant: ReadonlySet<number>,
  meter: WorkMeter
): Lookahead => {
  const pieces = alphabet.pieceKinds.length;
  const scratch = createBackScratch(ordered.states.length + 1);
  const table = createRunTable();
  const dfaStates = table.runs;
  const next: number[] = [];

  addRuns(table, 0, start, start.length, hashRuns(0, start, start.length));

  for (let head = 0; head < table.count; head += 1) {
    const current = dfaStates[head];

    for (let piece = 0; piece < pieces; piece += 1) {
      const target = stepBack(current, plain[piece], gated[piece], scratch);
      const hash = hashRuns(0, target, target.length);
      const known = findRuns(table, 0, target, target.length, hash);

      spend(meter, current.length + 1);

      if (known !== -1) {
        next.push(known);
        continue;
      }

      next.push(table.count);
      addRuns(table, 0, target, target.length, hash);
    }
  }

  const outputs = dfaStates.map((states) =>
    states.filter((state) => relevant.has(state)).join(',')
  );
  const classOf = minimize(outputs, next, pieces, meter);
  const classCount =
    classOf.reduce((highest, klass) => Math.max(highest, klass), 0) + 1;
  const representatives = new Int32Array(classCount).fill(-1);

  classOf.forEach((klass, state) => {
    if (representatives[klass] === -1) representatives[klass] = state;
  });

  const predecessors: number[][] = Array.from(
    { length: classCount * pieces },
    () => []
  );
  const members = Array.from(
    representatives,
    (state) =>
      new Set(dfaStates[state].filter((member) => relevant.has(member)))
  );
  const back = new Int32Array(classCount * pieces);

  representatives.forEach((state, klass) => {
    for (let piece = 0; piece < pieces; piece += 1) {
      const prior = classOf[next[state * pieces + piece]];

      back[klass * pieces + piece] = prior;
      predecessors[prior * pieces + piece].push(klass);
    }
  });

  return { blind: false, classCount, pieces, predecessors, members, back };
};

/** Builds the machine that tells, for every remaining input, which prioritized steps would already succeed */
export const buildLookahead = (
  ordered: OrderedAutomaton,
  alphabet: Alphabet,
  relevant: ReadonlySet<number>,
  meter: WorkMeter
): Lookahead =>
  lookaheadFrom(
    readerOf(ordered, alphabet, relevant),
    ordered,
    alphabet,
    relevant,
    meter
  );

/** A one-class lookahead that knows only the states sure to succeed */
export const sureLookahead = (
  pieces: number,
  sure: ReadonlySet<number>
): Lookahead => ({
  blind: true,
  classCount: 1,
  pieces,
  predecessors: Array.from({ length: pieces }, () => [0]),
  members: [sure],
  back: new Int32Array(pieces),
});

/** A one-class lookahead that knows nothing about the remaining input */
export const blindLookahead = (pieces: number): Lookahead =>
  sureLookahead(pieces, new Set());

const acceptsIn = (
  lookahead: Lookahead,
  state: number,
  klass: number
): boolean => lookahead.members[klass].has(state);

/** Tells whether the lookaheads a step depends on can hold for the input class it reads */
const gatesMayHold = (
  lookahead: Lookahead,
  gates: readonly StepGate[],
  klass: number
): boolean => lookahead.blind || holds(gates, lookahead.members[klass]);

/** Tells whether the lookaheads a step depends on are known to hold for the input class it reads */
const gatesSurelyHold = (
  lookahead: Lookahead,
  gates: readonly StepGate[],
  klass: number
): boolean =>
  gates.length === 0 ||
  (!lookahead.blind && holds(gates, lookahead.members[klass]));

/** Tells whether a step runs in backtracking order between the input classes before and after it, blocking the contexts it settles */
export const runsInOrder = (
  event: StepEvent,
  lookahead: Lookahead,
  current: number,
  next: number,
  blocked: number[]
): event is StepMove => {
  if (event.type === 'stop') {
    if (gatesSurelyHold(lookahead, event.gates, current))
      blocked.push(event.context);

    return false;
  }

  if (blocked.includes(event.context)) return false;
  if (!gatesMayHold(lookahead, event.gates, current)) return false;

  if (
    event.certain &&
    acceptsIn(lookahead, event.target, next) &&
    gatesSurelyHold(lookahead, event.gates, current)
  )
    blocked.push(event.context);

  return true;
};

export const predecessorsOf = (
  lookahead: Lookahead,
  klass: number,
  piece: number
): readonly number[] =>
  lookahead.predecessors[klass * lookahead.pieces + piece];
