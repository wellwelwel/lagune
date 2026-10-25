import type {
  ActionModalHeader,
  ActionRunState,
  ModalState,
} from '@/types/dashboard/client';
import type { VNode } from 'preact';
import { useLocation } from 'preact-iso';
import { modal } from '../../data/state';
import { PHASE_COMMANDS, phaseCommand } from '../../domain/commands';
import { actionFailed } from '../../hooks/use/run-action';
import { TILE_SM } from '../../utils/tailwind-classes';
import { NextStepCard } from '../next-step-card';
import { Admonition } from '../primitives/admonition';
import { Icon } from '../primitives/icons';
import { Modal } from '../primitives/modal';

const CATEGORIES_HEADER: Record<ActionRunState, ActionModalHeader> = {
  idle: {
    eyebrow: 'Categories',
    icon: 'graduationCap',
    title: 'Ready to apply',
    subtitle: 'Recording the categories this project uses.',
  },
  pending: {
    eyebrow: 'Categories',
    icon: 'refresh',
    title: 'Recording categories',
    subtitle: 'Writing them to the project catalog.',
  },
  success: {
    eyebrow: 'Categories',
    icon: 'checkCircle',
    title: 'Categories recorded',
    subtitle: 'The specializations detect can draw on have changed.',
  },
  error: {
    eyebrow: 'Categories',
    icon: 'alertTriangle',
    title: 'Update failed',
    subtitle: 'Nothing changed. Check the terminal and retry.',
  },
};

const CategoryCount = (props: { value: number; verb: string }): VNode => (
  <>
    <span class='tabular-nums font-semibold text-ink-2'>{props.value}</span>{' '}
    {props.value === 1 ? 'category' : 'categories'} {props.verb}
  </>
);

const CategoriesSummary = (props: { state: ModalState }): VNode => {
  const { added, removed } = props.state;

  if (added === 0 && removed === 0)
    return (
      <span class='text-[0.85rem] text-muted'>
        The same categories, now recorded
      </span>
    );

  return (
    <span class='text-[0.85rem] text-muted'>
      {added > 0 && <CategoryCount value={added} verb='added' />}
      {added > 0 && removed > 0 && ', '}
      {removed > 0 && <CategoryCount value={removed} verb='removed' />}
    </span>
  );
};

const CategoriesNext = (): VNode => {
  const detect = phaseCommand('Detect') ?? PHASE_COMMANDS[1];

  return (
    <div class='flex flex-col gap-4'>
      <Admonition kind='tip' title='Re-run detect'>
        <p>
          Detect is the phase that matches the catalog against your code. Run it
          again so the specializations you just changed shape what gets
          surfaced.
        </p>
      </Admonition>
      <NextStepCard step={detect} />
    </div>
  );
};

export const ActionModal = (): VNode | null => {
  const { route } = useLocation();
  const state = modal.value;

  if (state === null) return null;

  const header = CATEGORIES_HEADER[state.run];
  const close = () => (modal.value = null);
  const done = () => {
    close();
    route('/');
  };

  return (
    <Modal onClose={done} label={header.title} width='max-w-170'>
      <div class='relative flex-none overflow-hidden bg-banner px-6 py-5 text-white'>
        <img
          class='pointer-events-none absolute inset-0 z-0 size-full object-cover mask-[linear-gradient(to_right,transparent,rgba(0,0,0,0.35)_38%,black)]'
          src='https://lagune.ai/img/docs/banner-5.png'
          alt=''
          aria-hidden='true'
        />
        <span class='pointer-events-none absolute inset-0 z-1 bg-linear-to-r from-banner via-banner/85 to-banner/40' />
        <div class='relative z-2'>
          <span class='flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-white/82'>
            <span
              class={`inline-flex text-[0.95rem] ${state.run === 'pending' ? 'animate-spin' : ''}`}
            >
              <Icon name={header.icon} />
            </span>
            {header.eyebrow}
          </span>
          <h2 class='mt-1 text-[1.25rem] font-extrabold leading-[1.15] tracking-[-0.02em]'>
            {header.title}
          </h2>
          <p class='mt-1.5 text-[0.85rem] text-white/90'>{header.subtitle}</p>
        </div>
      </div>

      <div class='flex flex-col gap-4 bg-canvas px-6 py-5'>
        {state.run === 'pending' && (
          <div class='flex items-center gap-3 rounded-lg bg-surface p-4.5 shadow-card'>
            <span class={`${TILE_SM} bg-accent-soft text-accent`}>
              <span class='inline-flex animate-spin'>
                <Icon name='refresh' />
              </span>
            </span>
            <span class='text-[0.85rem] text-muted'>
              Recording the categories for this project…
            </span>
          </div>
        )}

        {state.run === 'error' && (
          <div class='flex items-center gap-3 rounded-lg bg-surface p-4.5 shadow-card'>
            <span class={`${TILE_SM} bg-red-soft text-red`}>
              <Icon name='alertTriangle' />
            </span>
            <span class='text-[0.85rem] text-muted'>
              {actionFailed(header.eyebrow)}
            </span>
          </div>
        )}

        {state.run === 'success' && (
          <>
            <div class='flex items-center gap-3 rounded-lg bg-surface p-4.5 shadow-card'>
              <span class={`${TILE_SM} bg-teal-soft text-teal`}>
                <Icon name='brain' />
              </span>
              <CategoriesSummary state={state} />
            </div>

            <CategoriesNext />
          </>
        )}
      </div>

      {state.run === 'success' && (
        <div class='flex items-center justify-end gap-3 border-t border-line-2 px-6 py-3.5 bg-surface'>
          <button
            class='flex cursor-pointer items-center gap-1.5 rounded-lg bg-accent px-4.5 py-2.5 text-[0.82rem] font-bold text-white transition-[background-color] duration-200 hover:bg-accent-3'
            type='button'
            onClick={done}
          >
            Done
            <span class='inline-flex'>
              <Icon name='arrowRight' />
            </span>
          </button>
        </div>
      )}
    </Modal>
  );
};
