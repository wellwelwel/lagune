import { HIGHLIGHTS } from '@site/src/data/home';
import { memo } from 'react';

const HighlightsComponent = () => (
  <section className='flex flex-col min-w-0 xl:aspect-flow xl:justify-center'>
    <div className='grid grid-cols-2 max-[600px]:grid-cols-1'>
      {HIGHLIGHTS.map((item, index) => {
        const isLeft = index % 2 === 0;
        const isTop = index < 2;
        const cell = [
          'min-w-0',
          isLeft
            ? 'pr-7 border-r border-dashed border-[#021664] max-[600px]:pr-0 max-[600px]:border-r-0'
            : 'pl-7 max-[600px]:pl-0',
          isTop
            ? 'pb-7 border-b border-dashed border-[#021664] max-[600px]:border-b-0'
            : 'pt-7',
          'max-[600px]:pt-2 max-[600px]:pb-7 max-[600px]:last:pb-0 max-[600px]:first:pt-0',
        ].join(' ');

        return (
          <div key={item.title} className={cell}>
            <h2 className='flex items-center gap-2.5 m-0 text-[17px] font-semibold tracking-[-0.01em] text-ink'>
              <item.Icon className='size-[22px] shrink-0 text-accent' />
              {item.title}
            </h2>
            <p className='mt-3.5 m-0 text-[13px] leading-[1.55] text-[rgba(233, 237, 247,0.72)]'>
              {item.lead}
            </p>
            <p className='mt-3 m-0 text-[13px] font-medium leading-[1.55] text-muted'>
              {item.body}
            </p>
          </div>
        );
      })}
    </div>
  </section>
);

export const Highlights = memo(HighlightsComponent);
