import type { ReactNode } from 'react';
import { useVisible } from '@site/src/components/useVisible';
import { PHASE_STEPS } from '@site/src/data/home';
import { useEffect, useRef, useState } from 'react';

const STEP_MS = 2000;

const WORDS = [
  '',
  ...PHASE_STEPS.filter(({ phase }) =>
    phase.command.startsWith('/lagune-')
  ).map(({ phase }) => phase.title),
];

const WORD = '[grid-area:1/1] ps-[0.25em]';

export const PhaseTicker = (): ReactNode => {
  const slotRef = useRef<HTMLSpanElement | null>(null);
  const visible = useVisible(slotRef);
  const [current, setCurrent] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);

  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      setLeaving(current);
      setCurrent((current + 1) % WORDS.length);
    }, STEP_MS);

    return () => clearTimeout(timer);
  }, [visible, current]);

  return (
    <span
      ref={slotRef}
      aria-hidden
      className='inline-grid h-lh overflow-hidden align-top'
    >
      {leaving !== null && WORDS[leaving] && (
        <span
          key={`leaving-${leaving}`}
          className={`lagune-word-leave ${WORD}`}
        >
          {WORDS[leaving]}
        </span>
      )}
      {WORDS[current] && (
        <span key={current} className={`lagune-word-rise ${WORD}`}>
          {WORDS[current]}
        </span>
      )}
    </span>
  );
};
