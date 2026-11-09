import { LuArrowRight } from 'react-icons/lu';

const SLIDE =
  'col-start-1 row-start-1 inline-flex transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] [&>svg]:size-full';

export const ArrowSlide = ({ className }: { className: string }) => (
  <span
    className={`inline-grid shrink-0 overflow-hidden ${className}`}
    aria-hidden
  >
    <span className={`${SLIDE} group-hover:translate-x-[120%]`}>
      <LuArrowRight />
    </span>
    <span className={`${SLIDE} -translate-x-[120%] group-hover:translate-x-0`}>
      <LuArrowRight />
    </span>
  </span>
);
