import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { MaskIcon } from '@site/src/components/MaskIcon';
import {
  FEATURED_AGENTS,
  UNIVERSAL_HIGHLIGHTS,
  UNIVERSAL_INSTALL,
  UNIVERSAL_SUMMARY,
} from '@site/src/data/agents';
import clsx from 'clsx';
import { Icon } from '../icons';

export const CARD =
  'group relative flex flex-col gap-3.5 rounded-panel border border-line-2 p-4.5 transition-[box-shadow,border-color,background-color] hover:no-underline!';

export const CARD_GRID = 'grid grid-cols-1 gap-4 font-jakarta @lg:grid-cols-2';

export const CARD_TITLE =
  'text-[0.92rem] font-extrabold leading-snug tracking-[-0.01em] text-ink';

export const CARD_DESCRIPTION =
  'text-[0.7375rem] font-medium leading-normal text-pretty text-muted';

export const AgentTile = ({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}): ReactNode => (
  <span
    className={clsx(
      'grid size-10 flex-none place-items-center rounded-field bg-surface-2 text-ink-2',
      className
    )}
  >
    <MaskIcon src={icon} className='size-5 bg-current' />
  </span>
);

const AgentCard = ({
  to,
  title,
  description,
  icon,
  className,
}: {
  to: string;
  title: string;
  description: string;
  icon: ReactNode;
  className: string;
}): ReactNode => (
  <Link className={clsx(CARD, className)} to={to}>
    {icon}
    <span className='flex min-w-0 flex-col gap-1'>
      <span
        className={clsx(
          CARD_TITLE,
          'transition-colors group-hover:text-accent'
        )}
      >
        {title}
      </span>
      <span className={CARD_DESCRIPTION}>{description}</span>
    </span>
    <span className='absolute top-4.5 right-4.5 inline-flex text-[0.9rem] text-faint transition-colors group-hover:text-accent'>
      <Icon name='arrowRight' />
    </span>
  </Link>
);

export const AgentPicker = (): ReactNode => (
  <div className='@container mb-(--ifm-leading)'>
    <div className={clsx(CARD_GRID, '@4xl:grid-cols-4')}>
      {FEATURED_AGENTS.map((agent) => (
        <AgentCard
          key={agent.name}
          to={agent.install}
          title={agent.name}
          description={agent.description}
          className='bg-surface shadow-card-half hover:shadow-pop'
          icon={<AgentTile icon={agent.icon} />}
        />
      ))}
      <AgentCard
        to={UNIVERSAL_INSTALL}
        title='Universal'
        description={UNIVERSAL_SUMMARY}
        className='border-dashed hover:border-accent'
        icon={
          <span className='flex'>
            {UNIVERSAL_HIGHLIGHTS.map((agent) => (
              <AgentTile
                key={agent.name}
                icon={agent.icon}
                className='-ml-2 ring-2 ring-surface first:ml-0'
              />
            ))}
          </span>
        }
      />
    </div>
  </div>
);
