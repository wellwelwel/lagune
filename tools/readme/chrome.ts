import type { Animation, FlowContext, Fragment, Session } from './types';
import { GUTTER, HEIGHT, NEW_TAB_SHIFT, TAB, WIDTH } from './layout';
import { escapeXml, icon } from './markup';
import { fragment, join } from './motion';

const RESTORE_DURATION = 0.3;

const tabContent = (x: number, label: string) =>
  `${icon('chat', x + 12, TAB.y + 7, 14, 'tab-icon')}
    <text x="${x + 33}" y="${TAB.y + 18.5}" class="sans tab-label">${escapeXml(label)}</text>`;

const tabBackground = (x: number, className: string) =>
  `<rect x="${x + 0.5}" y="${TAB.y + 0.5}" width="${TAB.width - 1}" height="${TAB.height - 1}" rx="8" class="tab-background ${className}"/>`;

const tabView =
  ({ timeline, motion }: FlowContext) =>
  (session: Session, index: number): Fragment => {
    const { opens } = timeline.sessions[index];
    const next = timeline.sessions[index + 1];
    const x = TAB.x + index * NEW_TAB_SHIFT;
    const prefix = `tab-${index + 1}`;
    const appear = motion.enterUntilFade(prefix, opens + 0.12);

    if (!next)
      return fragment(
        `<g class="${appear.name}">
    ${tabBackground(x, '')}
    ${tabContent(x, session.tab)}
  </g>`,
        [appear]
      );

    const isFirst = index === 0;
    const restore = isFirst ? motion.fade + 0.2 : motion.reset;
    const background = motion.visibleBetween(`${prefix}-active`, [
      { from: opens, to: next.opens, fadeOut: 0.25 },
      ...(isFirst
        ? [{ from: restore, to: motion.cycle, fadeIn: RESTORE_DURATION }]
        : []),
    ]);
    const label: Animation = {
      name: `${prefix}-label`,
      stops: [
        { at: 0, style: 'opacity:1' },
        { at: next.opens, style: 'opacity:1' },
        { at: next.opens + 0.25, style: 'opacity:.5' },
        { at: restore, style: 'opacity:.5' },
        { at: restore + RESTORE_DURATION, style: 'opacity:1' },
        { at: motion.cycle, style: 'opacity:1' },
      ],
    };
    const tab = `${tabBackground(x, `idle ${background.name}`)}
  <g class="dim ${label.name}">
    ${tabContent(x, session.tab)}
  </g>`;

    if (isFirst) return fragment(tab, [background, label]);

    return fragment(`<g class="${appear.name}">\n  ${tab}\n  </g>`, [
      appear,
      background,
      label,
    ]);
  };

const newTabButton = ({ timeline, motion }: FlowContext): Fragment => {
  const openings = timeline.sessions.slice(1).map((session) => session.opens);
  const shift = (tabs: number) =>
    `transform:translateX(${tabs * NEW_TAB_SHIFT}px)`;
  const move: Animation = {
    name: 'new-tab-move',
    stops: [
      { at: 0, style: shift(0) },
      ...openings.flatMap((opens, index) => [
        { at: opens, style: shift(index) },
        { at: opens + 0.35, style: shift(index + 1) },
      ]),
      { at: motion.fade, style: shift(openings.length) },
      { at: motion.fade + 0.4, style: shift(0) },
      { at: motion.cycle, style: shift(0) },
    ],
  };
  const press: Animation = {
    name: 'new-tab-press',
    stops: [
      { at: 0, style: 'transform:scale(1)' },
      ...openings.flatMap((opens) => [
        { at: opens - 0.3, style: 'transform:scale(1)' },
        { at: opens - 0.15, style: 'transform:scale(.8)' },
        { at: opens + 0.05, style: 'transform:scale(1)' },
      ]),
      { at: motion.cycle, style: 'transform:scale(1)' },
    ],
  };
  const x = TAB.x + TAB.width + 8;

  return fragment(
    `<g class="shifted ${move.name}">
    <g class="pop ${press.name}">
      <rect x="${x}" y="${TAB.y + 1}" width="26" height="26" rx="8" class="new-tab"/>
      <path d="M${x + 13} ${TAB.y + 8.5}v11M${x + 7.5} ${TAB.y + 14}h11" class="new-tab-plus"/>
    </g>
  </g>`,
    [move, press]
  );
};

export const windowChrome = (context: FlowContext): Fragment => {
  const tabs = join(context.sessions.map(tabView(context)), '\n  ');
  const newTab = newTabButton(context);

  return fragment(
    `<rect x=".5" y=".5" width="${WIDTH - 1}" height="${HEIGHT - 1}" rx="16" class="card"/>
  <g clip-path="url(#card-clip)">
    <ellipse cx="${WIDTH - 60}" cy="40" rx="320" ry="190" fill="url(#glow)"/>
  </g>
  <rect x=".5" y=".5" width="${WIDTH - 1}" height="${HEIGHT - 1}" rx="16" class="card-border"/>
  <circle cx="22" cy="22" r="5" class="window-dot"/>
  <circle cx="38" cy="22" r="5" class="window-dot"/>
  <circle cx="54" cy="22" r="5" class="window-dot"/>
  ${tabs.markup}
  ${newTab.markup}
  ${icon('spark', WIDTH - GUTTER - 92, 13, 18, 'accent')}
  <text x="${WIDTH - GUTTER}" y="27" text-anchor="end" class="sans title">Your agent</text>
  <line x1="0" y1="44.5" x2="${WIDTH}" y2="44.5" class="divider"/>`,
    [...tabs.animations, ...newTab.animations]
  );
};
