import type { FileAnalysis, LanguageId } from '../../types/scan.js';
import { deepFreeze } from '../collections.js';
import { languageOf } from './language.js';

export const EMPTY_ANALYSIS: FileAnalysis = deepFreeze({
  findings: [],
  review: [],
  advisory: [],
});

export const forLanguage =
  (language: LanguageId, analyze: (content: string) => FileAnalysis) =>
  (file: string, content: string): FileAnalysis =>
    languageOf(file) === language ? analyze(content) : EMPTY_ANALYSIS;

export const forDetectedLanguage =
  (analyze: (language: LanguageId, content: string) => FileAnalysis) =>
  (file: string, content: string): FileAnalysis => {
    const language = languageOf(file);

    return language === null ? EMPTY_ANALYSIS : analyze(language, content);
  };
