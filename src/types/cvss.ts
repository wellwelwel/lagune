export type CvssBaseMetric =
  'AV' | 'AC' | 'AT' | 'PR' | 'UI' | 'VC' | 'VI' | 'VA' | 'SC' | 'SI' | 'SA';

export type CvssThreatMetric = 'E';

export type CvssRequirementMetric = 'CR' | 'IR' | 'AR';

export type CvssModifiedMetric = `M${CvssBaseMetric}`;

export type CvssEnvironmentalMetric =
  CvssRequirementMetric | CvssModifiedMetric;

export type CvssSupplementalMetric = 'S' | 'AU' | 'R' | 'V' | 'RE' | 'U';

export type CvssMetric =
  | CvssBaseMetric
  | CvssThreatMetric
  | CvssEnvironmentalMetric
  | CvssSupplementalMetric;

export type CvssScoredMetric =
  CvssBaseMetric | CvssThreatMetric | CvssRequirementMetric;

export type CvssDistanceMetric = CvssBaseMetric | CvssRequirementMetric;

export type CvssMetricGroup =
  'base' | 'threat' | 'environmental' | 'supplemental';

export type CvssMetricDefinition<Code extends CvssMetric = CvssMetric> = {
  code: Code;
  name: string;
  group: CvssMetricGroup;
  values: Record<string, string>;
};

export type CvssMetrics = Partial<Record<CvssMetric, string>>;

export type CvssVector = CvssMetrics & Record<CvssBaseMetric, string>;

export type CvssPair = {
  code: CvssMetric;
  value: string;
};

export type CvssProblem = {
  problem: string;
};

export type CvssPairReading = CvssPair | CvssProblem;

export type CvssParse = { metrics: CvssVector } | CvssProblem;

export type CvssEffectiveMetrics = Record<CvssScoredMetric, string>;

export type CvssMacroVector = {
  eq1: number;
  eq2: number;
  eq3: number;
  eq4: number;
  eq5: number;
  eq6: number;
};

export type CvssEquivalenceClass = 'eq1' | 'eq2' | 'eq3eq6' | 'eq4' | 'eq5';

export type CvssSeverity = 'None' | 'Low' | 'Medium' | 'High' | 'Critical';

export type CvssNomenclature = 'CVSS-B' | 'CVSS-BT' | 'CVSS-BE' | 'CVSS-BTE';

export type CvssScore = {
  score: number;
  severity: CvssSeverity;
};

export type CvssRating = {
  vector: string;
  nomenclature: CvssNomenclature;
  overall: CvssScore;
  base: CvssScore;
};

export type CvssRatingLine = {
  vector: string;
  score: number;
  severity: CvssSeverity;
};
