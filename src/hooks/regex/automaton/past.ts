import type {
  Alphabet,
  EpsilonAutomaton,
  Past,
  RecallItem,
} from '../../../types/hooks/regex.js';
import { ALL_KINDS, allowedAfter, BOUNDARY, KINDS, maskOf } from './kinds.js';

const PAST_LIMIT = 256;

const startsAtBeginning = (automaton: EpsilonAutomaton): boolean =>
  automaton.startKinds.length === 1 && automaton.startKinds[0] === BOUNDARY;

const closeOver = (
  automaton: EpsilonAutomaton,
  seeds: readonly RecallItem[],
  kind: number
): { items: RecallItem[]; holds: number[] } => {
  const seen = new Set<number>();
  const items: RecallItem[] = [];
  const holds = automaton.recalls.map(() => 0);
  const pending = [...seeds];

  while (pending.length > 0) {
    const item = pending.pop();

    if (!item || item.allowed === 0) continue;

    const key = item.state * (ALL_KINDS + 1) + item.allowed;

    if (seen.has(key)) continue;

    seen.add(key);

    const transition = automaton.transitions[item.state];

    switch (transition.type) {
      case 'split':
        for (const target of transition.targets)
          pending.push({ state: target, allowed: item.allowed });
        break;
      case 'assert':
        pending.push({
          state: transition.target,
          allowed:
            item.allowed &
            allowedAfter(
              transition.test,
              transition.multiline,
              transition.unicodeWord,
              kind
            ),
        });
        break;
      case 'enter':
      case 'exit':
        pending.push({ state: transition.target, allowed: item.allowed });
        break;
      case 'consume':
        items.push(item);
        break;
      case 'recalled':
        holds[transition.tracked] |= item.allowed;
        break;
      default:
        break;
    }
  }

  return { items, holds };
};

/** A past that remembers only the kind of the last character read */
export const kindPast = (
  automaton: EpsilonAutomaton,
  alphabet: Alphabet
): Past => {
  const pieces = alphabet.pieceKinds.length;

  return {
    recalling: false,
    kinds: KINDS,
    next: Int32Array.from(KINDS.flatMap(() => alphabet.pieceKinds)),
    pieces,
    holds: KINDS.map(() => []),
    starts: automaton.startKinds,
    forgotten: 0,
  };
};

/** Maps a past state to the plain state that keeps only the kind of its last character */
export const forget = (past: Past, state: number): number =>
  state >= past.forgotten ? state : past.forgotten + past.kinds[state];

/** Tracks which recalled bodies the text read so far ends with, per kind of the next character, or null once the tracking outgrows its budget */
export const recallPast = (
  automaton: EpsilonAutomaton,
  alphabet: Alphabet
): Past | null => {
  const pieces = alphabet.pieceKinds.length;
  const members = alphabet.setPieces.map((list) => new Set(list));
  const restarts = automaton.recalls.map((state) => ({
    state,
    allowed: ALL_KINDS,
  }));
  const ids = new Map<string, number>();
  const kinds: number[] = [];
  const itemSets: RecallItem[][] = [];
  const holds: number[][] = [];
  const next: number[] = [];

  const intern = (
    kind: number,
    seeds: readonly RecallItem[]
  ): number | null => {
    const closed = closeOver(automaton, [...seeds, ...restarts], kind);
    const listed = closed.items
      .map(({ state, allowed }) => state * (ALL_KINDS + 1) + allowed)
      .toSorted((left, right) => left - right);
    const key = `${kind}|${closed.holds.join(',')}|${listed.join(',')}`;
    const known = ids.get(key);

    if (known !== undefined) return known;
    if (kinds.length >= PAST_LIMIT) return null;

    ids.set(key, kinds.length);
    kinds.push(kind);
    itemSets.push(closed.items);
    holds.push(closed.holds);
    return kinds.length - 1;
  };

  const advance = (items: readonly RecallItem[], piece: number): RecallItem[] =>
    items.flatMap(({ state, allowed }) => {
      const transition = automaton.transitions[state];

      return transition.type === 'consume' &&
        (allowed & maskOf(alphabet.pieceKinds[piece])) !== 0 &&
        members[transition.set].has(piece)
        ? [{ state: transition.target, allowed: ALL_KINDS }]
        : [];
    });

  intern(BOUNDARY, []);

  for (let head = 0; head < kinds.length; head += 1)
    for (let piece = 0; piece < pieces; piece += 1) {
      const target = intern(
        alphabet.pieceKinds[piece],
        advance(itemSets[head], piece)
      );

      if (target === null) return null;

      next.push(target);
    }

  const forgotten = kinds.length;

  return {
    recalling: true,
    kinds: [...kinds, ...KINDS],
    next: Int32Array.from([
      ...next,
      ...KINDS.flatMap(() =>
        alphabet.pieceKinds.map((kind) => forgotten + kind)
      ),
    ]),
    pieces,
    holds: [...holds, ...KINDS.map(() => automaton.recalls.map(() => 0))],
    starts: startsAtBeginning(automaton) ? [0] : kinds.map((_, past) => past),
    forgotten,
  };
};
