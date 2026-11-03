import type { CSSProperties, ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { MaskIcon } from '@site/src/components/MaskIcon';
import {
  INSTALL_INDEX,
  MAIN_AGENTS,
  OTHER_AGENTS_COUNT,
} from '@site/src/data/agents';

type StackStyle = CSSProperties & { '--stack-index': number };

const SPREAD =
  'transition-[translate,background-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] min-[601px]:@min-[352px]:group-hover:translate-x-[calc(var(--stack-index)*12px)] motion-reduce:transition-none';

const stackIndex = (index: number): StackStyle => ({ '--stack-index': index });

export const AgentStack = (): ReactNode => (
  <div className='@container w-full'>
    <div className='group flex w-fit items-center gap-3.5'>
      <div className='flex'>
        {MAIN_AGENTS.map((agent, index) => (
          <Link
            key={agent.name}
            to={agent.install}
            aria-label={`Install on ${agent.name}`}
            style={stackIndex(index)}
            className={`relative -ml-1.5 grid size-8 place-items-center rounded-chip bg-[#0c2266] text-ink no-underline shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ring-2 ring-[#05164a] first:ml-0 hover:z-10 hover:bg-accent focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 @min-[280px]:-ml-2 @min-[280px]:size-10 @min-[280px]:rounded-field ${SPREAD}`}
          >
            <MaskIcon
              src={agent.icon}
              className='size-4 bg-current @min-[280px]:size-5'
            />
          </Link>
        ))}
      </div>
      <Link
        to={INSTALL_INDEX}
        aria-label={`${OTHER_AGENTS_COUNT} more agents`}
        style={stackIndex(MAIN_AGENTS.length - 1)}
        className={`relative inline-flex h-8 items-center rounded-chip font-display text-[clamp(14px,1.35vw,16px)] font-extrabold tracking-[-0.01em] text-[rgba(233,237,247,0.72)] no-underline before:absolute before:inset-y-0 before:-left-3.5 before:-right-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4 @min-[280px]:h-10 ${SPREAD}`}
      >
        +{OTHER_AGENTS_COUNT}
      </Link>
    </div>
  </div>
);
