import type {
  CodeSet,
  LookNode,
  RegexNode,
} from '../../../types/hooks/regex.js';
import { EMPTY_SET, intersect, subtract, union } from './codeset.js';
import { charNode } from './tree.js';

const singleCharSet = (node: RegexNode): CodeSet | null => {
  if (node.kind === 'char') return node.set;
  if (node.kind === 'sequence' && node.items.length === 1)
    return singleCharSet(node.items[0]);
  if (node.kind !== 'alternation') return null;

  let set = EMPTY_SET;

  for (const branch of node.branches) {
    const branchSet = singleCharSet(branch);

    if (branchSet === null) return null;

    set = union(set, branchSet);
  }

  return set;
};

const narrow = (
  look: LookNode,
  next: RegexNode | undefined
): RegexNode | null => {
  const filter = look.behind ? null : singleCharSet(look.body);

  if (filter === null || next === undefined) return null;

  const restrict = (set: CodeSet): CodeSet =>
    look.negative ? subtract(set, filter) : intersect(set, filter);

  if (next.kind === 'char') return charNode(restrict(next.set));

  if (next.kind !== 'repeat' || next.min < 1 || next.body.kind !== 'char')
    return null;

  return {
    kind: 'sequence',
    items: [
      charNode(restrict(next.body.set)),
      { ...next, min: next.min - 1, max: next.max - 1 },
    ],
  };
};

/** Folds a lookahead that only ever inspects one character into the character step that follows it */
export const foldLookaheads = (node: RegexNode): RegexNode => {
  switch (node.kind) {
    case 'sequence': {
      const items: RegexNode[] = [];

      for (let index = node.items.length - 1; index >= 0; index -= 1) {
        const item = foldLookaheads(node.items[index]);
        const narrowed = item.kind === 'look' ? narrow(item, items[0]) : null;

        if (narrowed) items[0] = narrowed;
        else items.unshift(item);
      }

      return { ...node, items };
    }
    case 'alternation':
      return { ...node, branches: node.branches.map(foldLookaheads) };
    case 'repeat':
    case 'look':
    case 'uncertain':
      return { ...node, body: foldLookaheads(node.body) };
    default:
      return node;
  }
};
