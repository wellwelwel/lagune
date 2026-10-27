import type {
  Alphabet,
  CodeSet,
  EpsilonAutomaton,
} from '../../../types/hooks/regex.js';
import { lowerBound, subtract } from '../syntax/codeset.js';
import { BASIC_WORD, LINE_TERMINATORS, wordSet } from '../syntax/unicode.js';
import { addRuns, createRunTable, findRuns, hashRuns } from './intern.js';
import { EXTRA_WORD, LINE, maskOf, OTHER, WORD } from './kinds.js';

const kindSets = (
  automaton: EpsilonAutomaton
): readonly (readonly [CodeSet, number])[] => {
  const uses = (kind: number): boolean =>
    (automaton.kinds & maskOf(kind)) !== 0;
  const sets: (readonly [CodeSet, number])[] = [];

  if (uses(LINE)) sets.push([LINE_TERMINATORS, LINE]);
  if (uses(EXTRA_WORD))
    sets.push([subtract(wordSet(true, true), BASIC_WORD), EXTRA_WORD]);
  if (uses(WORD)) sets.push([BASIC_WORD, WORD]);

  return sets;
};

/** Splits the universe into the coarsest pieces that every consumed set and every assertion kind respects */
export const partitionAlphabet = (automaton: EpsilonAutomaton): Alphabet => {
  const kinds = kindSets(automaton);
  const sets = [...automaton.sets, ...kinds.map(([set]) => set)];
  const boundaries = [
    ...new Set([0, automaton.universe[1], ...sets.flat()]),
  ].toSorted((left, right) => left - right);
  const members: number[][] = Array.from(
    { length: boundaries.length - 1 },
    () => []
  );

  sets.forEach((set, index) => {
    for (let range = 0; range < set.length; range += 2) {
      const last = lowerBound(boundaries, set[range + 1]);

      for (
        let segment = lowerBound(boundaries, set[range]);
        segment < last;
        segment += 1
      )
        members[segment].push(index);
    }
  });

  const pieceIds = createRunTable();
  const pieceSets: number[][] = [];
  const pieceKinds: number[] = [];
  const setPieces: number[][] = automaton.sets.map(() => []);

  members.forEach((owners, segment) => {
    const hash = hashRuns(0, owners, owners.length);
    const known = findRuns(pieceIds, 0, owners, owners.length, hash);
    const start = boundaries[segment];
    const end = boundaries[segment + 1];

    if (known !== -1) {
      const set = pieceSets[known];

      if (set[set.length - 1] === start) set[set.length - 1] = end;
      else set.push(start, end);

      return;
    }

    const piece = pieceSets.length;
    const kindOwner = owners.find((owner) => owner >= automaton.sets.length);

    addRuns(pieceIds, 0, owners, owners.length, hash);
    pieceSets.push([start, end]);
    pieceKinds.push(
      kindOwner === undefined
        ? OTHER
        : kinds[kindOwner - automaton.sets.length][1]
    );

    for (const owner of owners)
      if (owner < automaton.sets.length) setPieces[owner].push(piece);
  });

  const setKinds = setPieces.map((pieces) =>
    pieces.reduce((mask, piece) => mask | maskOf(pieceKinds[piece]), 0)
  );

  return { pieceSets, pieceKinds, setPieces, setKinds };
};
