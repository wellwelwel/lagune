import type {
  Closing,
  ClosingPlacement,
  FlowContext,
  Fragment,
  IconName,
  Row,
  Session,
} from './types';
import {
  BLOCK_TOP,
  BUBBLE_TOP,
  GUTTER,
  LABEL_X,
  NOTE_X,
  ROW_PITCH,
  ROWS_TOP,
  TEXT_X,
  WIDTH,
} from './layout';
import {
  escapeXml,
  icon,
  promptText,
  promptWidth,
  roundedRectangle,
} from './markup';
import { fragment, join, POP } from './motion';

const tileIcon = (iconName: IconName, top: number, tone: string) =>
  icon(iconName, TEXT_X + 4, top + 4, 16, tone);

const rowTile = (
  top: number,
  iconName: IconName,
  tone: string,
  tileClass: string
) =>
  `<rect x="${TEXT_X}" y="${top}" width="24" height="24" rx="7" class="${tileClass}"/>
      ${tileIcon(iconName, top, tone)}`;

const rowText = (top: number, text: string, className: string, x = LABEL_X) =>
  `<text x="${x}" y="${top + 17}" class="${className}">${escapeXml(text)}</text>`;

const rowMarkup = (row: Row, top: number) => {
  if (row.kind === 'detected')
    return `${rowTile(top, row.icon, 'accent', 'tile')}
      ${rowText(top, row.name, 'sans label')}`;

  if (row.kind === 'specialization')
    return `${rowTile(top, 'shield', 'accent', 'tile')}
      ${rowText(top, row.name, 'mono name')}
      ${rowText(top, row.note, 'sans note', NOTE_X)}`;

  return `${rowTile(top, 'target', 'warning', 'warning-tile')}
      ${rowText(top, row.name, 'sans finding')}
      ${rowText(top, row.note, 'sans note', NOTE_X)}`;
};

const badge = (
  { prefix, top, at, motion }: ClosingPlacement,
  iconName: IconName,
  tone: string,
  tileClass: string
): Fragment => {
  const pop = motion.enter(`${prefix}-badge`, at + 0.05, POP);

  return fragment(
    `<g class="pop ${pop.name}">
        <circle cx="${TEXT_X + 12}" cy="${top + 12}" r="12" class="${tileClass}"/>
        ${tileIcon(iconName, top, tone)}
      </g>`,
    [pop]
  );
};

const closingText = (top: number, content: string) =>
  `<text x="${LABEL_X}" y="${top + 17}" class="sans heading strong">${content}</text>`;

const buildingIndicator = (top: number) => {
  const dots = [0, 1, 2]
    .map(
      (index) =>
        `<tspan class="ellipsis" style="animation-delay:${(index * 0.2 - 1.2).toFixed(2)}s">.</tspan>`
    )
    .join('');

  return `<circle cx="${TEXT_X + 12}" cy="${top + 12}" r="8" class="spinner-track"/>
      <circle cx="${TEXT_X + 12}" cy="${top + 12}" r="8" class="spinner"/>
      <text x="${LABEL_X}" y="${top + 17}" class="sans heading strong" fill="url(#shimmer)">Building${dots}</text>`;
};

const closingView = (
  closing: Closing,
  placement: ClosingPlacement
): Fragment => {
  if (closing === 'building') return fragment(buildingIndicator(placement.top));

  if (closing === 'ready') {
    const check = badge(placement, 'check', 'success', 'success-tile');

    return fragment(
      `${check.markup}
      ${closingText(placement.top, 'All set! You’re ready to build.')}`,
      check.animations
    );
  }

  const arrow = badge(placement, 'arrow', 'accent', 'tile');

  return fragment(
    `${arrow.markup}
      ${closingText(placement.top, 'Next, <tspan class="mono command inline-command">/lagune-plan</tspan> turns them into prioritized fixes.')}`,
    arrow.animations
  );
};

const userBubble = (session: Session, className: string) => {
  const width = promptWidth(session.prompt) + 28;
  const x = WIDTH - GUTTER - width;

  return `<g class="${className}">
      <path d="${roundedRectangle(x, BUBBLE_TOP, width, 38, [14, 14, 4, 14])}" class="bubble"/>
      ${promptText(session.prompt, x + 14, BUBBLE_TOP + 24)}
    </g>`;
};

const avatar = (className: string) =>
  `<g class="${className}">
      <circle cx="34" cy="${BLOCK_TOP + 14}" r="14" class="tile"/>
      ${icon('spark', 25, BLOCK_TOP + 5, 18, 'accent')}
    </g>`;

const thinking = (className: string) => {
  const dots = [0, 1, 2]
    .map(
      (index) =>
        `<circle cx="${TEXT_X + 4 + index * 11}" cy="${BLOCK_TOP + 14}" r="3.2" class="dot bounce" style="animation-delay:${(index * 0.16 - 1).toFixed(2)}s"/>`
    )
    .join('');

  return `<g class="thinking ${className}">${dots}</g>`;
};

const sessionView =
  ({ timeline, motion }: FlowContext) =>
  (session: Session, index: number): Fragment => {
    const timing = timeline.sessions[index];
    const next = timeline.sessions[index + 1];
    const prefix = `session-${index + 1}`;
    const container = next
      ? motion.leaveAt(prefix, next.opens)
      : motion.fadeAtEnd(prefix);
    const bubble = motion.enter(`${prefix}-bubble`, timing.send + 0.05);
    const answerer = motion.enter(`${prefix}-avatar`, timing.send + 0.4);
    const pending = motion.visibleBetween(`${prefix}-think`, [
      {
        from: timing.think,
        to: timing.answer - 0.1,
        fadeIn: 0.2,
        fadeOut: 0.15,
      },
    ]);
    const heading = motion.enter(`${prefix}-heading`, timing.answer);
    const rows = join(
      session.rows.map((row, rowIndex) => {
        const top = ROWS_TOP + rowIndex * ROW_PITCH;
        const entrance = motion.enter(
          `${prefix}-row-${rowIndex + 1}`,
          timing.rows[rowIndex]
        );

        return fragment(
          `<g class="${entrance.name}">
      ${rowMarkup(row, top)}
    </g>`,
          [entrance]
        );
      }),
      '\n    '
    );
    const closingEntrance = motion.enter(`${prefix}-closing`, timing.closing);
    const closing = closingView(session.closing, {
      prefix,
      top: ROWS_TOP + session.rows.length * ROW_PITCH + 8,
      at: timing.closing,
      motion,
    });

    return fragment(
      `<g class="${next ? 'past ' : ''}${container.name}">
    ${userBubble(session, bubble.name)}
    ${avatar(answerer.name)}
    ${thinking(pending.name)}
    <text x="${TEXT_X}" y="${BLOCK_TOP + 19}" class="sans heading ${heading.name}">${escapeXml(session.heading)}</text>
    ${rows.markup}
    <g class="${closingEntrance.name}">
      ${closing.markup}
    </g>
  </g>`,
      [
        container,
        bubble,
        answerer,
        pending,
        heading,
        ...rows.animations,
        closingEntrance,
        ...closing.animations,
      ]
    );
  };

export const conversation = (context: FlowContext): Fragment => {
  const sessions = join(context.sessions.map(sessionView(context)), '\n  ');

  return fragment(
    `<g clip-path="url(#viewport)">
  ${sessions.markup}
  </g>`,
    sessions.animations
  );
};
