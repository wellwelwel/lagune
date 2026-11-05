import type { CheckersConfig } from '@/types/checkers';
import type { HookScope } from '@/types/dashboard/client';
import type { ComponentChildren, VNode } from 'preact';
import { HOOK_SCOPES, summaryOf } from '../../domain/hook-settings';
import { hookMeta } from '../../domain/hooks';
import { BADGE, classes, TOOLTIP } from '../../utils/tailwind-classes';
import { Icon } from '../primitives/icons';

const ignoredLabel = (count: number): string => {
  if (count === 0) return 'No ignored paths';

  return `${count} ignored ${count === 1 ? 'path' : 'paths'}`;
};

const gitLabel = (gitignore: boolean): string =>
  gitignore ? 'Skips what Git ignores' : 'Scans what Git ignores';

const SettingLabel = (props: {
  custom: boolean;
  tip: string;
  children: ComponentChildren;
}): VNode => (
  <span
    class={classes(
      BADGE,
      'group/tip relative flex-none bg-surface font-bold tabular-nums',
      props.custom
        ? 'text-accent ring-1 ring-accent/40 ring-inset'
        : 'text-muted'
    )}
  >
    <span class='inline-flex' aria-hidden='true'>
      {props.children}
    </span>
    <span class={`${TOOLTIP} left-1/2 -translate-x-1/2`}>
      {props.custom ? `Custom: ${props.tip}` : props.tip}
    </span>
  </span>
);

const GitMark = (props: { skips: boolean }): VNode => (
  <span class='relative inline-flex text-[0.85rem]'>
    <span
      class={classes(
        'inline-flex transition-opacity duration-300 ease-house',
        props.skips ? 'opacity-40' : 'opacity-100'
      )}
    >
      <Icon name='git' />
    </span>
    <span
      class={classes(
        'absolute top-1/2 left-1/2 h-[1.5px] w-[140%] -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-current transition-[scale] duration-300 ease-house',
        props.skips ? 'scale-x-100' : 'scale-x-0'
      )}
    />
  </span>
);

const ScopeTile = (props: {
  config: CheckersConfig;
  scope: HookScope;
  on: boolean;
  onSelect: () => void;
}): VNode => {
  const hook = hookMeta(props.scope);
  const summary = summaryOf(props.config, props.scope);

  return (
    <button
      class={classes(
        'flex h-full items-center gap-3 rounded-lg p-3.5 text-left transition-[background-color,box-shadow] duration-200',
        props.scope === undefined &&
          'col-span-2 @min-[52rem]:col-span-1 @min-[70rem]:col-span-4',
        props.on
          ? 'cursor-default bg-accent-soft shadow-card-half'
          : 'cursor-pointer bg-surface-2 hover:shadow-card-half'
      )}
      type='button'
      role='radio'
      aria-checked={props.on}
      onClick={props.onSelect}
    >
      <span
        class={classes(
          'inline-flex flex-none text-[1.2rem] transition-colors duration-200',
          props.on ? 'text-accent' : 'text-faint'
        )}
      >
        <Icon name={hook.icon} />
      </span>
      <span class='flex min-w-0 flex-1 items-center gap-2'>
        <span
          class={classes(
            'min-w-0 truncate text-[0.83rem] font-bold',
            props.on ? 'text-accent' : 'text-ink'
          )}
        >
          {hook.label}
        </span>
        <SettingLabel
          custom={summary.customList}
          tip={ignoredLabel(summary.ignore.length)}
        >
          {summary.ignore.length}
        </SettingLabel>
        <SettingLabel
          custom={summary.customGit}
          tip={gitLabel(summary.gitignore)}
        >
          <GitMark skips={summary.gitignore} />
        </SettingLabel>
      </span>
    </button>
  );
};

export const HookScopes = (props: {
  config: CheckersConfig;
  active: HookScope;
  onSelect: (scope: HookScope) => void;
}): VNode => (
  <div class='@container'>
    <div
      class='grid grid-cols-2 gap-2.5 @min-[52rem]:grid-cols-3 @min-[70rem]:grid-cols-4'
      role='radiogroup'
      aria-label='Hook to configure'
    >
      {HOOK_SCOPES.map((scope) => (
        <ScopeTile
          key={scope ?? 'every'}
          config={props.config}
          scope={scope}
          on={scope === props.active}
          onSelect={() => props.onSelect(scope)}
        />
      ))}
    </div>
  </div>
);
