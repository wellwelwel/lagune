const DARK = `
  --card: #0f131c; --field: #151a26; --line: #222a38; --line-2: #2d3648;
  --ink: #eef1f8; --ink-2: #c6ccdb; --muted: #8b93a8;
  --accent: #4f9bff; --accent-strong: #2f7bff; --on-accent: #ffffff;
  --bubble: #1a2b4d; --tile: #172238; --success: #2fc58f; --success-tile: #12302a;
  --warning: #f2a93b; --warning-tile: #33270f;
  --glow: #2f7bff; --glow-opacity: .16;`;

const LIGHT = `
  --card: #ffffff; --field: #f4f6fa; --line: #e7eaf1; --line-2: #dbe0ea;
  --ink: #17182b; --ink-2: #3d4058; --muted: #6f7489;
  --accent: #005eff; --accent-strong: #005eff; --on-accent: #ffffff;
  --bubble: #e8f0ff; --tile: #edf3ff; --success: #10b17d; --success-tile: #e2f6ef;
  --warning: #d2780c; --warning-tile: #fdf1e2;
  --glow: #005eff; --glow-opacity: .07;`;

const BASE = `
text { white-space: pre; }
.sans { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif; }
.mono { font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace; }
.card { fill: var(--card); }
.card-border { fill: none; stroke: var(--line-2); }
.divider { stroke: var(--line); }
.window-dot { fill: var(--line-2); }
.title { fill: var(--ink-2); font-size: 13px; font-weight: 600; letter-spacing: .2px; }
.glow-stop { stop-color: var(--glow); }
.glow-start { stop-opacity: var(--glow-opacity); }
.accent { color: var(--accent); }
.success { color: var(--success); }
.warning { color: var(--warning); }
.tile { fill: var(--tile); }
.success-tile { fill: var(--success-tile); }
.warning-tile { fill: var(--warning-tile); }
.bubble { fill: var(--bubble); }
.prompt { fill: var(--ink); font-size: 14px; }
.command { fill: var(--accent); font-weight: 600; }
.inline-command { font-size: 14px; }
.heading { fill: var(--ink); font-size: 15px; }
.strong { font-weight: 600; }
.label { fill: var(--ink-2); font-size: 14px; }
.name { fill: var(--accent); font-size: 13px; font-weight: 600; }
.finding { fill: var(--ink); font-size: 14px; font-weight: 600; }
.note { fill: var(--muted); font-size: 13.5px; }
.dot { fill: var(--muted); }
.field { fill: var(--field); }
.field-border { stroke: var(--line-2); }
.placeholder { fill: var(--muted); font-size: 14px; }
.caret { fill: var(--accent); }
.send-idle { fill: var(--line-2); }
.send-arrow-idle { fill: none; stroke: var(--muted); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.send-armed { fill: var(--accent-strong); }
.send-arrow-armed { fill: none; stroke: var(--on-accent); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.spinner-track { fill: none; stroke: var(--tile); stroke-width: 2.4; }
.spinner { fill: none; stroke: var(--accent); stroke-width: 2.4; stroke-linecap: round; stroke-dasharray: 16 34.3; transform-box: fill-box; transform-origin: center; animation: spin .9s linear infinite; }
.shimmer-base { stop-color: var(--muted); }
.shimmer-peak { stop-color: var(--ink); }
.ellipsis { animation: ellipsis 1.2s ease-in-out infinite; }
.tab-background { fill: var(--field); stroke: var(--line-2); }
.tab-icon { color: var(--muted); }
.tab-label { fill: var(--ink); font-size: 12.5px; font-weight: 500; }
.new-tab { fill: transparent; }
.new-tab-plus { fill: none; stroke: var(--muted); stroke-width: 1.8; stroke-linecap: round; }
.pop { transform-box: fill-box; transform-origin: center; }
.blink { animation: blink 1.06s steps(1) infinite; }
.bounce { animation: bounce 1s ease-in-out infinite; }
.typed, .thinking, .send-on, .past, .idle { opacity: 0; }
.dim { opacity: .5; }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes blink { 50% { opacity: 0; } }
@keyframes bounce { 0%, 60%, 100% { opacity: .35; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-3px); } }
@keyframes ellipsis { 0%, 100% { fill-opacity: .15; } 40% { fill-opacity: 1; } }`;

export const stylesheet = (animationRules: string[], finalTabShift: number) =>
  [
    `svg {${DARK}\n}`,
    `@media (prefers-color-scheme: light) {\n  svg {${LIGHT}\n  }\n}`,
    BASE,
    `.shifted { transform: translateX(${finalTabShift}px); }`,
    ...animationRules,
    '@media (prefers-reduced-motion: reduce) {\n  * { animation: none !important; }\n}',
  ].join('\n');
