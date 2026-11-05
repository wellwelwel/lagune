import type { SettingsTab, SettingsTabItem } from '@/types/dashboard/client';
import type { VNode } from 'preact';
import { Tabs } from '../primitives/tabs';

const SETTINGS_TABS: SettingsTabItem[] = [
  { key: 'categories', label: 'Categories', icon: 'graduationCap' },
  { key: 'hooks', label: 'Hooks', icon: 'sliders' },
];

const isSettingsTab = (value: string | undefined): value is SettingsTab =>
  SETTINGS_TABS.some((item) => item.key === value);

export const initialTab = (value: string | undefined): SettingsTab =>
  isSettingsTab(value) ? value : 'categories';

export const TabBar = (props: {
  active: SettingsTab;
  onSelect: (tab: SettingsTab) => void;
}): VNode => (
  <div class='route-fade mb-5'>
    <Tabs
      items={SETTINGS_TABS}
      active={props.active}
      onSelect={(key) => isSettingsTab(key) && props.onSelect(key)}
    />
  </div>
);
