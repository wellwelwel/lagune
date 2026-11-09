import type { ReactNode } from 'react';
import { MaskIcon } from '@site/src/components/MaskIcon';
import { installRouteNamed } from '@site/src/data/agents';

export const AgentTabLabel = ({
  agent,
  label,
}: {
  agent: string;
  label?: string;
}): ReactNode => {
  const route = installRouteNamed(agent);
  const name = label ?? route.name;

  return (
    <span title={name} className='inline-flex items-center gap-1.5'>
      <MaskIcon src={route.icon} className='size-3.5 flex-none bg-current' />
      <span className='lagune-docs-agent-tab-name'>{name}</span>
    </span>
  );
};
