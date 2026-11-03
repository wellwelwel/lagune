import type { DocEntry } from '@site/plugins/docs-content';
import type { ComponentType, ReactNode } from 'react';
import type { DocTocItem } from '../Toc';
import Head from '@docusaurus/Head';
import { PageMetadata } from '@docusaurus/theme-common';
import { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { LocaleHead } from '@site/src/components/LocaleHead';
import { jsonLd } from '@site/src/seo/jsonLd';
import MDXContent from '@theme/MDXContent';
import { findDocContext, useDocsData } from '../data';
import { DocsNotice } from '../Notice';
import { DocsPagination } from '../Pagination';
import { Paper } from '../Paper';
import { DocsShell } from '../Shell';
import { DocsSmallPrint } from '../SmallPrint';
import { DocsToc } from '../Toc';

type DocContent = ComponentType<Record<string, unknown>> & {
  metadata: DocEntry;
  toc: DocTocItem[];
};

type DocPageProps = {
  content: DocContent;
};

const SITE_URL = 'https://lagune.ai';

const INSTALL_DOC_ID = 'get-started/install';

export default function DocPage({ content: Content }: DocPageProps): ReactNode {
  const { metadata } = Content;
  const { sidebar } = useDocsData();
  const {
    siteConfig: { baseUrl },
    i18n: { currentLocale, defaultLocale, localeConfigs },
  } = useDocusaurusContext();
  const context = findDocContext(sidebar, metadata);
  const isUntranslated = metadata.state === 'untranslated';
  const isTranslation =
    metadata.state === 'translated' || metadata.state === 'stale';
  const originalPermalink =
    metadata.alternates.find(({ locale }) => locale === defaultLocale)
      ?.permalink ?? metadata.permalink;
  const pageUrl = `${SITE_URL}${metadata.permalink}`;
  const originalUrl = `${SITE_URL}${originalPermalink}`;
  const canonicalUrl = isUntranslated ? originalUrl : pageUrl;
  const docsRoot = `${baseUrl}docs`;
  const contentLocale = isUntranslated ? defaultLocale : currentLocale;
  const contentLang = localeConfigs[contentLocale]?.htmlLang ?? contentLocale;
  const alternates = isUntranslated
    ? []
    : metadata.alternates.map(({ locale, permalink }) => ({
        locale,
        url: `${SITE_URL}${permalink}`,
      }));
  const trail = [
    {
      name: translate({
        id: 'common.home',
        message: 'Home',
        description: 'The name of the home page, in links and breadcrumbs',
      }),
      url: `${SITE_URL}${baseUrl}`,
    },
    {
      name: translate({
        id: 'common.docs',
        message: 'Docs',
        description: 'The name of the documentation, in links and breadcrumbs',
      }),
      url: `${SITE_URL}${docsRoot}`,
    },
    ...(metadata.permalink === docsRoot
      ? []
      : [{ name: metadata.title, url: pageUrl }]),
  ];

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };

  const imageAlt = translate(
    {
      id: 'docs.page.imageAlt',
      message: 'Lagune {section}: {title}',
      description:
        "The alternative text of a docs page's link preview image, where {section} is its sidebar group and {title} is the page title",
    },
    { section: context.eyebrow, title: metadata.title }
  );
  const isPaper = metadata.docId === 'references/paper';
  const activeDocId = metadata.parent ?? metadata.docId;
  const mentionsTrademarks = activeDocId === INSTALL_DOC_ID;

  const article = {
    '@context': 'https://schema.org',
    '@type': isPaper ? 'ScholarlyArticle' : 'TechArticle',
    '@id': `${pageUrl}#article`,
    headline: metadata.title,
    name: metadata.title,
    description: metadata.description,
    inLanguage: contentLang,
    url: pageUrl,
    image: `${SITE_URL}/img/og.png`,
    author: { '@id': `${SITE_URL}/#author` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    isPartOf: { '@id': `${SITE_URL}/#website` },
    breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
    ...(isTranslation
      ? { translationOfWork: { '@id': `${originalUrl}#article` } }
      : {}),
    ...(metadata.datePublished
      ? { datePublished: metadata.datePublished }
      : {}),
    ...(metadata.dateModified ? { dateModified: metadata.dateModified } : {}),
  };

  return (
    <DocsShell
      activeDocId={activeDocId}
      rail={<DocsToc toc={isPaper ? [] : Content.toc} />}
    >
      <PageMetadata
        title={metadata.title}
        description={metadata.description}
        keywords={metadata.keywords.length > 0 ? metadata.keywords : undefined}
      />
      <LocaleHead
        canonical={canonicalUrl}
        contentLocale={contentLocale}
        alternates={alternates}
      />
      <Head>
        <link
          rel='alternate'
          type='text/markdown'
          href={`${canonicalUrl}.md`}
        />
        <meta property='og:image:alt' content={imageAlt} />
        <meta name='twitter:image:alt' content={imageAlt} />
        <script type='application/ld+json'>{jsonLd(breadcrumb)}</script>
        <script type='application/ld+json'>{jsonLd(article)}</script>
      </Head>
      <section className='lagune-docs-route-fade relative mb-5 flex-none overflow-hidden rounded-card bg-banner px-5 py-6 text-white shadow-card sm:px-9 sm:py-7.5'>
        <img
          className='lagune-docs-route-rise pointer-events-none absolute inset-0 z-0 size-full object-cover mask-[linear-gradient(to_right,transparent,rgba(0,0,0,0.35)_38%,black)]'
          src={context.banner}
          alt={metadata.title}
          aria-hidden='true'
        />
        <span className='pointer-events-none absolute inset-0 z-1 bg-linear-to-r from-banner via-banner/85 to-banner/40' />
        <div className='relative z-2 max-w-145'>
          <span className='text-[0.7rem] font-bold uppercase tracking-[0.14em] text-white/82'>
            {context.eyebrow}
          </span>
          <h1 className='mt-2.5 text-[1.45rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-balance text-white sm:text-[1.7rem]'>
            {metadata.title}
          </h1>
          {metadata.description && (
            <p className='mt-2.5 mb-0 text-[0.85rem] text-pretty text-white/90'>
              {metadata.description}
            </p>
          )}
        </div>
      </section>
      <DocsNotice
        state={metadata.state}
        originalPermalink={originalPermalink}
      />
      <article
        className='lagune-docs-route-rise markdown rounded-card bg-surface px-5 py-6 shadow-card sm:px-9 sm:py-8'
        lang={isUntranslated ? contentLang : undefined}
      >
        <MDXContent>
          {isPaper ? (
            <Paper>
              <Content />
            </Paper>
          ) : (
            <Content />
          )}
        </MDXContent>
      </article>
      <DocsPagination previous={context.previous} next={context.next} />
      <DocsSmallPrint
        dateModified={metadata.dateModified}
        mentionsTrademarks={mentionsTrademarks}
      />
    </DocsShell>
  );
}
