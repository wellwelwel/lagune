import type { InterpreterVerdict } from '../../types/hooks/interpreter.js';
import type { FileAnalysis, LanguageId } from '../../types/scan.js';
import { firedRules } from '../../core/scan/lines.js';
import { forDetectedLanguage } from '../../core/scan/scope.js';
import { rulesOf } from './patterns.js';

export const analyzeFor = (
  language: LanguageId,
  content: string
): FileAnalysis => ({
  findings: [],
  review: firedRules(content, rulesOf(language), language),
  advisory: [],
});

export const analyze = forDetectedLanguage(analyzeFor);

export const classify = (
  snippet: string,
  language: LanguageId
): InterpreterVerdict =>
  firedRules(snippet, rulesOf(language), language).length > 0
    ? 'careful'
    : 'safe';
