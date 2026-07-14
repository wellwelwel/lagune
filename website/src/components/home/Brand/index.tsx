import type { ReactNode } from 'react';

type BrandProps = {
  onClick: () => void;
  className?: string;
};

export const Brand = ({ onClick, className = '' }: BrandProps): ReactNode => (
  <button
    type='button'
    aria-label='Lagune.ai, back to top'
    className={`flex m-0 items-center gap-2 border-0 bg-transparent p-0 font-display text-[clamp(18px,1.8vw,23px)] font-extrabold tracking-[-0.02em] leading-none cursor-pointer rounded-md focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4 ${className}`}
    onClick={onClick}
  >
    <span>
      Lagune
      <span className='px-0.5 text-[#2092ff] font-sans text-[clamp(14px,1.8vw,19px)]'>
        .ai
      </span>
    </span>
  </button>
);
