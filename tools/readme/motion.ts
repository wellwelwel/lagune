import type {
  Animation,
  Change,
  Fragment,
  MotionStates,
  Press,
  Segment,
  Span,
  Stop,
  Target,
  Timeline,
  TimelineRenderer,
  VisibilityWindow,
} from './types';

const ENTER_DURATION = 0.35;
export const INSTANT = 0.01;
export const LEAVE_DURATION = 0.4;
export const STEP = 'steps(1,end)';
const EASE_OUT = 'cubic-bezier(.2,0,0,1)';
const RELEASED = 'transform:scale(1)';
const BURST_GAP = 0.1;
const CYCLE_CLOCK = 'cycle-clock';

const SLIDE_UP: MotionStates = {
  hidden: 'opacity:0;transform:translateY(6px)',
  shown: 'opacity:1;transform:translateY(0)',
};

const SLIDE_IN: MotionStates = {
  hidden: 'opacity:0;transform:translateX(-10px)',
  shown: 'opacity:1;transform:translateX(0)',
};

export const POP: MotionStates = {
  hidden: 'opacity:0;transform:scale(.25)',
  shown: 'opacity:1;transform:scale(1)',
};

const LEAVE_UP: MotionStates = {
  hidden: 'opacity:0;transform:translateY(-8px)',
  shown: 'opacity:1;transform:translateY(0)',
};

const ROLL = {
  below: 'opacity:0;transform:translateY(7px)',
  shown: 'opacity:1;transform:translateY(0)',
  above: 'opacity:0;transform:translateY(-7px)',
};

export const fragment = (
  markup: string,
  animations: Animation[] = []
): Fragment => ({ markup, animations });

export const join = (fragments: Fragment[], separator: string): Fragment => ({
  markup: fragments.map((part) => part.markup).join(separator),
  animations: fragments.flatMap((part) => part.animations),
});

export const spanOf = ({
  from,
  to,
  fadeOut = INSTANT,
}: VisibilityWindow): Span => ({ from, to: to + fadeOut });

export const createMotion = ({ cycle, fade, reset }: Timeline) => {
  const enterUntil = (
    name: string,
    at: number,
    states: MotionStates,
    exit: number,
    exitDuration: number
  ): Animation => ({
    name,
    stops: [
      { at: 0, style: states.hidden },
      { at, style: states.hidden },
      { at: at + ENTER_DURATION, style: states.shown },
      { at: exit, style: states.shown },
      { at: exit + exitDuration, style: states.hidden },
      { at: cycle, style: states.hidden },
    ],
  });

  const enter = (name: string, at: number, states = SLIDE_UP): Animation =>
    enterUntil(name, at, states, reset, INSTANT);

  const enterUntilFade = (name: string, at: number): Animation =>
    enterUntil(name, at, SLIDE_IN, fade, 0.4);

  const opacityBetween = (
    name: string,
    windows: VisibilityWindow[],
    outside: number
  ): Animation => {
    const opacity = (inside: boolean) => `opacity:${inside ? 1 : outside}`;

    return {
      name,
      stops: [
        { at: 0, style: opacity(windows[0]?.from === 0) },
        ...windows.flatMap(
          ({ from, to, fadeIn = INSTANT, fadeOut = INSTANT }): Stop[] => [
            ...(from > 0
              ? [
                  { at: from, style: opacity(false) },
                  { at: from + fadeIn, style: opacity(true) },
                ]
              : []),
            ...(to < cycle
              ? [
                  { at: to, style: opacity(true) },
                  { at: to + fadeOut, style: opacity(false) },
                ]
              : []),
          ]
        ),
        { at: cycle, style: opacity((windows.at(-1)?.to ?? 0) >= cycle) },
      ],
    };
  };

  const visibleBetween = (
    name: string,
    windows: VisibilityWindow[]
  ): Animation => opacityBetween(name, windows, 0);

  const switchBetween = (
    name: string,
    spans: Span[],
    inside: string,
    outside: string
  ): Animation => {
    const style = (open: boolean) => (open ? inside : outside);

    return {
      name,
      stops: [
        { at: 0, style: style(spans[0]?.from === 0) },
        ...spans.flatMap(({ from, to }): Stop[] => [
          ...(from > 0
            ? [
                { at: from - INSTANT, style: outside, easing: STEP },
                { at: from, style: inside },
              ]
            : []),
          ...(to < cycle
            ? [
                { at: to, style: inside, easing: STEP },
                { at: to + INSTANT, style: outside },
              ]
            : []),
        ]),
        { at: cycle, style: style((spans.at(-1)?.to ?? 0) >= cycle) },
      ],
    };
  };

  const leaveAt = (name: string, at: number): Animation => ({
    name,
    stops: [
      { at: 0, style: LEAVE_UP.shown },
      { at, style: LEAVE_UP.shown },
      { at: at + LEAVE_DURATION, style: LEAVE_UP.hidden },
      { at: reset + 0.1, style: LEAVE_UP.hidden },
      { at: reset + 0.11, style: LEAVE_UP.shown },
      { at: cycle, style: LEAVE_UP.shown },
    ],
  });

  const rollBetween = (
    name: string,
    from: number,
    to: number,
    duration: number
  ): Animation => ({
    name,
    stops: [
      { at: 0, style: from === 0 ? ROLL.shown : ROLL.below },
      ...(from > 0
        ? [
            { at: from, style: ROLL.below },
            { at: from + duration, style: ROLL.shown },
          ]
        : []),
      ...(to < cycle
        ? [
            { at: to, style: ROLL.shown },
            { at: to + duration, style: ROLL.above },
            { at: to + duration + INSTANT, style: ROLL.below },
          ]
        : []),
      { at: cycle, style: to >= cycle ? ROLL.shown : ROLL.below },
    ],
  });

  const pressAt = (
    name: string,
    moments: number[],
    { scale, start, peak, end }: Press
  ): Animation => ({
    name,
    stops: [
      { at: 0, style: RELEASED },
      ...moments.flatMap((moment) => [
        { at: moment + start, style: RELEASED },
        { at: moment + peak, style: `transform:scale(${scale})` },
        { at: moment + end, style: RELEASED },
      ]),
      { at: cycle, style: RELEASED },
    ],
  });

  return {
    cycle,
    fade,
    reset,
    enter,
    rollBetween,
    enterUntilFade,
    opacityBetween,
    visibleBetween,
    switchBetween,
    leaveAt,
    pressAt,
  };
};

export const animationRules = (
  animations: Animation[],
  cycle: number
): string[] => {
  const percent = (seconds: number) =>
    `${Number(((seconds / cycle) * 100).toFixed(3))}%`;
  const frame = ({ at, style, easing }: Stop) =>
    `${percent(at)}{${style}${easing ? `;animation-timing-function:${easing}` : ''}}`;

  return animations.flatMap(({ name, stops }) => [
    `@keyframes ${name}{${stops.map(frame).join('')}}`,
    `.${name}{animation:${name} ${cycle}s ${EASE_OUT} infinite}`,
  ]);
};

const timeOf = (seconds: number) => `${Number(seconds.toFixed(4))}s`;

const changesOf = (stops: Stop[]): Change[] =>
  stops.slice(1).flatMap((stop, index) => {
    const previous = stops[index];

    if (stop.style === previous.style) return [];

    const jumps = previous.easing === STEP || stop.at === previous.at;

    return [
      {
        from: jumps ? stop.at : previous.at,
        to: stop.at,
        first: jumps ? index + 1 : index,
        last: index + 1,
      },
    ];
  });

const burstsOf = (changes: Change[]): Change[] =>
  changes.reduce<Change[]>((bursts, change) => {
    const current = bursts.at(-1);

    if (!current || change.from - current.to > BURST_GAP)
      return [...bursts, change];

    return [
      ...bursts.slice(0, -1),
      { ...current, to: change.to, last: change.last },
    ];
  }, []);

const stillFrames = (style: string) => `0%{${style}}100%{${style}}`;

const burstFrames = (stops: Stop[], { from, to, first, last }: Change) => {
  if (to === from) return stillFrames(stops[last].style);

  return stops
    .slice(first, last + 1)
    .map(({ at, style, easing }, index) => {
      const offset = Number((((at - from) / (to - from)) * 100).toFixed(3));
      const timing =
        easing && first + index < last
          ? `;animation-timing-function:${easing}`
          : '';

      return `${offset}%{${style}${timing}}`;
    })
    .join('');
};

const segmentsOf = (stops: Stop[]): Segment[] => {
  const bursts = burstsOf(changesOf(stops));
  const opening = bursts[0];
  const opensSettled =
    opening !== undefined && stops[opening.first].style === stops[0].style;
  const hold = opensSettled
    ? []
    : [{ from: 0, to: 0, keyframes: stillFrames(stops[0].style) }];

  return [
    ...hold,
    ...bursts.map((burst) => ({
      from: burst.from,
      to: burst.to,
      keyframes: burstFrames(stops, burst),
    })),
  ].map((segment, index) => ({
    ...segment,
    fill: index === 0 ? 'both' : 'forwards',
  }));
};

const keyframesNameOf = (names: Map<string, string>, keyframes: string) => {
  const name = names.get(keyframes);

  if (name === undefined)
    throw new Error(`[readme] no keyframes name was assigned to ${keyframes}`);

  return name;
};

const burstRules = (animations: Animation[], cycle: number): string[] => {
  const segments = animations.map(({ stops }) => segmentsOf(stops));
  const keyframes = [
    ...new Set(segments.flat().map((segment) => segment.keyframes)),
  ];
  const names = new Map(
    keyframes.map((frames, index) => [frames, `burst-${index + 1}`])
  );
  const entry = ({ from, to, keyframes: frames, fill }: Segment) =>
    `${keyframesNameOf(names, frames)} ${timeOf(to - from)} ${to > from ? EASE_OUT : 'linear'} ${timeOf(from)} 1 ${fill}`;

  return [
    ...keyframes.map(
      (frames) => `@keyframes ${keyframesNameOf(names, frames)}{${frames}}`
    ),
    ...animations.map(
      ({ name }, index) =>
        `.${name}{animation:${segments[index].map(entry).join(',')}}`
    ),
    `@keyframes ${CYCLE_CLOCK}{to{opacity:1}}`,
    `.${CYCLE_CLOCK}{animation:${CYCLE_CLOCK} 0s linear ${timeOf(cycle)} 1 forwards}`,
  ];
};

export const TIMELINE_RENDERERS: Record<Target, TimelineRenderer> = {
  readme: { rules: animationRules, markers: [] },
  website: { rules: burstRules, markers: [`<g class="${CYCLE_CLOCK}"/>`] },
};
