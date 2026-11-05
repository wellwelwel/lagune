import type {
  Animation,
  Fragment,
  MotionStates,
  Stop,
  Timeline,
  VisibilityWindow,
} from './types';

const ENTER_DURATION = 0.35;
const INSTANT = 0.01;
const EASE_OUT = 'cubic-bezier(.2,0,0,1)';

export const SLIDE_UP: MotionStates = {
  hidden: 'opacity:0;transform:translateY(6px)',
  shown: 'opacity:1;transform:translateY(0)',
};

export const SLIDE_IN: MotionStates = {
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

const opacity = (visible: boolean) => `opacity:${visible ? 1 : 0}`;

export const fragment = (
  markup: string,
  animations: Animation[] = []
): Fragment => ({ markup, animations });

export const join = (fragments: Fragment[], separator = '\n'): Fragment => ({
  markup: fragments.map((part) => part.markup).join(separator),
  animations: fragments.flatMap((part) => part.animations),
});

export const createMotion = ({ cycle, fade, reset }: Timeline) => {
  const enter = (name: string, at: number, states = SLIDE_UP): Animation => ({
    name,
    stops: [
      { at: 0, style: states.hidden },
      { at, style: states.hidden },
      { at: at + ENTER_DURATION, style: states.shown },
      { at: reset, style: states.shown },
      { at: reset + INSTANT, style: states.hidden },
      { at: cycle, style: states.hidden },
    ],
  });

  const enterUntilFade = (
    name: string,
    at: number,
    states = SLIDE_IN
  ): Animation => ({
    name,
    stops: [
      { at: 0, style: states.hidden },
      { at, style: states.hidden },
      { at: at + ENTER_DURATION, style: states.shown },
      { at: fade, style: states.shown },
      { at: fade + 0.4, style: states.hidden },
      { at: cycle, style: states.hidden },
    ],
  });

  const visibleBetween = (
    name: string,
    windows: VisibilityWindow[]
  ): Animation => ({
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
  });

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

  const fadeAtEnd = (name: string): Animation => ({
    name,
    stops: [
      { at: 0, style: opacity(true) },
      { at: fade, style: opacity(true) },
      { at: fade + 0.5, style: opacity(false) },
      { at: reset + 0.1, style: opacity(false) },
      { at: reset + 0.25, style: opacity(true) },
      { at: cycle, style: opacity(true) },
    ],
  });

  return {
    cycle,
    fade,
    reset,
    enter,
    enterUntilFade,
    visibleBetween,
    leaveAt,
    fadeAtEnd,
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
