import type {
  CvssBaseMetric,
  CvssEffectiveMetrics,
  CvssMacroVector,
  CvssVector,
} from '../../types/cvss.js';
import { isDefined, modifiedOf } from './metrics.js';

const WORST_EXPLOIT_MATURITY = 'A';
const WORST_REQUIREMENT = 'H';

const baseValue = (vector: CvssVector, metric: CvssBaseMetric): string => {
  const modified = vector[modifiedOf(metric)];

  return isDefined(modified) ? modified : vector[metric];
};

const requirementValue = (value: string | undefined): string =>
  isDefined(value) ? value : WORST_REQUIREMENT;

export const effectiveMetrics = (vector: CvssVector): CvssEffectiveMetrics => ({
  AV: baseValue(vector, 'AV'),
  AC: baseValue(vector, 'AC'),
  AT: baseValue(vector, 'AT'),
  PR: baseValue(vector, 'PR'),
  UI: baseValue(vector, 'UI'),
  VC: baseValue(vector, 'VC'),
  VI: baseValue(vector, 'VI'),
  VA: baseValue(vector, 'VA'),
  SC: baseValue(vector, 'SC'),
  SI: baseValue(vector, 'SI'),
  SA: baseValue(vector, 'SA'),
  E: isDefined(vector.E) ? vector.E : WORST_EXPLOIT_MATURITY,
  CR: requirementValue(vector.CR),
  IR: requirementValue(vector.IR),
  AR: requirementValue(vector.AR),
});

const reach = ({ AV, PR, UI }: CvssEffectiveMetrics): number => {
  const fullyOpen = AV === 'N' && PR === 'N' && UI === 'N';
  const partlyOpen = AV === 'N' || PR === 'N' || UI === 'N';

  if (fullyOpen) return 0;
  if (partlyOpen && AV !== 'P') return 1;

  return 2;
};

const effort = ({ AC, AT }: CvssEffectiveMetrics): number =>
  AC === 'L' && AT === 'N' ? 0 : 1;

const vulnerableImpact = ({ VC, VI, VA }: CvssEffectiveMetrics): number => {
  if (VC === 'H' && VI === 'H') return 0;
  if (VC === 'H' || VI === 'H' || VA === 'H') return 1;

  return 2;
};

const subsequentImpact = ({ SC, SI, SA }: CvssEffectiveMetrics): number => {
  if (SI === 'S' || SA === 'S') return 0;
  if (SC === 'H' || SI === 'H' || SA === 'H') return 1;

  return 2;
};

const exploitMaturity = ({ E }: CvssEffectiveMetrics): number => {
  if (E === 'A') return 0;
  if (E === 'P') return 1;

  return 2;
};

const requirements = ({
  CR,
  IR,
  AR,
  VC,
  VI,
  VA,
}: CvssEffectiveMetrics): number =>
  (CR === 'H' && VC === 'H') ||
  (IR === 'H' && VI === 'H') ||
  (AR === 'H' && VA === 'H')
    ? 0
    : 1;

export const macroVector = (
  effective: CvssEffectiveMetrics
): CvssMacroVector => ({
  eq1: reach(effective),
  eq2: effort(effective),
  eq3: vulnerableImpact(effective),
  eq4: subsequentImpact(effective),
  eq5: exploitMaturity(effective),
  eq6: requirements(effective),
});

export const macroKey = ({
  eq1,
  eq2,
  eq3,
  eq4,
  eq5,
  eq6,
}: CvssMacroVector): string => `${eq1}${eq2}${eq3}${eq4}${eq5}${eq6}`;
