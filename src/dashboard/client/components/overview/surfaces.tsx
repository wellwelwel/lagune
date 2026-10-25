import type { CatalogItem, Finding } from '@/types/dashboard/dashboard';
import type { VNode } from 'preact';
import { SpecializationIcon } from '../findings/specialization-icon';
import { ListCard, ListRow } from '../primitives/list-card';
import { SectionHead } from './section-head';

export const Surfaces = (props: {
  catalog: CatalogItem[];
  findings: Finding[];
}): VNode | null => {
  const applied = props.catalog.filter((item) => item.applied);
  if (applied.length === 0) return null;

  const rows = applied
    .map((item) => ({
      item,
      count: props.findings.filter((finding) =>
        finding.specializations.some((used) => used.name === item.name)
      ).length,
    }))
    .sort((left, right) => right.count - left.count);

  return (
    <section class='flex min-w-0 flex-col'>
      <SectionHead
        title='Detected surfaces'
        link={{ href: '/catalog', label: 'Catalog' }}
      />
      <ListCard>
        {rows.map(({ item, count }) => (
          <ListRow title={item.surfaced}>
            <span class='grid size-8.5 flex-none place-items-center rounded-sm bg-accent-soft text-[1.05rem] text-accent'>
              <SpecializationIcon name={item.name} />
            </span>
            <span class='min-w-0 flex-1 truncate text-[0.82rem] font-bold'>
              {item.label}
            </span>
            <span class='flex flex-none items-baseline gap-1.5'>
              <span
                class={`text-[0.8rem] font-bold tabular-nums ${count === 0 ? 'text-faint' : ''}`}
              >
                {count}
              </span>
              <span class='text-[0.76rem] text-muted'>
                {count === 1 ? 'finding' : 'findings'}
              </span>
            </span>
          </ListRow>
        ))}
      </ListCard>
    </section>
  );
};
