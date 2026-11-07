import type {
  Agent,
  Animation,
  ChipSegment,
  FieldLayers,
  FlowContext,
  Fragment,
  Outro,
  Session,
  Target,
  TypingSpan,
} from './types';
import {
  CHIP,
  FIELD,
  FIELD_LINE_TOP,
  FIELD_TEXT_X,
  HEIGHT,
  LINE_BASELINE,
  LINE_HEIGHT,
  SEND,
  TOOLBAR_CENTER,
  TOOLBAR_HEIGHT,
  WIDTH,
} from './layout';
import {
  characterOffsets,
  fittedText,
  icon,
  lineTops,
  lineWidth,
  promptHeight,
  promptLine,
} from './markup';
import { sansWidth } from './metrics';
import { fragment, join } from './motion';
import { isPasted } from './timeline';

const PANEL_PADDING = FIELD_LINE_TOP - FIELD.y;
const COVER_REGION = `x="0" y="0" width="${WIDTH}" height="${HEIGHT}"`;
const STEP = 'steps(1,end)';
const STAR_SIZE = 15;
const CHIP_ROLL = 0.22;
const SEND_STAR_SIZE = 15;

const fieldShape = (top: number, height: number) =>
  `<rect x="${FIELD.x + 0.5}" y="${top + 0.5}" width="${FIELD.width - 1}" height="${height - 1}" rx="${FIELD.radius - 0.5}" class="field field-border"/>`;

const caret = (x: number, top: number) =>
  `<rect x="${x - 0.5}" y="${top}" width="1.6" height="19" rx=".8" class="caret blink"/>`;

const translateX = (pixels: number) =>
  `transform:translateX(${Number(pixels.toFixed(1))}px)`;

const typingAnimation = (
  name: string,
  offsets: number[],
  { start, end, until }: TypingSpan,
  cycle: number
): Animation => {
  const interval = (end - start) / offsets.length;

  return {
    name,
    stops: [
      { at: 0, style: translateX(0) },
      { at: start, style: translateX(0), easing: STEP },
      ...offsets.map((position, index) => ({
        at: start + (index + 1) * interval,
        style: translateX(position),
        easing: STEP,
      })),
      { at: until, style: translateX(offsets.at(-1) ?? 0) },
      { at: until + 0.01, style: translateX(0) },
      { at: cycle, style: translateX(0) },
    ],
  };
};

const typingCover = (className: string, width: number) =>
  `<g class="${className}">
        <rect x="${FIELD_TEXT_X}" y="${FIELD_LINE_TOP - 3}" width="${width + 40}" height="25" class="field"/>
        ${caret(FIELD_TEXT_X - 1, FIELD_LINE_TOP)}
      </g>`;

const fieldCaret =
  ({ timeline, motion }: FlowContext) =>
  (session: Session, index: number): Fragment => {
    const timing = timeline.sessions[index];
    const previous = timeline.sessions[index - 1];
    const isLast = index === timeline.sessions.length - 1;
    const name = `cover-${index + 1}`;
    const visible = motion.visibleBetween(name, [
      {
        from: previous?.send ?? 0,
        to: isLast ? timeline.outro.type : timing.send,
      },
      ...(previous ? [] : [{ from: motion.reset, to: motion.cycle }]),
    ]);

    if (isPasted(session.prompt))
      return fragment(
        `<g class="${visible.name}">${caret(FIELD_TEXT_X - 1, FIELD_LINE_TOP)}</g>`,
        [visible]
      );

    const offsets = characterOffsets(session.prompt.join(''));
    const typing = typingAnimation(
      `${name}-typing`,
      offsets,
      { start: timing.type, end: timing.typed, until: timing.send },
      motion.cycle
    );

    return fragment(
      `<g class="${visible.name}">
      ${typingCover(typing.name, offsets.at(-1) ?? 0)}
    </g>`,
      [visible, typing]
    );
  };

const typedPrompt = (
  { timeline, motion }: FlowContext,
  session: Session,
  index: number
): Fragment => {
  const { type, send } = timeline.sessions[index];
  const visible = motion.visibleBetween(`typed-${index + 1}`, [
    { from: type, to: send },
  ]);

  return fragment(
    promptLine(
      session.prompt.join(''),
      FIELD_TEXT_X,
      FIELD_LINE_TOP,
      `typed ${visible.name}`
    ),
    [visible]
  );
};

const pastedPrompt = (
  { timeline, motion }: FlowContext,
  session: Session,
  index: number
): Fragment => {
  const timing = timeline.sessions[index];
  const prefix = `paste-${index + 1}`;
  const height = promptHeight(session.prompt) + PANEL_PADDING + TOOLBAR_HEIGHT;
  const top = FIELD.y + FIELD.height - height;
  const tops = lineTops(session.prompt, top + PANEL_PADDING);
  const visible = motion.visibleBetween(prefix, [
    { from: timing.type, to: timing.send + 0.05, fadeIn: 0.15, fadeOut: 0.15 },
  ]);
  const lines = join(
    session.prompt.flatMap((line, lineIndex) => {
      if (!line) return [];

      const entrance = motion.enter(
        `${prefix}-line-${lineIndex + 1}`,
        timing.lines[lineIndex]
      );
      const isLastLine = lineIndex === session.prompt.length - 1;
      const endCaret = isLastLine
        ? caret(FIELD_TEXT_X + lineWidth(line) + 2, tops[lineIndex])
        : '';

      return [
        fragment(
          `<g class="${entrance.name}">
        ${promptLine(line, FIELD_TEXT_X, tops[lineIndex])}${endCaret}
      </g>`,
          [entrance]
        ),
      ];
    }),
    '\n      '
  );

  return fragment(
    `<g class="pasted ${visible.name}">
      ${fieldShape(top, height)}
      ${lines.markup}
    </g>`,
    [visible, ...lines.animations]
  );
};

const callToActionLayout = (outro: Outro) => {
  const lead = `${outro.lead} `;
  const leadOffsets = characterOffsets(lead);
  const starX = (leadOffsets.at(-1) ?? 0) + 1;
  const trailX = starX + STAR_SIZE + 1;

  return {
    lead,
    starX,
    trailX,
    offsets: [
      ...leadOffsets,
      starX + STAR_SIZE,
      ...characterOffsets(outro.trail).map((offset) => trailX + offset),
    ],
  };
};

const callToAction = ({ outro, timeline, motion }: FlowContext): Fragment => {
  const { type, typed } = timeline.outro;
  const layout = callToActionLayout(outro);
  const visible = motion.visibleBetween('outro', [
    { from: type, to: motion.fade, fadeOut: 0.4 },
  ]);
  const typing = typingAnimation(
    'outro-typing',
    layout.offsets,
    { start: type, end: typed, until: motion.fade + 0.45 },
    motion.cycle
  );

  return fragment(
    `<g class="typed ${visible.name}">
      ${promptLine(layout.lead, FIELD_TEXT_X, FIELD_LINE_TOP)}
      ${icon('star', FIELD_TEXT_X + layout.starX, FIELD_LINE_TOP + (LINE_HEIGHT - STAR_SIZE) / 2, STAR_SIZE, 'star')}
      ${promptLine(outro.trail, FIELD_TEXT_X + layout.trailX, FIELD_LINE_TOP)}
      ${typingCover(typing.name, layout.offsets.at(-1) ?? 0)}
    </g>`,
    [visible, typing]
  );
};

const chipSegments = ({
  sessions,
  outro,
  timeline,
  motion,
}: FlowContext): ChipSegment[] => {
  const changes = [
    ...sessions.map((session, index) => ({
      agent: session.agent,
      at: timeline.sessions[index].opens,
    })),
    { agent: outro.agent, at: timeline.outro.opens },
    ...outro.agents.map((agent, index) => ({
      agent,
      at: timeline.outro.swaps[index],
    })),
    { agent: sessions[0].agent, at: timeline.outro.back },
  ];

  return changes.map((change, index) => ({
    agent: change.agent,
    from: change.at,
    to: changes[index + 1]?.at ?? motion.cycle,
  }));
};

const chipLabelWidth = (agent: Agent) => sansWidth(agent.name, CHIP.fontSize);

const chipWidth = (agent: Agent) => chipLabelWidth(agent) + 40;

const chipTrack = (
  name: string,
  segments: ChipSegment[],
  style: (width: number) => string,
  cycle: number
): Animation => {
  const widths = segments.map((segment) => chipWidth(segment.agent));

  return {
    name,
    stops: [
      { at: 0, style: style(widths[0]) },
      ...segments.slice(1).flatMap((segment, index) => [
        { at: segment.from, style: style(widths[index]) },
        { at: segment.from + CHIP_ROLL, style: style(widths[index + 1]) },
      ]),
      { at: cycle, style: style(widths.at(-1) ?? 0) },
    ],
  };
};

const agentChip = (context: FlowContext): Fragment => {
  const { sessions, motion } = context;
  const segments = chipSegments(context);
  const resting = sessions.length - 1;
  const restingWidth = chipWidth(segments[resting].agent);
  const cap = CHIP.height / 2;
  const top = TOOLBAR_CENTER - cap;
  const stretch = chipTrack(
    'chip-stretch',
    segments,
    (width) =>
      `transform:scaleX(${Number(((width - CHIP.height) / (restingWidth - CHIP.height)).toFixed(4))})`,
    motion.cycle
  );
  const edge = chipTrack(
    'chip-edge',
    segments,
    (width) => translateX(width - restingWidth),
    motion.cycle
  );
  const contents = join(
    segments.map((segment, index) => {
      const roll = motion.rollBetween(
        `chip-${index + 1}`,
        segment.from,
        segment.to,
        CHIP_ROLL
      );
      const labelWidth = chipLabelWidth(segment.agent);

      return fragment(
        `<g class="${index === resting ? '' : 'idle '}${roll.name}">
      ${icon(segment.agent.icon, CHIP.x + 7, TOOLBAR_CENTER - 8, 16, 'agent-logo')}
      ${fittedText(segment.agent.name, CHIP.x + 28, TOOLBAR_CENTER + 4.5, labelWidth, 'chip-label')}
    </g>`,
        [roll]
      );
    }),
    '\n  '
  );

  return fragment(
    `<circle cx="${CHIP.x + cap}" cy="${TOOLBAR_CENTER}" r="${cap}" class="chip"/>
  <rect x="${CHIP.x + cap}" y="${top}" width="${restingWidth - CHIP.height}" height="${CHIP.height}" class="chip chip-stretch ${stretch.name}"/>
  <circle cx="${CHIP.x + restingWidth - cap}" cy="${TOOLBAR_CENTER}" r="${cap}" class="chip ${edge.name}"/>
  ${contents.markup}`,
    [stretch, edge, ...contents.animations]
  );
};

const sendButton = ({ sessions, timeline, motion }: FlowContext): Fragment => {
  const armed = motion.visibleBetween(
    'send-armed',
    timeline.sessions.map(({ type, send }) => ({
      from: type,
      to: send + 0.1,
      fadeIn: 0.15,
      fadeOut: 0.25,
    }))
  );
  const starred = motion.visibleBetween('send-starred', [
    {
      from: timeline.outro.opens,
      to: motion.fade,
      fadeIn: 0.2,
      fadeOut: 0.4,
    },
  ]);
  const working = motion.visibleBetween(
    'send-working',
    timeline.sessions.map((timing, index) => ({
      from: timing.send,
      to:
        sessions[index].closing === 'building'
          ? (timeline.sessions[index + 1]?.opens ?? motion.fade)
          : timing.closing,
      fadeIn: 0.2,
      fadeOut: 0.25,
    }))
  );
  const press = motion.pressAt(
    'send-press',
    [...timeline.sessions.map(({ send }) => send), timeline.outro.click],
    { scale: '.86', start: -0.05, peak: 0.07, end: 0.3 }
  );
  const centerX = SEND.x + SEND.size / 2;
  const centerY = SEND.y + SEND.size / 2;
  const play = `M${centerX - 3.5} ${centerY - 6.5}L${centerX + 6.5} ${centerY}L${centerX - 3.5} ${centerY + 6.5}Z`;
  const sendStar = icon(
    'star',
    centerX - SEND_STAR_SIZE / 2,
    centerY - SEND_STAR_SIZE / 2,
    SEND_STAR_SIZE,
    'send-star'
  );
  const button = (className: string) =>
    `<rect x="${SEND.x}" y="${SEND.y}" width="${SEND.size}" height="${SEND.size}" rx="${SEND.radius}" class="${className}"/>`;

  return fragment(
    `<g class="pop ${press.name}">
    ${button('send-idle')}
    <path d="${play}" class="send-icon-idle"/>
    <g class="send-on ${armed.name}">
      ${button('send-active')}
      <path d="${play}" class="send-icon-active"/>
    </g>
    <g class="send-on ${working.name}">
      ${button('send-active')}
      <rect x="${centerX - 5}" y="${centerY - 5}" width="10" height="10" rx="2" class="send-icon-active"/>
    </g>
    <g class="send-on ${starred.name}">
      ${button('send-gold')}
      ${sendStar}
    </g>
  </g>`,
    [press, armed, working, starred]
  );
};

const coverMask = (id: string, covers: string) =>
  `<mask id="${id}" maskUnits="userSpaceOnUse" ${COVER_REGION} class="cover-mask">
      <rect ${COVER_REGION} fill="#fff" class="cover-backdrop"/>
      ${covers}
    </mask>`;

const paintedCovers = ({ typing, placeholder, pasted }: FieldLayers) =>
  `${fieldShape(FIELD.y, FIELD.height)}
  <g clip-path="url(#field-clip)">
    ${typing}
  </g>
  ${placeholder}
  ${pasted}`;

const maskedCovers = ({ typing, covers, placeholder, pasted }: FieldLayers) =>
  `<defs>
    ${coverMask('typing-cover', covers)}
    ${coverMask('paste-cover', pasted)}
  </defs>
  <g mask="url(#paste-cover)">
    ${fieldShape(FIELD.y, FIELD.height)}
    <g clip-path="url(#field-clip)">
      <g mask="url(#typing-cover)">
    ${typing}
      </g>
    </g>
    ${placeholder}
  </g>
  ${pasted}`;

const FIELD_LAYERS: Record<Target, (layers: FieldLayers) => string> = {
  readme: paintedCovers,
  website: maskedCovers,
};

export const composer = (context: FlowContext): Fragment => {
  const { sessions, timeline, motion } = context;
  const placeholder = motion.visibleBetween('placeholder', [
    { from: 0, to: timeline.sessions[0].type },
    ...timeline.sessions.map(({ send }, index) => ({
      from: send + 0.05,
      to: (timeline.sessions[index + 1] ?? timeline.outro).type,
      fadeIn: 0.2,
    })),
    { from: motion.fade + 0.5, to: motion.cycle, fadeIn: 0.2 },
  ]);
  const typed = join(
    sessions.flatMap((session, index) =>
      isPasted(session.prompt) ? [] : [typedPrompt(context, session, index)]
    ),
    '\n    '
  );
  const pasted = join(
    sessions.flatMap((session, index) =>
      isPasted(session.prompt) ? [pastedPrompt(context, session, index)] : []
    ),
    '\n  '
  );
  const carets = join(sessions.map(fieldCaret(context)), '\n    ');
  const starRequest = callToAction(context);
  const chip = agentChip(context);
  const send = sendButton(context);
  const covers = `${carets.markup}
    ${starRequest.markup}`;
  const layers: FieldLayers = {
    typing: `${typed.markup}
    ${covers}`,
    covers,
    placeholder: `<text x="${FIELD_TEXT_X}" y="${FIELD_LINE_TOP + LINE_BASELINE}" class="sans placeholder ${placeholder.name}">Message your AI agent</text>`,
    pasted: pasted.markup,
  };

  return fragment(
    `${FIELD_LAYERS[context.target](layers)}
  ${icon('paperclip', FIELD_TEXT_X - 2, TOOLBAR_CENTER - 8, 16, 'muted')}
  ${chip.markup}
  ${send.markup}`,
    [
      placeholder,
      ...typed.animations,
      ...carets.animations,
      ...starRequest.animations,
      ...pasted.animations,
      ...chip.animations,
      ...send.animations,
    ]
  );
};
