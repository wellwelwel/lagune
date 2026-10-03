import type { CvssVector } from '../../../src/types/cvss.js';
import { parseVector } from '../../../src/core/cvss/parse.js';

export const BASE_VECTOR =
  'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N';

export const vectorOf = (input: string): CvssVector => {
  const reading = parseVector(input);

  if ('problem' in reading) throw new Error(reading.problem);

  return reading.metrics;
};

export const problemOf = (input: string): string => {
  const reading = parseVector(input);

  return 'problem' in reading ? reading.problem : '';
};
