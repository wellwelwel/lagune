import type { Reel } from './reel';
import { useVisible } from '@site/src/components/useVisible';
import { PHASE_STEPS, STEP_CARD_ICONS } from '@site/src/data/home';
import { useEffect, useRef } from 'react';
import { createReel } from './reel';

export { SLIDE } from './motion';

type PhaseCarouselProps = {
  current: number;
  onStep: (index: number) => void;
};

const CARD =
  'pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-[45.5cqw] w-[26cqw] cursor-pointer opacity-0 [--card-inset:clamp(8px,2cqw,12px)] [--card-radius:clamp(18px,4.2cqw,26px)] @max-[480px]:h-[54.25cqw] @max-[480px]:w-[31cqw] after:absolute after:inset-x-0 after:top-full after:h-[8%]';

const SCRIM =
  'linear-gradient(to bottom, rgba(4, 8, 22, 0.6), rgba(4, 8, 22, 0) 30%, rgba(4, 8, 22, 0) 55%, rgba(4, 8, 22, 0.85))';

/* Background tiles snap to whole device pixels. */
const LAYER_SIZES = 'calc(100% + 2px) calc(100% + 2px), cover';

const EYEBROW =
  'absolute inset-x-0 top-[calc(var(--card-inset)+4px)] ps-[0.12em] text-center font-mono text-[10px] tracking-[0.12em] uppercase text-[rgba(233,237,247,0.78)] [text-shadow:0_1px_4px_rgba(0,0,0,0.7)] transition-opacity duration-300 ease-out';

export const PhaseCarousel = ({ current, onStep }: PhaseCarouselProps) => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const reelRef = useRef<Reel | null>(null);
  const visible = useVisible(stageRef);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) return;

    const reel = createReel(stage);

    reelRef.current = reel;

    return () => {
      reel.release();
      reelRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (visible) reelRef.current?.enter(current);

    reelRef.current?.turn(current);
  }, [visible, current]);

  return (
    <div aria-hidden className='@container isolate -mx-4 overflow-x-clip px-4'>
      <div
        ref={stageRef}
        onPointerLeave={() => reelRef.current?.rest()}
        className='relative h-[46.5cqw] @max-[480px]:h-[55.25cqw]'
      >
        {PHASE_STEPS.map((phase, index) => {
          const Icon = STEP_CARD_ICONS[index];

          return (
            <div
              key={phase.title}
              onClick={() => onStep(index)}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse')
                  reelRef.current?.hover(index);
              }}
              className={CARD}
            >
              <div
                style={{
                  backgroundImage: `${SCRIM}, url("${phase.image}")`,
                  backgroundSize: LAYER_SIZES,
                }}
                className='relative size-full rounded-(--card-radius) bg-[#0a1a4a] bg-center bg-no-repeat [box-shadow:0_15px_35px_rgba(0,0,0,0.5)]'
              >
                <span
                  className={
                    index === current
                      ? EYEBROW
                      : `${EYEBROW} @max-[480px]:opacity-0`
                  }
                >
                  {phase.eyebrow}
                </span>
                <span className='absolute bottom-(--card-inset) left-1/2 flex -translate-x-1/2 size-[clamp(30px,7cqw,44px)] items-center justify-center rounded-[calc(var(--card-radius)-var(--card-inset))] border border-accent/40 bg-accent text-ink [box-shadow:0_12px_24px_-6px_rgba(0,0,0,0.7),0_4px_8px_-2px_rgba(0,0,0,0.5)] [&>svg]:size-[55%]'>
                  <Icon />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
