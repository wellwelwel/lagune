import type { VNode } from 'preact';
import { MAX_PATTERN_LENGTH } from '@/core/checker-rules';
import { useState } from 'preact/hooks';
import { readNewPattern, sweepsEverything } from '../../domain/hook-settings';
import { BADGE, CARD, classes } from '../../utils/tailwind-classes';
import { Icon } from '../primitives/icons';
import { ListRow } from '../primitives/list-card';

const PatternRow = (props: {
  pattern: string;
  editable: boolean;
  disabled: boolean;
  onRemove: () => void;
}): VNode => (
  <ListRow title={props.pattern}>
    <span
      class={classes(
        'min-w-0 flex-1 truncate font-mono text-[0.8rem] font-semibold',
        props.editable ? 'text-ink-2' : 'text-faint'
      )}
    >
      {props.pattern}
    </span>
    {sweepsEverything(props.pattern) && (
      <span class={`${BADGE} flex-none font-bold bg-amber-soft text-amber`}>
        Ignores almost everything
      </span>
    )}
    {props.editable && (
      <button
        class="relative -my-1.5 -mr-2 grid size-8 flex-none cursor-pointer place-items-center rounded-md border-0 bg-transparent text-[0.95rem] text-faint transition-colors duration-200 after:absolute after:-inset-1 after:content-[''] hover:text-red disabled:cursor-default"
        type='button'
        aria-label={`Stop ignoring ${props.pattern}`}
        disabled={props.disabled}
        onClick={props.onRemove}
      >
        <Icon name='x' />
      </button>
    )}
  </ListRow>
);

const PatternField = (props: {
  patterns: readonly string[];
  disabled: boolean;
  onAdd: (pattern: string) => void;
}): VNode => {
  const [entry, setEntry] = useState('');
  const [problem, setProblem] = useState<string | null>(null);
  const typed = entry.trim();

  const add = () => {
    if (typed === '' || props.disabled) return;

    const read = readNewPattern(props.patterns, typed);

    if ('problem' in read) return setProblem(read.problem);

    props.onAdd(read.pattern);
    setEntry('');
  };

  return (
    <div class='mt-3'>
      <div class='flex gap-2.5'>
        <label
          class={classes(
            'flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-lg border bg-surface pr-3.5 pl-4.25 transition-[border-color] duration-200',
            problem === null
              ? 'border-line-2 focus-within:border-accent/45'
              : 'border-red/45'
          )}
        >
          <span class='inline-flex text-[1.1rem] text-faint'>
            <Icon name='plus' />
          </span>
          <input
            class='min-w-0 flex-1 border-0 bg-transparent font-mono text-[0.82rem] text-ink outline-none placeholder:font-body placeholder:text-faint'
            type='text'
            placeholder='A path or pattern, like test/fixtures'
            aria-label='Path or pattern to ignore'
            aria-invalid={problem !== null}
            aria-describedby={problem === null ? undefined : 'pattern-problem'}
            autocomplete='off'
            spellcheck={false}
            maxLength={MAX_PATTERN_LENGTH}
            disabled={props.disabled}
            value={entry}
            onInput={(event) => {
              setEntry(event.currentTarget.value);
              setProblem(null);
            }}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return;

              event.preventDefault();
              add();
            }}
          />
        </label>
        <button
          class='flex h-11 flex-none items-center rounded-lg border-0 bg-accent-soft px-4.5 text-[0.82rem] font-bold text-accent transition-[background-color,color,opacity] duration-200 enabled:cursor-pointer enabled:hover:bg-accent enabled:hover:text-white disabled:opacity-50'
          type='button'
          disabled={typed === '' || props.disabled}
          onClick={add}
        >
          Ignore
        </button>
      </div>
      {problem !== null && (
        <p id='pattern-problem' class='mt-2 text-[0.76rem] text-red'>
          {problem}
        </p>
      )}
    </div>
  );
};

export const IgnoreList = (props: {
  patterns: readonly string[];
  editable: boolean;
  disabled: boolean;
  onChange: (patterns: readonly string[]) => void;
}): VNode => (
  <>
    {props.patterns.length > 0 ? (
      <div class={`overflow-hidden ${CARD}`}>
        {props.patterns.map((pattern) => (
          <PatternRow
            key={pattern}
            pattern={pattern}
            editable={props.editable}
            disabled={props.disabled}
            onRemove={() =>
              props.onChange(props.patterns.filter((kept) => kept !== pattern))
            }
          />
        ))}
      </div>
    ) : (
      <p class='rounded-lg border border-dashed border-line-2 px-4.5 py-4.5 text-center text-[0.8rem] text-faint'>
        No ignored paths.
      </p>
    )}
    {props.editable && (
      <PatternField
        patterns={props.patterns}
        disabled={props.disabled}
        onAdd={(pattern) => props.onChange([...props.patterns, pattern])}
      />
    )}
  </>
);
