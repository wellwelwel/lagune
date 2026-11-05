import type {
  Animation,
  Fragment,
  MotionStates,
  Press,
  Stop,
  Timeline,
  VisibilityWindow,
} from './types';

const ENTER_DURATION = 0.35;
const INSTANT = 0.01;
const EASE_OUT = 'cubic-bezier(.2,0,0,1)';
const RELEASED = 'transform:scale(1)';

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

  const leaveAt = (name: string, at: number): Animation => ({
    name,
    stops: [
      { at: 0, style: LEAVE_UP.shown },
      { at, style: LEAVE_UP.shown },
      { at: at + 0.4, style: LEAVE_UP.hidden },
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
