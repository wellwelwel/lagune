import type { InterpreterVerdict } from '../../types/hooks/interpreter.js';
import type { LanguageId } from '../../types/hooks/regex.js';
import type { FileAnalysis } from '../../types/scan.js';
import { languageOf } from '../../core/scan/language.js';
import { firedRules } from '../../core/scan/lines.js';
import { rulesOf } from './patterns.js';

const EMPTY: FileAnalysis = { findings: [], review: [], advisory: [] };

export const analyzeFor = (
  language: LanguageId,
  content: string
): FileAnalysis => ({
  findings: [],
  review: firedRules(content, rulesOf(language), language),
  advisory: [],
});

export const analyze = (file: string, content: string): FileAnalysis => {
  const language = languageOf(file);

  return language === null ? EMPTY : analyzeFor(language, content);
};

export const classify = (
  snippet: string,
  language: LanguageId
): InterpreterVerdict =>
  firedRules(snippet, rulesOf(language), language).length > 0
    ? 'careful'
    : 'safe';
