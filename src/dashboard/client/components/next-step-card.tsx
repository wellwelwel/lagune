import type { PhaseCommand } from '@/types/dashboard/client';
import type { VNode } from 'preact';
import { commandDocHref } from '../utils/links';
import { CARD_TITLE, TILE_MD } from '../utils/tailwind-classes';
import { CopyButton } from './primitives/copy-button';
import { DocsLink } from './primitives/docs-link';
import { Icon } from './primitives/icons';

export const NextStepCard = (props: { step: PhaseCommand }): VNode => {
  const { step } = props;

  return (
    <div class='flex items-center gap-3.5 rounded-lg bg-surface p-4.5 shadow-card'>
      <span class={`${TILE_MD} ${step.tone}`}>
        <Icon name={step.icon} />
      </span>
      <div class='flex min-w-0 flex-1 flex-col gap-1'>
        <span class='flex items-center gap-1.5'>
          <span class={CARD_TITLE}>{step.command}</span>
          <span class='inline-flex text-muted'>
            <CopyButton
              inline
              text={step.command}
              label={`Copy ${step.command}`}
            />
          </span>
        </span>
        <span class='text-[0.8rem] text-muted'>{step.purpose}</span>
      </div>
      <DocsLink href={commandDocHref(step.key)} />
    </div>
  );
};
