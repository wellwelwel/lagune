import type { EndlessLoops, Loops, Motion, Span, Stop, Target } from './types';
import { fragment, STEP } from './motion';

const SPIN_PERIOD = 0.9;
const PULSE_PERIOD = 1.2;
const PULSE_PEAK = 0.4;
const PULSE_STAGGER = 0.2;
const PULSE_FLOOR = 0.15;
const PULSE_EASING = 'ease-in-out';
const BLINK_PERIOD = 1.06;
const UNPAINTED = 'fill:var(--muted)';

const cssNumber = (value: number) =>
  value < 1 ? String(value).slice(1) : String(value);

export const ENDLESS_LOOPS: EndlessLoops = {
  spinner: ` animation: spin ${cssNumber(SPIN_PERIOD)}s linear infinite;`,
  ellipsis: `.ellipsis { animation: ellipsis ${cssNumber(PULSE_PERIOD)}s ${PULSE_EASING} infinite; }`,
  blink: `.blink { animation: blink ${cssNumber(BLINK_PERIOD)}s steps(1) infinite; }`,
  keyframes: [
    '@keyframes spin { to { transform: rotate(360deg); } }',
    '@keyframes blink { 50% { opacity: 0; } }',
    `@keyframes ellipsis { 0%, 100% { fill-opacity: ${cssNumber(PULSE_FLOOR)}; } ${PULSE_PEAK * 100}% { fill-opacity: 1; } }`,
  ],
};

const pulseDelay = (index: number) => index * PULSE_STAGGER - PULSE_PERIOD;

const rotation = (seconds: number) =>
  `transform:rotate(${Number(((360 * seconds) / SPIN_PERIOD).toFixed(2))}deg)`;

const spinStops = ({ from, to }: Span, cycle: number): Stop[] => [
  { at: 0, style: rotation(from) },
  { at: from, style: rotation(from), easing: 'linear' },
  { at: to, style: rotation(to) },
  { at: cycle, style: rotation(to) },
];

const fillOpacity = (value: number) => `fill-opacity:${value}`;

const pulseStops = (
  { from, to }: Span,
  delay: number,
  cycle: number
): Stop[] => {
  const first =
    delay + PULSE_PERIOD * Math.floor((from - delay) / PULSE_PERIOD);
  const count = Math.ceil((to - first) / PULSE_PERIOD);
  const rest = fillOpacity(PULSE_FLOOR);
  const pulses = Array.from(
    { length: count },
    (_, index) => first + index * PULSE_PERIOD
  ).flatMap((start): Stop[] => [
    { at: start, style: rest, easing: PULSE_EASING },
    {
      at: start + PULSE_PEAK * PULSE_PERIOD,
      style: fillOpacity(1),
      easing: PULSE_EASING,
    },
  ]);

  return [
    { at: 0, style: rest },
    ...pulses,
    { at: first + count * PULSE_PERIOD, style: rest },
    { at: cycle, style: rest },
  ];
};

const caretStops = (spans: Span[], cycle: number): Stop[] => {
  const half = BLINK_PERIOD / 2;
  const toggles = spans
    .flatMap(({ from, to }) => {
      const first = Math.floor(from / half);
      const count = Math.ceil(Math.min(to, cycle) / half) - first + 1;

      return Array.from({ length: count }, (_, index) => first + index);
    })
    .map((step) => ({
      at: step * half,
      style: `opacity:${step % 2 === 0 ? 1 : 0}`,
      easing: STEP,
    }))
    .filter(({ at }) => at <= cycle);
  const opening = toggles[0]?.style ?? 'opacity:1';

  return [
    { at: 0, style: opening, easing: STEP },
    ...toggles,
    { at: cycle, style: toggles.at(-1)?.style ?? opening },
  ];
};

const endlessLoops: Loops = {
  spinner: () => fragment('class="spinner"'),
  ellipsis: (_, __, index) =>
    fragment(
      `class="ellipsis" style="animation-delay:${pulseDelay(index).toFixed(2)}s"`
    ),
  caret: () => fragment('class="caret blink"'),
  shimmer: (_, __, textClass, gradient) =>
    fragment(`class="${textClass} ${gradient}"`),
};

const windowedLoops = (motion: Motion): Loops => ({
  spinner: (name, span) =>
    fragment(`class="spinner ${name}"`, [
      { name, stops: spinStops(span, motion.cycle) },
    ]),
  ellipsis: (name, span, index) =>
    fragment(`class="${name}"`, [
      { name, stops: pulseStops(span, pulseDelay(index), motion.cycle) },
    ]),
  caret: (name, spans) =>
    fragment(`class="caret ${name}"`, [
      { name, stops: caretStops(spans, motion.cycle) },
    ]),
  shimmer: (name, span, textClass, gradient) =>
    fragment(`class="${textClass} ${gradient} ${name}"`, [
      motion.switchBetween(name, [span], `fill:url(#${gradient})`, UNPAINTED),
    ]),
});

const LOOPS: Record<Target, (motion: Motion) => Loops> = {
  readme: () => endlessLoops,
  website: windowedLoops,
};

export const createLoops = (target: Target, motion: Motion) =>
  LOOPS[target](motion);
