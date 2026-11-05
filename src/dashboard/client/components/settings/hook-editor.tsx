import type { CheckersConfig } from '@/types/checkers';
import type {
  GitChoice,
  HookScope,
  IconName,
  ListChoice,
  SegmentOption,
} from '@/types/dashboard/client';
import type { ComponentChildren, VNode } from 'preact';
import {
  GIT_LABELS,
  gitChoiceOf,
  LIST_LABELS,
  listChoiceOf,
  summaryOf,
  withGit,
  withListChoice,
  withPaths,
} from '../../domain/hook-settings';
import { EVERY_HOOK, hookMeta } from '../../domain/hooks';
import { hookDocHref } from '../../utils/links';
import { CARD_TITLE, SOFT_TONE, TILE_SM } from '../../utils/tailwind-classes';
import { DocsLink } from '../primitives/docs-link';
import { Icon } from '../primitives/icons';
import { Segmented } from '../primitives/segmented';
import { IgnoreList } from './ignore-list';

const optionsOf = <Choice extends string>(
  labels: Record<Choice, string>,
  keys: Choice[]
): SegmentOption<Choice>[] => keys.map((key) => ({ key, label: labels[key] }));

const SHARED_GIT = optionsOf(GIT_LABELS, ['skip', 'scan']);

const OWN_GIT = optionsOf(GIT_LABELS, ['shared', 'skip', 'scan']);

const LIST_CHOICES = optionsOf(LIST_LABELS, ['shared', 'own']);

const SettingBlock = (props: {
  icon: IconName;
  title: string;
  description: string;
  control?: ComponentChildren;
  children?: ComponentChildren;
}): VNode => (
  <section class='rounded-lg bg-surface-2 p-4.5'>
    <div class='flex flex-wrap items-center gap-x-4 gap-y-3'>
      <div class='grid min-w-60 flex-1 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2.5 gap-y-1'>
        <span class='inline-flex text-[1.05rem] text-muted'>
          <Icon name={props.icon} />
        </span>
        <h4 class={CARD_TITLE}>{props.title}</h4>
        <p class='col-start-2 text-[0.8rem] leading-normal text-muted'>
          {props.description}
        </p>
      </div>
      {props.control}
    </div>
    {props.children && <div class='mt-4'>{props.children}</div>}
  </section>
);

const gitDescription = (
  config: CheckersConfig,
  scope: HookScope,
  choice: GitChoice
): string => {
  const base =
    'Skip the files Git ignores, like build output and dependencies. Files Git tracks are always scanned.';

  if (choice !== 'shared') return base;

  return `${base} Inherited from ${EVERY_HOOK.label}: ${GIT_LABELS[summaryOf(config, scope).gitignore ? 'skip' : 'scan']}.`;
};

const pathsDescription = (choice: ListChoice | undefined): string => {
  const base =
    'Paths and patterns from the project root that the hooks ignore, with everything inside them, even files Git tracks.';

  return choice === 'shared'
    ? `${base} Inherited from ${EVERY_HOOK.label}.`
    : base;
};

export const HookEditor = (props: {
  config: CheckersConfig;
  scope: HookScope;
  disabled: boolean;
  onChange: (config: CheckersConfig) => void;
}): VNode => {
  const { config, scope } = props;
  const hook = hookMeta(scope);
  const git = gitChoiceOf(config, scope);
  const list = scope === undefined ? undefined : listChoiceOf(config, scope);
  const editable = list !== 'shared';

  return (
    <div class='flex flex-col gap-3'>
      <div class='flex flex-wrap items-center gap-3 pb-1'>
        <span class={`${TILE_SM} ${SOFT_TONE.accent}`}>
          <Icon name={hook.icon} />
        </span>
        <div class='flex min-w-0 flex-1 flex-col gap-0.5'>
          <h3 class={CARD_TITLE}>{hook.label}</h3>
          <p class='text-[0.8rem] text-muted'>{hook.blurb}</p>
        </div>
        <DocsLink href={hookDocHref(scope)} />
      </div>

      <SettingBlock
        icon='git'
        title='Respect .gitignore'
        description={gitDescription(config, scope, git)}
        control={
          <Segmented
            label='Respect .gitignore'
            options={scope === undefined ? SHARED_GIT : OWN_GIT}
            value={git}
            disabled={props.disabled}
            onChange={(choice) =>
              props.onChange(withGit(config, scope, choice))
            }
          />
        }
      />

      <SettingBlock
        icon='folderMinus'
        title='Ignored paths'
        description={pathsDescription(list)}
        control={
          scope !== undefined &&
          list !== undefined && (
            <Segmented
              label='Ignored paths'
              options={LIST_CHOICES}
              value={list}
              disabled={props.disabled}
              onChange={(choice) =>
                props.onChange(withListChoice(config, scope, choice))
              }
            />
          )
        }
      >
        <IgnoreList
          patterns={summaryOf(config, scope).ignore}
          editable={editable}
          disabled={props.disabled}
          onChange={(patterns) =>
            props.onChange(withPaths(config, scope, patterns))
          }
        />
      </SettingBlock>
    </div>
  );
};
