import type { CodeSet, RegexNode } from '../../../types/hooks/regex.js';

export const EMPTY_NODE: RegexNode = { kind: 'empty' };

const reversedCache = new WeakMap<RegexNode, RegexNode>();

export const charNode = (set: CodeSet): RegexNode => ({ kind: 'char', set });

export const alternationOf = (branches: readonly RegexNode[]): RegexNode =>
  branches.length === 1 ? branches[0] : { kind: 'alternation', branches };

const reverseFresh = (node: RegexNode): RegexNode => {
  switch (node.kind) {
    case 'sequence':
      return { ...node, items: node.items.map(reverseNode).toReversed() };
    case 'alternation':
      return { ...node, branches: node.branches.map(reverseNode) };
    case 'repeat':
    case 'look':
    case 'uncertain':
      return { ...node, body: reverseNode(node.body) };
    case 'assertion':
      if (node.test === 'begin') return { ...node, test: 'end' };
      if (node.test === 'end') return { ...node, test: 'begin' };
      return node;
    default:
      return node;
  }
};

/** Mirrors a tree into the order a backward matcher reads it */
export const reverseNode = (node: RegexNode): RegexNode => {
  const cached = reversedCache.get(node);

  if (cached) return cached;

  const reversed = reverseFresh(node);

  reversedCache.set(node, reversed);
  return reversed;
};

export const canMatchEmpty = (node: RegexNode): boolean => {
  switch (node.kind) {
    case 'char':
      return false;
    case 'sequence':
      return node.items.every(canMatchEmpty);
    case 'alternation':
      return node.branches.some(canMatchEmpty);
    case 'repeat':
      return node.min === 0 || canMatchEmpty(node.body);
    case 'uncertain':
      return canMatchEmpty(node.body);
    default:
      return true;
  }
};

export const someNode = (
  node: RegexNode,
  predicate: (node: RegexNode) => boolean
): boolean => {
  if (predicate(node)) return true;

  switch (node.kind) {
    case 'sequence':
      return node.items.some((item) => someNode(item, predicate));
    case 'alternation':
      return node.branches.some((branch) => someNode(branch, predicate));
    case 'repeat':
    case 'look':
    case 'uncertain':
      return someNode(node.body, predicate);
    default:
      return false;
  }
};

/** Tells whether a tree can repeat without bound, directly or through what a backreference reads again */
export const repeatsUnbounded = (
  node: RegexNode,
  captures: ReadonlyMap<number, RegexNode>,
  visiting: readonly number[] = []
): boolean =>
  someNode(node, (inner) => {
    if (inner.kind === 'repeat') return inner.max === Infinity;
    if (inner.kind !== 'backreference') return false;

    return inner.captures.some(
      (index) =>
        visiting.includes(index) ||
        repeatsUnbounded(captures.get(index) ?? EMPTY_NODE, captures, [
          ...visiting,
          index,
        ])
    );
  });
