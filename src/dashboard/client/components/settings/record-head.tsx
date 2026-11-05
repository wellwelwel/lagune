import type { ActionRunState, RunButton } from '@/types/dashboard/client';
import type { ComponentChildren, VNode } from 'preact';
import { actionFailed } from '../../hooks/use/run-action';
import { classes, GROUP_HEAD } from '../../utils/tailwind-classes';
import { Icon } from '../primitives/icons';

const runButton = (run: ActionRunState, label: string): RunButton => {
  if (run === 'pending') return { icon: 'refresh', label: 'Recording…' };
  if (run === 'success') return { icon: 'check', label: 'Recorded' };

  return { icon: 'save', label };
};

const RecordButton = (props: {
  label: string;
  run: ActionRunState;
  shown: boolean;
  onRecord: () => void;
}): VNode => {
  const pending = props.run === 'pending';
  const button = runButton(props.run, props.label);

  return (
    <button
      class={classes(
        'ml-auto flex h-10 items-center gap-2.5 rounded-md border-0 bg-accent pr-5 pl-4.5 text-[0.8rem] font-bold text-white transition-[background-color,opacity,scale] duration-200 hover:bg-accent-3 disabled:cursor-default disabled:opacity-70',
        props.shown
          ? 'scale-100 cursor-pointer opacity-100'
          : 'pointer-events-none scale-95 opacity-0'
      )}
      type='button'
      tabIndex={props.shown ? 0 : -1}
      aria-hidden={!props.shown}
      disabled={pending}
      onClick={props.onRecord}
    >
      <span
        class={`inline-flex text-[0.95rem] ${pending ? 'animate-spin' : ''}`}
      >
        <Icon name={button.icon} />
      </span>
      {button.label}
    </button>
  );
};

export const RecordHead = (props: {
  title: string;
  label: string;
  run: ActionRunState;
  recordable: boolean;
  onRecord: () => void;
  children: ComponentChildren;
}): VNode => (
  <>
    <div class={`${GROUP_HEAD} min-h-10`}>
      {props.title}
      <RecordButton
        label={props.label}
        run={props.run}
        shown={props.recordable}
        onRecord={props.onRecord}
      />
    </div>
    {props.run === 'error' && (
      <p class='mb-3 text-right text-[0.8rem] text-red'>
        {actionFailed('Update')}
      </p>
    )}
    <p class='mb-4 text-[0.82rem] leading-[1.5] text-muted text-pretty'>
      {props.children}
    </p>
  </>
);
