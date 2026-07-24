import type { CryptoVerdict } from '../../types/hooks/crypto.js';
import type { LanguageId } from '../../types/hooks/regex.js';
import type { FileAnalysis } from '../../types/scan.js';
import { languageOf } from '../../core/scan/language.js';
import { codeLines, firedRules } from '../../core/scan/lines.js';
import {
  cryptoMarkerOf,
  insecurePrngOf,
  timingRulesOf,
  weakCipherRulesOf,
  weakDigestRulesOf,
} from './patterns.js';

const EMPTY: FileAnalysis = { findings: [], review: [], advisory: [] };

const SECURITY_CONTEXT =
  /\b(?:token|secret|password|nonce|salt|session|csrf|auth|credential|api[_-]?key|private[_-]?key|otp|reset|\biv\b)\b/i;

const PRNG_DETAIL =
  'insecure PRNG in a security context: use a cryptographically secure generator (secrets / SecureRandom / crypto rand)';

const weakDetails = (language: LanguageId, content: string): string[] =>
  firedRules(content, weakCipherRulesOf(language), language);

const prngInSecurityContext = (
  language: LanguageId,
  content: string,
  prng: RegExp
): boolean => {
  const lines = codeLines(content, language);

  return lines.some((line, index) => {
    if (!prng.test(line)) return false;

    const window = lines.slice(Math.max(0, index - 3), index + 4).join('\n');

    return SECURITY_CONTEXT.test(window);
  });
};

const reviewDetails = (language: LanguageId, content: string): string[] => {
  const prng = insecurePrngOf(language);
  const randomness =
    prng !== null && prngInSecurityContext(language, content, prng)
      ? [PRNG_DETAIL]
      : [];

  return [
    ...firedRules(content, weakDigestRulesOf(language), language),
    ...firedRules(content, timingRulesOf(language), language),
    ...randomness,
  ];
};

export const analyzeFor = (
  language: LanguageId,
  content: string
): FileAnalysis => ({
  findings: weakDetails(language, content),
  review: reviewDetails(language, content),
  advisory: [],
});

export const analyze = (file: string, content: string): FileAnalysis => {
  const language = languageOf(file);

  return language === null ? EMPTY : analyzeFor(language, content);
};

export const classify = (
  snippet: string,
  language: LanguageId
): CryptoVerdict => {
  if (weakDetails(language, snippet).length > 0) return 'weak';
  if (reviewDetails(language, snippet).length > 0) return 'review';

  const marker = cryptoMarkerOf(language);

  return marker !== null && marker.test(snippet) ? 'safe' : 'invalid';
};
