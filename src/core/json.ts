import { isRecord } from './collections.js';

/** Parses a JSON object out of a state file, refusing anything it cannot trust */
export const parseJsonObject = (
  raw: string,
  file: string
): Record<string, unknown> => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`${file} is not valid JSON: fix it, then run this again.`);
  }

  if (!isRecord(parsed))
    throw new Error(
      `${file} is not a JSON object: fix it, then run this again.`
    );

  return parsed;
};
