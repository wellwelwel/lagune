import type { InstallTab } from '@site/src/data/home';
import type { Token } from 'prism-react-renderer';
import type { KeyboardEvent } from 'react';
import { translate } from '@docusaurus/Translate';
import { CopyButton } from '@site/src/components/home/CopyButton';
import { TERMINAL_SURFACE } from '@site/src/components/home/PromptCard';
import { rovingIndex } from '@site/src/components/rovingIndex';
import { Tallest } from '@site/src/components/Tallest';
import { INSTALL_TABS } from '@site/src/data/home';
import { laguneCode } from '@site/src/prism/lagune';
import { Highlight } from 'prism-react-renderer';
import { memo, useId, useLayoutEffect, useRef, useState } from 'react';

type Bar = {
  left: number;
  width: number;
};

const BAR_BASE = 100;

const RESTING_BAR =
  'after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-accent';

const tabClass = (selected: boolean, resting: boolean): string =>
  `relative inline-flex h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-[13px] font-semibold tracking-[-0.01em] whitespace-nowrap transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${
    selected ? 'text-ink' : 'text-faint hover:text-ink'
  } ${resting ? RESTING_BAR : ''}`;

/* The offsets are physical, while the RTL build mirrors the sides set by class. */
const barUnder = (tab: HTMLElement): Bar => {
  const { paddingLeft, paddingRight } = getComputedStyle(tab);
  const left = tab.offsetLeft + parseFloat(paddingLeft);
  const right = tab.offsetLeft + tab.offsetWidth - parseFloat(paddingRight);

  return { left, width: right - left };
};

const tabLabel = ({ label, agent }: InstallTab): string => label ?? agent.name;

const tokenClass = ({ types }: Token): string | undefined =>
  types.includes('plain') ? undefined : 'whitespace-nowrap';

const Command = ({ code }: { code: string }) => (
  <Highlight theme={laguneCode} code={code} language='bash'>
    {({ tokens, getTokenProps }) => (
      <pre
        translate='no'
        className='m-0 overflow-visible rounded-none bg-transparent p-0 [font-family:var(--font-mono)] text-[14px] font-bold leading-[1.65] text-ink whitespace-pre-wrap wrap-break-word'
      >
        {tokens.map((line, lineIndex) => (
          <span key={lineIndex} className='block'>
            {line.map((token, tokenIndex) => (
              <span
                key={tokenIndex}
                {...getTokenProps({ token, className: tokenClass(token) })}
              />
            ))}
          </span>
        ))}
      </pre>
    )}
  </Highlight>
);

const COMMANDS = INSTALL_TABS.map(({ command }) => <Command code={command} />);

const InstallTabsComponent = () => {
  const [picked, setPicked] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [bar, setBar] = useState<Bar | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const baseId = useId();
  const current = picked ?? 0;
  const marked = hovered ?? current;
  const shown = INSTALL_TABS[current];
  const panelId = `${baseId}panel`;
  const tabId = (index: number) => `${baseId}tab${index}`;

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = rovingIndex(
      event.key,
      current,
      INSTALL_TABS.length,
      'horizontal'
    );

    if (next === null) return;

    const tab =
      event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')[next];

    event.preventDefault();
    setPicked(next);
    tab.focus();
  };

  useLayoutEffect(() => {
    const list = listRef.current;

    if (!list) return;

    const tab = list.querySelectorAll<HTMLElement>('[role="tab"]')[marked];
    const place = () => setBar(barUnder(tab));
    const observer = new ResizeObserver(place);

    place();
    observer.observe(list);

    return () => observer.disconnect();
  }, [marked]);

  return (
    <div className={`@container ${TERMINAL_SURFACE}`}>
      <div className='lagune-scroll-fade overflow-x-auto px-1.5 border-b border-white/[0.06] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
        <div
          ref={listRef}
          role='tablist'
          aria-label={translate({
            id: 'home.install.tabs',
            message: 'Install commands',
            description:
              'The accessible name of the tabs that switch the install command shown on the home page, one tab per agent',
          })}
          onKeyDown={onKeyDown}
          onMouseLeave={() => setHovered(null)}
          className='relative flex w-fit'
        >
          {INSTALL_TABS.map((tab, index) => (
            <button
              key={tabLabel(tab)}
              id={tabId(index)}
              type='button'
              role='tab'
              aria-selected={index === current}
              aria-controls={panelId}
              tabIndex={index === current ? 0 : -1}
              onClick={() => setPicked(index)}
              onMouseEnter={() => setHovered(index)}
              className={tabClass(index === current, index === current && !bar)}
            >
              <img
                src={tab.logo}
                alt=''
                width={16}
                height={16}
                decoding='async'
                className='size-4 shrink-0'
              />
              <span className='@max-[650px]:sr-only'>{tabLabel(tab)}</span>
            </button>
          ))}
          {bar && (
            <span
              className='pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-accent transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'
              style={{
                left: 0,
                transformOrigin: 'left',
                width: BAR_BASE,
                transform: `translateX(${bar.left}px) scaleX(${bar.width / BAR_BASE})`,
              }}
              aria-hidden
            />
          )}
        </div>
      </div>

      <div
        id={panelId}
        role='tabpanel'
        aria-labelledby={tabId(current)}
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
