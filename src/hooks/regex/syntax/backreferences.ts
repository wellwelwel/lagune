import type {
  CaseSplit,
  CodeSet,
  ParsedPattern,
  RegexNode,
} from '../../../types/hooks/regex.js';
import { expandPoints, pointSet, setKey } from './codeset.js';
import { charNode, someNode } from './tree.js';
import { caseClosure } from './unicode.js';

const SPLIT_LIMIT = 8;

const CASE_LIMIT = 16;

const pointCount = (set: CodeSet): number => {
  let count = 0;

  for (let index = 0; index < set.length; index += 2)
    count += set[index + 1] - set[index];

  return count;
};

const product = (
  left: readonly (readonly CodeSet[])[],
  right: readonly (readonly CodeSet[])[]
): (readonly CodeSet[])[] | null =>
  left.length * right.length > SPLIT_LIMIT
    ? null
    : left.flatMap((head) => right.map((tail) => [...head, ...tail]));

const smallLanguage = (node: RegexNode): (readonly CodeSet[])[] | null => {
  switch (node.kind) {
    case 'empty':
      return [[]];
    case 'char':
      return pointCount(node.set) <= SPLIT_LIMIT
        ? expandPoints(node.set).map((point) => [pointSet(point)])
        : null;
    case 'sequence':
      return node.items.reduce<(readonly CodeSet[])[] | null>(
        (strings, item) => {
          const language = strings && smallLanguage(item);

          return strings && language ? product(strings, language) : null;
        },
        [[]]
      );
    case 'alternation': {
      const languages = node.branches.map(smallLanguage);

      if (languages.some((language) => language === null)) return null;

      const strings = languages.flatMap((language) => language ?? []);

      return strings.length <= SPLIT_LIMIT ? strings : null;
    }
    case 'repeat': {
      if (!Number.isFinite(node.max) || node.max > SPLIT_LIMIT) return null;

      const body = smallLanguage(node.body);

      if (!body) return null;

      const strings: (readonly CodeSet[])[] = [];
      let power: (readonly CodeSet[])[] | null = [[]];

      for (let count = 0; count <= node.max && power; count += 1) {
        if (count >= node.min) strings.push(...power);

        power = product(power, body);
      }

      return strings.length <= SPLIT_LIMIT ? strings : null;
    }
    default:
      return null;
  }
};

const literal = (
  string: readonly CodeSet[],
  folded: boolean,
  unicode: boolean
): RegexNode =>
  string.length === 0
    ? { kind: 'empty' }
    : {
        kind: 'sequence',
        items: string.map((set) =>
          charNode(folded ? caseClosure(set, unicode) : set)
        ),
      };

const replaceReferences = (
  node: RegexNode,
  capture: number,
  replacement: RegexNode
): RegexNode => {
  switch (node.kind) {
    case 'backreference':
      return node.captures.length === 1 && node.captures[0] === capture
        ? replacement
        : node;
    case 'sequence':
      return {
        ...node,
        items: node.items.map((item) =>
          replaceReferences(item, capture, replacement)
        ),
      };
    case 'alternation':
      return {
        ...node,
        branches: node.branches.map((branch) =>
          replaceReferences(branch, capture, replacement)
        ),
      };
    case 'repeat':
    case 'look':
    case 'uncertain':
      return {
        ...node,
        body: replaceReferences(node.body, capture, replacement),
      };
    default:
      return node;
  }
};

const countReferences = (node: RegexNode, capture: number): number => {
  switch (node.kind) {
    case 'backreference':
      return node.captures.includes(capture) ? 1 : 0;
    case 'sequence':
      return node.items.reduce(
        (total, item) => total + countReferences(item, capture),
        0
      );
    case 'alternation':
      return node.branches.reduce(
        (total, branch) => total + countReferences(branch, capture),
        0
      );
    case 'repeat':
    case 'look':
    case 'uncertain':
      return countReferences(node.body, capture);
    default:
      return 0;
  }
};

const referencesAfter = (
  node: RegexNode,
  capture: number,
  body: RegexNode
): number => {
  switch (node.kind) {
    case 'sequence': {
      const position = node.items.indexOf(body);

      return node.items.reduce((total, item, index) => {
        if (index === position) return total;
        if (position !== -1 && index > position)
          return total + countReferences(item, capture);

        return total + referencesAfter(item, capture, body);
      }, 0);
    }
    case 'alternation':
      return node.branches.reduce(
        (total, branch) => total + referencesAfter(branch, capture, body),
        0
      );
    case 'repeat':
    case 'look':
    case 'uncertain':
      return referencesAfter(node.body, capture, body);
    default:
      return 0;
  }
};

const valueKey = (string: readonly CodeSet[], pattern: ParsedPattern): string =>
  string
    .map((set) =>
      setKey(
        pattern.flags.ignoreCase ? caseClosure(set, pattern.flags.unicode) : set
      )
    )
    .join('|');

const isPrefixOf = (key: string, other: string): boolean =>
  key === '' || other.startsWith(`${key}|`);

const prefixFree = (keys: readonly string[]): boolean =>
  keys.every((key, index) =>
    keys.every(
      (other, otherIndex) => otherIndex === index || !isPrefixOf(key, other)
    )
  );

const distribute = (
  node: RegexNode,
  capture: number,
  body: RegexNode,
  values: readonly RegexNode[]
): RegexNode => {
  switch (node.kind) {
    case 'sequence': {
      const position = node.items.indexOf(body);
      const items = node.items.map((item, index) =>
        position !== -1 && index >= position
          ? item
          : distribute(item, capture, body, values)
      );

      if (position === -1) return { ...node, items };

      const rest = node.items.slice(position + 1);
      const branches: RegexNode[] = values.map((value) => ({
        kind: 'sequence',
        items: [
          value,
          ...rest.map((item) => replaceReferences(item, capture, value)),
        ],
      }));

      return {
        ...node,
        items: [...items.slice(0, position), { kind: 'alternation', branches }],
      };
    }
    case 'alternation':
      return {
        ...node,
        branches: node.branches.map((branch) =>
          distribute(branch, capture, body, values)
        ),
      };
    case 'repeat':
    case 'look':
    case 'uncertain':
      return { ...node, body: distribute(node.body, capture, body, values) };
    default:
      return node;
  }
};

const distributionValues = (
  root: RegexNode,
  capture: number,
  body: RegexNode,
  pattern: ParsedPattern
): RegexNode[] | null => {
  const total = countReferences(root, capture);
  const strings = total === 0 ? null : smallLanguage(body);
  const shared = someNode(
    root,
    (node) =>
      node.kind === 'backreference' &&
      node.captures.length > 1 &&
      node.captures.includes(capture)
  );

  if (strings === null || shared) return null;
  if (referencesAfter(root, capture, body) !== total) return null;

  const unique = new Map(
    strings.map((string) => [valueKey(string, pattern), string])
  );

  if (!prefixFree([...unique.keys()])) return null;

  return [...unique.values()].map((string) =>
    literal(string, pattern.flags.ignoreCase, pattern.flags.unicode)
  );
};

/** Expands each capture of a few prefix-free values into one branch per value, carrying its later backreferences */
const distributeCaptures = (
  pattern: ParsedPattern
): { root: RegexNode; factor: number } => {
  let root = pattern.root;
  let factor = 1;

  for (const [capture, body] of pattern.captures) {
    const values = distributionValues(root, capture, body, pattern);

    if (values === null || factor * values.length > CASE_LIMIT) continue;

    factor *= values.length;
    root = distribute(root, capture, body, values);
  }

  return { root, factor };
};

const splitsOf = (
  root: RegexNode,
  captures: ParsedPattern['captures']
): CaseSplit[] => {
  if (root.kind !== 'sequence') return [];

  const items = root.items;

  return [...captures].flatMap(([capture, body]) => {
    const position = items.indexOf(body);
    const referenced = items
      .slice(position + 1)
      .some((item) =>
        someNode(
          item,
          (node) =>
            node.kind === 'backreference' && node.captures.includes(capture)
        )
      );
    const strings = position === -1 || !referenced ? null : smallLanguage(body);

    return strings ? [{ capture, position, strings }] : [];
  });
};

const applySplit = (
  items: readonly RegexNode[],
  split: CaseSplit,
  string: readonly CodeSet[],
  pattern: ParsedPattern
): RegexNode[] => {
  const value = literal(
    string,
    pattern.flags.ignoreCase,
    pattern.flags.unicode
  );

  return items.map((item, index) => {
    if (index === split.position) return value;
    if (index < split.position) return item;

    return replaceReferences(item, split.capture, value);
  });
};

/** Lists the trees to judge, each backreference to a capture of a few known values read as one of them */
export const backreferenceCases = (pattern: ParsedPattern): RegexNode[] => {
  const { root, factor } = distributeCaptures(pattern);
  let cases: RegexNode[][] = [
    root.kind === 'sequence' ? [...root.items] : [root],
  ];

  for (const split of splitsOf(root, pattern.captures)) {
    const unique = new Map(
      split.strings.map((string) => [valueKey(string, pattern), string])
    );

    if (factor * cases.length * unique.size > CASE_LIMIT) continue;

    cases = cases.flatMap((items) =>
      [...unique.values()].map((string) =>
        applySplit(items, split, string, pattern)
      )
    );
  }

  return cases.map((items) =>
    items.length === 1 && root.kind !== 'sequence'
      ? items[0]
      : { kind: 'sequence', items }
  );
};
