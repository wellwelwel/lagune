import type { VNode } from 'preact';
import { BANNER_CHIP, PageHeader } from '../components/page-header';
import { Icon } from '../components/primitives/icons';
import { CategoriesTab } from '../components/settings/categories-tab';
import { useData } from '../data/state';

export const Settings = (): VNode => {
  const { used } = useData().categories;

  return (
    <>
      <PageHeader
        background='https://lagune.ai/img/docs/banner-5.png'
        eyebrow='Configuration'
        title='Settings'
        description='Shape the security knowledge Lagune draws on for this project.'
        actions={
          <span class={BANNER_CHIP}>
            <span class='inline-flex text-white/80'>
              <Icon name='graduationCap' />
            </span>
            <span class='tabular-nums'>{used.length}</span>
            {used.length === 1 ? 'category' : 'categories'}
          </span>
        }
      />

      <CategoriesTab />
    </>
  );
};
