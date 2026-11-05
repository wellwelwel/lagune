import type { CheckersConfig } from '@/types/checkers';
import type { HookScope } from '@/types/dashboard/client';
import type { VNode } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { runCheckers } from '../../data/api';
import { modal, useData } from '../../data/state';
import {
  checkersPayload,
  configOf,
  sameConfig,
  scopeChanges,
} from '../../domain/hook-settings';
import { useRunAction } from '../../hooks/use/run-action';
import { classes, PANEL } from '../../utils/tailwind-classes';
import { Admonition } from '../primitives/admonition';
import { HookEditor } from './hook-editor';
import { HookScopes } from './hook-scopes';
import { RecordHead } from './record-head';

const Unreadable = (props: { problem: string }): VNode => (
  <Admonition kind='danger' title='Settings the hooks refuse'>
    <p>{props.problem}</p>
    <p>
      Until it is fixed, every hook that scans files stops with this error. Edit{' '}
      <code>.lagune/configs.json</code> and this page reloads on its own.
    </p>
  </Admonition>
);

export const HooksTab = (): VNode => {
  const { checkers } = useData();
  const [base, setBase] = useState<CheckersConfig>(() => configOf(checkers));
  const [draft, setDraft] = useState<CheckersConfig>(base);
  const [scope, setScope] = useState<HookScope>(undefined);
  const [switched, setSwitched] = useState(false);
  const { run, setRun, trigger } = useRunAction();
  const pending = run === 'pending';
  const changed = !sameConfig(draft, base);

  useEffect(() => {
    const recorded = configOf(checkers);

    if (sameConfig(recorded, base)) return;

    setBase(recorded);

    if (!changed || sameConfig(recorded, draft)) setDraft(recorded);
  }, [checkers]);

  const edit = (next: CheckersConfig) => {
    if (pending) return;

    setDraft(next);
    setRun('idle');
  };

  const select = (next: HookScope) => {
    setScope(next);
    setSwitched(true);
  };

  const apply = () => {
    const changes = scopeChanges(base, draft);

    modal.value = { kind: 'checkers', run: 'pending', changed: 0, changes };

    trigger(
      () => runCheckers(checkersPayload(draft)),
      (response) => {
        modal.value = {
          kind: 'checkers',
          run: response.ok ? 'success' : 'error',
          changed: response.ok ? response.changed : 0,
          changes,
        };
      }
    );
  };

  return (
    <div class='route-rise flex flex-col gap-5'>
      <section class={PANEL}>
        <RecordHead
          title='Manage hooks'
          label='Record settings'
          run={run}
          recordable={changed && checkers.problem === null}
          onRecord={apply}
        >
          Hooks are the checks the specializations run over your code. What they
          scan is recorded in <code>.lagune/configs.json</code> for the whole
          team: once for all hooks, or per hook, where a custom setting,
          highlighted on its hook, replaces the inherited one. A path a scan
          names directly is scanned either way, and the hooks that score a
          single value, like <code>cvss</code>, scan no files.
        </RecordHead>
        {checkers.problem === null ? (
          <HookScopes config={draft} active={scope} onSelect={select} />
        ) : (
          <Unreadable problem={checkers.problem} />
        )}
      </section>
      {checkers.problem === null && (
        <section
          key={scope ?? 'every'}
          class={classes(PANEL, switched && 'route-rise')}
        >
          <HookEditor
            config={draft}
            scope={scope}
            disabled={pending}
            onChange={edit}
          />
        </section>
      )}
    </div>
  );
};
