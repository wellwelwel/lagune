import type {
  CvssBaseMetric,
  CvssMetricDefinition,
  CvssModifiedMetric,
  CvssRequirementMetric,
  CvssVector,
} from '../../types/cvss.js';

export const NOT_DEFINED = 'X';

const NOT_DEFINED_VALUE = { [NOT_DEFINED]: 'Not Defined' };
const IMPACT_VALUES = { H: 'High', L: 'Low', N: 'None' };
const SAFETY_VALUE = { S: 'Safety' };
const REQUIREMENT_VALUES = {
  ...NOT_DEFINED_VALUE,
  H: 'High',
  M: 'Medium',
  L: 'Low',
};

export const BASE_DEFINITIONS: CvssMetricDefinition<CvssBaseMetric>[] = [
  {
    code: 'AV',
    name: 'Attack Vector',
    group: 'base',
    values: { N: 'Network', A: 'Adjacent', L: 'Local', P: 'Physical' },
  },
  {
    code: 'AC',
    name: 'Attack Complexity',
    group: 'base',
    values: { L: 'Low', H: 'High' },
  },
  {
    code: 'AT',
    name: 'Attack Requirements',
    group: 'base',
    values: { N: 'None', P: 'Present' },
  },
  {
    code: 'PR',
    name: 'Privileges Required',
    group: 'base',
    values: { N: 'None', L: 'Low', H: 'High' },
  },
  {
    code: 'UI',
    name: 'User Interaction',
    group: 'base',
    values: { N: 'None', P: 'Passive', A: 'Active' },
  },
  {
    code: 'VC',
    name: 'Vulnerable System Confidentiality',
    group: 'base',
    values: IMPACT_VALUES,
  },
  {
    code: 'VI',
    name: 'Vulnerable System Integrity',
    group: 'base',
    values: IMPACT_VALUES,
  },
  {
    code: 'VA',
    name: 'Vulnerable System Availability',
    group: 'base',
    values: IMPACT_VALUES,
  },
  {
    code: 'SC',
    name: 'Subsequent System Confidentiality',
    group: 'base',
    values: IMPACT_VALUES,
  },
  {
    code: 'SI',
    name: 'Subsequent System Integrity',
    group: 'base',
    values: IMPACT_VALUES,
  },
  {
    code: 'SA',
    name: 'Subsequent System Availability',
    group: 'base',
    values: IMPACT_VALUES,
  },
];

const THREAT_DEFINITION: CvssMetricDefinition = {
  code: 'E',
  name: 'Exploit Maturity',
  group: 'threat',
  values: {
    ...NOT_DEFINED_VALUE,
    A: 'Attacked',
    P: 'Proof-of-Concept',
    U: 'Unreported',
  },
};

const REQUIREMENT_DEFINITIONS: CvssMetricDefinition<CvssRequirementMetric>[] = [
  {
    code: 'CR',
    name: 'Confidentiality Requirement',
    group: 'environmental',
    values: REQUIREMENT_VALUES,
  },
  {
    code: 'IR',
    name: 'Integrity Requirement',
    group: 'environmental',
    values: REQUIREMENT_VALUES,
  },
  {
    code: 'AR',
    name: 'Availability Requirement',
    group: 'environmental',
    values: REQUIREMENT_VALUES,
  },
];

const SUPPLEMENTAL_DEFINITIONS: CvssMetricDefinition[] = [
  {
    code: 'S',
    name: 'Safety',
    group: 'supplemental',
    values: { ...NOT_DEFINED_VALUE, N: 'Negligible', P: 'Present' },
  },
  {
    code: 'AU',
    name: 'Automatable',
    group: 'supplemental',
    values: { ...NOT_DEFINED_VALUE, N: 'No', Y: 'Yes' },
  },
  {
    code: 'R',
    name: 'Recovery',
    group: 'supplemental',
    values: {
      ...NOT_DEFINED_VALUE,
      A: 'Automatic',
      U: 'User',
      I: 'Irrecoverable',
    },
  },
  {
    code: 'V',
    name: 'Value Density',
    group: 'supplemental',
    values: { ...NOT_DEFINED_VALUE, D: 'Diffuse', C: 'Concentrated' },
  },
  {
    code: 'RE',
    name: 'Vulnerability Response Effort',
    group: 'supplemental',
    values: { ...NOT_DEFINED_VALUE, L: 'Low', M: 'Moderate', H: 'High' },
  },
  {
    code: 'U',
    name: 'Provider Urgency',
    group: 'supplemental',
    values: {
      ...NOT_DEFINED_VALUE,
      Clear: 'Clear',
      Green: 'Green',
      Amber: 'Amber',
      Red: 'Red',
    },
  },
];

export const modifiedOf = (metric: CvssBaseMetric): CvssModifiedMetric =>
  `M${metric}`;

const safetyOf = (metric: CvssBaseMetric): Record<string, string> =>
  metric === 'SI' || metric === 'SA' ? SAFETY_VALUE : {};

const modifiedDefinition = (
  definition: CvssMetricDefinition<CvssBaseMetric>
): CvssMetricDefinition<CvssModifiedMetric> => ({
  code: modifiedOf(definition.code),
  name: `Modified ${definition.name}`,
  group: 'environmental',
  values: {
    ...NOT_DEFINED_VALUE,
    ...safetyOf(definition.code),
    ...definition.values,
  },
});

export const CVSS_METRICS: CvssMetricDefinition[] = [
  ...BASE_DEFINITIONS,
  THREAT_DEFINITION,
  ...REQUIREMENT_DEFINITIONS,
  ...BASE_DEFINITIONS.map(modifiedDefinition),
  ...SUPPLEMENTAL_DEFINITIONS,
];

export const BASE_METRICS: CvssBaseMetric[] = BASE_DEFINITIONS.map(
  (definition) => definition.code
);

export const IMPACT_METRICS: CvssBaseMetric[] = [
  'VC',
  'VI',
  'VA',
  'SC',
  'SI',
  'SA',
];

const BY_CODE = new Map<string, CvssMetricDefinition>(
  CVSS_METRICS.map((definition) => [definition.code, definition])
);

const MODIFIED_CODES = new Set<string>(BASE_METRICS.map(modifiedOf));

export const definitionOf = (code: string): CvssMetricDefinition | undefined =>
  BY_CODE.get(code);

export const isBaseDefinition = (
  definition: CvssMetricDefinition
): definition is CvssMetricDefinition<CvssBaseMetric> =>
  definition.group === 'base';

export const isModifiedDefinition = (
  definition: CvssMetricDefinition
): definition is CvssMetricDefinition<CvssModifiedMetric> =>
  MODIFIED_CODES.has(definition.code);

export const isDefined = (value: string | undefined): value is string =>
  value !== undefined && value !== NOT_DEFINED;

export const labelOf = (definition: CvssMetricDefinition): string =>
  `${definition.code} (${definition.name})`;

export const baseOnly = (vector: CvssVector): CvssVector => ({
  AV: vector.AV,
  AC: vector.AC,
  AT: vector.AT,
  PR: vector.PR,
  UI: vector.UI,
  VC: vector.VC,
  VI: vector.VI,
  VA: vector.VA,
  SC: vector.SC,
  SI: vector.SI,
  SA: vector.SA,
});
