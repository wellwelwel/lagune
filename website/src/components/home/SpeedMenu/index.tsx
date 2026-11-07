import type { KeyboardEvent, ReactNode } from 'react';
import { translate } from '@docusaurus/Translate';
import { rovingIndex } from '@site/src/components/rovingIndex';
import { useDismiss } from '@site/src/components/useDismiss';
import { useEffect, useId, useRef, useState } from 'react';
import { LuCheck, LuSettings } from 'react-icons/lu';

type SpeedMenuProps = {
  speed: number;
  onSpeed: (speed: number) => void;
};

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const ITEM_SELECTOR = '[role="menuitemradio"]';

export const CONTROL_BUTTON =
  'relative inline-flex shrink-0 items-center justify-center rounded-[10px] text-ink transition-colors duration-200 ease-out hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent';

const speedLabel = (speed: number): string =>
  speed === 1
    ? translate({
        id: 'home.demo.speed.normal',
        message: 'Normal',
        description:
          'The playback speed option that plays the animated AI chat on the home page at its own pace',
      })
    : `${speed}×`;

export const SpeedMenu = ({ speed, onSpeed }: SpeedMenuProps): ReactNode => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuId = useId();
  const label = translate({
    id: 'home.demo.speed',
    message: 'Playback speed',
    description:
      'The accessible name of the button and menu that change how fast the animated AI chat plays on the home page',
  });

  useDismiss(open, rootRef, setOpen);

  useEffect(() => {
    if (!open) return;

    const items = rootRef.current?.querySelectorAll<HTMLElement>(ITEM_SELECTOR);

    items?.[SPEEDS.indexOf(speed)]?.focus();
  }, [open, speed]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const choose = (next: number) => {
    onSpeed(next);
    close();
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();

      return;
    }

    if (event.key === 'Tab') {
      setOpen(false);

      return;
    }

    const items = [
      ...event.currentTarget.querySelectorAll<HTMLElement>(ITEM_SELECTOR),
    ];
    const focused = items.findIndex((item) => item === document.activeElement);
    const next = rovingIndex(event.key, focused, items.length, 'vertical');

    if (next === null) return;

    event.preventDefault();
    items[next].focus();
  };

  return (
    <div ref={rootRef} className='relative'>
      <button
        ref={triggerRef}
        type='button'
        aria-label={label}
        aria-haspopup='menu'
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}
        className={`${CONTROL_BUTTON} size-10 [&_svg]:size-5`}
      >
        <LuSettings
          className={`transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${open ? 'rotate-45' : ''}`}
        />
      </button>
      {open && (
        <div
          id={menuId}
          role='menu'
          aria-label={label}
          onKeyDown={onMenuKeyDown}
          className='lagune-fade-in absolute right-0 bottom-full z-20 mb-2 flex w-44 flex-col gap-0.5 rounded-2xl border border-white/10 bg-[rgba(10,15,31,0.96)] p-1.5 [backdrop-filter:blur(16px)_saturate(150%)] [-webkit-backdrop-filter:blur(16px)_saturate(150%)] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.08),0_20px_48px_-16px_rgba(0,0,0,0.6)]'
        >
          <span
            className='px-2.5 pt-1.5 pb-1 text-[11px] font-semibold tracking-[0.06em] uppercase text-faint'
            aria-hidden
          >
            {label}
          </span>
          {SPEEDS.map((option) => (
            <button
              key={option}
              type='button'
              role='menuitemradio'
              aria-checked={option === speed}
              tabIndex={-1}
              onClick={() => choose(option)}
              className='flex h-10 items-center justify-between rounded-[10px] px-2.5 text-[13px] font-medium text-ink tabular-nums transition-colors duration-200 ease-out hover:bg-white/[0.07] focus-visible:bg-white/[0.07] focus-visible:outline-none'
            >
              {speedLabel(option)}
              {option === speed && (
                <LuCheck className='size-4 text-accent' aria-hidden />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
