import type { FlowContext, Target } from './types';
import { windowChrome } from './chrome';
import { composer } from './composer';
import { conversation } from './conversation';
import {
  CONTENT_RIGHT,
  FIELD,
  FIELD_TEXT_X,
  HEIGHT,
  VIEWPORT,
  WIDTH,
} from './layout';
import { createLoops } from './loops';
import { escapeXml } from './markup';
import { createMotion, fragment, join, TIMELINE_RENDERERS } from './motion';
import { OUTRO, SESSIONS } from './sessions';
import { stylesheet } from './style';
import { symbolDefinitions } from './symbols';
import { createTimeline } from './timeline';

const VIEWPORT_FADE = 10;

const shimmerGradient = (id: string, baseClass: string) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset=".3" class="${baseClass}"/>
      <stop offset=".5" class="shimmer-peak"/>
      <stop offset=".7" class="${baseClass}"/>
      <animateTransform attributeName="gradientTransform" type="translate" values="-.8 0;.8 0" dur="1.6s" repeatCount="indefinite"/>
    </linearGradient>`;

const describe = ({ sessions, outro }: FlowContext) =>
  [
    'The GitHub logo fills the background of every empty chat and fades to half once a message arrives.',
    ...sessions.map(
      (session) =>
        `In a "${session.tab}" session with ${session.agent.name}, the user sends "${session.prompt.filter(Boolean).join(' ')}" and the agent answers "${session.heading}" ${session.rows.map((row) => row.name).join(', ')}.`
    ),
    `Finally, a "${outro.tab}" tab opens with ${outro.agent.name} and "${outro.lead} star${outro.trail}" is typed while the agent switches through ${outro.agents.map((agent) => agent.name).join(', ')}.`,
  ].join(' ');

export const renderFlow = (target: Target) => {
  const timeline = createTimeline(SESSIONS, OUTRO);
  const motion = createMotion(timeline);
  const renderer = TIMELINE_RENDERERS[target];
  const context: FlowContext = {
    target,
    sessions: SESSIONS,
    outro: OUTRO,
    timeline,
    motion,
    loops: createLoops(target, motion),
  };
  const body = join(
    [
      windowChrome(context),
      conversation(context),
      composer(context),
      ...renderer.markers.map((marker) => fragment(marker)),
    ],
    '\n  '
  );
  const styles = stylesheet(
    target,
    renderer.rules(body.animations, timeline.cycle)
  );
  const viewportHeight = VIEWPORT.bottom - VIEWPORT.top;
  const fieldClipWidth = CONTENT_RIGHT - 16 - (FIELD_TEXT_X - 4);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="title description">
  <title id="title">Lagune in an AI chat</title>
  <desc id="description">${escapeXml(describe(context))}</desc>
  <defs>
    <style>
${styles}
    </style>
    <filter id="card-shadow" x="-5%" y="-5%" width="110%" height="114%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" class="card-shadow"/>
    </filter>
    <clipPath id="viewport"><rect x="0" y="${VIEWPORT.top}" width="${WIDTH}" height="${viewportHeight}"/></clipPath>
    <clipPath id="field-clip"><rect x="${FIELD_TEXT_X - 4}" y="${FIELD.y + 4}" width="${fieldClipWidth}" height="36"/></clipPath>
    <linearGradient id="viewport-fade-gradient" x1="0" y1="${VIEWPORT.top}" x2="0" y2="${VIEWPORT.top + VIEWPORT_FADE}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#fff"/>
    </linearGradient>
    <mask id="viewport-fade" maskUnits="userSpaceOnUse" x="0" y="${VIEWPORT.top}" width="${WIDTH}" height="${viewportHeight}">
      <rect x="0" y="${VIEWPORT.top}" width="${WIDTH}" height="${viewportHeight}" fill="url(#viewport-fade-gradient)"/>
    </mask>
    ${shimmerGradient('shimmer', 'shimmer-base')}
    ${shimmerGradient('shimmer-strong', 'shimmer-strong-base')}
    ${symbolDefinitions()}
  </defs>
  ${body.markup}
</svg>
`;
};
