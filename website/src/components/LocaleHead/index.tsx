import type { ReactNode } from 'react';
import Head from '@docusaurus/Head';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { isPublished } from '@site/i18n/locales';
import { openGraphLocale } from '@site/src/seo/locale';

export type LocaleAlternate = {
  locale: string;
  url: string;
};

export const LocaleHead = ({
  canonical,
  contentLocale,
  alternates,
}: {
  canonical: string;
  contentLocale: string;
  alternates: LocaleAlternate[];
}): ReactNode => {
  const {
    i18n: { defaultLocale, localeConfigs },
  } = useDocusaurusContext();
  const htmlLang = (locale: string): string =>
    localeConfigs[locale]?.htmlLang ?? locale;
  const original = alternates.find(({ locale }) => locale === defaultLocale);

  return (
    <Head>
      <link rel='canonical' href={canonical} />
      <meta property='og:url' content={canonical} />
      {alternates.map(({ locale, url }) => (
        <link
          key={locale}
          rel='alternate'
          href={url}
          hrefLang={htmlLang(locale)}
        />
      ))}
      {original && (
        <link rel='alternate' href={original.url} hrefLang='x-default' />
      )}
      <meta
        property='og:locale'
        content={openGraphLocale(htmlLang(contentLocale))}
      />
      {alternates
        .filter(({ locale }) => locale !== contentLocale)
        .map(({ locale }) => (
          <meta
            key={locale}
            property='og:locale:alternate'
            content={openGraphLocale(htmlLang(locale))}
          />
        ))}
    </Head>
  );
};

/** The address of the current page in another locale, whether or not the locale's home was reached with its trailing slash */
export const useLocaleUrl = (): ((
  locale: string,
  fullyQualified: boolean
) => string) => {
  const {
    siteConfig: { baseUrl, url },
    i18n: { localeConfigs },
  } = useDocusaurusContext();
  const { pathname } = useLocation();
  const localeHome = baseUrl.replace(/\/$/, '');
  const suffix =
    pathname === localeHome
      ? ''
      : pathname.startsWith(baseUrl)
        ? pathname.slice(baseUrl.length)
        : pathname.replace(/^\//, '');

  return (locale, fullyQualified) =>
    `${fullyQualified ? url : ''}${localeConfigs[locale]?.baseUrl ?? '/'}${suffix}`;
};

export const usePublishedAlternates = (): LocaleAlternate[] => {
  const {
    i18n: { localeConfigs },
  } = useDocusaurusContext();
  const localeUrl = useLocaleUrl();

  return Object.keys(localeConfigs)
    .filter(isPublished)
    .map((locale) => ({
      locale,
      url: localeUrl(locale, true),
    }));
};

export type LocalePage = {
  url: string;
  originalUrl: string;
  baseUrl: string;
  htmlLang: string;
  isTranslation: boolean;
};

export const useLocalePage = (): LocalePage => {
  const {
    siteConfig: { baseUrl },
    i18n: { currentLocale, defaultLocale, localeConfigs },
  } = useDocusaurusContext();
  const localeUrl = useLocaleUrl();
  const htmlLang = (locale: string): string =>
    localeConfigs[locale]?.htmlLang ?? locale;

  return {
    url: localeUrl(currentLocale, true),
    originalUrl: localeUrl(defaultLocale, true),
    baseUrl,
    htmlLang: htmlLang(currentLocale),
    isTranslation: currentLocale !== defaultLocale,
  };
};

export const translationOf = (
  page: LocalePage,
  fragment: string
): Record<string, unknown> =>
  page.isTranslation
    ? {
        inLanguage: page.htmlLang,
        translationOfWork: { '@id': `${page.originalUrl}${fragment}` },
      }
    : Object.create(null);
