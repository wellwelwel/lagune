import type { IconName, SettingsTab } from '@/types/dashboard/client';
import type { ComponentType, VNode } from 'preact';
import { CHECKERS } from '@/core/checker-rules';
import { useLocation } from 'preact-iso';
import { useState } from 'preact/hooks';
import { BANNER_CHIP, PageHeader } from '../components/page-header';
import { Icon } from '../components/primitives/icons';
import { CategoriesTab } from '../components/settings/categories-tab';
import { HooksTab } from '../components/settings/hooks-tab';
import { initialTab, TabBar } from '../components/settings/tab-bar';
import { useData } from '../data/state';

const TAB_VIEW: Record<SettingsTab, ComponentType> = {
  categories: CategoriesTab,
  hooks: HooksTab,
};

const CountChip = (props: {
  icon: IconName;
  count: number;
  noun: string;
}): VNode => (
  <span class={BANNER_CHIP}>
    <span class='inline-flex text-white/80'>
      <Icon name={props.icon} />
    </span>
    <span class='tabular-nums'>{props.count}</span>
    {props.noun}
  </span>
);

const CategoriesChip = (): VNode => {
  const { used } = useData().categories;

  return (
    <CountChip
      icon='graduationCap'
      count={used.length}
      noun={used.length === 1 ? 'category' : 'categories'}
    />
  );
};

export const Settings = (): VNode => {
  const { query } = useLocation();
  const [tab, setTab] = useState<SettingsTab>(initialTab(query.tab));
  const View = TAB_VIEW[tab];

  return (
    <>
      <PageHeader
        background='https://lagune.ai/img/docs/banner-5.png'
        eyebrow='Configuration'
        title='Settings'
        description='Shape the knowledge Lagune draws on and what its hooks scan.'
        actions={
          tab === 'categories' ? (
            <CategoriesChip />
          ) : (
            <CountChip icon='sliders' count={CHECKERS.length} noun='hooks' />
          )
        }
      />

      <TabBar active={tab} onSelect={setTab} />

      <View key={tab} />
    </>
  );
};
