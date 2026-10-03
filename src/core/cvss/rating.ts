import type {
  CvssMetricGroup,
  CvssNomenclature,
  CvssRating,
  CvssRatingLine,
  CvssScore,
  CvssSeverity,
  CvssVector,
} from '../../types/cvss.js';
import { effectiveMetrics } from './macrovector.js';
import { baseOnly, CVSS_METRICS, isDefined } from './metrics.js';
import { CVSS_PREFIX } from './parse.js';
import { scoreEffective, severityOf } from './score.js';

const SEVERITIES: CvssSeverity[] = [
  'None',
  'Low',
  'Medium',
  'High',
  'Critical',
];

const RATING_LINE = /^(\S+)\s*\((\d+(?:\.\d+)?),\s*([A-Za-z]+)\)$/;

const groupDefined = (vector: CvssVector, group: CvssMetricGroup): boolean =>
  CVSS_METRICS.some(
    (definition) =>
      definition.group === group && isDefined(vector[definition.code])
  );

export const nomenclatureOf = (vector: CvssVector): CvssNomenclature => {
  const threat = groupDefined(vector, 'threat');
  const environmental = groupDefined(vector, 'environmental');

  if (threat && environmental) return 'CVSS-BTE';
  if (threat) return 'CVSS-BT';
  if (environmental) return 'CVSS-BE';

  return 'CVSS-B';
};

export const canonicalVector = (vector: CvssVector): string =>
  CVSS_PREFIX +
  CVSS_METRICS.flatMap(({ code }) => {
    const value = vector[code];

    return isDefined(value) ? [`${code}:${value}`] : [];
  }).join('/');

const scored = (score: number): CvssScore => ({
  score,
  severity: severityOf(score),
});

export const rateVector = (vector: CvssVector): CvssRating => ({
  vector: canonicalVector(vector),
  nomenclature: nomenclatureOf(vector),
  overall: scored(scoreEffective(effectiveMetrics(vector))),
  base: scored(scoreEffective(effectiveMetrics(baseOnly(vector)))),
});

export const formatScore = ({ score, severity }: CvssScore): string =>
  `${score.toFixed(1)}, ${severity}`;

export const readRatingLine = (line: string): CvssRatingLine | null => {
  const match = line.trim().match(RATING_LINE);

  if (match === null) return null;

  const severity = SEVERITIES.find((candidate) => candidate === match[3]);

  if (severity === undefined) return null;

  return { vector: match[1], score: Number(match[2]), severity };
};
