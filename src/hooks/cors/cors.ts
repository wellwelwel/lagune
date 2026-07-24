import type { CorsVerdict } from '../../types/hooks/cors.js';

/** A value oracle, not a CORS audit: `safe` means only "not `*`/`null`", never that the handler is correctly configured. Reflection and `endsWith`/substring allowlists are source patterns this value check never sees (the greedy-regex allowlist is the scan's job) */
const normalize = (origin: string): string =>
  origin
    .trim()
    .replace(/^access-control-allow-origin\s*:\s*/i, '')
    .replace(/^['"`]+|['"`]+$/g, '')
    .trim();

const scoreToken = (token: string): CorsVerdict => {
  if (token.toLowerCase() === 'null') return 'null';
  if (token.includes('*')) return 'wildcard';

  return 'safe';
};

export const check = (origin: string): CorsVerdict => {
  const tokens = normalize(origin)
    .split(/[\s,]+/)
    .filter(Boolean);
  const scored = tokens.map(scoreToken);

  if (scored.includes('wildcard')) return 'wildcard';
  if (scored.includes('null')) return 'null';

  return 'safe';
};
