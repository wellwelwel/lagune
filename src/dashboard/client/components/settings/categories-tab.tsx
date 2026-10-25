import type { ActionRunState, RunButton } from '@/types/dashboard/client';
import type { VNode } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { runCategories } from '../../data/api';
import { modal, useData } from '../../data/state';
import { CATEGORY_OPTIONS } from '../../domain/categories';
import { actionFailed, useRunAction } from '../../hooks/use/run-action';
import { classes, GROUP_HEAD } from '../../utils/tailwind-classes';
import { Icon } from '../primitives/icons';
import { SearchField } from '../primitives/search-field';
import { ManageCategoryRow } from './tiles';

const RUN_BUTTON: Record<ActionRunState, RunButton> = {
  idle: { icon: 'save', label: 'Record categories' },
  pending: { icon: 'refresh', label: 'Recording…' },
  success: { icon: 'check', label: 'Recorded' },
  error: { icon: 'save', label: 'Record categories' },
};

export const CategoriesTab = (): VNode => {
  const data = useData();
  const [chosen, setChosen] = useState<string[]>(data.categories.used);
  const [manageQuery, setManageQuery] = useState('');
  const { run, setRun, button, trigger } = useRunAction(RUN_BUTTON);

  const toggleChosen = (key: string) => {
    if (run === 'pending') return;

    setChosen((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    );
    setRun('idle');
  };

  const apply = () => {
    modal.value = { kind: 'categories', run: 'pending', added: 0, removed: 0 };

    trigger(async () => {
      const response = await runCategories({ categories: chosen });
      const succeeded = response.ok;

      modal.value = {
        kind: 'categories',
        run: succeeded ? 'success' : 'error',
        added: succeeded ? response.added : 0,
        removed: succeeded ? response.removed : 0,
      };

      return response;
    });
  };

  const shownCategories = useMemo(() => {
    const term = manageQuery.trim().toLowerCase();
    if (!term) return CATEGORY_OPTIONS;
    return CATEGORY_OPTIONS.filter(
      (category) =>
        category.name.toLowerCase().includes(term) ||
        category.description.toLowerCase().includes(term)
    );
  }, [manageQuery]);

  const changed = useMemo(() => {
    const used = new Set(data.categories.used);
    return (
      !data.categories.recorded ||
      chosen.length !== used.size ||
      chosen.some((key) => !used.has(key))
    );
  }, [chosen, data.categories]);

  return (
    <div class='route-rise'>
      <section class='rounded-xl bg-surface p-6 shadow-card'>
        <div class={`${GROUP_HEAD} min-h-10`}>
          Manage categories
          <button
            class={classes(
              'ml-auto flex h-10 items-center gap-2.5 rounded-md border-0 bg-accent pr-5 pl-4.5 text-[0.8rem] font-bold text-white transition-[background-color,opacity,scale] duration-200 hover:bg-accent-3 disabled:cursor-default disabled:opacity-70',
              changed
                ? 'scale-100 cursor-pointer opacity-100'
                : 'pointer-events-none scale-95 opacity-0'
            )}
            type='button'
            tabIndex={changed ? 0 : -1}
            aria-hidden={!changed}
            disabled={run === 'pending'}
            onClick={apply}
          >
            <span
              class={`inline-flex text-[0.95rem] ${run === 'pending' ? 'animate-spin' : ''}`}
            >
              <Icon name={button.icon} />
            </span>
            {button.label}
          </button>
        </div>
        {run === 'error' && (
          <p class='mb-3 text-right text-[0.8rem] text-red'>
            {actionFailed('Update')}
          </p>
        )}
        <p class='mb-4 text-[0.82rem] leading-[1.5] text-muted text-pretty'>
          On-demand security knowledge, by category. The categories this project
          uses decide which built-in specializations join its catalog, recorded
          in <code>.lagune/catalog.json</code> for the whole team.
          {!data.categories.recorded &&
            ' None is recorded yet, so the default applies.'}
        </p>
        <SearchField
          placeholder='Search categories'
          query={manageQuery}
          onQuery={setManageQuery}
        />
        {shownCategories.length > 0 ? (
          <div class='grid grid-cols-2 gap-2.5 min-[1280px]:grid-cols-3 min-[1600px]:grid-cols-4'>
            {shownCategories.map((category) => (
              <ManageCategoryRow
                key={category.key}
                category={category}
                on={chosen.includes(category.key)}
                onToggle={() => toggleChosen(category.key)}
              />
            ))}
          </div>
        ) : (
          <p class='py-8 text-center text-[0.85rem] text-faint'>
            No categories match “{manageQuery.trim()}”.
          </p>
        )}
      </section>
    </div>
  );
};
