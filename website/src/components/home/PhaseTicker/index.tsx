import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
import { useVisible } from '@site/src/components/useVisible';
import { PHASE_STEPS, STEP_CARD_ICONS } from '@site/src/data/home';
import { useEffect, useRef, useState } from 'react';

type Word = {
  title: string;
  Icon: IconType;
};

const STEP_MS = 2000;

const WORDS: Word[] = PHASE_STEPS.map(({ phase }, index) => ({
  title: phase.command.startsWith('/lagune-') ? phase.title : '',
  Icon: STEP_CARD_ICONS[index],
}));

const WORD = '[grid-area:1/1]';

const WordContent = ({ word }: { word: Word }) => (
  <>
    {word.title && <span className='ps-[0.25em]'>{word.title}</span>}
    <word.Icon className='ms-[0.3em] inline-block size-[0.75em] align-[calc(0.5cap_-_0.375em)] text-accent' />
  </>
);

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
      {leaving !== null && (
        <span
          key={`leaving-${leaving}`}
          className={`lagune-word-leave ${WORD}`}
        >
          <WordContent word={WORDS[leaving]} />
        </span>
      )}
      <span
        key={current}
        className={leaving === null ? WORD : `lagune-word-rise ${WORD}`}
      >
        <WordContent word={WORDS[current]} />
      </span>
    </span>
  );
};
