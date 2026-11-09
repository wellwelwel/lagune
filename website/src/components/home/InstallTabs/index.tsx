import type { TabItem } from '@site/src/components/tabs';
import type { InstallTab } from '@site/src/data/home';
import { translate } from '@docusaurus/Translate';
import { CopyButton } from '@site/src/components/home/CopyButton';
import { HighlightedCode } from '@site/src/components/home/HighlightedCode';
import { TERMINAL_SURFACE } from '@site/src/components/home/PromptCard';
import { TabBar } from '@site/src/components/home/TabBar';
import { panelIdOf, tabIdOf } from '@site/src/components/tabs';
import { Tallest } from '@site/src/components/Tallest';
import { INSTALL_TABS } from '@site/src/data/home';
import { memo, useId } from 'react';

type InstallTabsProps = {
  picked: number | null;
  onPick: (index: number) => void;
};

const tabLabel = ({ label, agent }: InstallTab): string => label ?? agent.name;

const Command = ({ code }: { code: string }) => (
  <HighlightedCode
    code={code}
    language='bash'
    translate='no'
    className='text-[14px] font-bold'
  />
);

const TABS: TabItem[] = INSTALL_TABS.map((tab) => ({
  label: tabLabel(tab),
  icon: (
    <img
      src={tab.logo}
      alt=''
      width={16}
      height={16}
      decoding='async'
      className='size-4 shrink-0'
    />
  ),
}));

const COMMANDS = INSTALL_TABS.map(({ command }) => <Command code={command} />);

const InstallTabsComponent = ({ picked, onPick }: InstallTabsProps) => {
  const baseId = useId();
  const current = picked ?? 0;
  const shown = INSTALL_TABS[current];

  return (
    <div className={`@container ${TERMINAL_SURFACE}`}>
      <TabBar
        id={baseId}
        label={translate({
          id: 'home.install.tabs',
          message: 'Install commands',
          description:
            'The accessible name of the tabs that switch the install command shown on the home page, one tab per agent',
        })}
        items={TABS}
        current={current}
        onPick={onPick}
        labelClassName='@max-[650px]:sr-only'
      />

      <div
        id={panelIdOf(baseId)}
        role='tabpanel'
        aria-labelledby={tabIdOf(baseId, current)}
        className='flex items-start gap-3 px-[18px] pt-3.5 pb-4'
      >
        <Tallest variants={COMMANDS} className='min-w-0 flex-1'>
          <div
            key={current}
            className={picked === null ? undefined : 'lagune-fade-in'}
          >
            <Command code={shown.command} />
          </div>
        </Tallest>
        <CopyButton
          value={shown.command}
          filled
          label={translate(
            {
              id: 'home.install.copy',
              message: 'Copy the {agent} install command',
              description:
                'The label of the button that copies the install command shown on the home page, where {agent} is the agent',
            },
            { agent: tabLabel(shown) }
          )}
        />
      </div>
    </div>
  );
};

export const InstallTabs = memo(InstallTabsComponent);
