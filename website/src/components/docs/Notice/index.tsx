import type { PageState } from '@site/plugins/docs-content/translation';
import type { ReactNode } from 'react';
import type { DocsIconName } from '../icons';
import Translate, { translate } from '@docusaurus/Translate';
import { DEFAULT_LOCALE } from '@site/i18n/locales';
import { Icon } from '../icons';

type NoticeState = Extract<PageState, 'stale' | 'untranslated'>;

type NoticeLook = {
  tone: string;
  icon: DocsIconName;
};

const NOTICE_LOOKS: Record<NoticeState, NoticeLook> = {
  stale: { tone: '[--notice-tone:var(--amber)]', icon: 'alert' },
  untranslated: { tone: '[--notice-tone:var(--blue)]', icon: 'globe' },
};

const isNoticeState = (state: PageState): state is NoticeState =>
  Object.hasOwn(NOTICE_LOOKS, state);

const OriginalLink = ({ href }: { href: string }): ReactNode => (
  <a
    className='font-semibold whitespace-nowrap text-inherit underline decoration-(--notice-tone)/50 underline-offset-3 transition-colors hover:decoration-current'
    href={href}
    hrefLang={DEFAULT_LOCALE}
  >
    {translate({
      id: 'docs.notice.original',
      message: 'Read the original version',
      description: 'The link from a stale page notice to the English page',
    })}
  </a>
);

const noticeText = (
  state: NoticeState,
  originalPermalink: string
): ReactNode => {
  if (state === 'stale')
    return (
      <Translate
        id='docs.notice.stale'
        description='Tells the reader a translated page fell behind its English source, shown above the page, where {original} is the link to the English page'
        values={{ original: <OriginalLink href={originalPermalink} /> }}
      >
        {'This page is outdated compared to its English version. {original}.'}
      </Translate>
    );

  return translate({
    id: 'docs.notice.untranslated',
    message: 'This page has not been translated yet.',
    description:
      'Tells the reader the page below is still in English, shown above the page',
  });
};

export const DocsNotice = ({
  state,
  originalPermalink,
}: {
  state: PageState;
  originalPermalink: string;
}): ReactNode => {
  if (!isNoticeState(state)) return null;

  const { tone, icon } = NOTICE_LOOKS[state];

  return (
    <div
      role='note'
      data-nosnippet
      className={`${tone} lagune-docs-route-fade mb-5 flex flex-none items-start gap-3 rounded-card bg-[color-mix(in_srgb,var(--notice-tone)_12%,var(--surface))] px-5 py-4 text-[0.9rem] leading-relaxed font-medium text-[color-mix(in_srgb,var(--notice-tone)_34%,var(--ink))] shadow-card inset-ring inset-ring-(--notice-tone)/30 sm:px-9`}
    >
      <span className='mt-0.5 inline-flex flex-none text-[1.15rem] text-(--notice-tone)'>
        <Icon name={icon} />
      </span>
      <p className='m-0 text-wrap!'>{noticeText(state, originalPermalink)}</p>
    </div>
  );
};
