import type { ReactNode } from 'react';
import { MaskIcon } from '@site/src/components/MaskIcon';
import { UNIVERSAL_AGENTS } from '@site/src/data/agents';

export const UniversalAgents = (): ReactNode => (
  <div className='@container'>
    <ul className='m-0! grid list-none grid-cols-1 gap-2 p-0! font-jakarta @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4'>
      {UNIVERSAL_AGENTS.map((agent) => (
        <li
          key={agent.name}
          className='m-0! flex min-w-0 items-center gap-2.5 rounded-field bg-surface-2 px-3 py-2.5 text-[0.8rem] font-semibold leading-snug text-ink-2'
        >
          <MaskIcon
            src={agent.icon}
            className='size-4.5 flex-none bg-current text-muted'
          />
          {agent.name}
        </li>
      ))}
    </ul>
  </div>
);
