import type {
  CvssMetricDefinition,
  CvssMetrics,
  CvssPairReading,
  CvssParse,
  CvssProblem,
  CvssVector,
} from '../../types/cvss.js';
import { allOf, oneOf } from '../collections.js';
import {
  BASE_DEFINITIONS,
  BASE_METRICS,
  definitionOf,
  labelOf,
} from './metrics.js';

export const CVSS_PREFIX = 'CVSS:4.0/';

const VERSION = /^CVSS:([^/]*)\//;

const prefixProblem = (text: string): string => {
  const version = text.match(VERSION)?.[1];

  return version === undefined
    ? `the vector must start with ${CVSS_PREFIX}`
    : `only CVSS v4.0 vectors are supported, and this one is CVSS:${version}`;
};

const valueList = (definition: CvssMetricDefinition): string =>
  oneOf(
    Object.entries(definition.values).map(([code, name]) => `${code} (${name})`)
  );

const readPair = (part: string): CvssPairReading => {
  if (part === '') return { problem: 'an empty part sits between two slashes' };

  const [code, value, ...rest] = part.split(':');

  if (value === undefined || value === '' || code === '' || rest.length > 0)
    return { problem: `"${part}" is not a metric:value pair` };

  const definition = definitionOf(code);

  if (definition === undefined)
    return { problem: `"${code}" is not a CVSS v4.0 metric` };

  if (!Object.hasOwn(definition.values, value))
    return {
      problem: `${labelOf(definition)} does not take "${value}": use ${valueList(definition)}`,
    };

  return { code: definition.code, value };
};

export const isProblem = (
  reading: CvssPairReading | CvssParse
): reading is CvssProblem => 'problem' in reading;

const hasBaseMetrics = (metrics: CvssMetrics): metrics is CvssVector =>
  BASE_METRICS.every((metric) => metrics[metric] !== undefined);

const missingBaseProblem = (metrics: CvssMetrics): string => {
  const missing = BASE_DEFINITIONS.filter(
    (definition) => metrics[definition.code] === undefined
  ).map(labelOf);

  return missing.length === 1
    ? `the base metric ${missing[0]} is missing`
    : `the base metrics ${allOf(missing)} are missing`;
};

const partsOf = (body: string): string[] => {
  const trimmed = body.endsWith('/') ? body.slice(0, -1) : body;

  return trimmed === '' ? [] : trimmed.split('/');
};

export const parseVector = (input: string): CvssParse => {
  const text = input.trim();

  if (!text.startsWith(CVSS_PREFIX)) return { problem: prefixProblem(text) };

  const readings = partsOf(text.slice(CVSS_PREFIX.length)).map(readPair);
  const failed = readings.find(isProblem);

  if (failed !== undefined) return failed;

  const pairs = readings.flatMap((reading) =>
    isProblem(reading) ? [] : [reading]
  );
  const repeated = pairs.find(
    (pair, index) =>
      pairs.findIndex((other) => other.code === pair.code) !== index
  );

  if (repeated !== undefined)
    return { problem: `the metric ${repeated.code} appears more than once` };

  const metrics: CvssMetrics = Object.fromEntries(
    pairs.map((pair) => [pair.code, pair.value])
  );

  if (!hasBaseMetrics(metrics)) return { problem: missingBaseProblem(metrics) };

  return { metrics };
};
