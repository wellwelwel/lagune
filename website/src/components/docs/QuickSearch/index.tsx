import type { KeyboardEvent, ReactNode } from 'react';
import { useHistory } from '@docusaurus/router';
import Translate, { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { useDocsData } from '../data';
import { Icon } from '../icons';
import { searchDocs } from './search';

const MAX_RESULTS = 8;

export const QuickSearch = (): ReactNode => {
  const { docs } = useDocsData();
  const {
    i18n: { currentLocale, localeConfigs },
  } = useDocusaurusContext();
  const searchLocale = localeConfigs[currentLocale]?.htmlLang ?? currentLocale;
  const history = useHistory();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(0);

  const results = useMemo(
    () => searchDocs(docs, query, searchLocale, MAX_RESULTS),
    [docs, query, searchLocale]
  );

  const open = focused && query.trim().length > 0;
  const searchLabel = translate({
    id: 'docs.search.label',
    message: 'Search the docs',
    description: 'The accessible name of the docs search box',
  });

  const go = (permalink: string) => {
    setQuery('');
    setActive(0);
    history.push(permalink);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((current) => Math.min(current + 1, results.length - 1));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === 'Enter' && results[active]) {
      event.preventDefault();
      go(results[active].permalink);
      return;
    }

    if (event.key === 'Escape') event.currentTarget.blur();
  };

  return (
    <div className='relative min-w-0 flex-1'>
      <label className='flex h-10 items-center gap-2 rounded-full border border-line-2 bg-surface px-3.5 transition-[border-color,box-shadow] focus-within:border-accent/45 sm:h-12.5 sm:gap-2.5 sm:px-4.5'>
        <span className='inline-flex text-[1.2rem] text-faint'>
          <Icon name='search' />
        </span>
        <input
          className='w-full min-w-0 flex-1 border-0 bg-transparent font-[inherit] text-[0.85rem] text-ink outline-none placeholder:text-faint'
          type='search'
          placeholder={translate({
            id: 'docs.search.placeholder',
            message: 'Search the docs…',
            description: 'The placeholder of the docs search box',
          })}
          autoComplete='off'
          spellCheck={false}
          role='combobox'
          aria-expanded={open}
          aria-label={searchLabel}
          aria-controls='lagune-docs-search-results'
          value={query}
          onInput={(event) => {
            setQuery(event.currentTarget.value);
            setActive(0);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={onKeyDown}
        />
      </label>
      {open && (
        <div
          id='lagune-docs-search-results'
          role='listbox'
          className='lagune-docs-route-fade absolute top-full right-0 left-0 z-40 mt-2 flex flex-col gap-0.5 rounded-panel border border-line bg-surface p-1.5 shadow-pop'
        >
          {results.length === 0 && (
            <span className='px-3 py-2.5 text-[0.85rem] font-semibold text-muted'>
              <Translate
                id='docs.search.empty'
                description='Shown when a docs search finds nothing, where {query} is what the reader typed'
                values={{ query: query.trim() }}
              >
                {'No pages match “{query}”.'}
              </Translate>
            </span>
          )}
          {results.map((doc, index) => (
            <button
              key={doc.docId}
              type='button'
              role='option'
              aria-selected={index === active}
              className={clsx(
                'flex cursor-pointer flex-col items-start gap-0.5 rounded-field border-0 px-3 py-2 text-left transition-colors',
                index === active
                  ? 'bg-accent-soft text-accent'
                  : 'bg-transparent text-ink-2 hover:bg-canvas'
              )}
              onMouseDown={(event) => {
                event.preventDefault();
                go(doc.permalink);
              }}
              onMouseEnter={() => setActive(index)}
            >
              <span className='flex items-center gap-2 text-[0.85rem] font-bold'>
                {doc.title}
                {doc.state === 'untranslated' && (
                  <span className='flex-none rounded-chip bg-surface-2 px-1.5 py-0.5 text-[0.62rem] font-bold tracking-[0.06em] text-muted'>
                    {translate({
                      id: 'docs.search.untranslatedBadge',
                      message: 'EN',
                      description:
                        'The badge on a search result that is still in English',
                    })}
                  </span>
                )}
              </span>
              <span className='text-[0.72rem] font-semibold text-faint'>
                {doc.permalink}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
