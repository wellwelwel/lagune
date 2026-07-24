import type { JwtVerdict } from '../../types/hooks/jwt.js';
import type { LanguageId } from '../../types/hooks/regex.js';
import type { FileAnalysis } from '../../types/scan.js';
import { languageOf } from '../../core/scan/language.js';
import { codeLines } from '../../core/scan/lines.js';
import {
  disableIsStandalone,
  disableVerifyOf,
  pinOptionOf,
  pinPresentOf,
  requiresExplicitPin,
  verifyCallOf,
} from './patterns.js';

const EMPTY: FileAnalysis = { findings: [], review: [], advisory: [] };

const ASYMMETRIC = /^(?:RS|ES|PS)(?:256|384|512)$/i;
const HMAC = /^HS(?:256|384|512)$/i;

const WINDOW = 6;

const UNPINNED_DETAIL =
  'JWT verification without an explicit algorithms allowlist: pin the accepted algorithms to block algorithm confusion';
const UNSAFE_DETAIL =
  "JWT algorithms allowlist is unsafe ('none', or an asymmetric algorithm mixed with HMAC): pin a single algorithm family";
const DISABLED_DETAIL =
  'JWT signature verification is disabled: the token is trusted without checking its signature';

const isUnsafeAllowlist = (body: string): boolean => {
  const algorithms = body.match(/[A-Za-z0-9]+/g) ?? [];

  if (algorithms.some((alg) => /^none$/i.test(alg))) return true;

  return (
    algorithms.some((alg) => ASYMMETRIC.test(alg)) &&
    algorithms.some((alg) => HMAC.test(alg))
  );
};

const pinDetail = (window: string, language: LanguageId): string | null => {
  const pin = pinOptionOf(language);
  const match = pin === null ? null : pin.exec(window);

  if (match !== null) return isUnsafeAllowlist(match[1]) ? UNSAFE_DETAIL : null;

  const present = pinPresentOf(language);

  if (present !== null && present.test(window)) return null;

  return requiresExplicitPin(language) ? UNPINNED_DETAIL : null;
};

export const analyzeFor = (
  language: LanguageId,
  content: string
): FileAnalysis => {
  const call = verifyCallOf(language);

  if (call === null) return EMPTY;

  const disable = disableVerifyOf(language);
  const lines = codeLines(content, language);
  const findings: string[] = [];

  const add = (detail: string): void => {
    if (!findings.includes(detail)) findings.push(detail);
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (call.test(line)) {
      const window = lines
        .slice(index, Math.min(lines.length, index + WINDOW))
        .join('\n');

      if (disable !== null && disable.test(window)) add(DISABLED_DETAIL);
      else {
        const detail = pinDetail(window, language);

        if (detail !== null) add(detail);
      }
      continue;
    }

    if (disableIsStandalone(language) && disable !== null && disable.test(line))
      add(DISABLED_DETAIL);
  }

  return { findings, review: [], advisory: [] };
};

export const analyze = (file: string, content: string): FileAnalysis => {
  const language = languageOf(file);

  return language === null ? EMPTY : analyzeFor(language, content);
};

export const classify = (snippet: string, language: LanguageId): JwtVerdict => {
  const call = verifyCallOf(language);
  const disable = disableVerifyOf(language);
  const isCall = call !== null && call.test(snippet);
  const isDisable =
    disable !== null &&
    disable.test(snippet) &&
    (disableIsStandalone(language) || isCall);

  if (!isCall && !isDisable) return 'invalid';
  if (isDisable) return 'unpinned';

  return pinDetail(snippet, language) === null ? 'safe' : 'unpinned';
};
