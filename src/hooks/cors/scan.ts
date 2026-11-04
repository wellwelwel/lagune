import type { FileAnalysis, LanguageId } from '../../types/scan.js';
import { forDetectedLanguage } from '../../core/scan/scope.js';
import { extractSources } from '../regex/extract.js';
import { validatesUrlWithGreedyWildcard } from './url.js';

const bypassable = (content: string, language: LanguageId): string[] =>
  extractSources(content, language)
    .filter(validatesUrlWithGreedyWildcard)
    .toSorted((left, right) => left.localeCompare(right));

export const analyze = forDetectedLanguage(
  (language, content): FileAnalysis => ({
    findings: [],
    review: bypassable(content, language),
    advisory: [],
  })
);
