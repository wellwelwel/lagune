import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import { MaskIcon } from '@site/src/components/MaskIcon';
import {
  INSTALL_INDEX,
  MAIN_AGENTS,
  OTHER_AGENTS_COUNT,
} from '@site/src/data/agents';
import { memo, useRef } from 'react';
import { LuArrowRight } from 'react-icons/lu';
import { useMetalRing } from './useMetalRing';

const CallToActionComponent = () => {
  const metalRef = useRef<HTMLSpanElement>(null);

  useMetalRing(metalRef);

  return (
    <Link
      to={INSTALL_INDEX}
      className='lagune-metal-button self-start max-[600px]:self-stretch'
    >
      <span className='sr-only'>
        {translate({
          id: 'home.cta.install',
          message: 'Install',
          description: 'The main home button, leading to the install page',
        })}
      </span>
      <span ref={metalRef} className='lagune-metal-button__metal' aria-hidden />
      <span
        className='lagune-metal-button__label flex flex-1 items-center gap-3 max-[380px]:gap-2'
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
        <span className='font-display text-[15px] font-extrabold leading-none tracking-[-0.01em]'>
          +{OTHER_AGENTS_COUNT}
        </span>
      </span>
      <span className='lagune-metal-button__orb' aria-hidden>
        <LuArrowRight />
        <LuArrowRight />
      </span>
    </Link>
  );
};

export const CallToAction = memo(CallToActionComponent);
