import type { ScopeChange, SettingShift } from '@/types/dashboard/client';
import type { ComponentChildren, VNode } from 'preact';
import { hookMeta } from '../../domain/hooks';
import {
  BADGE,
  BADGE_MUTED,
  CARD,
  CARD_TITLE,
  ROW_EDGES,
  SOFT_TONE,
} from '../../utils/tailwind-classes';
import { Icon } from '../primitives/icons';

const SHOWN_PATHS = 8;

const PATH_CHIP = `${BADGE} font-mono font-semibold`;

const Shift = (props: { shift: SettingShift }): VNode => (
  <span class='inline-flex items-center gap-1.5'>
    <span class='text-muted'>{props.shift.from}</span>
    <span class='inline-flex text-[0.8rem] text-faint'>
      <Icon name='arrowRight' />
    </span>
    <span class='font-semibold text-ink-2'>{props.shift.to}</span>
  </span>
);

const PathChips = (props: { added: string[]; removed: string[] }): VNode => {
  const paths = [
    ...props.added.map((path) => ({ path, added: true })),
    ...props.removed.map((path) => ({ path, added: false })),
  ];
  const hidden = paths.length - SHOWN_PATHS;

  return (
    <>
      {paths.slice(0, SHOWN_PATHS).map(({ path, added }) => (
        <span
          key={`${added}-${path}`}
          class={`${PATH_CHIP} ${added ? SOFT_TONE.teal : SOFT_TONE.red}`}
          title={path}
        >
          {added ? '+' : '−'} {path}
        </span>
      ))}
      {hidden > 0 && (
        <span class={`${BADGE_MUTED} tabular-nums`}>+{hidden} more</span>
      )}
    </>
  );
};

const ChangeLine = (props: {
  label: string;
  children: ComponentChildren;
}): VNode => (
  <>
    <span class='col-start-2 pr-4 text-[0.8rem] text-muted'>{props.label}</span>
    <span class='flex min-w-0 flex-wrap items-center gap-1.5 text-[0.8rem]'>
      {props.children}
    </span>
  </>
);

const ChangeRow = (props: { change: ScopeChange }): VNode => {
  const { scope, gitignore, list, added, removed } = props.change;
  const hook = hookMeta(scope);
  const paths = list !== null || added.length > 0 || removed.length > 0;

  return (
    <div
      class={`col-span-3 grid grid-cols-subgrid items-center gap-y-2 ${ROW_EDGES}`}
    >
      <span class='inline-flex pr-2.5 text-[1.05rem] text-accent'>
        <Icon name={hook.icon} />
      </span>
      <span class={`col-span-2 ${CARD_TITLE}`}>{hook.label}</span>
      {gitignore !== null && (
        <ChangeLine label='Respect .gitignore'>
          <Shift shift={gitignore} />
        </ChangeLine>
      )}
      {paths && (
        <ChangeLine label='Ignored paths'>
          {list !== null && <Shift shift={list} />}
          <PathChips added={added} removed={removed} />
        </ChangeLine>
      )}
    </div>
  );
};

export const HookChanges = (props: { changes: ScopeChange[] }): VNode => (
  <div
    class={`scroll-slim grid max-h-80 grid-cols-[auto_auto_minmax(0,1fr)] overflow-y-auto ${CARD}`}
  >
    {props.changes.map((change) => (
      <ChangeRow key={change.scope ?? 'every'} change={change} />
    ))}
  </div>
);
