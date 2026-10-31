import type { VNode } from 'preact';
import { INSTALL_DOC_HREF } from '../../utils/links';
import { DocsLink } from '../primitives/docs-link';
import { Icon } from '../primitives/icons';
import { SectionHead } from './section-head';

export const EmptyState = (): VNode => (
  <section class='mb-6'>
    <SectionHead title='Getting started' />
    <div class='flex items-center gap-3.5 rounded-lg bg-surface p-4.5 shadow-card'>
      <span class='grid size-11 flex-none place-items-center rounded-md bg-accent-soft text-[1.25rem] text-accent'>
        <Icon name='package' />
      </span>
      <p class='min-w-0 flex-1 text-[0.8rem] text-muted text-pretty'>
        Install Lagune with{' '}
        <code class='whitespace-nowrap'>npx skills add wellwelwel/lagune</code>{' '}
        or run <code>/lagune-charter</code> in your agent to set your project's
        security principles.
      </p>
      <DocsLink href={INSTALL_DOC_HREF} />
    </div>
  </section>
);
