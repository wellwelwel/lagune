import type { VNode } from 'preact';
import { CopyButton } from '../primitives/copy-button';
import { Icon } from '../primitives/icons';
import { SectionHead } from './section-head';

const INSTALL_COMMAND = 'npx skills add wellwelwel/lagune';

export const EmptyState = (): VNode => (
  <section class='mb-6'>
    <SectionHead title='Getting started' />
    <div class='flex items-center gap-3.5 rounded-lg bg-surface p-4.5 shadow-card'>
      <span class='grid size-11 flex-none place-items-center rounded-md bg-accent-soft text-[1.25rem] text-accent'>
        <Icon name='package' />
      </span>
      <span class='flex min-w-0 flex-1 flex-col gap-0.5'>
        <span class='text-[0.9rem] font-bold tracking-[-0.01em]'>
          Nothing in .lagune/ yet
        </span>
        <span class='text-[0.8rem] text-muted text-pretty'>
          Install the commands in this project, then run{' '}
          <code>/lagune.charter</code> in your agent. Every artifact it writes
          shows up here.
        </span>
      </span>
      <span class='flex flex-none items-center gap-2 rounded-md bg-surface-2 py-1.5 pr-1.5 pl-3'>
        <code class='border-0 bg-transparent p-0 font-mono text-[0.75rem] font-semibold text-ink-2'>
          {INSTALL_COMMAND}
        </code>
        <CopyButton text={INSTALL_COMMAND} label='Copy the install command' />
      </span>
    </div>
  </section>
);
