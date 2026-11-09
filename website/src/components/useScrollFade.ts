import type { RefObject } from 'react';
import { useEffect } from 'react';

const EDGE_TOLERANCE = 1;

/* In a right-to-left page, scrollLeft runs from zero down to negative values. */
const markHiddenEdges = (element: HTMLElement) => {
  const travelled = Math.abs(element.scrollLeft);
  const room = element.scrollWidth - element.clientWidth;

  element.toggleAttribute('data-hidden-start', travelled > EDGE_TOLERANCE);
  element.toggleAttribute('data-hidden-end', room - travelled > EDGE_TOLERANCE);
};

export const useScrollFade = (target: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const element = target.current;

    if (!element) return;

    const mark = () => markHiddenEdges(element);
    const resizes = new ResizeObserver(mark);
    const mutations = new MutationObserver(mark);

    mark();
    resizes.observe(element);

    for (const child of element.children) resizes.observe(child);

    mutations.observe(element, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    element.addEventListener('scroll', mark, { passive: true });

    return () => {
      resizes.disconnect();
      mutations.disconnect();
      element.removeEventListener('scroll', mark);
    };
  }, [target]);
};
