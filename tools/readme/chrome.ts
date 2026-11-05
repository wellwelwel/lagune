import type {
  Animation,
  FlowContext,
  Fragment,
  Motion,
  TabEntry,
  TabGeometry,
  VisibilityWindow,
} from './types';
import { BODY_TOP, CARD, CONTENT_RIGHT, HEADER_CENTER, TAB } from './layout';
import { fittedText, icon } from './markup';
import { sansWidth } from './metrics';
import { fragment, join } from './motion';

const APPEAR_DELAY = 0.12;
const RESTORE_DELAY = 0.2;
const RESTORE_DURATION = 0.3;
const HEADER_ICON_SIZE = 18;

const firstTabRestore = ({ fade }: Motion) => fade + RESTORE_DELAY;

const tabEntries = ({ sessions, outro, timeline }: FlowContext): TabEntry[] => [
  ...sessions.map((session, index) => ({
    label: session.tab,
    icon: session.agent.icon,
    iconClass: 'agent-logo',
    opens: timeline.sessions[index].opens,
  })),
  {
    label: outro.tab,
    icon: 'star-outline',
    iconClass: 'star',
    opens: timeline.outro.opens,
  },
];

const tabGeometry = (tabs: TabEntry[]): TabGeometry[] =>
  tabs.reduce<TabGeometry[]>((boxes, tab) => {
    const previous = boxes.at(-1);
    const labelWidth = sansWidth(tab.label, TAB.fontSize);
    const x = previous ? previous.x + previous.width : TAB.x;
    const width = TAB.padding * 2 + TAB.iconSize + TAB.labelGap + labelWidth;

    return [...boxes, { x, labelWidth, width }];
  }, []);

const tabContent = ({ x, labelWidth }: TabGeometry, tab: TabEntry) => {
  const iconX = x + TAB.padding;
  const labelX = iconX + TAB.iconSize + TAB.labelGap;

  return `${icon(tab.icon, iconX, HEADER_CENTER - TAB.iconSize / 2, TAB.iconSize, tab.iconClass)}
    ${fittedText(tab.label, labelX, HEADER_CENTER + 4.5, labelWidth, 'tab-label')}`;
};

const windowShape = ({ x, width }: TabGeometry) => {
  const left = CARD.x + 0.5;
  const right = CARD.x + CARD.width - 0.5;
  const top = BODY_TOP - 0.5;
  const bottom = CARD.y + CARD.height - 0.5;
  const corner = CARD.radius - 0.5;
  const tabLeft = x + 0.5;
  const tabRight = x + width - 0.5;
  const tabTop = TAB.y + 0.5;
  const tabCorner = TAB.radius - 0.5;
  const flare = TAB.flare + 0.5;
  const leftSide =
    x === CARD.x
      ? [`M${left} ${bottom - corner}`, `V${tabTop + tabCorner}`]
      : [
          `M${left} ${bottom - corner}`,
          `V${top + corner}`,
          `A${corner} ${corner} 0 0 1 ${left + corner} ${top}`,
          `H${tabLeft - flare}`,
          `A${flare} ${flare} 0 0 0 ${tabLeft} ${top - flare}`,
          `V${tabTop + tabCorner}`,
        ];

  return [
    ...leftSide,
    `A${tabCorner} ${tabCorner} 0 0 1 ${tabLeft + tabCorner} ${tabTop}`,
    `H${tabRight - tabCorner}`,
    `A${tabCorner} ${tabCorner} 0 0 1 ${tabRight} ${tabTop + tabCorner}`,
    `V${top - flare}`,
    `A${flare} ${flare} 0 0 0 ${tabRight + flare} ${top}`,
    `H${right - corner}`,
    `A${corner} ${corner} 0 0 1 ${right} ${top + corner}`,
    `V${bottom - corner}`,
    `A${corner} ${corner} 0 0 1 ${right - corner} ${bottom}`,
    `H${left + corner}`,
    `A${corner} ${corner} 0 0 1 ${left} ${bottom - corner}`,
    'Z',
  ].join('');
};

const activeWindows = (
  motion: Motion,
  tabs: TabEntry[],
  index: number
): VisibilityWindow[] => {
  const restore = firstTabRestore(motion);
  const next = tabs[index + 1];
  const until = next ? next.opens + APPEAR_DELAY : restore;

  if (index === 0)
    return [
      { from: 0, to: until },
      { from: restore, to: motion.cycle },
    ];

  return [{ from: tabs[index].opens + APPEAR_DELAY, to: until }];
};

const windowFrames = (
  { motion }: FlowContext,
  tabs: TabEntry[],
  geometry: TabGeometry[],
  resting: number
): Fragment =>
  join(
    geometry.map((box, index) => {
      const active = motion.visibleBetween(
        `frame-${index + 1}`,
        activeWindows(motion, tabs, index)
      );
      const shape = windowShape(box);

      return fragment(
        `<g class="${index === resting ? '' : 'idle '}${active.name}">
    <path d="${shape}" class="card" filter="url(#card-shadow)"/>
    <path d="${shape}" class="card-border"/>
  </g>`,
        [active]
      );
    }),
    '\n  '
  );

const tabView =
  (
    { motion }: FlowContext,
    tabs: TabEntry[],
    geometry: TabGeometry[],
    resting: number
  ) =>
  (tab: TabEntry, index: number): Fragment => {
    const next = tabs[index + 1];
    const box = geometry[index];
    const prefix = `tab-${index + 1}`;
    const appear = motion.enterUntilFade(prefix, tab.opens + APPEAR_DELAY);
    const hiddenAtRest = index > resting ? 'idle ' : '';

    if (!next)
      return fragment(
        `<g class="${hiddenAtRest}${appear.name}">
    ${tabContent(box, tab)}
  </g>`,
        [appear]
      );

    const isFirst = index === 0;
    const isBehind = index < resting;
    const restore = isFirst ? firstTabRestore(motion) : motion.reset;
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
    const markup = `<g class="${isBehind ? 'dim ' : ''}${label.name}">
    ${tabContent(box, tab)}
  </g>`;

    if (isFirst) return fragment(markup, [label]);

    return fragment(
      `<g class="${hiddenAtRest}${appear.name}">\n  ${markup}\n  </g>`,
      [appear, label]
    );
  };

const newChatButton = ({ motion }: FlowContext, tabs: TabEntry[]): Fragment => {
  const press = motion.pressAt(
    'new-chat-press',
    tabs.slice(1).map(({ opens }) => opens),
    { scale: '.8', start: -0.3, peak: -0.15, end: 0.05 }
  );
  const x = CONTENT_RIGHT - HEADER_ICON_SIZE;
  const top = HEADER_CENTER - HEADER_ICON_SIZE / 2;

  return fragment(
    `<g class="pop ${press.name}">
    ${icon('square-pen', x, top, HEADER_ICON_SIZE, 'muted')}
  </g>`,
    [press]
  );
};

export const windowChrome = (context: FlowContext): Fragment => {
  const tabs = tabEntries(context);
  const geometry = tabGeometry(tabs);
  const resting = context.sessions.length - 1;
  const frames = windowFrames(context, tabs, geometry, resting);
  const tabViews = tabs.map(tabView(context, tabs, geometry, resting));
  const newChat = newChatButton(context, tabs);

  return join([frames, ...tabViews, newChat], '\n  ');
};
