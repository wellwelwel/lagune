import type { IconName, IconSymbol } from './types';

const STROKE = 'fill="none" stroke="currentColor"';
const ROUND = 'stroke-linecap="round" stroke-linejoin="round"';

const SYMBOLS: Record<IconName, IconSymbol> = {
  spark: {
    attributes: 'fill="currentColor"',
    body: '<path d="M10.5 4c.8 5.2 3.3 7.7 8.5 8.5-5.2.8-7.7 3.3-8.5 8.5-.8-5.2-3.3-7.7-8.5-8.5 5.2-.8 7.7-3.3 8.5-8.5z"/><path d="M18.5 1.5c.3 1.9 1.1 2.7 3 3-1.9.3-2.7 1.1-3 3-.3-1.9-1.1-2.7-3-3 1.9-.3 2.7-1.1 3-3z" opacity=".7"/>',
  },
  rust: {
    attributes: STROKE,
    body: '<circle cx="12" cy="12" r="8" stroke-width="2.6" stroke-dasharray="2.513 2.513"/><circle cx="12" cy="12" r="5.6" stroke-width="2.2"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/>',
  },
  database: {
    attributes: `${STROKE} stroke-width="1.8" stroke-linecap="round"`,
    body: '<ellipse cx="12" cy="6.5" rx="7" ry="2.8"/><path d="M5 6.5v11c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8v-11"/><path d="M5 12c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8"/>',
  },
  tenants: {
    attributes: `${STROKE} stroke-width="1.8"`,
    body: '<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
  },
  signup: {
    attributes: `${STROKE} stroke-width="1.8" stroke-linecap="round"`,
    body: '<circle cx="10" cy="8" r="3.5"/><path d="M3.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M19 8v6M16 11h6"/>',
  },
  shield: {
    attributes: `${STROKE} stroke-width="1.8" ${ROUND}`,
    body: '<path d="M12 3l7 3v5.5c0 4.4-3 8-7 9.5-4-1.5-7-5.1-7-9.5V6z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
  },
  target: {
    attributes: `${STROKE} stroke-width="1.8" stroke-linecap="round"`,
    body: '<circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/>',
  },
  check: {
    attributes: `${STROKE} stroke-width="2.4" ${ROUND}`,
    body: '<path d="M6.5 12.5l3.5 3.5L17.5 8.5"/>',
  },
  arrow: {
    attributes: `${STROKE} stroke-width="2.2" ${ROUND}`,
    body: '<path d="M5.5 12h13M13 6.5l5.5 5.5-5.5 5.5"/>',
  },
  chat: {
    attributes: `${STROKE} stroke-width="2" stroke-linejoin="round"`,
    body: '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 3.5V17A2.5 2.5 0 0 1 4 14.5z"/>',
  },
};

export const symbolDefinitions = () =>
  Object.entries(SYMBOLS)
    .map(
      ([name, symbol]) =>
        `<symbol id="icon-${name}" viewBox="0 0 24 24" ${symbol.attributes}>${symbol.body}</symbol>`
    )
    .join('\n    ');
