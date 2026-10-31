import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import {
  FEATURED_AGENTS,
  INSTALL_INDEX,
  SKILLS_SH,
} from '@site/src/data/agents';
import { AgentTile } from '../AgentPicker';
import { ArrowLink } from '../ArrowLink';
import { Icon } from '../icons';

const INSTALL_ROUTES = [SKILLS_SH, ...FEATURED_AGENTS];

export const InstallHeader = ({ name }: { name: string }): ReactNode => {
  const route = INSTALL_ROUTES.find((entry) => entry.name === name);

  if (!route) throw new Error(`No install route is named "${name}".`);

  return (
    <div className='mb-(--ifm-leading) flex items-center gap-3 font-jakarta'>
      <AgentTile icon={route.icon} />
      <span className='flex min-w-0 flex-col gap-0.5 leading-snug'>
        <span className='text-[1.05rem] font-extrabold tracking-[-0.01em] text-ink'>
          {route.name}
        </span>
        <ArrowLink to={route.homepage} className='text-[0.7rem]'>
          {route.homepage}
        </ArrowLink>
      </span>
      <Link
        to={INSTALL_INDEX}
        aria-label='Back to all agents'
        title='Back to all agents'
        className='-mr-3 ml-auto grid size-10 flex-none place-items-center rounded-field text-[1.1rem] text-faint transition-colors hover:text-accent'
      >
        <Icon name='undo' strokeWidth={2.5} />
      </Link>
    </div>
  );
};
