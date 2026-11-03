import type { PageState } from '@site/plugins/docs-content/translation';
import type { ReactNode } from 'react';
import { translate } from '@docusaurus/Translate';
import { DEFAULT_LOCALE } from '@site/i18n/locales';
import { Icon } from '../icons';

const noticeText = (state: PageState): string | undefined => {
  if (state === 'stale')
    return translate({
      id: 'docs.notice.stale',
      message: 'This page is outdated compared to its English version.',
      description:
        'Tells the reader a translated page fell behind its English source, shown above the page',
    });

  if (state === 'untranslated')
    return translate({
      id: 'docs.notice.untranslated',
      message: 'This page has not been translated yet.',
      description:
        'Tells the reader the page below is still in English, shown above the page',
    });

  return undefined;
};

export const DocsNotice = ({
  state,
  originalPermalink,
}: {
  state: PageState;
  originalPermalink: string;
}): ReactNode => {
  const text = noticeText(state);

  if (text === undefined) return null;

  return (
    <div
      role='note'
      data-nosnippet
      className='lagune-docs-route-fade mb-5 flex flex-none items-start gap-3 rounded-card bg-surface px-5 py-4 text-[0.85rem] leading-relaxed text-pretty text-ink-2 shadow-card sm:px-9'
    >
      <span className='mt-0.5 inline-flex flex-none text-[1.05rem] text-accent'>
        <Icon name='globe' />
      </span>
      <p className='m-0'>
        {text}{' '}
        <a
          className='font-semibold text-accent underline-offset-2 hover:underline'
          href={originalPermalink}
          hrefLang={DEFAULT_LOCALE}
        >
          {translate({
            id: 'docs.notice.original',
            message: 'Read the original version',
            description:
              'The link from a stale or untranslated page notice to the English page',
          })}
        </a>
      </p>
    </div>
  );
};
