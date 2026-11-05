import type { VNode } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { runCategories } from '../../data/api';
import { modal, useData } from '../../data/state';
import { CATEGORY_OPTIONS } from '../../domain/categories';
import { useRunAction } from '../../hooks/use/run-action';
import { PANEL } from '../../utils/tailwind-classes';
import { SearchField } from '../primitives/search-field';
import { RecordHead } from './record-head';
import { ManageCategoryRow } from './tiles';

export const CategoriesTab = (): VNode => {
  const data = useData();
  const [chosen, setChosen] = useState<string[]>(data.categories.used);
  const [manageQuery, setManageQuery] = useState('');
  const { run, setRun, trigger } = useRunAction();

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

    trigger(
      () => runCategories({ categories: chosen }),
      (response) => {
        const succeeded = response.ok;

        modal.value = {
          kind: 'categories',
          run: succeeded ? 'success' : 'error',
          added: succeeded ? response.added : 0,
          removed: succeeded ? response.removed : 0,
        };
      }
    );
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
      <section class={PANEL}>
        <RecordHead
          title='Manage categories'
          label='Record categories'
          run={run}
          recordable={changed}
          onRecord={apply}
        >
          On-demand security knowledge, by category. The categories this project
          uses, recorded in <code>.lagune/configs.json</code> for the whole
          team, decide which built-in specializations join its catalog.
          {!data.categories.recorded &&
            ' None is recorded yet, so the default applies.'}
        </RecordHead>
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
