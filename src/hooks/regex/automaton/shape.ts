import type {
  AutomatonJob,
  AutomatonShape,
  RegexNode,
} from '../../../types/hooks/regex.js';
import { someNode } from '../syntax/tree.js';
import { isLineTest } from './kinds.js';

const isLineAssertion = (node: RegexNode): boolean =>
  node.kind === 'assertion' && isLineTest(node.test);

const lineAssertionInMiddle = (
  node: RegexNode,
  isBegin: boolean,
  isEnd: boolean
): boolean => {
  switch (node.kind) {
    case 'alternation':
      return node.branches.some((branch) =>
        lineAssertionInMiddle(branch, isBegin, isEnd)
      );
    case 'sequence':
      return node.items.some((item, index) =>
        lineAssertionInMiddle(
          item,
          isBegin && index === 0,
          isEnd && index === node.items.length - 1
        )
      );
    case 'repeat':
    case 'look':
    case 'uncertain':
      return lineAssertionInMiddle(node.body, false, false);
    case 'assertion':
      if (node.test === 'begin') return !isBegin;
      if (node.test === 'end') return !isEnd;
      return false;
    default:
      return false;
  }
};

const everyEdge = (
  node: RegexNode,
  atStart: boolean,
  predicate: (node: RegexNode) => boolean
): boolean => {
  switch (node.kind) {
    case 'alternation':
      return node.branches.every((branch) =>
        everyEdge(branch, atStart, predicate)
      );
    case 'sequence':
      return (
        node.items.length > 0 &&
        everyEdge(
          node.items[atStart ? 0 : node.items.length - 1],
          atStart,
          predicate
        )
      );
    case 'empty':
      return false;
    default:
      return predicate(node);
  }
};

const strictLine =
  (test: 'begin' | 'end') =>
  (node: RegexNode): boolean =>
    node.kind === 'assertion' && node.test === test && !node.multiline;

const anyLine =
  (test: 'begin' | 'end') =>
  (node: RegexNode): boolean =>
    node.kind === 'assertion' && node.test === test;

const notLine =
  (test: 'begin' | 'end') =>
  (node: RegexNode): boolean =>
    !(node.kind === 'assertion' && node.test === test);

/** Decides whether the search loop wraps the pattern and whether its line anchors must stay explicit */
const anchoring = (root: RegexNode, sticky: boolean): AutomatonShape => {
  const searches = !sticky && !everyEdge(root, true, strictLine('begin'));
  const trails = !everyEdge(root, false, strictLine('end'));
  const multilineAnchor = someNode(
    root,
    (node) =>
      isLineAssertion(node) && node.kind === 'assertion' && node.multiline
  );
  const anyAnchor = someNode(root, isLineAssertion);
  const ragged =
    (!everyEdge(root, true, anyLine('begin')) &&
      !everyEdge(root, true, notLine('begin'))) ||
    (!everyEdge(root, false, anyLine('end')) &&
      !everyEdge(root, false, notLine('end')));
  const keepsLines =
    sticky ||
    multilineAnchor ||
    (anyAnchor && (lineAssertionInMiddle(root, true, true) || ragged));

  return { searches, trails, keepsLines };
};

const SUBMATCH_SHAPE: AutomatonShape = {
  searches: false,
  trails: true,
  keepsLines: true,
};

export const shapeOf = (job: AutomatonJob): AutomatonShape => {
  if (job.scope === 'submatch') return SUBMATCH_SHAPE;
  if (job.scope === 'search') return anchoring(job.root, job.flags.sticky);

  return { ...anchoring(job.root, false), searches: false, trails: false };
};
