import type {
  PluginModule,
  RouteConfig,
  TranslationFile,
} from '@docusaurus/types';
import type { Messages } from '../../src/data/messages';
import type { CorpusLocale } from './markdown';
import type { DocsNavEntry } from './nav';
import type { PageState } from './translation';
import type {
  DocAlternate,
  DocEntry,
  DocsGlobalData,
  DocsSidebarEntry,
  DocsSidebarLink,
} from './types';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createMDXLoaderRule } from '@docusaurus/mdx-loader';
import {
  addTrailingPathSeparator,
  aliasedSitePath,
  aliasedSitePathToRelativePath,
  docuHash,
  getFileCommitDate,
  Globby,
  parseMarkdownFile,
} from '@docusaurus/utils';
import { DEFAULT_LOCALE, isPublished, LOCALES } from '../../i18n/locales';
import { docsThemeBootScript } from '../../src/components/docs/theme';
import { messageTexts, text } from '../../src/data/messages';
import { robotsWithSitemaps } from '../../src/seo/robots';
import { siteHeadTags, siteMetadata } from '../../src/seo/site';
import {
  renderCorpusHeader,
  renderCorpusIndex,
  renderDocMarkdown,
} from './markdown';
import {
  DATA_FILE,
  dataMessages,
  NAV_FILE,
  navCategoryId,
  navMessages,
} from './messages';
import { docsNav } from './nav';
import { docsRedirects, redirectMarkdown, redirectPage } from './redirects';
import { substituteTokens } from './tokens';
import {
  docIdOf,
  isPairedTranslation,
  pageState,
  PLUGIN_NAME,
  sourceHash,
} from './translation';

type DocsContent = {
  docs: DocEntry[];
  nav: Messages;
  data: Messages;
};

type MarkdownPage = {
  file: string;
  content: string;
  frontMatter: Record<string, unknown>;
  contentTitle: string | undefined;
};

type SourcePage = MarkdownPage & {
  relativeFile: string;
  docId: string;
  hash: string;
};

type Rendition = {
  state: PageState;
  page: MarkdownPage | undefined;
};

export type {
  DocAlternate,
  DocEntry,
  DocsGlobalData,
  DocsSidebarCategory,
  DocsSidebarEntry,
  DocsSidebarLink,
} from './types';

const docPageComponent = '@site/src/components/docs/DocPage/index.tsx';

const DOCS_FOLDER = 'docs';

/** Whether a route shows the English page of a doc inside a translated locale, which keeps it out of that locale's sitemap */
export const rendersUntranslatedPage = (
  route: RouteConfig,
  locale: string
): boolean => {
  const content = route.modules?.content;

  return (
    locale !== DEFAULT_LOCALE &&
    route.component === docPageComponent &&
    typeof content === 'string' &&
    content.startsWith(`@site/${DOCS_FOLDER}/`)
  );
};

const isDocsContent = (content: unknown): content is DocsContent =>
  typeof content === 'object' &&
  content !== null &&
  'docs' in content &&
  Array.isArray(content.docs) &&
  'nav' in content &&
  'data' in content;

const docsContentOf = (content: unknown): DocsContent => {
  if (!isDocsContent(content))
    throw new Error(
      `[${PLUGIN_NAME}] The plugin content is not shaped as expected.`
    );

  return content;
};

const navDocIds = docsNav.flatMap((entry) =>
  typeof entry === 'string' ? [entry] : entry.items
);

const asString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

const asKeywords = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((keyword): keyword is string => typeof keyword === 'string')
    : [];

const joinRoutePath = (...segments: string[]): string =>
  `/${segments
    .flatMap((segment) => segment.split('/'))
    .filter(Boolean)
    .join('/')}`;

const resolvePermalink = ({
  baseUrl,
  docId,
  slug,
}: {
  baseUrl: string;
  docId: string;
  slug: string | undefined;
}): string => {
  if (slug === undefined) return joinRoutePath(baseUrl, 'docs', docId);
  if (slug.startsWith('/')) return joinRoutePath(baseUrl, 'docs', slug);

  const parentDirectory = path.posix.dirname(docId);
  const directory = parentDirectory === '.' ? '' : parentDirectory;

  return joinRoutePath(baseUrl, 'docs', directory, slug);
};

const isMissingFile = (error: unknown): boolean =>
  error instanceof Error && 'code' in error && error.code === 'ENOENT';

const readIfPresent = async (file: string): Promise<string | undefined> => {
  try {
    return await fs.readFile(file, 'utf8');
  } catch (error) {
    if (isMissingFile(error)) return undefined;

    throw error;
  }
};

const commitDates = async (
  file: string
): Promise<Pick<DocEntry, 'datePublished' | 'dateModified'>> => {
  try {
    const [oldest, newest] = await Promise.all([
      getFileCommitDate(file, { age: 'oldest' }),
      getFileCommitDate(file, { age: 'newest' }),
    ]);

    return {
      datePublished: oldest.date.toISOString(),
      dateModified: newest.date.toISOString(),
    };
  } catch {
    return { datePublished: undefined, dateModified: undefined };
  }
};

const translationFileContent = (
  translationFiles: TranslationFile[],
  filePath: string
): Messages => {
  const file = translationFiles.find((entry) => entry.path === filePath);

  if (!file)
    throw new Error(
      `[${PLUGIN_NAME}] The translation file "${filePath}" was not loaded.`
    );

  return messageTexts(file.content);
};

const buildSidebar = (docs: DocEntry[], nav: Messages): DocsSidebarEntry[] => {
  const docsById = new Map(docs.map((doc) => [doc.docId, doc]));

  const toLink = (docId: string): DocsSidebarLink => {
    const doc = docsById.get(docId);

    if (!doc)
      throw new Error(
        `[${PLUGIN_NAME}] The sidebar references the doc id "${docId}", but no MDX file matches it.`
      );

    return {
      type: 'link',
      docId: doc.docId,
      label: doc.sidebarLabel,
      permalink: doc.permalink,
    };
  };

  const toEntry = (entry: DocsNavEntry): DocsSidebarEntry => {
    if (typeof entry === 'string') return toLink(entry);

    return {
      type: 'category',
      key: entry.key,
      label: text(nav, navCategoryId(entry)),
      collapsed: entry.collapsed ?? true,
      items: entry.items.map(toLink),
    };
  };

  return docsNav.map(toEntry);
};

const assertParentsInNav = (docs: DocEntry[]): void => {
  const orphan = docs.find(
    (doc) => doc.parent !== undefined && !navDocIds.includes(doc.parent)
  );

  if (orphan)
    throw new Error(
      `[${PLUGIN_NAME}] The doc "${orphan.docId}" names the parent "${orphan.parent}", but the sidebar has no such doc.`
    );
};

const orderDocsByNav = (docs: DocEntry[]): DocEntry[] => {
  const docsById = new Map(docs.map((doc) => [doc.docId, doc]));
  const childrenOf = (docId: string): DocEntry[] =>
    docs
      .filter((doc) => doc.parent === docId)
      .sort((a, b) => a.permalink.localeCompare(b.permalink));
  const inNav = navDocIds.flatMap((docId) => {
    const doc = docsById.get(docId);
    return doc ? [doc, ...childrenOf(docId)] : [];
  });
  const seen = new Set(inNav.map((doc) => doc.docId));
  const rest = docs
    .filter((doc) => !seen.has(doc.docId))
    .sort((a, b) => a.permalink.localeCompare(b.permalink));

  return [...inNav, ...rest];
};

export const docsContentPlugin: PluginModule = async (context) => {
  const { siteConfig, siteDir, generatedFilesDir, baseUrl, i18n } = context;
  const contentPath = path.resolve(siteDir, DOCS_FOLDER);
  const dataDir = path.join(generatedFilesDir, PLUGIN_NAME, 'default');
  const isDefaultLocale = i18n.currentLocale === i18n.defaultLocale;

  const localizedContentPath = (locale: string): string =>
    path.resolve(
      siteDir,
      i18n.path,
      i18n.localeConfigs[locale]?.path ?? locale,
      PLUGIN_NAME
    );

  const currentContentPath = localizedContentPath(i18n.currentLocale);
  const pairedLocales = i18n.locales.filter(
    (locale) => locale !== i18n.defaultLocale && isPublished(locale)
  );

  const readMarkdownPage = async (
    file: string
  ): Promise<MarkdownPage | undefined> => {
    const content = await readIfPresent(file);

    if (content === undefined) return undefined;

    const { frontMatter, contentTitle } = await parseMarkdownFile({
      filePath: file,
      fileContent: content,
      parseFrontMatter: siteConfig.markdown.parseFrontMatter,
    });

    return { file, content, frontMatter, contentTitle };
  };

  const readSourcePage = async (relativeFile: string): Promise<SourcePage> => {
    const page = await readMarkdownPage(path.join(contentPath, relativeFile));

    if (!page)
      throw new Error(`[${PLUGIN_NAME}] Unable to read "${relativeFile}".`);

    return {
      ...page,
      relativeFile,
      docId: docIdOf(relativeFile, page.frontMatter.id),
      hash: sourceHash(page.content),
    };
  };

  const translationState = async (
    locale: string,
    source: SourcePage
  ): Promise<Rendition> => {
    const page = await readMarkdownPage(
      path.join(localizedContentPath(locale), source.relativeFile)
    );
    const state = pageState(
      page && { sourceHash: page.frontMatter.source_hash },
      source.hash
    );

    return { state, page };
  };

  const permalinkIn = (localeBaseUrl: string, source: SourcePage): string =>
    resolvePermalink({
      baseUrl: localeBaseUrl,
      docId: source.docId,
      slug: asString(source.frontMatter.slug),
    });

  const alternatesOf = async (source: SourcePage): Promise<DocAlternate[]> => {
    const translations = await Promise.all(
      pairedLocales.map(async (locale) => ({
        locale,
        paired: isPairedTranslation(
          (await translationState(locale, source)).state
        ),
      }))
    );

    return [
      i18n.defaultLocale,
      ...translations
        .filter(({ paired }) => paired)
        .map(({ locale }) => locale),
    ].map((locale) => ({
      locale,
      permalink: permalinkIn(
        i18n.localeConfigs[locale]?.baseUrl ?? '/',
        source
      ),
    }));
  };

  const currentRendition = async (source: SourcePage): Promise<Rendition> => {
    if (isDefaultLocale) return { state: 'original', page: undefined };

    return translationState(i18n.currentLocale, source);
  };

  const toDocEntry = async (source: SourcePage): Promise<DocEntry> => {
    const { state, page } = await currentRendition(source);
    const rendered = page && isPairedTranslation(state) ? page : source;
    const title =
      asString(rendered.frontMatter.title) ??
      rendered.contentTitle ??
      source.docId;

    return {
      docId: source.docId,
      permalink: permalinkIn(baseUrl, source),
      source: aliasedSitePath(rendered.file, siteDir),
      title,
      sidebarLabel: asString(rendered.frontMatter.sidebar_label) ?? title,
      description: asString(rendered.frontMatter.description),
      keywords: asKeywords(rendered.frontMatter.keywords),
      parent: asString(source.frontMatter.parent),
      ...(await commitDates(rendered.file)),
      state,
      alternates: await alternatesOf(source),
    };
  };

  const mdxLoaderRule = await createMDXLoaderRule({
    include: [
      addTrailingPathSeparator(contentPath),
      addTrailingPathSeparator(currentContentPath),
    ],
    options: {
      useCrossCompilerCache: siteConfig.future.faster.mdxCrossCompilerCache,
      admonitions: true,
      removeContentTitle: true,
      staticDirs: siteConfig.staticDirectories.map((directory) =>
        path.resolve(siteDir, directory)
      ),
      siteDir,
      isMDXPartial: (filePath) => path.basename(filePath).startsWith('_'),
      metadataPath: (mdxPath) =>
        path.join(
          dataDir,
          `${docuHash(aliasedSitePath(mdxPath, siteDir))}.json`
        ),
      markdownConfig: siteConfig.markdown,
    },
  });

  return {
    name: PLUGIN_NAME,

    getPathsToWatch: () => [
      `${contentPath}/**/*.{md,mdx}`,
      `${currentContentPath}/**/*.{md,mdx}`,
    ],

    loadContent: async (): Promise<DocsContent> => {
      const relativeFiles = await Globby(['**/*.{md,mdx}'], {
        cwd: contentPath,
      });
      const visibleFiles = relativeFiles
        .filter((relativeFile) => !path.basename(relativeFile).startsWith('_'))
        .sort();
      const sources = await Promise.all(visibleFiles.map(readSourcePage));
      const docs = await Promise.all(sources.map(toDocEntry));

      assertParentsInNav(docs);

      return {
        docs,
        nav: messageTexts(navMessages()),
        data: messageTexts(dataMessages()),
      };
    },

    getTranslationFiles: () => [
      { path: NAV_FILE, content: navMessages() },
      { path: DATA_FILE, content: dataMessages() },
    ],

    translateContent: ({ content, translationFiles }): DocsContent => ({
      ...docsContentOf(content),
      nav: translationFileContent(translationFiles, NAV_FILE),
      data: translationFileContent(translationFiles, DATA_FILE),
    }),

    translateThemeConfig: ({ translationFiles }) => ({
      metadata: siteMetadata(
        translationFileContent(translationFiles, DATA_FILE)
      ),
    }),

    contentLoaded: async ({ content: loaded, actions }) => {
      const { addRoute, createData, setGlobalData } = actions;
      const content = docsContentOf(loaded);

      await Promise.all(
        content.docs.map(async (doc) => {
          await createData(`${docuHash(doc.source)}.json`, doc);

          addRoute({
            path: doc.permalink,
            component: docPageComponent,
            exact: true,
            modules: { content: doc.source },
            metadata: {
              sourceFilePath: path.join(
                siteDir,
                aliasedSitePathToRelativePath(doc.source)
              ),
            },
          });
        })
      );

      setGlobalData({
        sidebar: buildSidebar(content.docs, content.nav),
        docs: content.docs,
        data: content.data,
      } satisfies DocsGlobalData);
    },

    configureWebpack: () => ({
      module: { rules: [mdxLoaderRule] },
    }),

    postBuild: async ({ outDir, content: loaded }) => {
      const content = docsContentOf(loaded);
      const site = siteConfig.url;
      const ordered = orderDocsByNav(content.docs).filter(
        (doc) => isDefaultLocale || isPairedTranslation(doc.state)
      );
      const originalPermalinkOf = (doc: DocEntry): string =>
        doc.alternates.find(({ locale }) => locale === i18n.defaultLocale)
          ?.permalink ?? doc.permalink;
      const localePermalinks = new Map(
        ordered.map((doc) => [originalPermalinkOf(doc), doc.permalink])
      );
      const localePath = (pathname: string): string => {
        if (pathname === '/') return baseUrl;

        return localePermalinks.get(pathname) ?? pathname;
      };
      const corpus: CorpusLocale = {
        siteUrl: site,
        baseUrl,
        language: isDefaultLocale
          ? undefined
          : i18n.localeConfigs[i18n.currentLocale]?.htmlLang,
        link: (target) => {
          const [pathname = '', ...fragment] = target.split('#');

          return [`${site}${localePath(pathname)}`, ...fragment].join('#');
        },
        otherLanguages: LOCALES.filter(
          ({ code }) =>
            code !== i18n.currentLocale &&
            isPublished(code) &&
            i18n.locales.includes(code)
        ).map(({ code, label }) => ({
          label,
          url: `${site}${i18n.localeConfigs[code]?.baseUrl ?? '/'}llms.txt`,
        })),
      };

      const markdownDocs = await Promise.all(
        ordered.map(async (doc) => {
          const sourceFile = path.join(
            siteDir,
            aliasedSitePathToRelativePath(doc.source)
          );
          const body = substituteTokens(
            await fs.readFile(sourceFile, 'utf8'),
            sourceFile
          );
          const original = isDefaultLocale
            ? undefined
            : {
                url: `${site}${originalPermalinkOf(doc)}`,
                stale: doc.state === 'stale',
              };

          return {
            doc,
            markdown: renderDocMarkdown(
              { ...doc, body, original },
              corpus,
              content.data
            ),
          };
        })
      );

      const outRoot = path.resolve(outDir);
      const insideBuild = (relativeFile: string): string => {
        const target = path.resolve(outRoot, relativeFile);

        if (!target.startsWith(`${outRoot}${path.sep}`))
          throw new Error(
            `[${PLUGIN_NAME}] Refusing to write "${target}" outside the build directory.`
          );

        return target;
      };

      if (isDefaultLocale) {
        const robots = insideBuild('robots.txt');
        const sitemaps = i18n.locales
          .filter(isPublished)
          .map(
            (code) =>
              `${site}${i18n.localeConfigs[code]?.baseUrl ?? '/'}sitemap.xml`
          );

        await fs.writeFile(
          robots,
          robotsWithSitemaps(await fs.readFile(robots, 'utf8'), sitemaps),
          'utf8'
        );

        await Promise.all(
          Object.entries(docsRedirects).map(async ([from, to]) => {
            const target = `${site}${joinRoutePath(baseUrl, 'docs', to)}`;
            const page = insideBuild(`docs/${from}.html`);

            await fs.mkdir(path.dirname(page), { recursive: true });
            await fs.writeFile(page, redirectPage(target), 'utf8');
            await fs.writeFile(
              insideBuild(`docs/${from}.md`),
              redirectMarkdown(target),
              'utf8'
            );
          })
        );
      }

      await Promise.all(
        markdownDocs.map(async ({ doc, markdown }) => {
          const target = insideBuild(
            `${doc.permalink.slice(baseUrl.length)}.md`
          );

          await fs.mkdir(path.dirname(target), { recursive: true });
          await fs.writeFile(target, markdown, 'utf8');
        })
      );

      await fs.writeFile(
        path.join(outDir, 'llms.txt'),
        renderCorpusIndex({
          entries: ordered,
          corpus,
          messages: content.data,
        }),
        'utf8'
      );

      const full = [
        renderCorpusHeader(content.data).join('\n'),
        ...markdownDocs.map(({ markdown }) => markdown.trimEnd()),
      ].join('\n\n---\n\n');

      await fs.writeFile(
        path.join(outDir, 'llms-full.txt'),
        `${full}\n`,
        'utf8'
      );
    },

    injectHtmlTags: ({ content }) => ({
      headTags: [
        {
          tagName: 'script',
          innerHTML: docsThemeBootScript,
        },
        ...siteHeadTags(docsContentOf(content).data),
      ],
    }),
  };
};
