import type { AgentVerdict } from '../../types/hooks/agent.js';
import type { LanguageId } from '../../types/hooks/regex.js';
import type { FileAnalysis } from '../../types/scan.js';
import { languageOf } from '../../core/scan/language.js';
import { codeLines, firedRules } from '../../core/scan/lines.js';
import {
  alwaysLoopCallsOf,
  capOf,
  flagsMissingCap,
  sdkImportOf,
  uncappedRulesOf,
} from './patterns.js';

const EMPTY: FileAnalysis = { findings: [], review: [], advisory: [] };

const WINDOW = 30;

const UNCAPPED_DETAIL =
  'agent runtime call without a step/turn/time/budget cap (maxTurns/maxBudgetUsd/stopWhen/signal): DoS and cost-burn risk';

const hasUncappedLoop = (language: LanguageId, content: string): boolean => {
  if (!flagsMissingCap(language)) return false;

  const always = alwaysLoopCallsOf(language);

  if (always === null) return false;

  const cap = capOf(language);
  const lines = codeLines(content, language);

  for (let index = 0; index < lines.length; index += 1) {
    if (!always.test(lines[index])) continue;

    const window = lines
      .slice(index, Math.min(lines.length, index + WINDOW))
      .join('\n');

    if (cap !== null && cap.test(window)) continue;

    return true;
  }

  return false;
};

export const analyzeFor = (
  language: LanguageId,
  content: string
): FileAnalysis => {
  const sdk = sdkImportOf(language);

  if (sdk === null || !sdk.test(content)) return EMPTY;

  const findings = [
    ...firedRules(content, uncappedRulesOf(language), language),
  ];

  if (hasUncappedLoop(language, content) && !findings.includes(UNCAPPED_DETAIL))
    findings.push(UNCAPPED_DETAIL);

  return { findings, review: [], advisory: [] };
};

export const analyze = (file: string, content: string): FileAnalysis => {
  const language = languageOf(file);

  return language === null ? EMPTY : analyzeFor(language, content);
};

export const classify = (
  snippet: string,
  language: LanguageId
): AgentVerdict => {
  if (uncappedRulesOf(language).some((rule) => rule.regex.test(snippet)))
    return 'uncapped';

  const always = alwaysLoopCallsOf(language);

  if (!(always !== null && always.test(snippet))) return 'invalid';

  const cap = capOf(language);

  if (cap !== null && cap.test(snippet)) return 'safe';

  return flagsMissingCap(language) ? 'uncapped' : 'safe';
};
