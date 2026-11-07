import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import { MaskIcon } from '@site/src/components/MaskIcon';
import {
  INSTALL_INDEX,
  MAIN_AGENTS,
  OTHER_AGENTS_COUNT,
} from '@site/src/data/agents';
import { memo } from 'react';
import { LuArrowRight } from 'react-icons/lu';

const ARROW_SLIDE =
  'col-start-1 row-start-1 inline-flex transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] [&>svg]:size-4.5';

const CallToActionComponent = () => (
  <Link
    to={INSTALL_INDEX}
    className='lagune-cta group relative inline-flex self-start items-stretch rounded-[13px] overflow-hidden font-sans text-white no-underline cursor-pointer transition-[box-shadow] duration-300 ease-out [background:linear-gradient(180deg,#1f7bff_0%,var(--color-accent)_100%)] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.35),0_2px_6px_-2px_rgba(0,0,0,0.35)] hover:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.45),0_6px_14px_-4px_rgba(0,0,0,0.4)] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 max-[600px]:self-stretch'
  >
    <span className='sr-only'>
      {translate({
        id: 'home.cta.install',
        message: 'Install',
        description: 'The main home button, leading to the install page',
      })}
    </span>
    <span
      className='flex items-center gap-3 px-5 py-[13px] max-[600px]:flex-1 max-[380px]:gap-2 max-[380px]:px-3.5'
      aria-hidden
    >
      <span className='flex items-center gap-3 max-[380px]:gap-2'>
        {MAIN_AGENTS.map((agent) => (
          <MaskIcon
            key={agent.name}
            src={agent.icon}
            className='size-4.5 shrink-0 bg-current max-[380px]:size-4'
          />
        ))}
      </span>
      <span className='h-3 w-px shrink-0 rounded-full bg-white/20' />
      <span className='font-display text-[15px] font-extrabold leading-none tracking-[-0.01em] [text-shadow:0_1px_1px_rgba(0,0,0,.5)]'>
        +{OTHER_AGENTS_COUNT}
      </span>
    </span>
    <span className='w-px bg-white/25' aria-hidden />
    <span className='flex items-center px-4 max-[380px]:px-3' aria-hidden>
      <span className='grid size-4.5 overflow-hidden'>
        <span className={`${ARROW_SLIDE} group-hover:translate-x-[120%]`}>
          <LuArrowRight />
        </span>
        <span
          className={`${ARROW_SLIDE} -translate-x-[120%] group-hover:translate-x-0`}
        >
          <LuArrowRight />
        </span>
      </span>
    </span>
  </Link>
);

export const CallToAction = memo(CallToActionComponent);
