import type { RefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

type Box = {
  left: number;
  top: number;
  width: number;
};

type ExpandedViewParts = {
  player: RefObject<HTMLElement | null>;
  frame: RefObject<HTMLElement | null>;
  controls: RefObject<HTMLElement | null>;
  backdrop: RefObject<HTMLElement | null>;
  holder: RefObject<HTMLElement | null>;
};

const DURATION = 420;

const EASING = 'cubic-bezier(0.2, 0, 0, 1)';

const HOLD: KeyframeAnimationOptions = {
  duration: DURATION,
  easing: EASING,
  fill: 'forwards',
};

const SCROLL_KEYS = new Set([
  ' ',
  'PageUp',
  'PageDown',
  'Home',
  'End',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
]);

const FOCUSABLE =
  'button:not([disabled]):not([tabindex="-1"]), input:not([disabled])';

const STILL = { transformOrigin: '0 0', transform: 'none' };

const shift = (from: Box, to: Box) => ({
  transformOrigin: '0 0',
  transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width})`,
});

const blocksScroll = (event: KeyboardEvent): boolean => {
  if (event.defaultPrevented || !SCROLL_KEYS.has(event.key)) return false;
  if (event.target instanceof HTMLInputElement) return false;

  return !(event.key === ' ' && event.target instanceof HTMLButtonElement);
};

const trapFocus = (event: KeyboardEvent, player: HTMLElement) => {
  const items = [...player.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (item) => item.offsetParent !== null
  );
  const first = items.at(0);
  const last = items.at(-1);

  if (!first || !last) return;

  const leaving = event.shiftKey
    ? document.activeElement === first
    : document.activeElement === last;

  if (player.contains(document.activeElement) && !leaving) return;

  event.preventDefault();
  (event.shiftKey ? last : first).focus();
};

export const useExpandedView = ({
  player,
  frame,
  controls,
  backdrop,
  holder,
}: ExpandedViewParts) => {
  const [supported, setSupported] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const movingRef = useRef(false);

  const expand = useCallback(() => {
    const element = player.current;
    const card = frame.current;
    const bar = controls.current;
    const shade = backdrop.current;
    const place = holder.current;

    if (!element || !card || !bar || !shade || !place || movingRef.current)
      return;

    const from = card.getBoundingClientRect();

    place.style.height = `${place.getBoundingClientRect().height}px`;
    element.setAttribute('popover', 'manual');
    element.showPopover();

    const to = card.getBoundingClientRect();

    movingRef.current = true;
    setExpanded(true);
    shade.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: DURATION,
      easing: 'ease-out',
    });
    bar.animate(
      [
        { opacity: 0, transform: 'translateY(8px)' },
        { opacity: 1, transform: 'none' },
      ],
      {
        duration: DURATION * 0.6,
        delay: DURATION * 0.4,
        easing: EASING,
        fill: 'backwards',
      }
    );
    card
      .animate([shift(from, to), STILL], { duration: DURATION, easing: EASING })
      .finished.finally(() => {
        movingRef.current = false;
      });
  }, [player, frame, controls, backdrop, holder]);

  const collapse = useCallback(() => {
    const element = player.current;
    const card = frame.current;
    const bar = controls.current;
    const shade = backdrop.current;
    const place = holder.current;

    if (!element || !card || !bar || !shade || !place || movingRef.current)
      return;

    const from = card.getBoundingClientRect();
    const to = place.getBoundingClientRect();
    const fading = bar.animate([{ opacity: 1 }, { opacity: 0 }], {
      ...HOLD,
      duration: DURATION * 0.4,
    });
    const dimming = shade.animate([{ opacity: 1 }, { opacity: 0 }], HOLD);
    const shrinking = card.animate([STILL, shift(to, from)], HOLD);

    movingRef.current = true;
    setExpanded(false);
    shrinking.finished.then(() => {
      element.hidePopover();
      element.removeAttribute('popover');
      place.style.removeProperty('height');
      fading.cancel();
      dimming.cancel();
      shrinking.cancel();
      bar.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 200,
        easing: 'ease-out',
      });
      movingRef.current = false;
    });
  }, [player, frame, controls, backdrop, holder]);

  useEffect(() => {
    setSupported(typeof HTMLElement.prototype.showPopover === 'function');
  }, []);

  useEffect(() => {
    const element = player.current;

    if (!expanded || !element) return;

    const holdStill = (event: Event) => event.preventDefault();

    const holdTouch = (event: TouchEvent) => {
      if (!(event.target instanceof HTMLInputElement)) event.preventDefault();
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) {
        event.preventDefault();
        collapse();

        return;
      }

      if (event.key === 'Tab') {
        trapFocus(event, element);

        return;
      }

      if (blocksScroll(event)) event.preventDefault();
    };

    element.addEventListener('wheel', holdStill, { passive: false });
    element.addEventListener('touchmove', holdTouch, { passive: false });
    document.addEventListener('keydown', onKey);

    return () => {
      element.removeEventListener('wheel', holdStill);
      element.removeEventListener('touchmove', holdTouch);
      document.removeEventListener('keydown', onKey);
    };
  }, [expanded, player, collapse]);

  const toggle = useCallback(() => {
    if (expanded) collapse();
    else expand();
  }, [expanded, expand, collapse]);

  return { supported, expanded, toggle };
};
