import type { Pose, Timing } from './motion';
import {
  enteringPose,
  GENTLE_MOTION,
  hoveredPose,
  isShown,
  layerOf,
  offsetOf,
  offstagePose,
  REACH,
  restingPose,
  springyMotion,
} from './motion';

export type Reel = {
  enter: (phase: number) => void;
  turn: (phase: number) => void;
  hover: (card: number) => void;
  rest: () => void;
  release: () => void;
};

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const REST_DELAY = 50;

const settle = (card: HTMLElement) => {
  for (const animation of card.getAnimations()) {
    animation.commitStyles();
    animation.cancel();
  }
};

const stack = (card: HTMLElement, layer: number) => {
  card.style.zIndex = `${layer}`;
  card.style.pointerEvents = layer > 0 ? 'auto' : 'none';
};

export const createReel = (stage: HTMLElement): Reel => {
  const cards = [...stage.children].filter(
    (child) => child instanceof HTMLElement
  );
  const reading = getComputedStyle(stage).direction === 'rtl' ? -1 : 1;
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
  const springy = springyMotion();
  const count = cards.length;

  let shown: number | null = null;
  let hovered: number | null = null;
  let moving = false;
  let movement = 0;
  let restTimer: number | undefined;

  const motion = () => (reducedMotion.matches ? GENTLE_MOTION : springy);

  const frameOf = ({ x, y, scale }: Pose): Keyframe => ({
    translate: `${x * reading}cqw ${y}%`,
    scale: `${scale}`,
  });

  const glide = (
    card: HTMLElement,
    poses: Pose[],
    timing: Timing,
    fade: Timing,
    delay = 0
  ) => {
    settle(card);
    card.animate(
      poses.map(({ opacity }) => ({ opacity })),
      { ...fade, delay, fill: 'both' }
    );

    return card.animate(poses.map(frameOf), {
      ...timing,
      delay,
      fill: 'both',
    });
  };

  const track = (journeys: Promise<unknown>[]) => {
    movement += 1;

    const id = movement;

    moving = true;
    Promise.allSettled(journeys).then(() => {
      if (id === movement) moving = false;
    });
  };

  const move = (card: HTMLElement, offset: number) => {
    const { slide } = motion();

    stack(card, layerOf(offset));

    return glide(card, [restingPose(offset)], slide, slide).finished;
  };

  const arrive = (card: HTMLElement, offset: number, side: number) => {
    const { arrival } = motion();
    const poses = [offstagePose(side, arrival), restingPose(offset)];

    stack(card, layerOf(offset));

    return glide(card, poses, arrival.timing, arrival.timing).finished;
  };

  const depart = (card: HTMLElement, side: number) => {
    const { departure } = motion();
    const poses = [offstagePose(side, departure)];

    stack(card, 0);

    return glide(card, poses, departure.timing, departure.timing).finished;
  };

  const journeyOf = (
    card: HTMLElement,
    before: number,
    after: number,
    delta: number
  ): Promise<unknown> => {
    const side = Math.sign(delta);

    if (!isShown(after)) return depart(card, -side);
    if (!isShown(before)) return arrive(card, after, side);
    if (before - delta === after) return move(card, after);

    return depart(card, -side).then(() => arrive(card, after, side));
  };

  const arrange = (phase: number, focus: number | null) => {
    const { hover } = motion();

    for (const [index, card] of cards.entries()) {
      const offset = offsetOf(index, phase, count);

      if (!isShown(offset)) continue;

      const pose =
        focus === null
          ? restingPose(offset)
          : hoveredPose(offset, focus, hover);
      const delay = Math.abs(offset - (focus ?? 0)) * hover.stagger;

      glide(card, [pose], hover.spring, hover.spring, delay);
    }
  };

  const enter = (phase: number) => {
    if (shown !== null) return;

    const { entrance } = motion();
    const journeys: Promise<unknown>[] = [];

    shown = phase;

    for (const [index, card] of cards.entries()) {
      const offset = offsetOf(index, phase, count);

      stack(card, layerOf(offset));

      if (!isShown(offset)) continue;

      const delay = entrance.lead + (offset + REACH) * entrance.stagger;
      const poses = [enteringPose(offset, entrance), restingPose(offset)];

      journeys.push(
        glide(card, poses, entrance.spring, entrance.fade, delay).finished
      );
    }

    track(journeys);
  };

  const turn = (phase: number) => {
    if (shown === null || phase === shown) return;

    const from = shown;
    const delta = -offsetOf(from, phase, count);
    const journeys: Promise<unknown>[] = [];

    shown = phase;
    hovered = null;
    window.clearTimeout(restTimer);

    for (const [index, card] of cards.entries()) {
      const before = offsetOf(index, from, count);
      const after = offsetOf(index, phase, count);

      if (isShown(before) || isShown(after))
        journeys.push(journeyOf(card, before, after, delta));
    }

    track(journeys);
  };

  const hover = (card: number) => {
    if (shown === null || moving) return;

    const offset = offsetOf(card, shown, count);

    window.clearTimeout(restTimer);

    if (offset === hovered) return;

    hovered = offset;
    arrange(shown, offset);
  };

  const rest = () => {
    if (shown === null || moving || hovered === null) return;

    const phase = shown;

    window.clearTimeout(restTimer);
    restTimer = window.setTimeout(() => {
      hovered = null;
      arrange(phase, null);
    }, REST_DELAY);
  };

  const release = () => {
    movement += 1;
    window.clearTimeout(restTimer);

    for (const card of cards)
      for (const animation of card.getAnimations()) animation.cancel();
  };

  return { enter, turn, hover, rest, release };
};
