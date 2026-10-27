import type { AutomatonJob, CompiledJob } from '../../../types/hooks/regex.js';
import { partitionAlphabet } from './alphabet.js';
import { buildEpsilon } from './epsilon.js';
import { kindPast, recallPast } from './past.js';

/** Compiles a job, tracking what its lookbehinds read exactly when asked and when that tracking fits */
export const compile = (job: AutomatonJob, recalling: boolean): CompiledJob => {
  const epsilon = buildEpsilon(job, recalling);
  const alphabet = partitionAlphabet(epsilon);

  if (epsilon.recalls.length === 0)
    return { epsilon, alphabet, past: kindPast(epsilon, alphabet) };

  const past = recallPast(epsilon, alphabet);

  return past ? { epsilon, alphabet, past } : compile(job, false);
};
