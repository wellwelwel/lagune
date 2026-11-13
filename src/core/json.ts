import { isRecord } from './collections.js';

const stateFileProblem = (file: string, problem: string): Error =>
  new Error(`${file} ${problem}: fix it, then run this again.`);

/** Parses a JSON object out of a file, refusing anything it cannot trust */
export const parseJsonObject = (
  raw: string,
  file: string,
  failure: (file: string, problem: string) => Error = stateFileProblem
): Record<string, unknown> => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw failure(file, 'is not valid JSON');
  }

  if (!isRecord(parsed)) throw failure(file, 'is not a JSON object');

  return parsed;
};
