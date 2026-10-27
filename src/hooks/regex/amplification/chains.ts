import type { ScoreGroups, ScoreWalk } from '../../../types/hooks/regex.js';
import { GAIN, SHIFT, sourceEnd } from './walk.js';

const isChain = (groups: ScoreGroups, group: number): boolean =>
  groups.kinds[group] === SHIFT &&
  groups.targets[group] === groups.sources[group] + 1;

const sharesPiece = (walk: ScoreWalk, left: number, right: number): boolean => {
  const { pieceSets, pieceCount } = walk;

  for (let piece = 0; piece < pieceCount; piece += 1)
    if (
      pieceSets[left * pieceCount + piece] === 1 &&
      pieceSets[right * pieceCount + piece] === 1
    )
      return true;

  return false;
};

const startsAttempt = (walk: ScoreWalk, pieces: number): boolean => {
  const { groups } = walk;

  for (let group = 0; group < groups.count; group += 1)
    if (
      groups.kinds[group] === GAIN &&
      sharesPiece(walk, groups.pieces[group], pieces)
    )
      return true;

  return false;
};

const splitsChain = (walk: ScoreWalk, chain: number): boolean => {
  const { groups } = walk;
  const first = groups.sources[chain];
  const last = first + groups.lengths[chain];

  for (let group = 0; group < groups.count; group += 1)
    if (
      group !== chain &&
      groups.kinds[group] !== GAIN &&
      groups.sources[group] <= last &&
      sourceEnd(groups, group) > first &&
      sharesPiece(walk, groups.pieces[group], groups.pieces[chain])
    )
      return true;

  return false;
};

export const chainRanges = (
  walk: ScoreWalk,
  keep: (group: number) => boolean
): number[] => {
  const { groups } = walk;
  const ranges: number[] = [];

  for (let group = 0; group < groups.count; group += 1)
    if (isChain(groups, group) && keep(group))
      ranges.push(
        groups.sources[group],
        groups.sources[group] + groups.lengths[group] + 1
      );

  return ranges;
};

/** Lists the runs of states that read one class in a row and that no new attempt can start within */
export const quietRanges = (walk: ScoreWalk): number[] =>
  chainRanges(walk, (group) => !startsAttempt(walk, walk.groups.pieces[group]));

/** Lists the runs of states that read one class in a row and never split on it */
export const steadyRanges = (walk: ScoreWalk): number[] =>
  chainRanges(walk, (group) => !splitsChain(walk, group));
