import type { InfraKind, InfraVerdict } from '../../types/hooks/infra.js';
import type { FileAnalysis } from '../../types/scan.js';
import { analysisBySeverity } from '../../core/scan/driver.js';
import { infraKindOf } from './kind.js';
import { RULES } from './rules.js';

export const analyze = (content: string, kind: InfraKind): FileAnalysis =>
  analysisBySeverity(RULES[kind].filter((rule) => rule.test(content)));

export const analyzeInfra = (file: string, content: string): FileAnalysis => {
  const kind = infraKindOf(file);

  return kind === null
    ? { findings: [], review: [], advisory: [] }
    : analyze(content, kind);
};

export const classify = (snippet: string, kind: InfraKind): InfraVerdict => {
  const finding = RULES[kind].find(
    (rule) => rule.severity === 'finding' && rule.test(snippet)
  );

  if (finding !== undefined) return finding.tag;

  const advisory = RULES[kind].find(
    (rule) => rule.severity === 'advisory' && rule.test(snippet)
  );

  return advisory === undefined ? 'safe' : advisory.tag;
};
