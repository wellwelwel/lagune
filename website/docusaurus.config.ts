import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import tailwindPostcss from '@tailwindcss/postcss';
import { localeBuild, localeOfBaseUrl } from './i18n/locales';
import { criticalCssPlugin } from './plugins/critical-css';
import {
  docsContentPlugin,
  rendersUntranslatedPage,
} from './plugins/docs-content';
import { dataMessages } from './plugins/docs-content/messages';
import { substituteTokens } from './plugins/docs-content/tokens';
import { dropWoff } from './plugins/drop-woff';
import { localeOutputPlugin } from './plugins/locale-output';
import { schemasPlugin } from './plugins/schemas';
import { messageTexts } from './src/data/messages';
import { laguneCode } from './src/prism/lagune';
import { OG_IMAGE, SITE_TAGLINE, SITE_URL, siteMetadata } from './src/seo/site';
import { extraSitemapItems } from './src/seo/sitemap/extras';
import { sitemapPriority } from './src/seo/sitemap/priority';

// This runs in Bun - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Lagune',
  tagline: SITE_TAGLINE,
  favicon: 'favicon.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
    faster: true,
    experimental_vcs: true,
  },

  url: SITE_URL,
  baseUrl: '/',
  trailingSlash: false,
  organizationName: 'wellwelwel',
  projectName: 'lagune',
  deploymentBranch: 'website',

  staticDirectories: ['static', '../src/dashboard/client/public'],

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  markdown: {
    preprocessor: ({ filePath, fileContent }) =>
      substituteTokens(fileContent, filePath),
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  i18n: localeBuild({
    includeDrafts: process.env.LAGUNE_WEBSITE_DEPLOY !== 'true',
  }),

  plugins: [
    docsContentPlugin,
    criticalCssPlugin,
    schemasPlugin,
    localeOutputPlugin,
    function tailwindPlugin() {
      return {
        name: 'tailwind-plugin',
        configurePostCss(postcssOptions) {
          postcssOptions.plugins.push(tailwindPostcss, dropWoff());
          return postcssOptions;
        },
      };
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: false,
        theme: {
          customCss: ['./src/css/custom.css', './src/css/docs.css'],
        },
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          filename: 'sitemap.xml',
          createSitemapItems: async ({
            defaultCreateSitemapItems,
            ...params
          }) => {
            const { baseUrl, url } = params.siteConfig;
            const items = await defaultCreateSitemapItems({
              ...params,
              routes: params.routes.filter(
                (route) =>
                  !rendersUntranslatedPage(route, localeOfBaseUrl(baseUrl))
              ),
            });
            const ranked = items.map((item) => ({
              ...item,
              priority: sitemapPriority(item.url, baseUrl),
            }));

            return [...ranked, ...extraSitemapItems(url, baseUrl)];
          },
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: OG_IMAGE,
    metadata: siteMetadata(messageTexts(dataMessages())),
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Lagune',
      logo: {
        alt: 'Lagune',
        src: 'favicon.png',
        href: '/',
      },
      hideOnScroll: true,
      items: [
        {
          to: '/docs',
          label: 'Docs',
          position: 'left',
        },
        {
          to: '/',
          label: 'Home',
          position: 'left',
        },
        {
          href: 'https://github.com/wellwelwel/lagune',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Get Started', to: '/docs' },
            { label: 'Skills', to: '/docs/commands/charter' },
            { label: 'Catalog', to: '/docs/catalog' },
          ],
        },
        {
          title: 'Project',
          items: [
            { label: 'Home', to: '/' },
            {
              label: 'GitHub',
              href: 'https://github.com/wellwelwel/lagune',
            },
            {
              label: 'npm',
              href: 'https://www.npmjs.com/package/lagune',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Security Policy',
              href: 'https://github.com/wellwelwel/lagune/blob/main/SECURITY.md',
            },
            {
              label: 'License',
              href: 'https://github.com/wellwelwel/lagune/blob/main/LICENSE',
            },
            {
              label: 'Sponsor',
              href: 'https://github.com/sponsors/wellwelwel',
            },
          ],
        },
      ],
    },
    prism: {
      theme: laguneCode,
      darkTheme: laguneCode,
      additionalLanguages: [
        'javascript',
        'bash',
        'json',
        'python',
        'typescript',
        'markdown',
        'toml',
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
