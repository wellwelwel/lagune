import type {
  Alphabet,
  ClosureGate,
  ClosureItem,
  ClosurePath,
  Digraph,
  EpsilonAutomaton,
  EpsilonTransition,
  OrderedAutomaton,
  OrderedState,
  Past,
  StepEvent,
  StepGate,
  WorkMeter,
} from '../../../types/hooks/regex.js';
import { spend } from '../budget.js';
import { reach, toDigraph } from './graph.js';
import { ALL_KINDS, allowedAfter, BOUNDARY, maskOf } from './kinds.js';
import { forget } from './past.js';

const recalledKinds = (
  past: Past,
  pastState: number,
  transition: Extract<EpsilonTransition, { type: 'recall' }>
): number => {
  const holds = past.holds[pastState][transition.tracked];

  return transition.negative ? ALL_KINDS & ~holds : holds;
};

const closureStep = (
  automaton: EpsilonAutomaton,
  alphabet: Alphabet,
  past: Past,
  pastState: number,
  path: ClosurePath,
  out: ClosureItem[]
): ClosurePath[] => {
  const transition = automaton.transitions[path.state];

  switch (transition.type) {
    case 'split':
      return transition.targets.map((target) => ({ ...path, state: target }));
    case 'assert':
      return [
        {
          ...path,
          state: transition.target,
          allowed:
            path.allowed &
            allowedAfter(
              transition.test,
              transition.multiline,
              transition.unicodeWord,
              past.kinds[pastState]
            ),
        },
      ];
    case 'enter':
      return path.loops.includes(transition.loop)
        ? []
        : [
            {
              ...path,
              state: transition.target,
              loops: [...path.loops, transition.loop],
            },
          ];
    case 'exit':
      return path.loops.includes(transition.loop)
        ? []
        : [{ ...path, state: transition.target }];
    case 'doubt':
      return [{ ...path, state: transition.target, certain: false }];
    case 'invoke':
      return [
        {
          ...path,
          state: transition.target,
          certain: false,
          marks: [...path.marks, transition.look],
        },
      ];
    case 'recall':
      return [
        {
          ...path,
          state: transition.target,
          allowed: past.recalling
            ? path.allowed & recalledKinds(past, pastState, transition)
            : path.allowed,
          certain: path.certain && past.recalling,
          marks: [...path.marks, transition.look],
        },
      ];
    case 'gate':
      return [
        {
          ...path,
          state: transition.target,
          gates: [
            ...path.gates,
            {
              look: transition.look,
              negative: transition.negative,
              past: pastState,
            },
          ],
        },
      ];
    case 'consume':
      if ((alphabet.setKinds[transition.set] & path.allowed) !== 0)
        out.push({
          type: 'consume',
          state: path.state,
          kinds: path.allowed,
          certain: path.certain && transition.certain,
          marks: path.marks,
          gates: path.gates,
        });
      return [];
    case 'accept':
      if ((path.allowed & maskOf(BOUNDARY)) !== 0)
        out.push({ type: 'accept', certain: path.certain, gates: path.gates });
      return [];
    case 'success':
      out.push({
        type: 'success',
        context: transition.context,
        kinds: path.allowed,
        certain: path.certain,
        gates: path.gates,
      });
      return [];
    case 'recalled':
    case 'dead':
      return [];
  }
};

const collectClosure = (
  automaton: EpsilonAutomaton,
  alphabet: Alphabet,
  past: Past,
  pastState: number,
  state: number,
  meter: WorkMeter
): ClosureItem[] => {
  const out: ClosureItem[] = [];
  const pending: ClosurePath[] = [
    {
      state,
      allowed: ALL_KINDS,
      loops: [],
      certain: true,
      marks: [],
      gates: [],
    },
  ];

  while (pending.length > 0) {
    const path = pending.pop();

    spend(meter, 1);

    if (!path || path.allowed === 0) continue;

    const next = closureStep(automaton, alphabet, past, pastState, path, out);

    for (let index = next.length - 1; index >= 0; index -= 1)
      pending.push(next[index]);
  }

  return out;
};

const gatesKey = (gates: readonly ClosureGate[]): string =>
  gates
    .map(({ look, negative, past }) => `${look}${negative ? '!' : '='}${past}`)
    .join('/');

const itemKey = (item: ClosureItem): string => {
  const gates = gatesKey(item.gates);

  if (item.type === 'consume')
    return `c${item.state}.${item.kinds}.${item.certain ? 1 : 0}.${item.marks.join('/')}.${gates}`;

  if (item.type === 'accept') return `a${item.certain ? 1 : 0}.${gates}`;

  return `s${item.context}.${item.kinds}.${item.certain ? 1 : 0}.${gates}`;
};

const successorsOf = (transition: EpsilonTransition): readonly number[] => {
  switch (transition.type) {
    case 'split':
      return transition.targets;
    case 'accept':
    case 'success':
    case 'recalled':
    case 'dead':
      return [];
    default:
      return [transition.target];
  }
};

const leadsToRecall = (automaton: EpsilonAutomaton): Uint8Array => {
  const predecessors = automaton.transitions.map((): number[] => []);
  const recalls = automaton.transitions.flatMap((transition, state) =>
    transition.type === 'recall' ? [state] : []
  );

  automaton.transitions.forEach((transition, state) => {
    for (const target of successorsOf(transition))
      predecessors[target].push(state);
  });

  return reach(automaton.transitions.length, recalls, (state, visit) => {
    for (const source of predecessors[state]) visit(source);
  });
};

const pushEvent = (
  events: Map<number, StepEvent[]>,
  piece: number,
  event: StepEvent
): void => {
  const list = events.get(piece);

  if (list) list.push(event);
  else events.set(piece, [event]);
};

const contextSpanOf = (automaton: EpsilonAutomaton): number => {
  let highest = 0;

  for (const transition of automaton.transitions)
    if (transition.type === 'consume' || transition.type === 'success')
      highest = Math.max(highest, transition.context);

  for (const gate of automaton.gates) highest = Math.max(highest, gate.context);

  return highest + 1;
};

/** Removes ε-moves, turning the automaton into prioritized per-piece steps between closures, each aware of the text it follows */
export const buildOrdered = (
  automaton: EpsilonAutomaton,
  alphabet: Alphabet,
  past: Past,
  meter: WorkMeter
): OrderedAutomaton => {
  const closureIds = new Map<number, number>();
  const closureItems: ClosureItem[][] = [];
  const closureSignatures: number[] = [];
  const signatureIds = new Map<string, number>();
  const stateIds = new Map<number, number>();
  const states: OrderedState[] = [];
  const queue: number[] = [];
  const contextSpan = contextSpanOf(automaton);
  const pastSpan = past.kinds.length + 1;
  const ahead = past.recalling ? leadsToRecall(automaton) : null;

  const pastAt = (pastState: number, state: number): number =>
    ahead === null || ahead[state] ? pastState : forget(past, pastState);

  const closureOf = (pastState: number, state: number): number => {
    const key = pastState * automaton.transitions.length + state;
    const cached = closureIds.get(key);

    if (cached !== undefined) return cached;

    const items = collectClosure(
      automaton,
      alphabet,
      past,
      pastState,
      state,
      meter
    );
    const text = items.map(itemKey).join(';');
    const signature = signatureIds.get(text) ?? signatureIds.size;

    signatureIds.set(text, signature);
    closureIds.set(key, closureItems.length);
    closureItems.push(items);
    closureSignatures.push(signature);
    return closureItems.length - 1;
  };

  const intern = (
    pastState: number,
    state: number,
    context: number
  ): number => {
    const closure = closureOf(pastState, state);
    const remembered = past.recalling && pastState < past.forgotten;
    const key =
      (closureSignatures[closure] * contextSpan + context) * pastSpan +
      (remembered ? pastState + 1 : 0);
    const known = stateIds.get(key);

    if (known !== undefined) return known;

    const items = closureItems[closure];
    const marks = [
      ...new Set(
        items.flatMap((item) => (item.type === 'consume' ? item.marks : []))
      ),
    ];

    states.push({
      past: pastState,
      context,
      items,
      marks,
      exits: [],
      events: new Map(),
    });
    spend(meter, 1);
    stateIds.set(key, states.length - 1);
    queue.push(states.length - 1);
    return states.length - 1;
  };

  const resolve = (gates: readonly ClosureGate[]): StepGate[] =>
    gates.map((gate) => ({
      state: intern(
        pastAt(gate.past, automaton.gates[gate.look].start),
        automaton.gates[gate.look].start,
        automaton.gates[gate.look].context
      ),
      negative: gate.negative,
      depth: automaton.gates[gate.look].depth,
    }));

  const starts = [
    ...new Set(
      past.starts.map((pastState) =>
        intern(pastAt(pastState, automaton.start), automaton.start, 0)
      )
    ),
  ];

  for (let head = 0; head < queue.length; head += 1) {
    const state = states[queue[head]];

    for (const item of state.items) {
      if (item.type !== 'consume') {
        if (!item.certain) continue;

        const gates = resolve(item.gates);

        if (item.type === 'accept') {
          if (state.context === 0)
            state.exits.push({ kinds: maskOf(BOUNDARY), gates });
          continue;
        }

        if (item.context === state.context)
          state.exits.push({ kinds: item.kinds, gates });

        alphabet.pieceKinds.forEach((kind, piece) => {
          if ((item.kinds & maskOf(kind)) !== 0)
            pushEvent(state.events, piece, {
              type: 'stop',
              context: item.context,
              gates,
            });
        });
        continue;
      }

      const transition = automaton.transitions[item.state];

      if (transition.type !== 'consume') continue;

      const gates = resolve(item.gates);

      for (const piece of alphabet.setPieces[transition.set]) {
        const kind = alphabet.pieceKinds[piece];

        if ((item.kinds & maskOf(kind)) === 0) continue;

        pushEvent(state.events, piece, {
          type: 'move',
          target: intern(
            pastAt(
              past.next[state.past * past.pieces + piece],
              transition.target
            ),
            transition.target,
            transition.context
          ),
          certain: item.certain,
          context: transition.context,
          prefix: transition.prefix,
          gates,
        });
        spend(meter, 1);
      }
    }
  }

  return { states, starts };
};

const forEachShadow = (
  ordered: OrderedAutomaton,
  visit: (source: number, target: number) => void
): void =>
  ordered.states.forEach((state, source) => {
    for (const events of state.events.values()) {
      const laterContexts = new Set<number>();

      for (let index = events.length - 1; index >= 0; index -= 1) {
        const event = events[index];

        if (event.type !== 'move') continue;
        if (event.certain && laterContexts.has(event.context))
          visit(source, event.target);

        laterContexts.add(event.context);
      }
    }
  });

/** Lists the step targets whose success would cancel a later step */
const shadowingTargets = (
  ordered: OrderedAutomaton,
  keep: (state: number) => boolean
): Set<number> => {
  const shadowing = new Set<number>();

  forEachShadow(ordered, (source, target) => {
    if (keep(source)) shadowing.add(target);
  });

  return shadowing;
};

/** Marks the states whose next step depends on the input left to read, through a sibling or a lookahead */
export const decidingStates = (ordered: OrderedAutomaton): Uint8Array => {
  const deciding = new Uint8Array(ordered.states.length);

  forEachShadow(ordered, (source) => {
    deciding[source] = 1;
  });

  ordered.states.forEach((state, id) => {
    for (const events of state.events.values())
      if (events.some((event) => event.gates.length > 0)) deciding[id] = 1;
  });

  return deciding;
};

/** Lists the states that succeed whatever input follows */
export const sureStates = (
  ordered: OrderedAutomaton,
  alphabet: Alphabet
): Set<number> => {
  const following = alphabet.pieceKinds.reduce(
    (mask, kind) => mask | maskOf(kind),
    maskOf(BOUNDARY)
  );

  return new Set(
    ordered.states.flatMap((state, id) =>
      state.exits.some(
        (exit) =>
          exit.gates.length === 0 && (exit.kinds & following) === following
      )
        ? [id]
        : []
    )
  );
};

/** Lists the lookahead bodies the given states consult */
const gateStates = (
  ordered: OrderedAutomaton,
  keep: (state: number) => boolean
): Set<number> => {
  const gated = new Set<number>();

  ordered.states.forEach((state, id) => {
    if (!keep(id)) return;

    for (const exit of state.exits)
      for (const gate of exit.gates) gated.add(gate.state);

    for (const events of state.events.values())
      for (const event of events)
        for (const gate of event.gates) gated.add(gate.state);
  });

  return gated;
};

/** Lays the prioritized steps out as a plain graph whose labels are the pieces they consume */
export const orderedGraph = (ordered: OrderedAutomaton): Digraph => {
  const sources: number[] = [];
  const targets: number[] = [];
  const labels: number[] = [];

  ordered.states.forEach((state, id) => {
    for (const [piece, events] of state.events)
      for (const event of events) {
        if (event.type !== 'move') continue;

        sources.push(id);
        targets.push(event.target);
        labels.push(piece);
      }
  });

  return toDigraph(ordered.states.length, sources, targets, labels);
};

/** Lists the states whose success the kept states consult, through a shadowed step or a lookahead gate */
export const consultedStates = (
  ordered: OrderedAutomaton,
  keep: (state: number) => boolean
): Set<number> =>
  new Set([...shadowingTargets(ordered, keep), ...gateStates(ordered, keep)]);
