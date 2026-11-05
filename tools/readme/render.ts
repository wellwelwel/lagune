import type { FlowContext } from './types';
import { windowChrome } from './chrome';
import { composer } from './composer';
import { conversation } from './conversation';
import {
  FIELD,
  FIELD_TEXT_X,
  HEIGHT,
  LABEL_X,
  NEW_TAB_SHIFT,
  SEND,
  VIEWPORT,
  WIDTH,
} from './layout';
import { escapeXml } from './markup';
import { animationRules, createMotion, join } from './motion';
import { SESSIONS } from './sessions';
import { stylesheet } from './style';
import { symbolDefinitions } from './symbols';
import { createTimeline } from './timeline';

const describe = ({ sessions }: FlowContext) =>
  sessions
    .map(
      (session) =>
        `In a "${session.tab}" session, the user runs ${session.prompt.command}${session.prompt.text} and the agent answers "${session.heading}" ${session.rows.map((row) => row.name).join(', ')}.`
    )
    .join(' ');

export const renderFlow = () => {
  const timeline = createTimeline(SESSIONS);
  const context: FlowContext = {
    sessions: SESSIONS,
    timeline,
    motion: createMotion(timeline),
  };
  const body = join(
    [windowChrome(context), conversation(context), composer(context)],
    '\n  '
  );
  const styles = stylesheet(
    animationRules(body.animations, timeline.cycle),
    (SESSIONS.length - 1) * NEW_TAB_SHIFT
  );
  const viewportHeight = VIEWPORT.bottom - VIEWPORT.top;
  const fieldClipWidth = SEND.centerX - SEND.radius - FIELD_TEXT_X - 8;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="title description">
  <title id="title">Lagune in an AI chat</title>
  <desc id="description">${escapeXml(describe(context))}</desc>
  <defs>
    <style>
${styles}
    </style>
    <clipPath id="card-clip"><rect width="${WIDTH}" height="${HEIGHT}" rx="16"/></clipPath>
    <clipPath id="viewport"><rect x="0" y="${VIEWPORT.top}" width="${WIDTH}" height="${viewportHeight}"/></clipPath>
    <clipPath id="field-clip"><rect x="${FIELD_TEXT_X - 4}" y="${FIELD.y + 6}" width="${fieldClipWidth}" height="${FIELD.height - 12}"/></clipPath>
    <radialGradient id="glow">
      <stop offset="0" class="glow-stop glow-start"/>
      <stop offset="1" class="glow-stop" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="shimmer" x1="${LABEL_X - 40}" y1="0" x2="${LABEL_X + 40}" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" class="shimmer-base"/>
      <stop offset=".5" class="shimmer-peak"/>
      <stop offset="1" class="shimmer-base"/>
      <animateTransform attributeName="gradientTransform" type="translate" values="-60 0;140 0" dur="1.8s" repeatCount="indefinite"/>
    </linearGradient>
    ${symbolDefinitions()}
  </defs>
  ${body.markup}
</svg>
`;
};
