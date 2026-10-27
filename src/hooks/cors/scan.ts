import type { FileAnalysis, LanguageId } from '../../types/scan.js';
import { languageOf } from '../../core/scan/language.js';
import { extractSources } from '../regex/extract.js';
import { validatesUrlWithGreedyWildcard } from './url.js';

const EMPTY: FileAnalysis = { findings: [], review: [], advisory: [] };

const bypassable = (content: string, language: LanguageId): string[] =>
  extractSources(content, language)
    .filter(validatesUrlWithGreedyWildcard)
    .toSorted((left, right) => left.localeCompare(right));

export const analyze = (file: string, content: string): FileAnalysis => {
  const language = languageOf(file);

  if (language === null) return EMPTY;

  return { findings: [], review: bypassable(content, language), advisory: [] };
};
