import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import { INSTALL_INDEX, installRouteNamed } from '@site/src/data/agents';
import { AgentTile } from '../AgentPicker';
import { ArrowLink } from '../ArrowLink';
import { Icon } from '../icons';

export const InstallHeader = ({ name }: { name: string }): ReactNode => {
  const route = installRouteNamed(name);
  const backLabel = translate({
    id: 'docs.install.back',
    message: 'Back to all agents',
    description:
      "The label of the link from an agent's install page back to the list of agents",
  });

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
        aria-label={backLabel}
        title={backLabel}
        className='-mr-3 ml-auto grid size-10 flex-none place-items-center rounded-field text-[1.1rem] text-faint transition-colors hover:text-accent'
      >
        <Icon name='undo' strokeWidth={2.5} />
      </Link>
    </div>
  );
};
