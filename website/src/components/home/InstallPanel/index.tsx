import type { PointerEvent } from 'react';
import { CopyButton } from '@site/src/components/home/CopyButton';
import { GroupHead } from '@site/src/components/home/GroupHead';
import { MaskIcon } from '@site/src/components/MaskIcon';
import {
  selectableCard,
  selectableTint,
} from '@site/src/components/selectable';
import { ALL_CATEGORIES } from '@site/src/data/categories';
import { memo, useMemo } from 'react';
import { LuChevronRight, LuLayoutGrid } from 'react-icons/lu';

const SKILLS_ADD = 'npx skills add wellwelwel/lagune';
const CATEGORIES_ADD = 'npx --yes lagune@latest add';

const clampTip = (event: PointerEvent<HTMLButtonElement>) => {
  const wrap = event.currentTarget;
  const tip = wrap.lastElementChild;
  const strip = wrap.parentElement;

  if (!(tip instanceof HTMLElement) || strip === null) return;

  const bounds = strip.getBoundingClientRect();
  const anchor = wrap.getBoundingClientRect();
  const center = anchor.left + anchor.width / 2;
  const overflowLeft = bounds.left - (center - tip.offsetWidth / 2);
  const overflowRight = bounds.right - (center + tip.offsetWidth / 2);

  tip.style.setProperty(
    '--tip-shift',
    `${overflowLeft > 0 ? overflowLeft : Math.min(overflowRight, 0)}px`
  );
};

const InstallPanelComponent = ({
  onOpenCategories,
  onToggleCategory,
  chosen,
}: {
  onOpenCategories: () => void;
  onToggleCategory: (key: string) => void;
  chosen: string[];
}) => {
  const orderedCategories = useMemo(
    () =>
      chosen
        .map((key) => ALL_CATEGORIES.find((category) => category.key === key))
        .filter((category) => category !== undefined),
    [chosen]
  );

  const commands = useMemo(
    () => [
      SKILLS_ADD,
      ...(orderedCategories.length > 0
        ? [
            `${CATEGORIES_ADD} --categories ${orderedCategories.map((category) => category.key).join(' ')}`,
          ]
        : []),
    ],
    [orderedCategories]
  );

  return (
    <div className='flex flex-col min-w-0'>
      <GroupHead title='Choose categories' meta='Optional' />

      <div className='flex flex-wrap items-center gap-3 mb-[22px]'>
        {ALL_CATEGORIES.map((category) => {
          const on = chosen.includes(category.key);

          return (
            <button
              key={category.key}
              type='button'
              role='checkbox'
              aria-checked={on}
              aria-label={category.name}
              onClick={(event) => {
                onToggleCategory(category.key);
                event.currentTarget.focus({ preventScroll: true });
              }}
              onPointerEnter={clampTip}
              className='group/chip relative flex after:absolute after:top-1/2 after:left-1/2 after:size-8 after:-translate-x-1/2 after:-translate-y-1/2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
            >
              <MaskIcon
                src={category.icon}
                className={`size-5 bg-current transition-colors duration-200 ease-out ${selectableTint(on)}`}
              />
              <span
                aria-hidden
                className='pointer-events-none absolute bottom-[calc(100%+0.375rem)] left-[calc(50%+var(--tip-shift,0px))] -translate-x-1/2 translate-y-1 scale-95 whitespace-nowrap rounded-chip bg-dark px-2 py-1 text-[0.68rem] font-bold text-white opacity-0 transition-[opacity,scale,translate] duration-200 ease-[cubic-bezier(0.2,0,0,1)] group-hover/chip:translate-y-0 group-hover/chip:scale-100 group-hover/chip:opacity-100 group-focus-visible/chip:translate-y-0 group-focus-visible/chip:scale-100 group-focus-visible/chip:opacity-100 pointer-coarse:group-focus/chip:translate-y-0 pointer-coarse:group-focus/chip:scale-100 pointer-coarse:group-focus/chip:opacity-100'
              >
                {category.name}
              </span>
            </button>
          );
        })}
        <span className='hidden w-full max-[600px]:block' aria-hidden />
        <button
          type='button'
          onClick={onOpenCategories}
          className={`flex items-center gap-3 p-[12px_14px] ml-auto max-[600px]:ml-0 ${selectableCard(false)}`}
        >
          <span
            className={`shrink-0 size-5 flex items-center justify-center [&>svg]:size-5 ${selectableTint(false)}`}
          >
            <LuLayoutGrid aria-hidden />
          </span>
          <span className='text-[13.5px] font-semibold tracking-[-0.01em] whitespace-nowrap'>
            Select
          </span>
          <LuChevronRight
            className={`shrink-0 size-[18px] ${selectableTint(false)}`}
            aria-hidden
          />
        </button>
      </div>

      <GroupHead title='Run this' />

      <div className='flex items-center gap-3 p-[15px_16px] rounded-[14px] border border-line bg-[rgba(6,7,9,0.5)] font-mono text-[13px]'>
        <span className='flex flex-1 min-w-0 flex-col gap-1.5'>
          <span className='flex min-w-0 gap-3'>
            <span className='select-none text-accent' aria-hidden>
              $
            </span>
            <code className='flex-1 min-w-0 text-ink overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
              {SKILLS_ADD}
            </code>
          </span>
          {orderedCategories.length > 0 && (
            <span className='flex min-w-0 gap-3'>
              <span className='select-none text-accent' aria-hidden>
                $
              </span>
              <code className='flex-1 min-w-0 text-ink overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
                {CATEGORIES_ADD}{' '}
                <span className='lagune-token-in text-muted'>--categories</span>
                {orderedCategories.map((category) => (
                  <span key={category.key}>
                    {' '}
                    <span className='lagune-token-in text-[#5191ff]'>
                      {category.key}
                    </span>
                  </span>
                ))}
              </code>
            </span>
          )}
        </span>
        <CopyButton
          value={commands.join(' && ')}
          label='Copy install command'
        />
      </div>

      <p className='mx-1 mt-6 text-[12px] leading-[1.6] text-muted [text-wrap:pretty]'>
        Then run <code>/lagune.charter</code> in your agent: with no category
        chosen, it records the ones its reading of your project supports.
      </p>

      <p className='mx-1 mt-3 text-[12px] leading-[1.6] text-muted'>
        All product names, trademarks, and registered trademarks mentioned are
        the property of their respective owners and are used for identification
        purposes only.
      </p>
    </div>
  );
};

export const InstallPanel = memo(InstallPanelComponent);
