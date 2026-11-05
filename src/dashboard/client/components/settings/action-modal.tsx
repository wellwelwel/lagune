import type {
  ActionCopy,
  ActionModalHeader,
  ModalKind,
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
import { HookChanges } from './hook-changes';

const FAILED_HEADER: ActionModalHeader = {
  icon: 'alertTriangle',
  title: 'Update failed',
  subtitle: 'Nothing changed. Check the terminal and retry.',
};

const ACTION_COPY: Record<ModalKind, ActionCopy> = {
  categories: {
    eyebrow: 'Categories',
    headers: {
      idle: {
        icon: 'graduationCap',
        title: 'Ready to apply',
        subtitle: 'Recording the categories this project uses.',
      },
      pending: {
        icon: 'refresh',
        title: 'Recording categories',
        subtitle: 'Writing them to the project catalog.',
      },
      success: {
        icon: 'checkCircle',
        title: 'Categories recorded',
        subtitle: 'The specializations detect can draw on have changed.',
      },
      error: FAILED_HEADER,
    },
    pending: 'Recording the categories for this project…',
    resultIcon: 'brain',
    doneRoute: '/',
  },
  checkers: {
    eyebrow: 'Hooks',
    headers: {
      idle: {
        icon: 'sliders',
        title: 'Ready to apply',
        subtitle: 'Recording what the hooks scan.',
      },
      pending: {
        icon: 'refresh',
        title: 'Recording settings',
        subtitle: 'Writing them to the project configs.',
      },
      success: {
        icon: 'checkCircle',
        title: 'Settings recorded',
        subtitle: "The changes take effect on each hook's next scan.",
      },
      error: FAILED_HEADER,
    },
    pending: 'Recording what the hooks scan in this project…',
    resultIcon: 'sliders',
    doneRoute: null,
  },
};

const SUMMARY = 'text-[0.85rem] text-muted';

const Count = (props: {
  value: number;
  one: string;
  many: string;
  verb: string;
}): VNode => (
  <>
    <span class='tabular-nums font-semibold text-ink-2'>{props.value}</span>{' '}
    {props.value === 1 ? props.one : props.many} {props.verb}
  </>
);

const CategoriesSummary = (props: {
  added: number;
  removed: number;
}): VNode => {
  const { added, removed } = props;

  if (added === 0 && removed === 0)
    return <span class={SUMMARY}>The same categories, now recorded</span>;

  return (
    <span class={SUMMARY}>
      {added > 0 && (
        <Count value={added} one='category' many='categories' verb='added' />
      )}
      {added > 0 && removed > 0 && ', '}
      {removed > 0 && (
        <Count
          value={removed}
          one='category'
          many='categories'
          verb='removed'
        />
      )}
    </span>
  );
};

const CheckersSummary = (props: { changed: number }): VNode => {
  if (props.changed === 0)
    return <span class={SUMMARY}>Every hook scans as before</span>;

  return (
    <span class={SUMMARY}>
      <Count
        value={props.changed}
        one='hook'
        many='hooks'
        verb={props.changed === 1 ? 'scans differently' : 'scan differently'}
      />
    </span>
  );
};

const Summary = (props: { state: ModalState }): VNode =>
  props.state.kind === 'categories' ? (
    <CategoriesSummary
      added={props.state.added}
      removed={props.state.removed}
    />
  ) : (
    <CheckersSummary changed={props.state.changed} />
  );

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

  const copy = ACTION_COPY[state.kind];
  const header = copy.headers[state.run];
  const close = () => (modal.value = null);
  const done = () => {
    close();

    if (copy.doneRoute !== null) route(copy.doneRoute);
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
            {copy.eyebrow}
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
            <span class='text-[0.85rem] text-muted'>{copy.pending}</span>
          </div>
        )}

        {state.run === 'error' && (
          <div class='flex items-center gap-3 rounded-lg bg-surface p-4.5 shadow-card'>
            <span class={`${TILE_SM} bg-red-soft text-red`}>
              <Icon name='alertTriangle' />
            </span>
            <span class='text-[0.85rem] text-muted'>
              {actionFailed(copy.eyebrow)}
            </span>
          </div>
        )}

        {state.run === 'success' && (
          <>
            <div class='flex items-center gap-3 rounded-lg bg-surface p-4.5 shadow-card'>
              <span class={`${TILE_SM} bg-teal-soft text-teal`}>
                <Icon name={copy.resultIcon} />
              </span>
              <Summary state={state} />
            </div>

            {state.kind === 'categories' ? (
              <CategoriesNext />
            ) : (
              state.changes.length > 0 && (
                <HookChanges changes={state.changes} />
              )
            )}
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
