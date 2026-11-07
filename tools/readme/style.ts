import type { EndlessLoops, Target, TargetStyle } from './types';
import { ENDLESS_LOOPS } from './loops';

const DARK = `
  --card: #151a26; --watermark: #121721; --surface: #1d2432; --line: #222a38; --line-2: #2d3648;
  --ink: #eef1f8; --ink-2: #c6ccdb; --muted: #8b93a8;
  --accent: #4f9bff; --accent-strong: #2f7bff; --on-accent: #ffffff;
  --track: #1c2a45; --success: #2fc58f; --success-tile: #163a31;
  --danger: #ff6369;
  --star: #ffb000;
  --shadow: #000000; --shadow-opacity: .45;`;

const LIGHT = `
  --card: #ffffff; --watermark: #f3f5f9; --surface: #f2f4f9; --line: #e7eaf1; --line-2: #dbe0ea;
  --ink: #17182b; --ink-2: #3d4058; --muted: #6f7489;
  --accent: #005eff; --accent-strong: #005eff; --on-accent: #ffffff;
  --track: #edf3ff; --success: #10b17d; --success-tile: #e2f6ef;
  --danger: #e5484d;
  --star: #f5a300;
  --shadow: #12162d; --shadow-opacity: .1;`;

const CANVAS = `
  --card: #00000075; --watermark: #16307625; --surface: #07112e; --line: #171c2a; --line-2: #202533;
  --track: #0e1b34; --success-tile: #0b2429;`;

/* WebKit filters shift the hue of colors as dark as the canvas. */
const UNFILTERED_CARD = '.card { filter: none; }';

const PAUSABLE = '.paused * { animation-play-state: paused !important; }';

const DARK_ONLY = 'svg { color-scheme: dark; }';

const UNPAINTED_FIELD = '.field { fill: none; }';

const COVER_MASKS = `.cover-mask .field { fill: #000; stroke: none; }
.cover-mask :not(g, .field, .cover-backdrop) { display: none; }`;

const TARGET_STYLES: Record<Target, TargetStyle> = {
  readme: {
    theme: [
      `svg {${DARK}\n}`,
      `@media (prefers-color-scheme: light) {\n  svg {${LIGHT}\n  }\n}`,
    ],
    overrides: [],
    loops: ENDLESS_LOOPS,
  },
  website: {
    theme: [`svg {${DARK}\n}`, `svg {${CANVAS}\n}`, DARK_ONLY],
    overrides: [UNFILTERED_CARD, PAUSABLE, UNPAINTED_FIELD, COVER_MASKS],
    loops: null,
  },
};

const ruleLines = (rules: string[]) =>
  rules.map((rule) => `\n${rule}`).join('');

const base = (loops: EndlessLoops | null) => `
text { white-space: pre; }
.sans { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif; }
.card { fill: var(--card); }
.watermark { color: var(--watermark); }
.card-border { fill: none; stroke: var(--line); }
.card-shadow { flood-color: var(--shadow); flood-opacity: var(--shadow-opacity); }
.accent { color: var(--accent); }
.success { color: var(--success); }
.danger { color: var(--danger); }
.muted { color: var(--muted); }
.success-tile { fill: var(--success-tile); }
.agent-logo { color: var(--ink); }
.star { color: var(--star); }
.send-gold { fill: var(--star); }
.send-star { color: var(--on-accent); }
.bubble, .chip { fill: var(--surface); }
.chip-stretch { transform-box: fill-box; transform-origin: left center; }
.prompt { fill: var(--ink); font-size: 14px; }
.bullet { fill: var(--ink-2); }
.command { fill: var(--accent); font-weight: 600; }
.heading { fill: var(--ink); font-size: 15px; }
.strong { font-weight: 600; }
.label { fill: var(--ink-2); font-size: 13px; }
.name { fill: var(--accent); font-size: 13px; font-weight: 600; }
.note { fill: var(--muted); font-size: 12.5px; }
.status { fill: var(--muted); font-size: 13.5px; }
.timeline { fill: none; stroke: var(--line-2); stroke-width: 1; stroke-linecap: round; }
.chip-label { fill: var(--ink); font-size: 12.5px; font-weight: 500; }
.field { fill: var(--card); }
.field-border { stroke: var(--line-2); }
.placeholder { fill: var(--muted); font-size: 14px; }
.caret { fill: var(--accent); }
.chevron { fill: none; stroke: var(--muted); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.send-idle { fill: var(--line-2); }
.send-icon-idle { fill: var(--muted); stroke: var(--muted); stroke-width: 1.5; stroke-linejoin: round; }
.send-active { fill: var(--accent-strong); }
.send-icon-active { fill: var(--on-accent); stroke: var(--on-accent); stroke-width: 1.5; stroke-linejoin: round; }
.spinner-track { fill: none; stroke: var(--track); stroke-width: 2.4; }
.spinner { fill: none; stroke: var(--accent); stroke-width: 2.4; stroke-linecap: round; stroke-dasharray: 16 34.3; transform-box: fill-box; transform-origin: center;${loops?.spinner ?? ''} }
.shimmer-base { stop-color: var(--muted); }
.shimmer-strong-base { stop-color: var(--ink-2); }
.shimmer-peak { stop-color: var(--ink); }${ruleLines(loops ? [loops.ellipsis] : [])}
.shimmer { fill: url(#shimmer); }
.shimmer-strong { fill: url(#shimmer-strong); }
.tab-label { fill: var(--ink); font-size: 12.5px; font-weight: 500; }
.pop { transform-box: fill-box; transform-origin: center; }${ruleLines(loops ? [loops.blink] : [])}
.typed, .pasted, .thinking, .send-on, .past, .idle { opacity: 0; }
.dim { opacity: .5; }${ruleLines(loops?.keyframes ?? [])}`;

export const stylesheet = (target: Target, animationRules: string[]) => {
  const { theme, overrides, loops } = TARGET_STYLES[target];

  return [
    ...theme,
    base(loops),
    ...overrides,
    ...animationRules,
    '@media (prefers-reduced-motion: reduce) {\n  * { animation: none !important; }\n}',
  ].join('\n');
};
