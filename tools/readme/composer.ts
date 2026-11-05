import type { Animation, FlowContext, Fragment, Session } from './types';
import { FIELD, FIELD_BASELINE, FIELD_TEXT_X, SEND } from './layout';
import { promptText, promptWidth } from './markup';
import { fragment, join } from './motion';
import { promptLength } from './timeline';

const typingCover =
  ({ timeline, motion }: FlowContext) =>
  (session: Session, index: number): Fragment => {
    const timing = timeline.sessions[index];
    const previous = timeline.sessions[index - 1];
    const isLast = index === timeline.sessions.length - 1;
    const distance = promptWidth(session.prompt);
    const offset = (pixels: number) => `transform:translateX(${pixels}px)`;
    const name = `cover-${index + 1}`;
    const typing: Animation = {
      name: `${name}-typing`,
      stops: [
        { at: 0, style: offset(0) },
        {
          at: timing.type,
          style: offset(0),
          easing: `steps(${promptLength(session.prompt)},end)`,
        },
        { at: timing.typed, style: offset(distance) },
        { at: timing.send, style: offset(distance) },
        { at: timing.send + 0.01, style: offset(0) },
        { at: motion.cycle, style: offset(0) },
      ],
    };
    const visible = motion.visibleBetween(name, [
      { from: previous?.send ?? 0, to: isLast ? motion.reset : timing.send },
      ...(previous ? [] : [{ from: motion.reset, to: motion.cycle }]),
    ]);

    return fragment(
      `<g class="${visible.name}">
      <g class="${typing.name}">
        <rect x="${FIELD_TEXT_X + 1}" y="${FIELD.y + 12}" width="${distance + 40}" height="28" class="field"/>
        <rect x="${FIELD_TEXT_X - 0.5}" y="${FIELD.y + 16}" width="1.6" height="20" rx=".8" class="caret blink"/>
      </g>
    </g>`,
      [visible, typing]
    );
  };

const typedPrompt =
  ({ timeline, motion }: FlowContext) =>
  (session: Session, index: number): Fragment => {
    const { type, send } = timeline.sessions[index];
    const visible = motion.visibleBetween(`typed-${index + 1}`, [
      { from: type, to: send },
    ]);

    return fragment(
      promptText(
        session.prompt,
        FIELD_TEXT_X,
        FIELD_BASELINE,
        `typed ${visible.name}`
      ),
      [visible]
    );
  };

const sendButton = ({ timeline, motion }: FlowContext): Fragment => {
  const armed = motion.visibleBetween(
    'send-armed',
    timeline.sessions.map(({ type, send }) => ({
      from: type,
      to: send + 0.1,
      fadeIn: 0.15,
      fadeOut: 0.25,
    }))
  );
  const press: Animation = {
    name: 'send-press',
    stops: [
      { at: 0, style: 'transform:scale(1)' },
      ...timeline.sessions.flatMap(({ send }) => [
        { at: send - 0.05, style: 'transform:scale(1)' },
        { at: send + 0.07, style: 'transform:scale(.86)' },
        { at: send + 0.3, style: 'transform:scale(1)' },
      ]),
      { at: motion.cycle, style: 'transform:scale(1)' },
    ],
  };
  const arrow = `M${SEND.centerX} ${SEND.centerY + 7}V${SEND.centerY - 7}M${SEND.centerX - 6} ${SEND.centerY - 1}L${SEND.centerX} ${SEND.centerY - 7}L${SEND.centerX + 6} ${SEND.centerY - 1}`;

  return fragment(
    `<g class="pop ${press.name}">
    <circle cx="${SEND.centerX}" cy="${SEND.centerY}" r="${SEND.radius}" class="send-idle"/>
    <path d="${arrow}" class="send-arrow-idle"/>
    <g class="send-on ${armed.name}">
      <circle cx="${SEND.centerX}" cy="${SEND.centerY}" r="${SEND.radius}" class="send-armed"/>
      <path d="${arrow}" class="send-arrow-armed"/>
    </g>
  </g>`,
    [press, armed]
  );
};

export const composer = (context: FlowContext): Fragment => {
  const { sessions, timeline, motion } = context;
  const placeholder = motion.visibleBetween('placeholder', [
    { from: 0, to: timeline.sessions[0].type },
    ...timeline.sessions.slice(1).map((timing, index) => ({
      from: timeline.sessions[index].send + 0.05,
      to: timing.type,
      fadeIn: 0.2,
    })),
    {
      from: (timeline.sessions.at(-1)?.send ?? 0) + 0.05,
      to: motion.cycle,
      fadeIn: 0.2,
    },
  ]);
  const typed = join(sessions.map(typedPrompt(context)), '\n    ');
  const covers = join(sessions.map(typingCover(context)), '\n    ');
  const send = sendButton(context);

  return fragment(
    `<rect x="${FIELD.x + 0.5}" y="${FIELD.y + 0.5}" width="${FIELD.width - 1}" height="${FIELD.height - 1}" rx="14" class="field field-border"/>
  <g clip-path="url(#field-clip)">
    ${typed.markup}
    ${covers.markup}
  </g>
  <text x="${FIELD_TEXT_X + 4}" y="${FIELD_BASELINE}" class="sans placeholder ${placeholder.name}">Message your AI agent</text>
  ${send.markup}`,
    [placeholder, ...typed.animations, ...covers.animations, ...send.animations]
  );
};
