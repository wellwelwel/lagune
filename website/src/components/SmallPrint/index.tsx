import type { ReactNode } from 'react';
import Translate from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { REPOSITORY_URL } from '@site/src/seo/site';

const SMALL_PRINT_LINK = 'font-semibold text-ink-2 hover:text-accent';

const ExternalLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}): ReactNode => (
  <a className={SMALL_PRINT_LINK} href={href} target='_blank' rel='noreferrer'>
    {children}
  </a>
);

export const SmallPrint = ({
  dateModified,
  mentionsTrademarks,
  className,
  as: Root = 'footer',
}: {
  dateModified?: string;
  mentionsTrademarks: boolean;
  className: string;
  as?: 'footer' | 'div';
}): ReactNode => {
  const {
    i18n: { currentLocale, localeConfigs },
  } = useDocusaurusContext();
  const dateLocale = localeConfigs[currentLocale]?.htmlLang ?? currentLocale;

  return (
    <Root
      className={`flex flex-col gap-1.5 text-[0.75rem] leading-relaxed text-[color-mix(in_srgb,var(--muted),var(--ink-2))] ${className}`}
    >
      {dateModified && (
        <p className='m-0'>
          <Translate
            id='docs.smallPrint.lastUpdated'
            description='When a docs page last changed, where {date} is the date'
            values={{
              date: new Date(dateModified).toLocaleDateString(dateLocale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
            }}
          >
            {'Last updated on {date}.'}
          </Translate>
        </p>
      )}
      <p className='m-0'>
        <Translate
          id='docs.smallPrint.copyright'
          description='The copyright and license notice under every docs page, where {author}, {contributors}, {license}, and {policy} are links'
          values={{
            author: (
              <ExternalLink href='https://github.com/wellwelwel'>
                Weslley Araújo
              </ExternalLink>
            ),
            contributors: (
              <ExternalLink href={`${REPOSITORY_URL}/graphs/contributors`}>
                <Translate
                  id='docs.smallPrint.contributors'
                  description='The link to the people who contributed to Lagune'
                >
                  contributors
                </Translate>
              </ExternalLink>
            ),
            license: (
              <ExternalLink href={`${REPOSITORY_URL}/blob/main/LICENSE`}>
                Apache License 2.0
              </ExternalLink>
            ),
            policy: (
              <ExternalLink href={`${REPOSITORY_URL}/blob/main/SECURITY.md`}>
                <Translate
                  id='docs.smallPrint.securityPolicy'
                  description="The link to Lagune's security policy"
                >
                  Security Policy
                </Translate>
              </ExternalLink>
            ),
          }}
        >
          {
            'Copyright © 2026-present {author} and {contributors}. Lagune is under the {license}. Please check the {policy}.'
          }
        </Translate>
      </p>
      {mentionsTrademarks && (
        <p className='m-0'>
          <Translate
            id='docs.smallPrint.trademarks'
            description='The trademark notice on pages that name other products'
          >
            All product names, trademarks, and registered trademarks mentioned
            are the property of their respective owners and are used for
            identification purposes only.
          </Translate>
        </p>
      )}
    </Root>
  );
};
