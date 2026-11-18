export type Pose = {
  x: number;
  y: number;
  scale: number;
  opacity: number;
};

export type Timing = {
  duration: number;
  easing: string;
};

type Offstage = {
  distance: number;
  scale: number;
  timing: Timing;
};

export type Motion = {
  entrance: {
    spread: number;
    rise: number;
    shrink: number;
    spring: Timing;
    fade: Timing;
    lead: number;
    stagger: number;
  };
  hover: {
    lift: number;
    grow: number;
    push: number;
    spring: Timing;
    stagger: number;
  };
  slide: Timing;
  arrival: Offstage;
  departure: Offstage;
};

export const REACH = 2;

const SLOTS = [
  { x: 0, scale: 1 },
  { x: 21.5, scale: 0.88 },
  { x: 38, scale: 0.76 },
];

const CURVE_SAMPLES = 48;

const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
const POWER2_OUT = 'cubic-bezier(0.33, 1, 0.68, 1)';
const POWER2_IN = 'cubic-bezier(0.32, 0, 0.67, 0)';
const SINE_IN_OUT = 'cubic-bezier(0.37, 0, 0.63, 1)';
const BACK_OUT = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

export const SLIDE: Timing = { duration: 500, easing: POWER2_OUT };

export const GENTLE_MOTION: Motion = {
  entrance: {
    spread: 1,
    rise: 6,
    shrink: 0.94,
    spring: { duration: 900, easing: EASE_OUT },
    fade: { duration: 900, easing: EASE_OUT },
    lead: 200,
    stagger: 60,
  },
  hover: {
    lift: 3,
    grow: 1.03,
    push: 2.5,
    spring: { duration: 600, easing: EASE_OUT },
    stagger: 20,
  },
  slide: { duration: 700, easing: SINE_IN_OUT },
  arrival: {
    distance: 45,
    scale: 0.8,
    timing: { duration: 700, easing: EASE_OUT },
  },
  departure: {
    distance: 45,
    scale: 0.8,
    timing: { duration: 500, easing: SINE_IN_OUT },
  },
};

/* GSAP 3's elastic.out curve. */
const elasticOut = (amplitude: number, period: number) => {
  const peak = Math.max(amplitude, 1);
  const cycle = period / Math.min(amplitude, 1);
  const shift = (cycle / (2 * Math.PI)) * Math.asin(1 / peak);

  return (progress: number) =>
    progress === 1
      ? 1
      : peak *
          2 ** (-10 * progress) *
          Math.sin(((progress - shift) * 2 * Math.PI) / cycle) +
        1;
};

const springEasing = (curve: (progress: number) => number) => {
  if (!CSS.supports('animation-timing-function', 'linear(0, 1)'))
    return BACK_OUT;

  const points = Array.from({ length: CURVE_SAMPLES + 1 }, (_, index) =>
    curve(index / CURVE_SAMPLES).toFixed(4)
  );

  return `linear(${points.join(', ')})`;
};

export const springyMotion = (): Motion => ({
  entrance: {
    spread: 0,
    rise: 35,
    shrink: 0.5,
    spring: { duration: 1200, easing: springEasing(elasticOut(1.05, 0.78)) },
    fade: { duration: 400, easing: EASE_OUT },
    lead: 200,
    stagger: 60,
  },
  hover: {
    lift: 7,
    grow: 1.08,
    push: 4.5,
    spring: { duration: 500, easing: springEasing(elasticOut(1, 0.75)) },
    stagger: 20,
  },
  slide: SLIDE,
  arrival: {
    distance: 55,
    scale: 0.6,
    timing: { duration: 600, easing: POWER2_OUT },
  },
  departure: {
    distance: 55,
    scale: 0.6,
    timing: { duration: 400, easing: POWER2_IN },
  },
});

export const offsetOf = (card: number, phase: number, count: number) => {
  const half = Math.floor(count / 2);

  return ((card - phase + count + half) % count) - half;
};

export const isShown = (offset: number) => Math.abs(offset) <= REACH;

export const layerOf = (offset: number) =>
  Math.max(0, REACH + 1 - Math.abs(offset));

export const restingPose = (offset: number): Pose => {
  const { x, scale } = SLOTS[Math.abs(offset)];

  return { x: Math.sign(offset) * x, y: 0, scale, opacity: 1 };
};

export const enteringPose = (
  offset: number,
  { spread, rise, shrink }: Motion['entrance']
): Pose => {
  const { x, scale } = restingPose(offset);

  return { x: x * spread, y: rise, scale: scale * shrink, opacity: 0 };
};

export const hoveredPose = (
  offset: number,
  hovered: number,
  { lift, grow, push }: Motion['hover']
): Pose => {
  const pose = restingPose(offset);

  if (offset === hovered)
    return { ...pose, y: pose.y - lift, scale: pose.scale * grow };

  const distance = Math.abs(offset - hovered);
  const reach = 1 - Math.abs(offset) / REACH;
  const nearness = 1 + 0.2 * Math.max(0, 3 - distance);

  return {
    ...pose,
    x: pose.x + Math.sign(offset - hovered) * push * reach * nearness,
  };
};

export const offstagePose = (
  side: number,
  { distance, scale }: Offstage
): Pose => ({ x: side * distance, y: 0, scale, opacity: 0 });
