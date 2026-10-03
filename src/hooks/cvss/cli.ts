import type { HookResult } from '../../types/core.js';
import type { CvssParse } from '../../types/cvss.js';
import type { CvssRequest } from '../../types/hooks/cvss.js';
import { parseArgs as parseNodeArgs } from 'node:util';
import { isProblem, parseVector } from '../../core/cvss/parse.js';
import { formatScore, rateVector } from '../../core/cvss/rating.js';
import { explainRating } from './explain.js';

const OPTIONS = {
  vector: { type: 'string', short: 'v', multiple: true },
  explain: { type: 'boolean', short: 'e' },
} as const;

/** Reads the flags into a request, requiring at least one vector */
export const parseArgs = (args: string[]): CvssRequest => {
  const { values } = parseNodeArgs({ args, options: OPTIONS, strict: true });
  const vectors = values.vector ?? [];

  if (vectors.length === 0)
    throw new Error('the cvss hook needs at least one -v <vector>');

  return { vectors, explain: values.explain === true };
};

const render = (reading: CvssParse, explain: boolean): string[] => {
  if (isProblem(reading)) return [`invalid vector: ${reading.problem}`];

  const rating = rateVector(reading.metrics);

  return [
    formatScore(rating.overall),
    ...(explain ? explainRating(reading.metrics, rating) : []),
  ];
};

/** Scores each vector in order, its score and band first, flagging an invalid one */
export const run = (args: string[]): HookResult => {
  const { vectors, explain } = parseArgs(args);
  const readings = vectors.map(parseVector);

  return {
    output:
      readings.flatMap((reading) => render(reading, explain)).join('\n') + '\n',
    hasFinding: readings.some(isProblem),
  };
};
