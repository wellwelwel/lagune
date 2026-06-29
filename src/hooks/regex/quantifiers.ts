import type {
  Alternative,
  AtomBody,
  AtomScan,
  CharSet,
  ClassFootprint,
  GateResult,
  MemberSet,
  QuantifierMark,
  QuantifierScan,
  RegexScanCursor,
  SequenceScan,
} from '../../types/hooks/regex.js';

const escapeOverlaps = (left: string, right: string): boolean => {
  if (left === right) return true;

  const pair = new Set([left, right]);

  return pair.has('d') && pair.has('w');
};

const literalMatchesEscape = (literal: string, escape: string): boolean => {
  if (escape === 'w') return /[A-Za-z0-9_]/.test(literal);
  if (escape === 'd') return /[0-9]/.test(literal);
  if (escape === 's') return /\s/.test(literal);

  return false;
};

const isEscapeMember = (member: string): boolean =>
  member.length === 2 && member[0] === '\\';

const isRangeMember = (member: string): boolean =>
  member.length === 3 && member[1] === '-';

const literalInRange = (literal: string, range: string): boolean =>
  literal >= range[0] && literal <= range[2];

const rangesOverlap = (left: string, right: string): boolean =>
  left[0] <= right[2] && right[0] <= left[2];

const escapeMeetsRange = (escape: string, range: string): boolean => {
  if (escape === 'w')
    return (
      rangesOverlap('a-z', range) ||
      rangesOverlap('A-Z', range) ||
      rangesOverlap('0-9', range)
    );
  if (escape === 'd') return rangesOverlap('0-9', range);
  if (escape === 's') return false;

  return true;
};

const memberPairOverlaps = (left: string, right: string): boolean => {
  const leftRange = isRangeMember(left);
  const rightRange = isRangeMember(right);
  const leftEscape = isEscapeMember(left);
  const rightEscape = isEscapeMember(right);

  if (leftRange && rightRange) return rangesOverlap(left, right);
  if (leftRange)
    return rightEscape
      ? escapeMeetsRange(right[1], left)
      : literalInRange(right, left);
  if (rightRange)
    return leftEscape
      ? escapeMeetsRange(left[1], right)
      : literalInRange(left, right);

  if (leftEscape && rightEscape) return escapeOverlaps(left[1], right[1]);
  if (leftEscape) return literalMatchesEscape(right, left[1]);
  if (rightEscape) return literalMatchesEscape(left, right[1]);

  return left === right;
};

const membersOverlap = (left: Set<string>, right: Set<string>): boolean => {
  for (const member of left)
    for (const other of right)
      if (memberPairOverlaps(member, other)) return true;

  return false;
};

const isCoveredBy = (member: string, set: Set<string>): boolean => {
  for (const other of set) if (memberPairOverlaps(member, other)) return true;

  return false;
};

const isSubsetOf = (inner: Set<string>, outer: Set<string>): boolean => {
  for (const member of inner) if (!isCoveredBy(member, outer)) return false;

  return true;
};

const positiveMeetsNegated = (
  positive: MemberSet,
  negated: MemberSet
): boolean => !isSubsetOf(positive.members, negated.members);

const membersSetsOverlap = (left: MemberSet, right: MemberSet): boolean => {
  if (!left.negated && !right.negated)
    return membersOverlap(left.members, right.members);

  if (left.negated && right.negated) return true;

  return left.negated
    ? positiveMeetsNegated(right, left)
    : positiveMeetsNegated(left, right);
};

const charSetsOverlap = (left: CharSet, right: CharSet): boolean => {
  if (left === 'none' || right === 'none') return false;
  if (left === 'any' || right === 'any') return true;

  return membersSetsOverlap(left, right);
};

const unionCharSet = (left: CharSet, right: CharSet): CharSet => {
  if (left === 'any' || right === 'any') return 'any';
  if (left === 'none') return right;
  if (right === 'none') return left;
  if (left.negated || right.negated) return 'any';

  return {
    members: new Set([...left.members, ...right.members]),
    negated: false,
  };
};

const anyOverlap = (sets: CharSet[]): boolean => {
  for (let left = 0; left < sets.length; left += 1)
    for (let right = left + 1; right < sets.length; right += 1)
      if (charSetsOverlap(sets[left], sets[right])) return true;

  return false;
};

const isRangeQuantifierAt = (source: string, position: number): boolean => {
  if (source[position] !== '{') return false;

  const closing = source.indexOf('}', position);

  if (closing === -1) return false;

  return /^\{\d+(,\d*)?\}$/.test(source.slice(position, closing + 1));
};

const isUnboundedRange = (range: string): boolean => /^\{\d+,\}$/.test(range);

const requiresOneRepetition = (range: string): boolean =>
  !/^\{0[,}]/.test(range);

const consumeQuantifier = (cursor: RegexScanCursor): QuantifierMark => {
  const char = cursor.source[cursor.position];
  let unbounded = false;
  let required = false;

  if (char === '*' || char === '+' || char === '?') {
    unbounded = char !== '?';
    required = char === '+';
    cursor.position += 1;
  } else if (isRangeQuantifierAt(cursor.source, cursor.position)) {
    const closing = cursor.source.indexOf('}', cursor.position);
    const range = cursor.source.slice(cursor.position, closing + 1);

    unbounded = isUnboundedRange(range);
    required = requiresOneRepetition(range);
    cursor.position = closing + 1;
  } else
    return {
      quantified: false,
      greedy: false,
      unbounded: false,
      required: true,
    };

  let greedy = true;

  if (cursor.source[cursor.position] === '?') {
    cursor.position += 1;
    greedy = false;
  }

  cursor.repetitionCount += 1;

  return { quantified: true, greedy, unbounded, required };
};

const BROAD_ESCAPES = new Set(['w', 'W', 's', 'S', 'D']);

const isBroadEscape = (escape: string): boolean => BROAD_ESCAPES.has(escape);

const escapeCharSet = (escape: string): CharSet => {
  const lower = escape.toLowerCase();

  if ('dws'.includes(lower))
    return { members: new Set([`\\${lower}`]), negated: escape !== lower };

  return { members: new Set([escape]), negated: false };
};

const readClassFootprint = (cursor: RegexScanCursor): ClassFootprint => {
  cursor.position += 1;

  const negated = cursor.source[cursor.position] === '^';

  if (negated) cursor.position += 1;

  const members = new Set<string>();

  while (cursor.position < cursor.source.length) {
    const char = cursor.source[cursor.position];

    if (char === ']') {
      cursor.position += 1;

      return { charSet: { members, negated }, negated };
    }

    if (char === '\\') {
      const next = cursor.source[cursor.position + 1] ?? '';

      members.add('dws'.includes(next.toLowerCase()) ? `\\${next}` : next);
      cursor.position += 2;
      continue;
    }

    const after = cursor.source[cursor.position + 1];
    const rangeEnd = cursor.source[cursor.position + 2];

    if (after === '-' && rangeEnd !== undefined && rangeEnd !== ']') {
      members.add(`${char}-${rangeEnd}`);
      cursor.position += 3;
      continue;
    }

    members.add(char);
    cursor.position += 1;
  }

  return { charSet: { members, negated }, negated };
};

const characterBody = (charSet: CharSet, permissive: boolean): AtomBody => ({
  charSet,
  endsGreedy: false,
  singleChar: true,
  permissive,
  gatedDanger: false,
  consumes: true,
  loopAmbiguous: false,
});

const ASSERTION_PREFIXES = ['?=', '?!', '?<=', '?<!'];

const assertionPrefixAt = (source: string, position: number): string | null => {
  for (const prefix of ASSERTION_PREFIXES)
    if (source.startsWith(prefix, position)) return prefix;

  return null;
};

const skipGroupBody = (cursor: RegexScanCursor): void => {
  let depth = 1;

  while (cursor.position < cursor.source.length && depth > 0) {
    const char = cursor.source[cursor.position];

    if (char === '\\') {
      cursor.position += 2;
      continue;
    }

    if (char === '[') {
      readClassFootprint(cursor);
      continue;
    }

    if (char === '(') depth += 1;
    else if (char === ')') depth -= 1;

    cursor.position += 1;
  }

  cursor.position -= 1;
};

const emptyBody = (): AtomBody => ({
  charSet: 'none',
  endsGreedy: false,
  singleChar: false,
  permissive: false,
  gatedDanger: false,
  consumes: false,
  loopAmbiguous: false,
});

const scanAtomBody = (cursor: RegexScanCursor): AtomBody => {
  const char = cursor.source[cursor.position];

  if (char === '(') {
    cursor.position += 1;

    const assertion = assertionPrefixAt(cursor.source, cursor.position);

    if (assertion) {
      cursor.position += assertion.length;
      skipGroupBody(cursor);
      cursor.position += 1;

      return emptyBody();
    }

    const group = scanSequence(cursor);
    cursor.position += 1;

    return {
      charSet: group.footprint,
      endsGreedy: group.endsGreedy,
      singleChar: false,
      permissive: group.permissiveTail,
      gatedDanger: group.unresolvedDanger,
      consumes: group.required,
      loopAmbiguous: group.loopAmbiguous,
    };
  }

  if (char === '[') {
    const { charSet, negated } = readClassFootprint(cursor);

    return characterBody(charSet, negated);
  }

  if (char === '.') {
    cursor.position += 1;

    return characterBody('any', true);
  }

  if (char === '\\') {
    const next = cursor.source[cursor.position + 1] ?? '';
    cursor.position += 2;

    return characterBody(escapeCharSet(next), isBroadEscape(next));
  }

  cursor.position += 1;

  return characterBody({ members: new Set([char]), negated: false }, false);
};

const scanAtom = (cursor: RegexScanCursor): AtomScan => {
  const body = scanAtomBody(cursor);
  const mark = consumeQuantifier(cursor);
  const loops = mark.quantified && mark.greedy && mark.unbounded;
  const directTail = loops && body.singleChar;
  const groupTail = !mark.quantified && body.endsGreedy;
  const directPermissive = loops && body.permissive;
  const groupPermissive = !mark.quantified && body.permissive;
  const nested = loops && body.loopAmbiguous;

  return {
    charSet: body.charSet,
    loops,
    tailGreedy: directTail || groupTail,
    permissiveTail: directPermissive || groupPermissive,
    gatedDanger: nested || body.gatedDanger,
    required: body.consumes && mark.required,
  };
};

const adjacentOverlap = (previous: AtomScan, atom: AtomScan): boolean =>
  previous.loops &&
  atom.loops &&
  charSetsOverlap(previous.charSet, atom.charSet);

const resolveGates = (
  atoms: AtomScan[],
  followedByRequired: boolean
): GateResult => {
  let suffixRequired = followedByRequired;
  let confirmed = false;
  let unresolved = false;

  for (let index = atoms.length - 1; index >= 0; index -= 1) {
    const atom = atoms[index];

    if (atom.gatedDanger) {
      if (suffixRequired) confirmed = true;
      else unresolved = true;
    }

    if (atom.required) suffixRequired = true;
  }

  return { confirmed, unresolved };
};

const anchorAtom = (): AtomScan => ({
  charSet: 'none',
  loops: false,
  tailGreedy: false,
  permissiveTail: false,
  gatedDanger: false,
  required: true,
});

const scanAlternative = (cursor: RegexScanCursor): Alternative => {
  const atoms: AtomScan[] = [];
  const realAtoms: AtomScan[] = [];
  let footprint: CharSet = 'none';
  let loops = false;
  let previous: AtomScan | null = null;
  let pendingScan = false;

  while (cursor.position < cursor.source.length) {
    const char = cursor.source[cursor.position];

    if (char === ')' || char === '|') break;

    if (char === '$') {
      if (!cursor.anchored && previous?.tailGreedy) cursor.backtrack = true;

      atoms.push(anchorAtom());
      previous = null;
      cursor.position += 1;
      continue;
    }

    if (char === '^') {
      if (realAtoms.length === 0) cursor.anchored = true;

      cursor.position += 1;
      continue;
    }

    const atom = scanAtom(cursor);

    if (pendingScan && !cursor.anchored) cursor.backtrack = true;

    footprint = unionCharSet(footprint, atom.charSet);
    loops = loops || atom.loops;

    if (previous && adjacentOverlap(previous, atom)) atom.gatedDanger = true;

    if (atom.permissiveTail) pendingScan = true;

    atoms.push(atom);
    realAtoms.push(atom);
    previous = atom;
  }

  const lastReal = realAtoms[realAtoms.length - 1] ?? null;

  return {
    atoms,
    footprint,
    loops,
    endsGreedy: lastReal?.tailGreedy ?? false,
    permissiveTail: lastReal?.permissiveTail ?? false,
    required: atoms.some((atom) => atom.required),
  };
};

const scanSequence = (cursor: RegexScanCursor): SequenceScan => {
  const alternatives: Alternative[] = [scanAlternative(cursor)];

  while (cursor.source[cursor.position] === '|') {
    cursor.position += 1;
    alternatives.push(scanAlternative(cursor));
  }

  let unresolvedDanger = false;

  for (const alternative of alternatives) {
    const { confirmed, unresolved } = resolveGates(alternative.atoms, false);

    if (confirmed) cursor.backtrack = true;
    if (unresolved) unresolvedDanger = true;
  }

  const footprints = alternatives.map((alternative) => alternative.footprint);
  const alternationOverlap = alternatives.length > 1 && anyOverlap(footprints);
  const containsLoop = alternatives.some((alternative) => alternative.loops);

  return {
    footprint: footprints.reduce(unionCharSet, 'none'),
    endsGreedy: alternatives.some((alternative) => alternative.endsGreedy),
    permissiveTail: alternatives.some(
      (alternative) => alternative.permissiveTail
    ),
    unresolvedDanger,
    required: alternatives.every((alternative) => alternative.required),
    loopAmbiguous: alternationOverlap || containsLoop,
  };
};

export const scanQuantifiers = (source: string): QuantifierScan => {
  const cursor: RegexScanCursor = {
    source,
    position: 0,
    repetitionCount: 0,
    anchored: false,
    backtrack: false,
  };
  scanSequence(cursor);

  return {
    repetitionCount: cursor.repetitionCount,
    backtrack: cursor.backtrack,
  };
};
