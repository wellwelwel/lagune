import type { TabItem } from '@site/src/components/tabs';
import { panelIdOf, tabIdOf, tabKeyDown } from '@site/src/components/tabs';
import { useScrollFade } from '@site/src/components/useScrollFade';
import { useLayoutEffect, useRef, useState } from 'react';

type Bar = {
  left: number;
  width: number;
};

type TabBarProps = {
  id: string;
  label: string;
  items: TabItem[];
  current: number;
  onPick: (index: number) => void;
  labelClassName?: string;
};

const BAR_BASE = 100;

const TAB_HEIGHT = 'h-11';

/* The surface's 1px inset highlight covers the bar's top row. */
const BAR_EDGE = 'pt-px border-b border-white/[0.06]';

const LABEL = '[text-box:trim-both_cap_alphabetic]';

const RESTING_BAR =
  'after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-accent';

const tabClass = (selected: boolean, resting: boolean): string =>
  `relative inline-flex ${TAB_HEIGHT} shrink-0 items-center gap-2 rounded-lg px-3 text-[13px] font-semibold tracking-[-0.01em] whitespace-nowrap transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${
    selected ? 'text-ink' : 'text-faint hover:text-ink'
  } ${resting ? RESTING_BAR : ''}`;

/* The offsets are physical, while the RTL build mirrors the sides set by class. */
const barUnder = (tab: HTMLElement): Bar => {
  const { paddingLeft, paddingRight } = getComputedStyle(tab);
  const left = tab.offsetLeft + parseFloat(paddingLeft);
  const right = tab.offsetLeft + tab.offsetWidth - parseFloat(paddingRight);

  return { left, width: right - left };
};

export const TabBarSpacer = () => (
  <div className={`${TAB_HEIGHT} box-content ${BAR_EDGE}`} />
);

export const TabBar = ({
  id,
  label,
  items,
  current,
  onPick,
  labelClassName,
}: TabBarProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [bar, setBar] = useState<Bar | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const marked = hovered ?? current;

  useScrollFade(scrollRef);

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
    <div
      ref={scrollRef}
      className={`lagune-scroll-fade overflow-x-auto px-1.5 ${BAR_EDGE} [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
    >
      <div
        ref={listRef}
        role='tablist'
        aria-label={label}
        onKeyDown={tabKeyDown(current, items.length, onPick)}
        onMouseLeave={() => setHovered(null)}
        className='relative flex w-fit'
      >
        {items.map((item, index) => (
          <button
            key={item.label}
            id={tabIdOf(id, index)}
            type='button'
            role='tab'
            aria-selected={index === current}
            aria-controls={panelIdOf(id)}
            tabIndex={index === current ? 0 : -1}
            onClick={() => onPick(index)}
            onMouseEnter={() => setHovered(index)}
            className={tabClass(index === current, index === current && !bar)}
          >
            {item.icon}
            <span className={`${LABEL} ${labelClassName ?? ''}`}>
              {item.label}
            </span>
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
  );
};
