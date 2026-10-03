import type {
  CvssDistanceMetric,
  CvssEffectiveMetrics,
  CvssEquivalenceClass,
  CvssMacroVector,
  CvssSeverity,
} from '../../types/cvss.js';
import { MACRO_VECTOR_SCORES } from './lookup.js';
import { macroKey, macroVector } from './macrovector.js';
import { IMPACT_METRICS } from './metrics.js';

const STEP = 0.1;
const ROUNDING_EPSILON = 10 ** -6;
const TOP_SCORE = 10;

const LEVELS: Record<CvssDistanceMetric, Record<string, number>> = {
  AV: { N: 0.0, A: 0.1, L: 0.2, P: 0.3 },
  PR: { N: 0.0, L: 0.1, H: 0.2 },
  UI: { N: 0.0, P: 0.1, A: 0.2 },
  AC: { L: 0.0, H: 0.1 },
  AT: { N: 0.0, P: 0.1 },
  VC: { H: 0.0, L: 0.1, N: 0.2 },
  VI: { H: 0.0, L: 0.1, N: 0.2 },
  VA: { H: 0.0, L: 0.1, N: 0.2 },
  SC: { H: 0.1, L: 0.2, N: 0.3 },
  SI: { S: 0.0, H: 0.1, L: 0.2, N: 0.3 },
  SA: { S: 0.0, H: 0.1, L: 0.2, N: 0.3 },
  CR: { H: 0.0, M: 0.1, L: 0.2 },
  IR: { H: 0.0, M: 0.1, L: 0.2 },
  AR: { H: 0.0, M: 0.1, L: 0.2 },
};

const CLASSES: CvssEquivalenceClass[] = ['eq1', 'eq2', 'eq3eq6', 'eq4', 'eq5'];

const DISTANCE_METRICS: Record<CvssEquivalenceClass, CvssDistanceMetric[]> = {
  eq1: ['AV', 'PR', 'UI'],
  eq2: ['AC', 'AT'],
  eq3eq6: ['VC', 'VI', 'VA', 'CR', 'IR', 'AR'],
  eq4: ['SC', 'SI', 'SA'],
  eq5: [],
};

const HIGHEST_SEVERITY: Record<
  CvssEquivalenceClass,
  Record<string, string[]>
> = {
  eq1: {
    '0': ['AV:N/PR:N/UI:N'],
    '1': ['AV:A/PR:N/UI:N', 'AV:N/PR:L/UI:N', 'AV:N/PR:N/UI:P'],
    '2': ['AV:P/PR:N/UI:N', 'AV:A/PR:L/UI:P'],
  },
  eq2: {
    '0': ['AC:L/AT:N'],
    '1': ['AC:H/AT:N', 'AC:L/AT:P'],
  },
  eq3eq6: {
    '00': ['VC:H/VI:H/VA:H/CR:H/IR:H/AR:H'],
    '01': ['VC:H/VI:H/VA:L/CR:M/IR:M/AR:H', 'VC:H/VI:H/VA:H/CR:M/IR:M/AR:M'],
    '10': ['VC:L/VI:H/VA:H/CR:H/IR:H/AR:H', 'VC:H/VI:L/VA:H/CR:H/IR:H/AR:H'],
    '11': [
      'VC:L/VI:H/VA:L/CR:H/IR:M/AR:H',
      'VC:L/VI:H/VA:H/CR:H/IR:M/AR:M',
      'VC:H/VI:L/VA:H/CR:M/IR:H/AR:M',
      'VC:H/VI:L/VA:L/CR:M/IR:H/AR:H',
      'VC:L/VI:L/VA:H/CR:H/IR:H/AR:M',
    ],
    '21': ['VC:L/VI:L/VA:L/CR:H/IR:H/AR:H'],
  },
  eq4: {
    '0': ['SC:H/SI:S/SA:S'],
    '1': ['SC:H/SI:H/SA:H'],
    '2': ['SC:L/SI:L/SA:L'],
  },
  eq5: {
    '0': ['E:A'],
    '1': ['E:P'],
    '2': ['E:U'],
  },
};

const DEPTHS: Record<CvssEquivalenceClass, Record<string, number>> = {
  eq1: { '0': 1, '1': 4, '2': 5 },
  eq2: { '0': 1, '1': 2 },
  eq3eq6: { '00': 7, '01': 6, '10': 8, '11': 8, '21': 10 },
  eq4: { '0': 6, '1': 5, '2': 4 },
  eq5: { '0': 1, '1': 1, '2': 1 },
};

const levelOf = (
  macro: CvssMacroVector,
  equivalenceClass: CvssEquivalenceClass
): string => {
  if (equivalenceClass === 'eq3eq6') return `${macro.eq3}${macro.eq6}`;

  return `${macro[equivalenceClass]}`;
};

const lookup = (macro: CvssMacroVector): number =>
  MACRO_VECTOR_SCORES[macroKey(macro)] ?? Number.NaN;

const lowerImpactScore = (macro: CvssMacroVector): number => {
  const { eq3, eq6 } = macro;

  if (eq3 === 2) return Number.NaN;
  if (eq3 === 0 && eq6 === 0)
    return Math.max(lookup({ ...macro, eq6: 1 }), lookup({ ...macro, eq3: 1 }));
  if (eq3 === 1 && eq6 === 0) return lookup({ ...macro, eq6: 1 });

  return lookup({ ...macro, eq3: eq3 + 1 });
};

const lowerScore = (
  macro: CvssMacroVector,
  equivalenceClass: CvssEquivalenceClass
): number => {
  if (equivalenceClass === 'eq3eq6') return lowerImpactScore(macro);

  return lookup({
    ...macro,
    [equivalenceClass]: macro[equivalenceClass] + 1,
  });
};

const parseHighest = (text: string): Record<string, string> =>
  Object.fromEntries(text.split('/').map((part) => part.split(':')));

const distancesTo = (
  effective: CvssEffectiveMetrics,
  metrics: CvssDistanceMetric[],
  highest: Record<string, string>
): number[] =>
  metrics.map(
    (metric) =>
      LEVELS[metric][effective[metric]] - LEVELS[metric][highest[metric]]
  );

const sum = (values: number[]): number =>
  values.reduce((total, value) => total + value, 0);

const classDistance = (
  effective: CvssEffectiveMetrics,
  macro: CvssMacroVector,
  equivalenceClass: CvssEquivalenceClass
): number => {
  const candidates = HIGHEST_SEVERITY[equivalenceClass][
    levelOf(macro, equivalenceClass)
  ].map((text) =>
    distancesTo(
      effective,
      DISTANCE_METRICS[equivalenceClass],
      parseHighest(text)
    )
  );
  const dominant =
    candidates.find((distances) => distances.every((value) => value >= 0)) ??
    candidates[candidates.length - 1];

  return sum(dominant);
};

const adjustment = (
  effective: CvssEffectiveMetrics,
  macro: CvssMacroVector,
  score: number,
  equivalenceClass: CvssEquivalenceClass
): number | null => {
  const available = score - lowerScore(macro, equivalenceClass);

  if (Number.isNaN(available)) return null;

  const depth =
    DEPTHS[equivalenceClass][levelOf(macro, equivalenceClass)] * STEP;

  return (
    available * (classDistance(effective, macro, equivalenceClass) / depth)
  );
};

const isNumber = (value: number | null): value is number => value !== null;

const clamp = (value: number): number =>
  Math.min(TOP_SCORE, Math.max(0, value));

const round = (value: number): number =>
  Math.round((value + ROUNDING_EPSILON) * 10) / 10;

export const scoreEffective = (effective: CvssEffectiveMetrics): number => {
  if (IMPACT_METRICS.every((metric) => effective[metric] === 'N')) return 0;

  const macro = macroVector(effective);
  const score = lookup(macro);
  const adjustments = CLASSES.map((equivalenceClass) =>
    adjustment(effective, macro, score, equivalenceClass)
  ).filter(isNumber);
  const mean =
    adjustments.length === 0 ? 0 : sum(adjustments) / adjustments.length;

  return round(clamp(score - mean));
};

export const severityOf = (score: number): CvssSeverity => {
  if (score === 0) return 'None';
  if (score < 4) return 'Low';
  if (score < 7) return 'Medium';
  if (score < 9) return 'High';

  return 'Critical';
};
