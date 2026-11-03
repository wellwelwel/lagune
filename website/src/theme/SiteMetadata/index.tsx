import type { ReactNode } from 'react';
import Head from '@docusaurus/Head';
import { useLocation } from '@docusaurus/router';
import { PageMetadata, useThemeConfig } from '@docusaurus/theme-common';
import { DEFAULT_SEARCH_TAG } from '@docusaurus/theme-common/internal';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { applyTrailingSlash } from '@docusaurus/utils-common';
import { openGraphLocale } from '@site/src/seo/locale';
import SearchMetadata from '@theme/SearchMetadata';

const CanonicalUrlHeaders = (): ReactNode => {
  const {
    siteConfig: { url: siteUrl, baseUrl, trailingSlash },
  } = useDocusaurusContext();
  const { pathname } = useLocation();
  const canonicalUrl =
    siteUrl +
    applyTrailingSlash(useBaseUrl(pathname), { trailingSlash, baseUrl });

  return (
    <Head>
      <meta property='og:url' content={canonicalUrl} />
      <link rel='canonical' href={canonicalUrl} />
    </Head>
  );
};

const SiteMetadata = (): ReactNode => {
  const {
    i18n: { currentLocale, localeConfigs },
  } = useDocusaurusContext();
  const { metadata, image: defaultImage } = useThemeConfig();
  const htmlLang = localeConfigs[currentLocale]?.htmlLang ?? currentLocale;

  return (
    <>
      <Head>
        <meta name='twitter:card' content='summary_large_image' />
        <body />
      </Head>
      {defaultImage && <PageMetadata image={defaultImage} />}
      <CanonicalUrlHeaders />
      <Head>
        <meta property='og:locale' content={openGraphLocale(htmlLang)} />
      </Head>
      <SearchMetadata tag={DEFAULT_SEARCH_TAG} locale={currentLocale} />
      <Head>
        {metadata.map((metadatum, index) => (
          <meta key={index} {...metadatum} />
        ))}
      </Head>
    </>
  );
};

export default SiteMetadata;
