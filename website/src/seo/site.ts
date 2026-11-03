import type { Messages, TranslationMessages } from '../data/messages';
import { slugOf, text } from '../data/messages';
import { jsonLd } from './jsonLd';

export type SiteMetadatum = Record<string, string>;

export type SiteHeadTag = {
  tagName: string;
  attributes: Record<string, string>;
  innerHTML?: string;
};

export const SITE_URL = 'https://lagune.ai';

export const SITE_TAGLINE = 'Security-Driven Hardening for any codebase';

const AUTHOR_NAME = 'Weslley Araújo';

export const OG_IMAGE = `${SITE_URL}/img/og.png`;

const AUTHOR_EXPERTISE = [
  'Application security',
  'Defensive security',
  'Secure coding',
  'Security-Driven Hardening',
  'Security Hardening',
];

const ORGANIZATION_EXPERTISE = [
  'Application security',
  'AI security',
  'Vulnerability detection',
  'Security-Driven Hardening',
  'Security Hardening',
  'Blue Team',
  'OWASP',
];

const DESCRIPTION_ID = 'site.description';
const KEYWORDS_ID = 'site.keywords';
const IMAGE_ALT_ID = 'site.imageAlt';
const DISAMBIGUATION_ID =
  'structuredData.organization.disambiguatingDescription';

const expertiseId = (subject: 'author' | 'organization', topic: string) =>
  `structuredData.${subject}.knowsAbout.${slugOf(topic)}`;

const expertiseMessages = (
  subject: 'author' | 'organization',
  topics: string[]
): TranslationMessages =>
  Object.fromEntries(
    topics.map((topic) => [
      expertiseId(subject, topic),
      {
        message: topic,
        description: `A field of expertise the ${subject} is known for, in search engines' structured data`,
      },
    ])
  );

export const siteMessages = (): TranslationMessages => ({
  [DESCRIPTION_ID]: {
    message:
      "Lagune is your security copilot as you build, your Blue Team when you audit, whether you're a developer or not.",
    description:
      'The one-sentence summary of Lagune, shown in search results, link previews, and the home page',
  },
  [KEYWORDS_ID]: {
    message:
      'security, application security, AI security, security hardening, secure coding, vulnerability detection, defensive security, blue team, AI agents, Claude Code, vibe coding, npx, OWASP, Lagune AI, Lagune IA, SDH, Spec-Driven, SDH Lagune, Security-Driven Hardening',
    description:
      'The comma-separated search keywords of the whole site, written as people search in this language',
  },
  [IMAGE_ALT_ID]: {
    message: 'Lagune: AI-driven security hardening for any codebase',
    description: 'The alternative text of the image in link previews',
  },
  [DISAMBIGUATION_ID]: {
    message:
      'Lagune (also written Lagune AI) is a Security-Driven Hardening workflow that hardens any codebase, in any language, whether written by humans or an AI. It is not related to Laguna AI.',
    description:
      'Tells search engines and AI assistants which Lagune this is, so it is not confused with a similar name',
  },
  ...expertiseMessages('author', AUTHOR_EXPERTISE),
  ...expertiseMessages('organization', ORGANIZATION_EXPERTISE),
});

export const siteDescriptionIn = (messages: Messages): string =>
  text(messages, DESCRIPTION_ID);

export const siteImageAltIn = (messages: Messages): string =>
  text(messages, IMAGE_ALT_ID);

export const siteMetadata = (messages: Messages): SiteMetadatum[] => [
  { name: 'description', content: siteDescriptionIn(messages) },
  { name: 'keywords', content: text(messages, KEYWORDS_ID) },
  { name: 'author', content: AUTHOR_NAME },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:image:alt', content: siteImageAltIn(messages) },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'Lagune' },
  { property: 'og:image:alt', content: siteImageAltIn(messages) },
  { property: 'og:image:width', content: '1280' },
  { property: 'og:image:height', content: '640' },
  { property: 'og:image:secure_url', content: OG_IMAGE },
];

const structuredData = (data: Record<string, unknown>): SiteHeadTag => ({
  tagName: 'script',
  attributes: { type: 'application/ld+json' },
  innerHTML: jsonLd({ '@context': 'https://schema.org', ...data }),
});

export const siteHeadTags = (messages: Messages): SiteHeadTag[] => [
  {
    tagName: 'link',
    attributes: {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
  },
  {
    tagName: 'meta',
    attributes: {
      name: 'robots',
      content:
        'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    },
  },
  structuredData({
    '@type': 'Person',
    '@id': `${SITE_URL}/#author`,
    name: AUTHOR_NAME,
    url: 'https://github.com/wellwelwel',
    sameAs: ['https://github.com/wellwelwel'],
    knowsAbout: AUTHOR_EXPERTISE.map((topic) =>
      text(messages, expertiseId('author', topic))
    ),
  }),
  structuredData({
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Lagune',
    alternateName: ['Lagune AI', 'Lagune Security', 'lagune', 'lagune.ai'],
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/img/logo.png`,
    description: siteDescriptionIn(messages),
    disambiguatingDescription: text(messages, DISAMBIGUATION_ID),
    foundingDate: '2026',
    founder: { '@id': `${SITE_URL}/#author` },
    knowsAbout: ORGANIZATION_EXPERTISE.map((topic) =>
      text(messages, expertiseId('organization', topic))
    ),
    sameAs: [
      'https://github.com/wellwelwel/lagune',
      'https://www.npmjs.com/package/lagune',
    ],
  }),
];
