/**
 * A greedy wildcard in the authority segment before an escaped-dot host suffix
 * (`^https?://.+\.trusted\.com`, no `$`): the `.+` swallows an attacker label, so
 * `https://evil.trusted.com.attacker.com` passes as trusted. Whether the regex
 * gates a trust decision is undecidable from the text, so a match is a review lead.
 */
const GREEDY_BEFORE_HOST =
  /[a-z][a-z0-9?()|*+.-]{0,20}:\\?\/\\?\/[^/\n]{0,200}(?:\.\+|\.\*|\.\{\d{0,4},\})[^/\n]{0,200}\\\./i;

export const validatesUrlWithGreedyWildcard = (source: string): boolean =>
  GREEDY_BEFORE_HOST.test(source);
