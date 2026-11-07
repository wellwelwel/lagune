import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

const REVEAL_MARGIN = '0px 0px -15% 0px';

export const useVisible = (
  target: RefObject<Element | null>,
  rootMargin: string = REVEAL_MARGIN
): boolean => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = target.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const latest = entries.at(-1);

        if (latest) setVisible(latest.isIntersecting);
      },
      { rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [target, rootMargin]);

  return visible;
};
