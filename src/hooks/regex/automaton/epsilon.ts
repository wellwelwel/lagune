import type {
  AssertionNode,
  AutomatonJob,
  BuildScope,
  CodeSet,
  EpsilonAutomaton,
  EpsilonBuilder,
  EpsilonTransition,
  Fragment,
  LookNode,
  RegexNode,
  RepeatNode,
} from '../../../types/hooks/regex.js';
import { spend } from '../budget.js';
import { rangeSet, setKey } from '../syntax/codeset.js';
import {
  alternationOf,
  canMatchEmpty,
  charNode,
  EMPTY_NODE,
  reverseNode,
  someNode,
} from '../syntax/tree.js';
import { universeLimit } from '../syntax/unicode.js';
import {
  BOUNDARY,
  EXTRA_WORD,
  isLineTest,
  KINDS,
  LINE,
  maskOf,
  OTHER,
  WORD,
} from './kinds.js';
import { shapeOf } from './shape.js';

const DEAD: EpsilonTransition = { type: 'dead' };

const addState = (builder: EpsilonBuilder): number => {
  builder.transitions.push(DEAD);
  spend(builder.meter, 1);
  return builder.transitions.length - 1;
};

const link = (
  builder: EpsilonBuilder,
  state: number,
  transition: EpsilonTransition
): void => {
  builder.transitions[state] = transition;
};

const setId = (builder: EpsilonBuilder, set: CodeSet): number => {
  const key = setKey(set);
  const known = builder.setIds.get(key);

  if (known !== undefined) return known;

  builder.sets.push(set);
  builder.setIds.set(key, builder.sets.length - 1);
  return builder.sets.length - 1;
};

const emptyFragment = (builder: EpsilonBuilder): Fragment => {
  const state = addState(builder);

  return [state, state];
};

const consumeFragment = (
  builder: EpsilonBuilder,
  set: CodeSet,
  scope: BuildScope
): Fragment => {
  const start = addState(builder);
  const end = addState(builder);

  link(builder, start, {
    type: 'consume',
    set: setId(builder, set),
    target: end,
    context: scope.context,
    certain: scope.certain,
    prefix: false,
  });
  return [start, end];
};

const chain = (
  builder: EpsilonBuilder,
  fragments: readonly Fragment[]
): Fragment => {
  for (let index = 1; index < fragments.length; index += 1)
    link(builder, fragments[index - 1][1], {
      type: 'split',
      targets: [fragments[index][0]],
    });

  return [fragments[0][0], fragments[fragments.length - 1][1]];
};

const sequenceFragment = (
  builder: EpsilonBuilder,
  items: readonly RegexNode[],
  scope: BuildScope
): Fragment => {
  if (items.length === 0) return emptyFragment(builder);

  return chain(
    builder,
    items.map((item) => buildNode(builder, item, scope))
  );
};

const alternationFragment = (
  builder: EpsilonBuilder,
  branches: readonly RegexNode[],
  scope: BuildScope
): Fragment => {
  const fragments = branches.map((branch) => buildNode(builder, branch, scope));
  const start = addState(builder);
  const end = addState(builder);

  link(builder, start, {
    type: 'split',
    targets: fragments.map(([branchStart]) => branchStart),
  });

  for (const [, branchEnd] of fragments)
    link(builder, branchEnd, { type: 'split', targets: [end] });

  return [start, end];
};

const starFragment = (
  builder: EpsilonBuilder,
  body: RegexNode,
  lazy: boolean,
  scope: BuildScope
): Fragment => {
  const [bodyStart, bodyEnd] = buildNode(builder, body, scope);
  const loop = builder.loops;
  const start = addState(builder);
  const entry = addState(builder);
  const leave = addState(builder);
  const end = addState(builder);

  builder.loops += 1;
  link(builder, start, {
    type: 'split',
    targets: lazy ? [leave, entry] : [entry, leave],
  });
  link(builder, entry, { type: 'enter', loop, target: bodyStart });
  link(builder, bodyEnd, { type: 'split', targets: [start] });
  link(builder, leave, { type: 'exit', loop, target: end });
  return [start, end];
};

const plusFragment = (
  builder: EpsilonBuilder,
  body: RegexNode,
  lazy: boolean,
  scope: BuildScope
): Fragment => {
  const [bodyStart, bodyEnd] = buildNode(builder, body, scope);
  const loop = builder.loops;
  const again = addState(builder);
  const leave = addState(builder);
  const end = addState(builder);

  builder.loops += 1;
  link(builder, bodyEnd, {
    type: 'split',
    targets: lazy ? [leave, again] : [again, leave],
  });
  link(builder, again, { type: 'enter', loop, target: bodyStart });
  link(builder, leave, { type: 'exit', loop, target: end });
  return [bodyStart, end];
};

const optionalIteration = (
  builder: EpsilonBuilder,
  [bodyStart, bodyEnd]: Fragment,
  next: number,
  end: number,
  lazy: boolean
): number => {
  const loop = builder.loops;
  const start = addState(builder);
  const entry = addState(builder);

  builder.loops += 1;
  link(builder, start, {
    type: 'split',
    targets: lazy ? [end, entry] : [entry, end],
  });
  link(builder, entry, { type: 'enter', loop, target: bodyStart });
  link(builder, bodyEnd, { type: 'exit', loop, target: next });
  return start;
};

const nestedOptional = (
  builder: EpsilonBuilder,
  body: RegexNode,
  depth: number,
  lazy: boolean,
  scope: BuildScope
): Fragment => {
  const end = addState(builder);
  let start = end;

  for (let level = 0; level < depth; level += 1)
    start = optionalIteration(
      builder,
      buildNode(builder, body, scope),
      start,
      end,
      lazy
    );

  return [start, end];
};

const repeatFragment = (
  builder: EpsilonBuilder,
  node: RepeatNode,
  scope: BuildScope
): Fragment => {
  const { body, min, max, lazy } = node;

  if (max === 0) return emptyFragment(builder);
  if (min === 0 && max === Infinity)
    return starFragment(builder, body, lazy, scope);
  if (min === 1 && max === Infinity)
    return plusFragment(builder, body, lazy, scope);

  const required = Array.from({ length: min }, () =>
    buildNode(builder, body, scope)
  );

  if (min === max) return chain(builder, required);

  const rest =
    max === Infinity
      ? starFragment(builder, body, lazy, scope)
      : nestedOptional(builder, body, max - min, lazy, scope);

  return chain(builder, [...required, rest]);
};

const assertionFragment = (
  builder: EpsilonBuilder,
  node: AssertionNode
): Fragment => {
  const lineAnchor = isLineTest(node.test);

  if (lineAnchor && !builder.keepsLines) return emptyFragment(builder);

  const start = addState(builder);
  const end = addState(builder);

  link(builder, start, {
    type: 'assert',
    test: node.test,
    multiline: node.multiline,
    unicodeWord: node.unicodeWord,
    target: end,
  });
  return [start, end];
};

const isPlain = (node: RegexNode): boolean =>
  !someNode(
    node,
    (inner) =>
      inner.kind === 'backreference' ||
      inner.kind === 'uncertain' ||
      inner.kind === 'look'
  );

const isInline = (builder: EpsilonBuilder, node: LookNode): boolean =>
  node.behind === (builder.direction === 'backward');

const isRecalled = (builder: EpsilonBuilder, node: LookNode): boolean =>
  builder.recalling && isPlain(node.body);

const isRegular = (builder: EpsilonBuilder, node: RegexNode): boolean =>
  !someNode(
    node,
    (inner) =>
      inner.kind === 'backreference' ||
      inner.kind === 'uncertain' ||
      (inner.kind === 'look' &&
        !isInline(builder, inner) &&
        !isRecalled(builder, inner))
  );

const recallFragment = (
  builder: EpsilonBuilder,
  node: LookNode,
  [start, end]: Fragment
): Fragment => {
  const look = builder.looks.length;

  builder.looks.push({
    body: reverseNode(node.body),
    direction: node.behind ? 'backward' : 'forward',
  });

  if (!isRecalled(builder, node)) {
    link(builder, start, { type: 'invoke', look, target: end });
    return [start, end];
  }

  const tracked = builder.recalls.length;
  const [bodyStart, bodyEnd] = buildNode(builder, node.body, {
    context: 0,
    certain: true,
  });

  builder.recalls.push(bodyStart);
  link(builder, bodyEnd, { type: 'recalled', tracked });
  link(builder, start, {
    type: 'recall',
    look,
    tracked,
    negative: node.negative,
    target: end,
  });
  return [start, end];
};

const lookFragment = (
  builder: EpsilonBuilder,
  node: LookNode,
  scope: BuildScope
): Fragment => {
  const start = addState(builder);
  const end = addState(builder);

  if (!isInline(builder, node))
    return recallFragment(builder, node, [start, end]);

  builder.contexts += 1;

  const context = builder.contexts;
  const nested = builder.gates.length;
  const [bodyStart, bodyEnd] = buildNode(builder, node.body, {
    context,
    certain: scope.certain,
  });
  const resume = addState(builder);

  link(builder, bodyEnd, { type: 'success', context });
  link(builder, start, { type: 'split', targets: [bodyStart, resume] });

  if (!isRegular(builder, node.body)) {
    link(builder, resume, { type: 'doubt', target: end });
    return [start, end];
  }

  const depth =
    1 +
    builder.gates
      .slice(nested)
      .reduce((deepest, gate) => Math.max(deepest, gate.depth), 0);

  link(builder, resume, {
    type: 'gate',
    look: builder.gates.length,
    negative: node.negative,
    target: end,
  });
  builder.gates.push({ start: bodyStart, context, depth });
  return [start, end];
};

const uncertainFragment = (
  builder: EpsilonBuilder,
  body: RegexNode,
  scope: BuildScope
): Fragment => {
  const start = addState(builder);
  const [bodyStart, bodyEnd] = buildNode(builder, body, {
    ...scope,
    certain: false,
  });

  link(builder, start, { type: 'doubt', target: bodyStart });
  return [start, bodyEnd];
};

const orient = (builder: EpsilonBuilder, body: RegexNode): RegexNode =>
  builder.direction === 'forward' ? body : reverseNode(body);

const backreferenceFragment = (
  builder: EpsilonBuilder,
  captures: readonly number[],
  scope: BuildScope
): Fragment => {
  if (captures.some((index) => builder.copying.includes(index)))
    return uncertainFragment(
      builder,
      {
        kind: 'repeat',
        body: charNode(builder.universe),
        min: 0,
        max: Infinity,
        lazy: false,
      },
      scope
    );

  const bodies = captures.map((index) =>
    orient(builder, builder.captures.get(index) ?? EMPTY_NODE)
  );
  const copy = alternationOf(bodies);
  const guarded: RegexNode = canMatchEmpty(copy)
    ? copy
    : { kind: 'alternation', branches: [copy, EMPTY_NODE] };

  builder.copying.push(...captures);

  const fragment = uncertainFragment(builder, guarded, scope);

  builder.copying.length -= captures.length;
  return fragment;
};

const buildNode = (
  builder: EpsilonBuilder,
  node: RegexNode,
  scope: BuildScope
): Fragment => {
  switch (node.kind) {
    case 'empty':
      return emptyFragment(builder);
    case 'char':
      return consumeFragment(builder, node.set, scope);
    case 'sequence':
      return sequenceFragment(builder, node.items, scope);
    case 'alternation':
      return alternationFragment(builder, node.branches, scope);
    case 'repeat':
      return repeatFragment(builder, node, scope);
    case 'assertion':
      return assertionFragment(builder, node);
    case 'look':
      return lookFragment(builder, node, scope);
    case 'backreference':
      return backreferenceFragment(builder, node.captures, scope);
    case 'uncertain':
      return uncertainFragment(builder, node.body, scope);
  }
};

const searchLoop = (builder: EpsilonBuilder, bodyStart: number): number => {
  const loop = builder.loops;
  const start = addState(builder);
  const entry = addState(builder);
  const step = addState(builder);
  const leave = addState(builder);

  builder.loops += 1;
  link(builder, start, { type: 'split', targets: [leave, entry] });
  link(builder, entry, { type: 'enter', loop, target: step });
  link(builder, step, {
    type: 'consume',
    set: setId(builder, builder.universe),
    target: start,
    context: 0,
    certain: true,
    prefix: true,
  });
  link(builder, leave, { type: 'exit', loop, target: bodyStart });
  return start;
};

const kindsInUse = (transitions: readonly EpsilonTransition[]): number => {
  let mask = maskOf(BOUNDARY) | maskOf(OTHER);

  for (const transition of transitions) {
    if (transition.type !== 'assert') continue;

    const lineAnchor = isLineTest(transition.test);

    if (lineAnchor && transition.multiline) mask |= maskOf(LINE);
    if (!lineAnchor) mask |= maskOf(WORD);
    if (!lineAnchor && transition.unicodeWord) mask |= maskOf(EXTRA_WORD);
  }

  return mask;
};

const startsAnywhere = (job: AutomatonJob): boolean =>
  job.scope === 'submatch' || (job.scope === 'search' && job.flags.sticky);

/** Compiles an oriented tree into an ordered ε-automaton for its scope, keeping the bodies of lookbehinds to track when recalling */
export const buildEpsilon = (
  job: AutomatonJob,
  recalling: boolean
): EpsilonAutomaton => {
  const shape = shapeOf(job);
  const builder: EpsilonBuilder = {
    transitions: [],
    setIds: new Map(),
    sets: [],
    loops: 0,
    contexts: 0,
    looks: [],
    gates: [],
    captures: job.captures,
    direction: job.direction,
    keepsLines: shape.keepsLines,
    copying: [],
    universe: rangeSet(0, universeLimit(job.flags.unicode)),
    recalling,
    recalls: [],
    meter: job.meter,
  };
  const [bodyStart, bodyEnd] = buildNode(builder, job.root, {
    context: 0,
    certain: true,
  });

  link(
    builder,
    bodyEnd,
    shape.trails ? { type: 'success', context: 0 } : { type: 'accept' }
  );

  const start = shape.searches ? searchLoop(builder, bodyStart) : bodyStart;
  const kinds = kindsInUse(builder.transitions);
  const startKinds = startsAnywhere(job)
    ? KINDS.filter((kind) => (kinds & maskOf(kind)) !== 0)
    : [BOUNDARY];

  return {
    transitions: builder.transitions,
    start,
    startKinds,
    sets: builder.sets,
    looks: builder.looks,
    gates: builder.gates,
    recalls: builder.recalls,
    kinds,
    universe: builder.universe,
  };
};
