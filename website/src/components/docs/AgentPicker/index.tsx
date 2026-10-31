import type { CSSProperties, ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { MaskIcon } from '@site/src/components/MaskIcon';
import {
  FEATURED_AGENTS,
  UNIVERSAL_BACKGROUND,
  UNIVERSAL_HIGHLIGHTS,
  UNIVERSAL_INSTALL,
  UNIVERSAL_SUMMARY,
} from '@site/src/data/agents';
import clsx from 'clsx';
import { Icon } from '../icons';

type TileStyle = CSSProperties & { '--tile-delay'?: string };

export const CARD =
  'group relative flex flex-col gap-3.5 rounded-panel border border-line-2 p-4.5 transition-[box-shadow,border-color,background-color] hover:no-underline!';

export const CARD_GRID = 'grid grid-cols-1 gap-4 font-jakarta @lg:grid-cols-2';

export const CARD_TITLE =
  'text-[0.92rem] font-extrabold leading-snug tracking-[-0.01em] text-ink';

export const CARD_DESCRIPTION =
  'text-[0.7375rem] font-medium leading-normal text-pretty text-muted';

const TILE_HOVER =
  'group-hover:bg-accent group-hover:text-white docs-dark:group-hover:bg-accent-3';

const TILE_STAGGER =
  'transition-[background-color,color] duration-150 ease-in group-hover:duration-300 group-hover:ease-out group-hover:delay-(--tile-delay)';

const TILE_STAGGER_MS = 100;

export const AgentTile = ({
  icon,
  className,
  delay,
}: {
  icon: string;
  className?: string;
  delay?: number;
}): ReactNode => {
  const style: TileStyle | undefined =
    delay === undefined ? undefined : { '--tile-delay': `${delay}ms` };

  return (
    <span
      className={clsx(
        'grid size-10 flex-none place-items-center rounded-field bg-surface-2 text-ink-2',
        delay !== undefined && TILE_STAGGER,
        className
      )}
      style={style}
    >
      <MaskIcon src={icon} className='size-5 bg-current' />
    </span>
  );
};

const AgentCard = ({
  to,
  title,
  description,
  icon,
  background,
  className,
}: {
  to: string;
  title: string;
  description: string;
  icon: ReactNode;
  background: string;
  className: string;
}): ReactNode => (
  <Link className={clsx(CARD, 'isolate overflow-hidden', className)} to={to}>
    <MaskIcon
      src={background}
      className='pointer-events-none absolute -right-6 -bottom-6 -z-10 size-28 bg-ink/1.5'
    />
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
      <Icon name='chevronRight' strokeWidth={3} />
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
          icon={
            <AgentTile
              icon={agent.icon}
              className={clsx(TILE_HOVER, 'transition-colors')}
            />
          }
          background={agent.icon}
        />
      ))}
      <AgentCard
        to={UNIVERSAL_INSTALL}
        title='Universal'
        description={UNIVERSAL_SUMMARY}
        background={UNIVERSAL_BACKGROUND}
        className='border-dashed hover:border-accent'
        icon={
          <span className='flex'>
            {UNIVERSAL_HIGHLIGHTS.map((agent, index) => (
              <AgentTile
                key={agent.name}
                icon={agent.icon}
                delay={index * TILE_STAGGER_MS}
                className={clsx(
                  TILE_HOVER,
                  '-ml-2 ring-2 ring-surface first:ml-0'
                )}
              />
            ))}
          </span>
        }
      />
    </div>
  </div>
);
