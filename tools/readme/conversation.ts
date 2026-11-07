import type {
  AnswerLayout,
  Autoscroll,
  Closing,
  ClosingPlacement,
  FlowContext,
  Fragment,
  IconName,
  Loops,
  Motion,
  PendingLoops,
  Reveal,
  Row,
  RowPlacement,
  Session,
  SessionView,
  Span,
  StepRow,
  StepRun,
  Target,
  Tone,
  VisibilityWindow,
} from './types';
import {
  BADGE_LABEL_OFFSET,
  BUBBLE_PADDING,
  BUBBLE_TOP,
  CONTENT_LEFT,
  CONTENT_RIGHT,
  FIELD,
  ICON_X,
  LABEL_X,
  LINE_HEIGHT,
  NOTE_X,
  PROMPT_SCALE,
  ROW_PITCH,
  VIEWPORT,
} from './layout';
import {
  escapeXml,
  fittedText,
  icon,
  promptHeight,
  renderedPromptLines,
  renderedPromptWidth,
  roundedRectangle,
} from './markup';
import { sansWidth } from './metrics';
import { fragment, join, LEAVE_DURATION, POP, spanOf } from './motion';

const ANSWER_CLEARANCE = 24;
const CLOSING_GAP = 6;
const LINK_GAP = 2;
const SCROLL_LIMIT = FIELD.y - ANSWER_CLEARANCE;
const SCROLL_DURATION = 0.35;
const STATE_FADE = 0.2;
const HEADING_SIZE = 15;
const CHEVRON_GAP = 12;
const CLOSING_LABEL_X = CONTENT_LEFT + BADGE_LABEL_OFFSET;
const WATERMARK_SIZE = 160;
const WATERMARK_FADE_IN = 0.6;
const WATERMARK_FADE_OUT = 2.4;
const WATERMARK_DIMMED = 0.5;
const FADE_MASK = 'url(#viewport-fade)';

const CLOSING_MESSAGES: Record<Exclude<Closing, 'building'>, string> = {
  principles: 'All set! 8 security principles were created.',
  rest: 'All 4 findings closed. The cycle is at rest.',
};

const answerLayout = (session: Session): AnswerLayout => {
  const bubbleHeight = promptHeight(session.prompt) + BUBBLE_PADDING.y * 2;
  const blockTop = BUBBLE_TOP + bubbleHeight + 14;
  const rowsTop = blockTop + 32;

  return {
    bubbleHeight,
    blockTop,
    rowTops: session.rows.map((_, index) => rowsTop + index * ROW_PITCH),
    closingTop: rowsTop + session.rows.length * ROW_PITCH + CLOSING_GAP,
  };
};

const rowIcon = (iconName: IconName, top: number, tone: Tone, x = ICON_X) =>
  icon(iconName, x + 4, top + 4, 16, tone);

const timelineLink = (previousTop: number, top: number) =>
  `<path d="M${ICON_X + 12} ${previousTop + 20 + LINK_GAP}V${top + 4 - LINK_GAP}" class="timeline"/>`;

const rowText = (top: number, text: string, className: string, x = LABEL_X) =>
  `<text x="${x}" y="${top + 17}" class="${className}">${escapeXml(text)}</text>`;

const pendingLoops = (
  loops: Loops,
  name: string,
  span: Span,
  textClass: string,
  gradient: string
): PendingLoops => {
  const spin = loops.spinner(`${name}-spin`, span);
  const text = loops.shimmer(`${name}-label`, span, textClass, gradient);
  const dots = [0, 1, 2].map((index) =>
    loops.ellipsis(`${name}-dot-${index + 1}`, span, index)
  );

  return {
    spin,
    text,
    dots,
    animations: [spin, text, ...dots].flatMap((loop) => loop.animations),
  };
};

const spinner = (centerX: number, centerY: number, { spin }: PendingLoops) =>
  `<circle cx="${centerX}" cy="${centerY}" r="8" class="spinner-track"/>
      <circle cx="${centerX}" cy="${centerY}" r="8" ${spin.markup}/>`;

const loadingText = (
  baseline: number,
  label: string,
  x: number,
  { text, dots }: PendingLoops
) =>
  `<text x="${x}" y="${baseline}" ${text.markup}>${escapeXml(label)}${dots
    .map((dot) => `<tspan ${dot.markup}>.</tspan>`)
    .join('')}</text>`;

const runView = (
  run: StepRun,
  runIndex: number,
  { prefix, top, runs, motion, loops }: RowPlacement
): Fragment => {
  const { start, finish } = runs[runIndex];
  const until = runs[runIndex + 1]?.start ?? motion.reset;
  const isLast = runIndex === runs.length - 1;
  const name = `${prefix}-run-${runIndex + 1}`;
  const shown = finish + STATE_FADE;
  const loadingWindow: VisibilityWindow =
    runIndex > 0
      ? {
          from: start + STATE_FADE,
          to: finish,
          fadeIn: STATE_FADE,
          fadeOut: STATE_FADE,
        }
      : { from: start, to: finish, fadeOut: STATE_FADE };
  const loading = motion.visibleBetween(`${name}-loading`, [loadingWindow]);
  const pending = pendingLoops(
    loops,
    loading.name,
    spanOf(loadingWindow),
    'sans note',
    'shimmer'
  );
  const result = motion.visibleBetween(`${name}-result`, [
    { from: shown, to: until, fadeIn: STATE_FADE, fadeOut: STATE_FADE },
  ]);
  const pop = motion.enter(`${name}-pop`, shown, POP);

  return fragment(
    `<g class="idle ${loading.name}">
        ${spinner(ICON_X + 12, top + 12, pending)}
        ${loadingText(top + 17, 'Running', NOTE_X, pending)}
      </g>
      <g class="${isLast ? '' : 'idle '}${result.name}">
        <g class="pop ${pop.name}">${rowIcon('bot', top, run.tone)}</g>
        ${rowText(top, run.note, 'sans note', NOTE_X)}
      </g>`,
    [loading, ...pending.animations, result, pop]
  );
};

const stepView = (row: StepRow, placement: RowPlacement): Fragment => {
  const runs = join(
    row.runs.map((run, runIndex) => runView(run, runIndex, placement)),
    '\n      '
  );

  return fragment(
    `${runs.markup}
      ${rowText(placement.top, row.name, 'sans name')}`,
    runs.animations
  );
};

const rowView = (row: Row, placement: RowPlacement): Fragment => {
  const { top } = placement;

  if (row.kind === 'detected')
    return fragment(`${rowIcon(row.icon, top, 'accent')}
      ${rowText(top, row.name, 'sans label')}`);

  if (row.kind === 'specialization')
    return fragment(`${rowIcon('graduation-cap', top, 'accent')}
      ${rowText(top, row.name, 'sans name')}
      ${rowText(top, row.note, 'sans note', NOTE_X)}`);

  return stepView(row, placement);
};

const closingView = (
  closing: Closing,
  { prefix, top, at, until, motion, loops }: ClosingPlacement
): Fragment => {
  if (closing === 'building') {
    const pending = pendingLoops(
      loops,
      `${prefix}-building`,
      { from: at, to: until },
      'sans heading strong',
      'shimmer-strong'
    );

    return fragment(
      `${spinner(CONTENT_LEFT + 12, top + 12, pending)}
      ${loadingText(top + 17, 'Building', CLOSING_LABEL_X, pending)}`,
      pending.animations
    );
  }

  const pop = motion.enter(`${prefix}-badge`, at + 0.05, POP);

  return fragment(
    `<g class="pop ${pop.name}">
        <circle cx="${CONTENT_LEFT + 12}" cy="${top + 12}" r="12" class="success-tile"/>
        ${rowIcon('check', top, 'success', CONTENT_LEFT)}
      </g>
      ${rowText(top, CLOSING_MESSAGES[closing], 'sans heading strong', CLOSING_LABEL_X)}`,
    [pop]
  );
};

const userBubble = (session: Session, height: number, className: string) => {
  const width = renderedPromptWidth(session.prompt) + BUBBLE_PADDING.x * 2;
  const x = CONTENT_RIGHT - width;
  const radius = height <= LINE_HEIGHT + BUBBLE_PADDING.y * 2 ? height / 2 : 16;

  return `<g class="${className}">
      <path d="${roundedRectangle(x, BUBBLE_TOP, width, height, radius)}" class="bubble"/>
      ${renderedPromptLines(session.prompt, x + BUBBLE_PADDING.x, BUBBLE_TOP + BUBBLE_PADDING.y)}
    </g>`;
};

const thinking = (top: number, className: string, pending: PendingLoops) =>
  `<g class="thinking ${className}">
      ${spinner(CONTENT_LEFT + 8, top + 14, pending)}
      ${loadingText(top + 19, 'Thinking', CONTENT_LEFT + 24, pending)}
    </g>`;

const headingView = (session: Session, top: number) => {
  const width = Number(
    (sansWidth(session.heading, HEADING_SIZE) * PROMPT_SCALE.text).toFixed(1)
  );
  const centerX = CONTENT_LEFT + width + CHEVRON_GAP;
  const centerY = top + 14;

  return `${fittedText(session.heading, CONTENT_LEFT, top + 19, width, 'heading')}
      <path d="M${centerX - 4} ${centerY - 2}L${centerX} ${centerY + 2}L${centerX + 4} ${centerY - 2}" class="chevron"/>`;
};

const translateY = (offset: number) => `transform:translateY(${-offset}px)`;

const autoscroll = (
  name: string,
  reveals: Reveal[],
  motion: Motion
): Autoscroll | null => {
  const targets = reveals
    .map(({ at, bottom }) => ({ at, offset: bottom - SCROLL_LIMIT }))
    .filter(({ offset }) => offset > 0);
  const final = targets.at(-1)?.offset;

  if (!final) return null;

  return {
    rest: translateY(final),
    from: targets[0].at,
    animation: {
      name,
      stops: [
        { at: 0, style: translateY(0) },
        ...targets.flatMap(({ at, offset }, index) => [
          { at, style: translateY(targets[index - 1]?.offset ?? 0) },
          { at: at + SCROLL_DURATION, style: translateY(offset) },
        ]),
        { at: motion.reset, style: translateY(final) },
        { at: motion.reset + 0.01, style: translateY(0) },
        { at: motion.cycle, style: translateY(0) },
      ],
    },
  };
};

const sessionView =
  ({ timeline, motion, loops }: FlowContext) =>
  (session: Session, index: number): SessionView => {
    const timing = timeline.sessions[index];
    const next = timeline.sessions[index + 1];
    const prefix = `session-${index + 1}`;
    const layout = answerLayout(session);
    const leaves = next?.opens ?? timeline.outro.opens;
    const hidden = leaves + LEAVE_DURATION;
    const container = motion.leaveAt(prefix, leaves);
    const bubble = motion.enter(`${prefix}-bubble`, timing.send + 0.05);
    const thinkingWindow: VisibilityWindow = {
      from: timing.think,
      to: timing.answer - 0.1,
      fadeIn: 0.2,
      fadeOut: 0.15,
    };
    const pending = motion.visibleBetween(`${prefix}-think`, [thinkingWindow]);
    const thinkingLoops = pendingLoops(
      loops,
      pending.name,
      spanOf(thinkingWindow),
      'sans status',
      'shimmer'
    );
    const heading = motion.enter(`${prefix}-heading`, timing.answer);
    const rows = join(
      session.rows.map((row, rowIndex) => {
        const rowPrefix = `${prefix}-row-${rowIndex + 1}`;
        const runs = timing.rowRuns[rowIndex];
        const entrance = motion.enter(rowPrefix, runs[0].start);
        const content = rowView(row, {
          prefix: rowPrefix,
          top: layout.rowTops[rowIndex],
          runs,
          motion,
          loops,
        });
        const link =
          rowIndex > 0
            ? timelineLink(
                layout.rowTops[rowIndex - 1],
                layout.rowTops[rowIndex]
              )
            : '';

        return fragment(
          `<g class="${entrance.name}">
      ${link}${content.markup}
    </g>`,
          [entrance, ...content.animations]
        );
      }),
      '\n    '
    );
    const closingEntrance = motion.enter(`${prefix}-closing`, timing.closing);
    const closing = closingView(session.closing, {
      prefix,
      top: layout.closingTop,
      at: timing.closing,
      until: hidden,
      motion,
      loops,
    });
    const scroll = autoscroll(
      `${prefix}-scroll`,
      [
        ...timing.rowRuns.map(([firstRun], rowIndex) => ({
          at: firstRun.start,
          bottom: layout.rowTops[rowIndex] + 24,
        })),
        { at: timing.closing, bottom: layout.closingTop + 24 },
      ],
      motion
    );
    const content = `${userBubble(session, layout.bubbleHeight, bubble.name)}
    ${thinking(layout.blockTop, pending.name, thinkingLoops)}
    <g class="${heading.name}">
      ${headingView(session, layout.blockTop)}
    </g>
    ${rows.markup}
    <g class="${closingEntrance.name}">
      ${closing.markup}
    </g>`;
    const scrolled = scroll
      ? `<g class="${scroll.animation.name}" style="${scroll.rest}">
    ${content}
    </g>`
      : content;

    return {
      ...fragment(
        `<g class="${next ? 'past ' : ''}${container.name}">
    ${scrolled}
  </g>`,
        [
          container,
          bubble,
          pending,
          ...thinkingLoops.animations,
          heading,
          ...rows.animations,
          closingEntrance,
          ...closing.animations,
          ...(scroll ? [scroll.animation] : []),
        ]
      ),
      band: { from: scroll?.from ?? leaves, to: hidden },
    };
  };

const chatWatermark = ({ timeline, motion }: FlowContext): Fragment => {
  const presence = motion.opacityBetween(
    'chat-watermark',
    [
      ...timeline.sessions.map(({ opens, send }) => ({
        from: opens,
        to: send,
        fadeIn: WATERMARK_FADE_IN,
        fadeOut: WATERMARK_FADE_OUT,
      })),
      {
        from: timeline.outro.opens,
        to: motion.cycle,
        fadeIn: WATERMARK_FADE_IN,
      },
    ],
    WATERMARK_DIMMED
  );
  const x = (CONTENT_LEFT + CONTENT_RIGHT - WATERMARK_SIZE) / 2;
  const y = (VIEWPORT.top + VIEWPORT.bottom - WATERMARK_SIZE) / 2;

  return fragment(
    `<g class="${presence.name}" style="opacity:${WATERMARK_DIMMED}">
    ${icon('github', x, y, WATERMARK_SIZE, 'watermark')}
  </g>`,
    [presence]
  );
};

const VIEWPORT_MASKS: Record<
  Target,
  (motion: Motion, bands: Span[]) => Fragment
> = {
  readme: () => fragment(''),
  website: (motion, bands) => {
    const toggle = motion.switchBetween(
      'viewport-mask',
      bands,
      `mask:${FADE_MASK}`,
      'mask:none'
    );

    return fragment(` class="${toggle.name}"`, [toggle]);
  },
};

export const conversation = (context: FlowContext): Fragment => {
  const sessions = context.sessions.map(sessionView(context));
  const content = join([chatWatermark(context), ...sessions], '\n  ');
  const mask = VIEWPORT_MASKS[context.target](
    context.motion,
    sessions.map(({ band }) => band)
  );

  return fragment(
    `<g clip-path="url(#viewport)" mask="${FADE_MASK}"${mask.markup}>
  ${content.markup}
  </g>`,
    [...content.animations, ...mask.animations]
  );
};
