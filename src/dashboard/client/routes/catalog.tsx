import type { CatalogItem } from '@/types/dashboard/dashboard';
import type { VNode } from 'preact';
import {
  builtinNames,
  ENGINE_COMMAND,
  LOAD_VERB,
  specializationCategories,
  specializationDescription,
  specializationLabel,
  specializationLoadPrompt,
  specializationPromptSpec,
} from '@/dashboard/shared/specialization-meta';
import { SpecializationIcon } from '../components/findings/specialization-icon';
import { BannerButton, PageHeader } from '../components/page-header';
import { CopyButton } from '../components/primitives/copy-button';
import { Icon } from '../components/primitives/icons';
import { MaskIcon } from '../components/primitives/mask-icon';
import { PromptPreview } from '../components/prompt/preview';
import { useData } from '../data/state';
import { BADGE, classes, MICRO_LABEL } from '../utils/tailwind-classes';

const SpecializationCard = ({
  item,
  seed,
}: {
  item: CatalogItem;
  seed: number;
}): VNode => {
  const data = useData();
  const used = new Set(data.categories.used);

  return (
    <article
      class={classes(
        'group/eg-host flex flex-col overflow-hidden rounded-lg',
        item.inCatalog
          ? 'bg-surface shadow-card'
          : 'border border-dashed border-line-2 bg-surface/50'
      )}
    >
      <header class='flex items-center gap-3 p-4.5 pb-3.5'>
        <span
          class={classes(
            'grid size-8 flex-none place-items-center rounded-md text-[1rem] ring-1 ring-offset-2 ring-offset-surface',
            item.applied
              ? 'bg-accent-soft text-accent ring-accent/15'
              : 'bg-surface-2 text-faint ring-line-2'
          )}
        >
          <SpecializationIcon name={item.name} />
        </span>
        <h3
          class={classes(
            'min-w-0 flex-1 truncate text-[0.9rem] font-bold tracking-[-0.01em]',
            item.applied ? 'text-accent' : 'text-ink-2'
          )}
        >
          {item.label}
        </h3>
        {item.applied && (
          <span
            class={`${BADGE} flex-none font-bold uppercase tracking-[0.03em] bg-accent-soft text-accent`}
          >
            Applied
          </span>
        )}
      </header>
      <p
        class={classes(
          'px-4.5 text-[0.82rem] leading-normal',
          item.applied ? 'text-muted' : 'text-faint'
        )}
      >
        {specializationDescription(item.name)}
      </p>
      <div class='flex flex-1 items-end justify-between gap-3 px-4.5 pt-3 pb-4.5'>
        <div class='flex flex-wrap items-end content-end gap-1.5'>
          {specializationCategories(item.name).map((category) => (
            <span
              class={classes(
                'group/chip relative grid size-8 place-items-center rounded-sm',
                used.has(category.key)
                  ? 'bg-accent-soft text-accent'
                  : 'bg-surface-2 text-faint'
              )}
            >
              <MaskIcon src={category.icon} class='size-4 bg-current' />
              <span class='pointer-events-none absolute bottom-[calc(100%+0.375rem)] left-1/2 -translate-x-1/2 translate-y-1 scale-95 whitespace-nowrap rounded-sm bg-dark px-2 py-1 text-[0.68rem] font-bold text-white opacity-0 transition-[opacity,scale,translate] duration-200 ease-house group-hover/chip:translate-y-0 group-hover/chip:scale-100 group-hover/chip:opacity-100'>
                {category.label}
              </span>
            </span>
          ))}
        </div>
        <PromptPreview spec={specializationPromptSpec(item)} seed={seed} />
      </div>
      {item.inCatalog ? (
        <div class='flex items-center border-t border-line bg-surface-2 py-0.5 pr-1 pl-4.5'>
          <span class='flex min-w-0 flex-1 items-baseline gap-1.5 text-[0.72rem] leading-none font-semibold text-[#6b737a] dark:text-muted'>
            <span class='flex-none'>{LOAD_VERB}</span>
            <code class='flex min-w-0 rounded-[5px] border-0 bg-surface px-1.5 py-px font-mono text-[0.72rem] leading-4 text-inherit dark:bg-surface-3'>
              <span class='min-w-0 truncate'>{ENGINE_COMMAND}</span>
              <span class='flex-none whitespace-pre'> catalog {item.name}</span>
            </code>
          </span>
          <CopyButton
            text={specializationLoadPrompt(item.name)}
            label={`Copy the prompt that loads ${item.label}`}
          />
        </div>
      ) : (
        <a
          class='flex items-center gap-2 border-t border-dashed border-line-2 px-4.5 py-2.75 text-[0.72rem] font-bold text-faint no-underline transition-colors hover:text-accent'
          href='/settings'
        >
          <span class='inline-flex flex-none text-[0.9rem]'>
            <Icon name='package' />
          </span>
          <span class='flex-1'>Not in this project's categories</span>
          <span class='inline-flex flex-none text-[0.8rem]'>
            <Icon name='arrowUpRight' />
          </span>
        </a>
      )}
    </article>
  );
};

const SpecializationGrid = ({
  items,
  seedOffset,
}: {
  items: CatalogItem[];
  seedOffset: number;
}): VNode => (
  <div class='grid grid-cols-2 gap-4 min-[1720px]:grid-cols-3'>
    {items.map((item, index) => (
      <SpecializationCard item={item} seed={seedOffset + index} />
    ))}
  </div>
);

export const Catalog = (): VNode => {
  const data = useData();
  const applied = data.catalog.filter((item) => item.applied);
  const rest = data.catalog.filter((item) => !item.applied);
  const listed = new Set(data.catalog.map((item) => item.name));
  const elsewhere: CatalogItem[] = builtinNames()
    .filter((name) => !listed.has(name))
    .map((name) => ({
      name,
      label: specializationLabel(name),
      applied: false,
      inCatalog: false,
    }));

  return (
    <>
      <PageHeader
        background='https://lagune.ai/img/docs/banner-4.png'
        eyebrow='Knowledge'
        title='Catalog'
        description="The specializations detect applied, the rest of the project's catalog, and the built-ins its categories leave out."
        actions={<BannerButton href='/settings' label='Manage categories' />}
      />
      <div class='route-rise flex flex-col gap-6'>
        {applied.length > 0 && (
          <section class='flex flex-col gap-3'>
            <h2 class={MICRO_LABEL}>Applied</h2>
            <SpecializationGrid items={applied} seedOffset={0} />
          </section>
        )}
        {rest.length > 0 && (
          <section class='flex flex-col gap-3'>
            <h2 class={MICRO_LABEL}>In use</h2>
            <SpecializationGrid items={rest} seedOffset={applied.length} />
          </section>
        )}
        {elsewhere.length > 0 && (
          <section class='flex flex-col gap-3'>
            <h2 class={MICRO_LABEL}>In other categories</h2>
            <SpecializationGrid
              items={elsewhere}
              seedOffset={applied.length + rest.length}
            />
          </section>
        )}
      </div>
    </>
  );
};
