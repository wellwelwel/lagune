import type { ReactNode } from 'react';
import { PhaseTicker } from '@site/src/components/home/PhaseTicker';
import { HERO } from '@site/src/data/home';
import { TbShieldLockFilled } from 'react-icons/tb';

export const Hero = (): ReactNode => (
  <header className='flex flex-col items-start gap-3.5'>
    <span className='inline-flex items-center px-3.5 py-[7px] rounded-md bg-accent font-mono text-[13px]! tracking-[0.075em] uppercase text-ink max-[600px]:text-[12px]!'>
      <TbShieldLockFilled className='mr-2 size-4 shrink-0 text-white max-[600px]:size-3.5' />
      {HERO.chip}
    </span>
    <p className='font-display font-bold text-[clamp(32px,4.4vw,34px)] leading-[1.5] tracking-[-0.02em] whitespace-nowrap m-0 max-[600px]:text-[24px]'>
      <span className='text-accent mr-2 [-webkit-text-stroke:0.015em_var(--color-accent)]'>
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
