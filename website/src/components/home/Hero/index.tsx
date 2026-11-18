import type { ReactNode } from 'react';
import { PhaseTicker } from '@site/src/components/home/PhaseTicker';
import { HERO } from '@site/src/data/home';

export const Hero = (): ReactNode => (
  <header className='flex flex-col items-start gap-3.5'>
    <p
      dir='ltr'
      className='font-serif font-normal text-[clamp(32px,4.4vw,34px)] leading-[1.5] tracking-[-0.015em] whitespace-nowrap m-0 max-[600px]:text-[24px]'
    >
      <span className='text-accent me-2 [-webkit-text-stroke:0.015em_var(--color-accent)]'>
        /
      </span>
      Lagune
      <PhaseTicker />
    </p>
    <p className='text-[clamp(14px,1.35vw,16px)] font-normal leading-[1.55] tracking-[-0.01em] text-[rgba(233, 237, 247,0.92)]'>
      {HERO.kicker}
    </p>
  </header>
);
