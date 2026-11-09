import type { ReactNode } from 'react';
import { MaskIcon } from '@site/src/components/MaskIcon';
import { companionNamed } from '@site/src/data/companions';

export const CompanionTabLabel = ({ name }: { name: string }): ReactNode => {
  const { logo } = companionNamed(name);

  return (
    <span className='inline-flex items-center gap-1.5'>
      <MaskIcon src={logo} className='size-4 flex-none bg-current' />
      {name}
    </span>
  );
};
