import type {
  Exploration,
  GroupSteps,
  GrowthReport,
  NodeSteps,
  PieceClasses,
  Product,
  WorkMeter,
} from '../../../types/hooks/regex.js';
import { grownInt32 } from '../automaton/buffers.js';
import {
  componentLinks,
  isCyclic,
  reach,
  stronglyConnected,
  toDigraph,
} from '../automaton/graph.js';
import { createKeyIndex, internKey, keyOf } from '../automaton/intern.js';
import { reachCap, spend } from '../budget.js';
import { labelClass, labelPiece } from './product.js';

const PAIRWISE_LIMIT = 16;

const DIAGONAL = 1;

const APART = 2;

const pairKey = (left: number, right: number, width: number): number =>
  left * width + right;

const tripleKey = (
  first: number,
  second: number,
  third: number,
  width: number
): number => (first * width + second) * width + third;

const forks = (targets: readonly number[]): boolean => targets.length > 1;

const nodeSteps = (
  product: Product,
  node: number,
  keep: (target: number) => boolean
): NodeSteps => {
  const { offsets, targets, labels } = product.graph;
  const byPiece: NodeSteps = new Map();

  for (let edge = offsets[node]; edge < offsets[node + 1]; edge += 1) {
    const target = targets[edge];

    if (!keep(target)) continue;

    const piece = labelPiece(product, labels[edge]);
    const klass = labelClass(product, labels[edge]);
    let byClass = byPiece.get(piece);

    if (byClass === undefined) {
      byClass = new Map();
      byPiece.set(piece, byClass);
    }

    const classTargets = byClass.get(klass);

    if (classTargets === undefined) byClass.set(klass, [target]);
    else classTargets.push(target);
  }

  return byPiece;
};

const stepsWithin = (
  product: Product,
  nodes: readonly number[],
  keep: (target: number) => boolean
): GroupSteps => {
  const steps: GroupSteps = new Map();

  for (const node of nodes) steps.set(node, nodeSteps(product, node, keep));

  return steps;
};

const someTargets = (
  steps: GroupSteps,
  predicate: (targets: readonly number[]) => boolean
): boolean => {
  for (const byPiece of steps.values())
    for (const byClass of byPiece.values())
      for (const targets of byClass.values())
        if (predicate(targets)) return true;

  return false;
};

const repeats = (targets: readonly number[]): boolean => {
  if (targets.length > PAIRWISE_LIMIT)
    return new Set(targets).size !== targets.length;

  for (let index = 1; index < targets.length; index += 1)
    for (let earlier = 0; earlier < index; earlier += 1)
      if (targets[earlier] === targets[index]) return true;

  return false;
};

const followPairs = (
  exploration: Exploration,
  head: number,
  width: number,
  leftTargets: readonly number[],
  rightTargets: readonly number[] | undefined
): void => {
  if (rightTargets === undefined) return;

  for (const leftTarget of leftTargets)
    for (const rightTarget of rightTargets)
      follow(
        exploration,
        head,
        pairKey(leftTarget, rightTarget, width),
        leftTarget,
        rightTarget,
        0
      );
};

const followTriples = (
  exploration: Exploration,
  head: number,
  width: number,
  firstTargets: readonly number[],
  secondTargets: readonly number[],
  thirdTargets: readonly number[] | undefined
): void => {
  if (thirdTargets === undefined) return;

  for (const nextFirst of firstTargets)
    for (const nextSecond of secondTargets)
      for (const nextThird of thirdTargets)
        follow(
          exploration,
          head,
          tripleKey(nextFirst, nextSecond, nextThird, width),
          nextFirst,
          nextSecond,
          nextThird
        );
};

/** Follows the third walker's steps whose class agrees with the class the first two settled on, the wildcard agreeing with any */
const followThirds = (
  exploration: Exploration,
  head: number,
  width: number,
  wildcard: number,
  joined: number,
  firstTargets: readonly number[],
  secondTargets: readonly number[] | undefined,
  thirdByClass: ReadonlyMap<number, number[]>
): void => {
  if (secondTargets === undefined) return;

  if (joined === wildcard) {
    for (const thirdTargets of thirdByClass.values())
      followTriples(
        exploration,
        head,
        width,
        firstTargets,
        secondTargets,
        thirdTargets
      );
    return;
  }

  followTriples(
    exploration,
    head,
    width,
    firstTargets,
    secondTargets,
    thirdByClass.get(joined)
  );
  followTriples(
    exploration,
    head,
    width,
    firstTargets,
    secondTargets,
    thirdByClass.get(wildcard)
  );
};

const createExploration = (meter: WorkMeter): Exploration => ({
  index: createKeyIndex(),
  sources: new Int32Array(1024),
  targets: new Int32Array(1024),
  edges: 0,
  parts: new Int32Array(256 * 3),
  meter,
});

/** Numbers a node of the exploration the first time it is reached, keeping its walkers' states */
const reachKey = (
  exploration: Exploration,
  key: number,
  first: number,
  second: number,
  third: number
): number => {
  const { index } = exploration;
  const known = index.count;
  const entry = internKey(index, key);

  if (entry < known) return entry;

  exploration.parts = grownInt32(exploration.parts, index.keys.length * 3);
  exploration.parts[entry * 3] = first;
  exploration.parts[entry * 3 + 1] = second;
  exploration.parts[entry * 3 + 2] = third;
  spend(exploration.meter, 1);
  return entry;
};

const follow = (
  exploration: Exploration,
  head: number,
  key: number,
  first: number,
  second: number,
  third: number
): void => {
  const edge = exploration.edges;

  if (edge === exploration.sources.length) {
    exploration.sources = grownInt32(exploration.sources, edge + 1);
    exploration.targets = grownInt32(exploration.targets, edge + 1);
  }

  exploration.sources[edge] = head;
  exploration.edges = edge + 1;
  exploration.targets[edge] = reachKey(exploration, key, first, second, third);
  spend(exploration.meter, 1);
};

const groupsOf = (exploration: Exploration): Int32Array =>
  stronglyConnected(
    toDigraph(
      exploration.index.count,
      exploration.sources.subarray(0, exploration.edges),
      exploration.targets.subarray(0, exploration.edges),
      new Int32Array(exploration.edges)
    ),
    false
  ).component;

const firstOf = (exploration: Exploration, node: number): number =>
  exploration.parts[node * 3];

const secondOf = (exploration: Exploration, node: number): number =>
  exploration.parts[node * 3 + 1];

const thirdOf = (exploration: Exploration, node: number): number =>
  exploration.parts[node * 3 + 2];

const growsExponentially = (
  product: Product,
  steps: GroupSteps,
  members: readonly number[],
  meter: WorkMeter
): boolean => {
  if (someTargets(steps, repeats)) return true;
  if (!someTargets(steps, forks)) return false;

  const width = product.graph.size;
  const { wildcard } = product;
  const exploration = createExploration(meter);

  for (const node of members)
    reachKey(exploration, pairKey(node, node, width), node, node, 0);

  for (let head = 0; head < exploration.index.count; head += 1) {
    const leftSteps = steps.get(firstOf(exploration, head));
    const rightSteps = steps.get(secondOf(exploration, head));

    if (!leftSteps || !rightSteps) continue;

    for (const [piece, leftByClass] of leftSteps) {
      const rightByClass = rightSteps.get(piece);

      if (!rightByClass) continue;

      for (const [leftClass, leftTargets] of leftByClass) {
        if (leftClass === wildcard) {
          for (const rightTargets of rightByClass.values())
            followPairs(exploration, head, width, leftTargets, rightTargets);
          continue;
        }

        followPairs(
          exploration,
          head,
          width,
          leftTargets,
          rightByClass.get(leftClass)
        );
        followPairs(
          exploration,
          head,
          width,
          leftTargets,
          rightByClass.get(wildcard)
        );
      }
    }
  }

  const groups = groupsOf(exploration);
  const sides = new Uint8Array(exploration.index.count);

  for (let node = 0; node < exploration.index.count; node += 1)
    sides[groups[node]] |=
      firstOf(exploration, node) === secondOf(exploration, node)
        ? DIAGONAL
        : APART;

  return sides.includes(DIAGONAL | APART);
};

const connectsTwoLoops = (
  product: Product,
  component: Int32Array,
  members: readonly (readonly number[])[],
  source: number,
  target: number,
  between: Uint8Array,
  sourceSteps: GroupSteps,
  targetSteps: GroupSteps,
  meter: WorkMeter
): boolean => {
  const width = product.graph.size;

  if (width * width * width > Number.MAX_SAFE_INTEGER) reachCap();

  const { wildcard } = product;
  const bridge = new Map<number, NodeSteps>();
  const exploration = createExploration(meter);

  const inBetween = (node: number): boolean => between[component[node]] === 1;

  const bridgeOf = (node: number): NodeSteps | undefined => {
    const known = bridge.get(node);

    if (known !== undefined) return known;

    const steps = nodeSteps(product, node, inBetween);

    bridge.set(node, steps);
    return steps;
  };

  for (const first of members[source])
    for (const third of members[target])
      reachKey(
        exploration,
        tripleKey(first, first, third, width),
        first,
        first,
        third
      );

  for (let head = 0; head < exploration.index.count; head += 1) {
    const first = firstOf(exploration, head);
    const second = secondOf(exploration, head);
    const third = thirdOf(exploration, head);

    if (second === third && component[second] === target)
      follow(
        exploration,
        head,
        tripleKey(first, first, second, width),
        first,
        first,
        second
      );

    const firstSteps = sourceSteps.get(first);
    const secondSteps = bridgeOf(second);
    const thirdSteps = targetSteps.get(third);

    if (!firstSteps || !secondSteps || !thirdSteps) continue;

    for (const [piece, firstByClass] of firstSteps) {
      const secondByClass = secondSteps.get(piece);
      const thirdByClass = thirdSteps.get(piece);

      if (!secondByClass || !thirdByClass) continue;

      for (const [firstClass, firstTargets] of firstByClass) {
        if (firstClass === wildcard) {
          for (const [secondClass, secondTargets] of secondByClass)
            followThirds(
              exploration,
              head,
              width,
              wildcard,
              secondClass,
              firstTargets,
              secondTargets,
              thirdByClass
            );
          continue;
        }

        followThirds(
          exploration,
          head,
          width,
          wildcard,
          firstClass,
          firstTargets,
          secondByClass.get(firstClass),
          thirdByClass
        );
        followThirds(
          exploration,
          head,
          width,
          wildcard,
          firstClass,
          firstTargets,
          secondByClass.get(wildcard),
          thirdByClass
        );
      }
    }
  }

  const { index } = exploration;
  const groups = groupsOf(exploration);

  for (let node = 0; node < index.count; node += 1) {
    const first = firstOf(exploration, node);
    const second = secondOf(exploration, node);
    const third = thirdOf(exploration, node);

    if (component[third] !== target) continue;
    if (first !== second) continue;

    const partner = keyOf(index, tripleKey(first, third, third, width));

    if (partner !== -1 && groups[partner] === groups[node]) return true;
  }

  return false;
};

const reachableGroups = (
  start: number,
  links: readonly (readonly number[])[],
  meter: WorkMeter
): Uint8Array => {
  spend(meter, links.length);

  return reach(links.length, [start], (group, visit) => {
    for (const next of links[group]) visit(next);
  });
};

const pieceClassesOf = (steps: GroupSteps): PieceClasses => {
  const pieces = new Map<number, Set<number>>();

  for (const byPiece of steps.values())
    for (const [piece, byClass] of byPiece) {
      const classes = pieces.get(piece) ?? new Set<number>();

      for (const klass of byClass.keys()) classes.add(klass);

      pieces.set(piece, classes);
    }

  return pieces;
};

const sharesStep = (
  left: PieceClasses,
  right: PieceClasses,
  wildcard: number
): boolean => {
  for (const [piece, leftClasses] of left) {
    const rightClasses = right.get(piece);

    if (!rightClasses) continue;
    if (leftClasses.has(wildcard) || rightClasses.has(wildcard)) return true;

    for (const klass of leftClasses) if (rightClasses.has(klass)) return true;
  }

  return false;
};

/** Reports whether a product graph lets backtracking explode exponentially, and how many loops it can chain */
export const assessGrowth = (
  product: Product,
  meter: WorkMeter
): GrowthReport => {
  const { graph, wildcard } = product;
  const components = stronglyConnected(graph);
  const { component, members } = components;
  const count = members.length;
  const atomic = members.map((group) => !isCyclic(graph, group));
  const selfSteps: (GroupSteps | undefined)[] = new Array(count);

  const stepsOf = (group: number): GroupSteps =>
    (selfSteps[group] ??= stepsWithin(
      product,
      members[group],
      (target) => component[target] === group
    ));

  for (let group = 0; group < count; group += 1)
    if (
      !atomic[group] &&
      growsExponentially(product, stepsOf(group), members[group], meter)
    )
      return { exponential: true, degree: 2 };

  const { forward, backward } = componentLinks(graph, components);
  const pieceClasses = members.map((_, group) =>
    atomic[group]
      ? new Map<number, Set<number>>()
      : pieceClassesOf(stepsOf(group))
  );
  const degrees = new Int32Array(count);
  const between = new Uint8Array(count);

  for (let group = 0; group < count; group += 1) {
    let deepest = 0;

    for (const next of forward[group])
      deepest = Math.max(deepest, degrees[next]);

    if (deepest === 0) {
      degrees[group] = atomic[group] ? 0 : 1;
      continue;
    }

    if (atomic[group]) {
      degrees[group] = deepest;
      continue;
    }

    const downstream = reachableGroups(group, forward, meter);
    let chained = false;

    for (let target = 0; target < count && !chained; target += 1) {
      if (target === group || !downstream[target] || atomic[target]) continue;
      if (degrees[target] !== deepest) continue;
      if (!sharesStep(pieceClasses[group], pieceClasses[target], wildcard))
        continue;

      const upstream = reachableGroups(target, backward, meter);

      for (let middle = 0; middle < count; middle += 1)
        between[middle] = downstream[middle] && upstream[middle] ? 1 : 0;

      chained = connectsTwoLoops(
        product,
        component,
        members,
        group,
        target,
        between,
        stepsOf(group),
        stepsOf(target),
        meter
      );
    }

    degrees[group] = chained ? deepest + 1 : deepest;
  }

  return {
    exponential: false,
    degree: degrees.reduce((highest, degree) => Math.max(highest, degree), 0),
  };
};
