import type {
  CvssBaseMetric,
  CvssMetricDefinition,
  CvssRating,
  CvssVector,
} from '../../types/cvss.js';
import {
  CVSS_METRICS,
  definitionOf,
  isBaseDefinition,
  isDefined,
  isModifiedDefinition,
  modifiedOf,
} from '../../core/cvss/metrics.js';
import { formatScore } from '../../core/cvss/rating.js';

const INDENT = '  ';

const valueName = (definition: CvssMetricDefinition, value: string): string =>
  definition.values[value] ?? value;

const modifiedName = (metric: CvssBaseMetric, value: string): string =>
  definitionOf(modifiedOf(metric))?.values[value] ?? value;

const baseLine = (
  vector: CvssVector,
  definition: CvssMetricDefinition<CvssBaseMetric>
): string => {
  const own = `${definition.name}: ${valueName(definition, vector[definition.code])}`;
  const modified = vector[modifiedOf(definition.code)];

  return isDefined(modified)
    ? `${own}, modified to ${modifiedName(definition.code, modified)}`
    : own;
};

const describe = (
  vector: CvssVector,
  definition: CvssMetricDefinition
): string[] => {
  if (isBaseDefinition(definition)) return [baseLine(vector, definition)];

  const value = vector[definition.code];

  if (!isDefined(value) || isModifiedDefinition(definition)) return [];

  return [`${definition.name}: ${valueName(definition, value)}`];
};

export const explainRating = (
  vector: CvssVector,
  rating: CvssRating
): string[] =>
  [
    ...(rating.nomenclature === 'CVSS-B'
      ? []
      : [`Base metrics alone: ${formatScore(rating.base)}`]),
    ...CVSS_METRICS.flatMap((definition) => describe(vector, definition)),
  ].map((line) => `${INDENT}${line}`);
