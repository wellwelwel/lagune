import type { SegmentOption } from '@/types/dashboard/client';
import type { VNode } from 'preact';
import { classes } from '../../utils/tailwind-classes';

export const Segmented = <Key extends string>(props: {
  label: string;
  options: SegmentOption<Key>[];
  value: Key;
  disabled?: boolean;
  onChange: (key: Key) => void;
}): VNode => (
  <div
    class='inline-flex flex-none gap-1 rounded-md bg-surface p-1 shadow-card-half'
    role='radiogroup'
    aria-label={props.label}
  >
    {props.options.map((option) => {
      const on = option.key === props.value;

      return (
        <button
          key={option.key}
          class={classes(
            "relative h-8 rounded-[6px] px-3.5 text-[0.78rem] font-bold whitespace-nowrap transition-[background-color,color] duration-200 after:absolute after:inset-x-0 after:-inset-y-1 after:content-[''] disabled:cursor-default",
            on
              ? 'bg-accent-soft text-accent'
              : 'cursor-pointer text-muted hover:text-ink-2'
          )}
          type='button'
          role='radio'
          aria-checked={on}
          disabled={props.disabled}
          onClick={() => props.onChange(option.key)}
        >
          {option.label}
        </button>
      );
    })}
  </div>
);
