import type { ReactNode } from 'react';
import { FEATURED_AGENTS, SKILLS_SH } from '@site/src/data/agents';
import { AgentTile } from '../AgentPicker';

const INSTALL_ROUTES = [SKILLS_SH, ...FEATURED_AGENTS];

export const InstallHeader = ({ name }: { name: string }): ReactNode => {
  const route = INSTALL_ROUTES.find((entry) => entry.name === name);

  if (!route) throw new Error(`No install route is named "${name}".`);

  return (
    <div className='mb-(--ifm-leading) flex items-center gap-3 font-jakarta'>
      <AgentTile icon={route.icon} />
      <span className='text-[1.05rem] font-extrabold tracking-[-0.01em] text-ink'>
        {route.name}
      </span>
    </div>
  );
};
