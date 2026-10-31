import type { Category } from '@site/src/data/categories';
import type { ReactNode } from 'react';
import { CopyButton } from '@site/src/components/home/CopyButton';
import { IconSwap, SWAP_TIMING } from '@site/src/components/IconSwap';
import { ALL_CATEGORIES, CATEGORIES_ADD } from '@site/src/data/categories';
import clsx from 'clsx';
import { useCallback, useState } from 'react';
import { LuCheck } from 'react-icons/lu';
import {
  AgentTile,
  CARD,
  CARD_DESCRIPTION,
  CARD_GRID,
  CARD_TITLE,
} from '../AgentPicker';

const LABEL = 'text-[0.7rem] font-bold uppercase tracking-[0.09em] text-faint';

const CategoryCard = ({
  category,
  on,
  onToggle,
}: {
  category: Category;
  on: boolean;
  onToggle: (key: string) => void;
}): ReactNode => (
  <button
    type='button'
    role='checkbox'
    aria-checked={on}
    onClick={() => onToggle(category.key)}
    className={clsx(
      CARD,
      SWAP_TIMING,
      'cursor-pointer bg-surface text-left [font:inherit] shadow-card-half hover:shadow-pop focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-checked:border-accent/50 aria-checked:bg-accent-100'
    )}
  >
    <span className='flex items-center gap-3'>
      <AgentTile
        icon={category.icon}
        className={clsx(
          'transition-[background-color,color] group-aria-checked:bg-accent-soft group-aria-checked:text-accent',
          SWAP_TIMING
        )}
      />
      <span className={clsx(CARD_TITLE, 'min-w-0 flex-1')}>
        {category.name}
      </span>
      <IconSwap
        on={on}
        className='size-4.5 shrink-0'
        active={
          <span className='grid size-4.5 place-items-center rounded-[5px] bg-accent text-white docs-dark:bg-accent-3'>
            <LuCheck className='block size-3.5 stroke-3' />
          </span>
        }
        inactive={
          <span className='block size-4.5 rounded-[5px] border border-line-2 bg-surface' />
        }
      />
    </span>
    <span className={CARD_DESCRIPTION}>{category.description}</span>
  </button>
);

export const CategoryPicker = (): ReactNode => {
  const [chosen, setChosen] = useState<string[]>(['owasp']);

  const toggle = useCallback(
    (key: string) =>
      setChosen((current) =>
        current.includes(key)
          ? current.filter((entry) => entry !== key)
          : [...current, key]
      ),
    []
  );

  return (
    <div className='@container font-jakarta text-base'>
      <span className={clsx(LABEL, 'mb-3 flex flex-wrap gap-x-2')}>
        <span>Choose categories</span>
        <span className='text-faint/60'>Optional</span>
      </span>
      <div className={clsx(CARD_GRID, 'mb-6 @4xl:grid-cols-3')}>
        {ALL_CATEGORIES.map((category) => (
          <CategoryCard
            key={category.key}
            category={category}
            on={chosen.includes(category.key)}
            onToggle={toggle}
          />
        ))}
      </div>
      <span className={clsx(LABEL, 'mb-3 block')}>Run this</span>
      <div className='lagune-terminal mb-(--ifm-leading) flex items-center gap-3 rounded-[14px] border border-line bg-canvas p-[15px_16px] font-mono text-[13px] leading-[1.65] text-ink'>
        <span className='select-none text-accent' aria-hidden>
          $
        </span>
        <code className='lagune-scroll-fade min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          {CATEGORIES_ADD}{' '}
          <span className='lagune-token-in text-muted'>--categories</span>
          {chosen.map((key) => (
            <span key={key}>
              {' '}
              <span className='lagune-token-in text-[#5191ff]'>{key}</span>
            </span>
          ))}
        </code>
        <CopyButton
          value={[`${CATEGORIES_ADD} --categories`, ...chosen].join(' ')}
          label='Copy the command'
        />
      </div>
    </div>
  );
};
