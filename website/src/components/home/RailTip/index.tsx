import type { ReactNode } from 'react';

export const RailTip = ({
  tip,
  children,
}: {
  tip: string;
  children: ReactNode;
}) => (
  <span className='group/rail relative inline-flex max-[600px]:contents'>
    {children}
    <span
      role='tooltip'
      className='pointer-events-none absolute bottom-full left-1/2 z-30 mb-5 origin-bottom whitespace-nowrap rounded-lg border border-white/10 bg-[#0d1430] px-3 py-2 text-[12px] font-semibold leading-none tracking-[-0.01em] text-ink opacity-0 [transform:translateX(-50%)_translateY(6px)_scale(0.96)] [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.07),0_12px_28px_-12px_rgba(0,0,0,0.8)] transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] group-hover/rail:opacity-100 group-hover/rail:[transform:translateX(-50%)_translateY(0)_scale(1)] group-has-[:focus-visible]/rail:opacity-100 group-has-[:focus-visible]/rail:[transform:translateX(-50%)_translateY(0)_scale(1)] max-[600px]:hidden'
    >
      <span
        className='absolute top-full left-1/2 -translate-x-1/2 rtl:translate-x-1/2 border-[5px] border-transparent border-t-[#0d1430]'
        aria-hidden
      />
      {tip}
    </span>
  </span>
);
