import type { LanguageId } from '../../types/hooks/regex.js';

const VERIFY_CALL: Partial<Record<LanguageId, RegExp>> = {
  javascript:
    /\bjwt\.verify\s{0,16}\(|\bjwtVerify\s{0,16}\(|\bverifyJwt\s{0,16}\(|\bcompactVerify\s{0,16}\(|\bflattenedVerify\s{0,16}\(/i,
  python: /\bjwt\.decode\s{0,10}\(/i,
  go: /jwt\.Parse(WithClaims)?\s{0,4}\(/i,
  java: /(?:\.parseSignedClaims|\.parseClaimsJws|\.parseSignedContent)\s{0,4}\(|\bJWT\.require\s{0,4}\(|\.(?:verify|process)\s{0,4}\(/i,
  kotlin:
    /\bparseClaimsJws\s{0,8}\(|\bparseSignedClaims\s{0,8}\(|\bparseSignedContent\s{0,8}\(|\.verify\s{0,8}\(/i,
  php: /JWT::decode\s{0,4}\(/i,
  ruby: /JWT\.decode\s{0,4}\(/i,
  rust: /\bdecode\s{0,4}(?:::\s{0,4}<[^>]{1,80}>\s{0,4})?\(/i,
  csharp: /\.ValidateToken(?:Async)?\s{0,16}\(/i,
};

/** A bare `algorithms=` (even a variable list we cannot inspect) counts as a pin, so it is not flagged as unpinned */
const PIN_PRESENT: Partial<Record<LanguageId, RegExp>> = {
  python: /\balgorithms\s{0,5}=/i,
};

const PIN_OPTION: Partial<Record<LanguageId, RegExp>> = {
  javascript: /\balgorithms\s{0,16}:\s{0,16}\[([^\]]{0,400})\]/i,
  python: /algorithms\s{0,5}=\s{0,5}\[([^\]]{0,200})\]/i,
  go: /WithValidMethods\s{0,4}\(\s{0,4}\[\]string\s{0,4}\{([^}]{0,200})\}/i,
  java: /(?:(?:Set|List|Arrays)\.(?:of|asList)|JWSVerificationKeySelector\s{0,4}(?:<[^>]{0,60}>)?)\s{0,4}\(\s{0,4}((?:JWSAlgorithm\.[A-Za-z0-9]{2,8}\s{0,3},?\s{0,3}){1,8})/i,
  php: /(?:new\s{1,4}Key\s{0,4}\([^,)]{1,80},|,\s{0,4}\[)\s{0,4}(['"][^\]\)]{0,120}['"])/i,
  ruby: /algorithms?["']?\s{0,4}(?::|=>)\s{0,4}\[?\s{0,4}([^\]}\n]{1,200})/i,
  rust: /(?:Validation::new\s{0,4}\(|\balgorithms\s{0,4}=\s{0,4}vec!\s{0,4}\[)\s{0,4}([^)\]]{1,200})/i,
  csharp: /\bValidAlgorithms\s{0,16}=\s{0,16}new\b[^{]{0,64}\{([^}]{0,400})\}/i,
};

const DISABLE_VERIFY: Partial<Record<LanguageId, RegExp>> = {
  python: /\bverify(?:_signature)?["']?\s{0,5}[:=]\s{0,5}False/i,
  go: /ParseUnverified\s{0,4}\(/i,
  java: /\.unsecured\s{0,4}\(\s{0,4}\)|\b(?:parseClaimsJwt|parseUnsecuredClaims|parseUnsecuredContent)\s{0,4}\(/i,
  kotlin:
    /\.unsecured\s{0,8}\(|\bparseClaimsJwt\s{0,8}\(|\bparseUnsecuredClaims\s{0,8}\(|\bparseUnsecuredContent\s{0,8}\(/i,
  ruby: /JWT\.decode\s{0,4}\([^,\n]{1,80},[^,\n]{1,80},\s{0,4}false\b/i,
  rust: /insecure_disable_signature_validation\s{0,4}\(/i,
  csharp:
    /\bRequireSignedTokens\s{0,16}=\s{0,16}false\b|\bValidateIssuerSigningKey\s{0,16}=\s{0,16}false\b|\bSignatureValidator\s{0,16}=/i,
};

/** Libraries that need an explicit allowlist. The rest pin implicitly, so a missing list is already sound */
const REQUIRES_PIN: Partial<Record<LanguageId, boolean>> = {
  javascript: true,
  python: true,
  go: true,
  ruby: true,
};

/** Python's `verify=False` also reads as `requests.get(url, verify=False)`, so it counts only inside a decode window, not on a bare line */
const DISABLE_STANDALONE: Partial<Record<LanguageId, boolean>> = {
  python: false,
};

export const SUPPORTED_LANGUAGES: readonly LanguageId[] = Object.keys(
  VERIFY_CALL
) as LanguageId[];

export const isSupportedLanguage = (value: string): value is LanguageId =>
  (SUPPORTED_LANGUAGES as readonly string[]).includes(value);

export const verifyCallOf = (language: LanguageId): RegExp | null =>
  VERIFY_CALL[language] ?? null;

export const pinOptionOf = (language: LanguageId): RegExp | null =>
  PIN_OPTION[language] ?? null;

export const pinPresentOf = (language: LanguageId): RegExp | null =>
  PIN_PRESENT[language] ?? null;

export const disableVerifyOf = (language: LanguageId): RegExp | null =>
  DISABLE_VERIFY[language] ?? null;

export const requiresExplicitPin = (language: LanguageId): boolean =>
  REQUIRES_PIN[language] ?? false;

export const disableIsStandalone = (language: LanguageId): boolean =>
  DISABLE_STANDALONE[language] ?? true;
