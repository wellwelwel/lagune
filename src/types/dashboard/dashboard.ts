export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Unranked';

export type PhaseState = 'done' | 'current' | 'todo';

export type Phase = {
  name: string;
  state: PhaseState;
};

export type Uphold = {
  baseline: boolean;
  label: string;
  full: string;
};

export type FindingRef = {
  id: string;
  name: string;
};

export type FindingSpecialization = {
  name: string;
  label: string;
  surfaced: string;
};

export type Finding = {
  id: string;
  name: string;
  severity: Severity;
  category: string;
  cvss: string;
  whatItIs: string;
  whyItMatters: string;
  fix: string;
  where: string;
  planned: boolean;
  status: string;
  verdict: string | null;
  reason: string;
  upholds: Uphold[];
  dependsOn: FindingRef | null;
  references: string;
  specializations: FindingSpecialization[];
  files: string[];
};

export type Principle = {
  name: string;
  rule: string;
};

export type BaselineItem = {
  name: string;
  rule: string;
  bullets: string[];
};

export type Charter = {
  principles: Principle[];
  baseline: {
    intro: string;
    items: BaselineItem[];
  };
};

export type CatalogItem = {
  name: string;
  label: string;
  applied: boolean;
  inCatalog: boolean;
  surfaced?: string;
};

export type ProjectCategories = {
  used: string[];
  recorded: boolean;
};

export type DashboardDates = {
  mapped: string | null;
  planned: string | null;
  hardened: string | null;
};

export type PhaseName = 'Detect' | 'Plan' | 'Harden' | 'Verify';

export type SideQuestPhase = Exclude<PhaseName, 'Verify'>;

export type SideQuestItem = {
  phase: SideQuestPhase;
  text: string;
};

export type HistoryItem = {
  name: string;
  classification: Severity;
  category: string;
  whatItIs: string;
  closed: string;
};

export type DashboardData = {
  project: string;
  version: string;
  tagline: string;
  scope: string | null;
  dates: DashboardDates;
  phases: Phase[];
  findings: Finding[];
  sidequests: SideQuestItem[];
  charter: Charter;
  catalog: CatalogItem[];
  categories: ProjectCategories;
  history: HistoryItem[];
  artifacts: boolean;
  engine: string | null;
};
