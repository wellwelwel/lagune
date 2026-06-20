import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Blue Spec',
  tagline: 'Security-Driven Hardening for AI-built software',
  favicon: 'favicon.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
    // faster: true,
  },

  url: 'https://bluespec.weslley.io',
  baseUrl: '/',
  trailingSlash: false,
  organizationName: 'wellwelwel',
  projectName: 'blue-spec',
  deploymentBranch: 'website',

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'ignore',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  headTags: [
    {
      tagName: 'link',
      attributes: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800;900&family=Inter:wght@400;500;600;700&family=Ubuntu+Mono:wght@400;700&display=swap',
      },
    },
  ],

  plugins: [
    function tailwindPlugin() {
      return {
        name: 'tailwind-plugin',
        configurePostCss(postcssOptions) {
          postcssOptions.plugins.push(require('@tailwindcss/postcss'));
          return postcssOptions;
        },
      };
    },
  ],

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexDocs: true,
        indexPages: false,
        indexBlog: false,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
        searchBarShortcut: true,
        searchBarShortcutHint: true,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/wellwelwel/blue-spec/edit/main/website/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Blue Spec',
      logo: {
        alt: 'Blue Spec',
        src: 'favicon.png',
        href: '/',
      },
      hideOnScroll: true,
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/',
          label: 'Home',
          position: 'left',
        },
        {
          href: 'https://github.com/wellwelwel/blue-spec',
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
            { label: 'Get Started', to: '/docs/get-started/install' },
            { label: 'Commands', to: '/docs/commands/charter' },
            { label: 'Skills', to: '/docs/commands/skills' },
          ],
        },
        {
          title: 'Project',
          items: [
            { label: 'Home', to: '/' },
            {
              label: 'GitHub',
              href: 'https://github.com/wellwelwel/blue-spec',
            },
            {
              label: 'npm',
              href: 'https://www.npmjs.com/package/blue-spec',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Security Policy',
              href: 'https://github.com/wellwelwel/blue-spec/blob/main/SECURITY.md',
            },
            {
              label: 'License',
              href: 'https://github.com/wellwelwel/blue-spec/blob/main/LICENSE',
            },
            {
              label: 'Sponsor',
              href: 'https://github.com/sponsors/wellwelwel',
            },
          ],
        },
      ],
      copyright: `Copyright © 2026-present Weslley Araújo and contributors. Blue Spec is under the MIT License.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'python'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
