import type { Messages, TranslationMessages } from '../../src/data/messages';
import {
  featuredAgentsIn,
  UNIVERSAL_INSTALL,
  universalIn,
} from '../../src/data/agents';
import { badgeMarkdown } from '../../src/data/badges';
import { CATEGORIES_ADD, categoriesIn } from '../../src/data/categories';
import { text } from '../../src/data/messages';
import { SITE_TAGLINE } from '../../src/seo/site';

export type CorpusEntry = {
  title: string;
  description: string | undefined;
  permalink: string;
};

export type CorpusLanguage = {
  label: string;
  url: string;
};

export type CorpusLocale = {
  siteUrl: string;
  baseUrl: string;
  language: string | undefined;
  link: (path: string) => string;
  otherLanguages: CorpusLanguage[];
};

export type MarkdownDocInput = {
  title: string;
  description: string | undefined;
  permalink: string;
  dateModified: string | undefined;
  body: string;
  original: { url: string; stale: boolean } | undefined;
};

type FaqPair = { question: string; answer: string };

type ImageAttributes = { src: string; alt: string };

const frontmatterBlock = /^---\n[\s\S]*?\n---\n/;
const fenceLine = /^`{3,}/;
const importLine = /^import\s+(?:.+\s+from\s+)?['"][^'"]+['"];?\s*$/;
const admonitionOpen = /^:{3,}([a-z]+)(?:\[(.+)\])?\s*$/;
const admonitionClose = /^:{3,}\s*$/;
const tabItemLabel = /label=["']([^"']+)["']/;
const selfClosingComponent = /^<[A-Z][A-Za-z0-9]*(?:\s[^>]*)?\/>$/;
const faqEntry =
  /(question|answer)\s*:\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g;

const ADMONITION_TITLES: Record<string, string> = {
  tip: 'Tip',
  note: 'Note',
  info: 'Info',
  warning: 'Warning',
  danger: 'Danger',
  caution: 'Caution',
};

const FAQ_HEADING_ID = 'corpus.faqHeading';
const CATALOG_NOTE_ID = 'corpus.catalogOverviewNote';
const CATEGORIES_COMMAND_ID = 'corpus.categoriesCommand';
const CANONICAL_LABEL_ID = 'corpus.canonicalLabel';
const LAST_UPDATED_LABEL_ID = 'corpus.lastUpdatedLabel';
const LANGUAGE_LABEL_ID = 'corpus.languageLabel';
const ORIGINAL_LABEL_ID = 'corpus.originalLabel';
const STALE_NOTICE_ID = 'corpus.staleNotice';
const ORIGINAL_LINK_ID = 'corpus.originalLink';
const LANGUAGES_HEADING_ID = 'corpus.languagesHeading';
const TAGLINE_ID = 'corpus.tagline';
const SUMMARY_ID = 'corpus.summary';
const LINKS_NOTE_ID = 'corpus.linksNote';
const DOCS_HEADING_ID = 'corpus.docsHeading';

const admonitionTitleId = (type: string): string => `corpus.admonition.${type}`;

export const corpusMessages = (): TranslationMessages => ({
  [TAGLINE_ID]: {
    message: SITE_TAGLINE,
    description: 'The tagline under the title of the AI corpus (llms.txt)',
  },
  [SUMMARY_ID]: {
    message:
      'Lagune is an open-source, defense-only Security-Driven Hardening (SDH) workflow. It helps your AI agent harden any codebase in any language, at every moment: the charter sets the security rules before you build, the universal /lagune command hardens work as it is written, and the five-phase Blue Team flow detects what your system actually does and drives the fixes that matter for that context. Its commands install into your agent with the skills CLI, and it needs no API key.',
    description:
      'The paragraph that introduces Lagune to AI assistants at the top of the AI corpus (llms.txt and llms-full.txt)',
  },
  [LINKS_NOTE_ID]: {
    message:
      'Every link under Docs points to the plain-Markdown version of that page. Remove the .md suffix for the web page. The whole corpus in one file: {url}',
    description:
      'Explains the links of the AI corpus index (llms.txt), where {url} is the address of the whole corpus in one file',
  },
  [DOCS_HEADING_ID]: {
    message: 'Docs',
    description:
      'The heading of the list of pages in the AI corpus index (llms.txt)',
  },
  ...Object.fromEntries(
    Object.entries(ADMONITION_TITLES).map(([type, title]) => [
      admonitionTitleId(type),
      {
        message: title,
        description: `The title a ${type} callout without its own title takes in the Markdown copy of a page`,
      },
    ])
  ),
  [FAQ_HEADING_ID]: {
    message: 'Frequently Asked Questions',
    description:
      "The heading of a page's questions and answers in its Markdown copy",
  },
  [CATALOG_NOTE_ID]: {
    message:
      'The interactive catalog overview lives on the web page. Every built-in specialization is in the table below.',
    description:
      'Replaces the interactive catalog overview in the Markdown copy of the catalog page',
  },
  [CATEGORIES_COMMAND_ID]: {
    message:
      'Run `{command} --categories` with the keys of the categories you choose.',
    description:
      'Closes the list of categories in the Markdown copy of a page, where {command} is the command that adds them',
  },
  [CANONICAL_LABEL_ID]: {
    message: 'Canonical',
    description:
      'The label before the web address of the page a Markdown copy comes from',
  },
  [LAST_UPDATED_LABEL_ID]: {
    message: 'Last updated',
    description: 'The label before the date a Markdown copy was last changed',
  },
  [LANGUAGE_LABEL_ID]: {
    message: 'Language',
    description:
      'The label before the language code of a translated Markdown copy',
  },
  [ORIGINAL_LABEL_ID]: {
    message: 'Original',
    description:
      'The label before the web address of the English page a translated Markdown copy comes from',
  },
  [STALE_NOTICE_ID]: {
    message:
      'This page is outdated compared to its English version. {original}.',
    description:
      'The status line under the title of a translated Markdown copy that fell behind its English source, where {original} is the link to the English page',
  },
  [ORIGINAL_LINK_ID]: {
    message: 'Read the original version',
    description:
      'The link to the English page at the end of the status line of an outdated Markdown copy',
  },
  [LANGUAGES_HEADING_ID]: {
    message: 'Other languages',
    description:
      'The heading of the list of the AI corpus in every other language (llms.txt)',
  },
});

const unquote = (literal: string): string =>
  literal.slice(1, -1).replace(/\\(['"\\])/g, '$1');

const extractFaqPairs = (block: string): FaqPair[] => {
  const pairs: FaqPair[] = [];
  let question: string | undefined;

  for (const match of block.matchAll(faqEntry)) {
    const key = match[1];
    const literal = match[2];
    if (literal === undefined) continue;

    if (key === 'question') question = unquote(literal);
    else if (question !== undefined) {
      pairs.push({ question, answer: unquote(literal) });
      question = undefined;
    }
  }

  return pairs;
};

const renderFaq = (pairs: FaqPair[], messages: Messages): string[] =>
  pairs.length === 0
    ? []
    : [
        `## ${text(messages, FAQ_HEADING_ID)}`,
        '',
        ...pairs.flatMap((pair) => [
          `### ${pair.question}`,
          '',
          pair.answer,
          '',
        ]),
      ];

const readImage = (block: string): ImageAttributes | undefined => {
  const src = block.match(/src=["']([^"']+)["']/)?.[1];
  if (src === undefined) return undefined;

  return { src, alt: block.match(/alt=["']([^"']*)["']/)?.[1] ?? '' };
};

const renderImage = (block: string): string[] => {
  const image = readImage(block);
  if (image === undefined) return [];

  return [`![${image.alt}](${image.src})`, ''];
};

const renderBadge = (block: string): string[] => {
  const image = readImage(block);
  if (image === undefined) return [];

  return [
    `![${image.alt}](${image.src})`,
    '',
    '```md',
    badgeMarkdown(image.alt, image.src),
    '```',
    '',
  ];
};

const renderAgentPicker = (messages: Messages): string[] => {
  const universal = universalIn(messages);

  return [
    ...featuredAgentsIn(messages).map(
      (agent) => `- [${agent.name}](${agent.install}): ${agent.description}`
    ),
    `- [${universal.title}](${UNIVERSAL_INSTALL}): ${universal.summary}`,
    '',
  ];
};

const renderCategoryPicker = (messages: Messages): string[] => [
  ...categoriesIn(messages).map(
    (category) =>
      `- **${category.name}** (\`${category.key}\`): ${category.description}`
  ),
  '',
  text(messages, CATEGORIES_COMMAND_ID, { command: CATEGORIES_ADD }),
];

const readJsxBlock = (
  lines: string[],
  start: number
): { block: string; nextIndex: number } => {
  let end = start;
  while (end < lines.length && !(lines[end] ?? '').trim().endsWith('/>'))
    end += 1;

  return {
    block: lines.slice(start, end + 1).join('\n'),
    nextIndex: end + 1,
  };
};

const transformInline = (
  line: string,
  link: (path: string) => string
): string =>
  line
    .replace(
      /<ArrowLink\s+to=["']([^"']+)["']\s*>(.*?)<\/ArrowLink>/g,
      '[$2]($1)'
    )
    .replace(/<Level\s+value=\{(\d+)\}\s*\/>/g, '$1/5')
    .replace(/\]\((\/[^)\s]*)/g, (_match, path: string) => `](${link(path)}`);

export const cleanMdxBody = (
  source: string,
  link: (path: string) => string,
  messages: Messages
): string => {
  const lines = source.replace(frontmatterBlock, '').split('\n');
  const output: string[] = [];
  let lastBlank = true;
  let inFence = false;

  const emit = (line: string): void => {
    const blank = line.trim() === '';
    if (blank && lastBlank) return;
    output.push(line);
    lastBlank = blank;
  };

  const emitRaw = (line: string): void => {
    output.push(line);
    lastBlank = line.trim() === '';
  };

  let index = 0;
  while (index < lines.length) {
    const line = lines[index] ?? '';
    const trimmed = line.trim();

    if (inFence) {
      emitRaw(line);
      if (fenceLine.test(trimmed)) inFence = false;
      index += 1;
      continue;
    }

    if (fenceLine.test(trimmed)) {
      inFence = true;
      emit(line);
      index += 1;
      continue;
    }

    if (importLine.test(trimmed)) {
      index += 1;
      continue;
    }

    const admonition = trimmed.match(admonitionOpen);
    if (admonition) {
      const type = admonition[1] ?? '';
      const title =
        admonition[2] ??
        text(
          messages,
          admonitionTitleId(
            Object.hasOwn(ADMONITION_TITLES, type) ? type : 'note'
          )
        );
      emit('');
      emit(`**${title}**`);
      emit('');
      index += 1;
      continue;
    }

    if (admonitionClose.test(trimmed)) {
      emit('');
      index += 1;
      continue;
    }

    if (
      trimmed === '<Tabs>' ||
      (trimmed.startsWith('<Tabs ') && trimmed.endsWith('>')) ||
      trimmed === '</Tabs>' ||
      trimmed === '</TabItem>' ||
      (trimmed.startsWith('<div') && trimmed.endsWith('>')) ||
      trimmed === '</div>'
    ) {
      emit('');
      index += 1;
      continue;
    }

    if (trimmed.startsWith('<TabItem')) {
      const label = trimmed.match(tabItemLabel)?.[1];
      emit('');
      if (label !== undefined) {
        emit(`**${label}**`);
        emit('');
      }
      index += 1;
      continue;
    }

    if (trimmed.startsWith('<Faq')) {
      const { block, nextIndex } = readJsxBlock(lines, index);
      emit('');
      for (const faqLine of renderFaq(extractFaqPairs(block), messages))
        emit(transformInline(faqLine, link));
      index = nextIndex;
      continue;
    }

    if (trimmed.startsWith('<img')) {
      const { block, nextIndex } = readJsxBlock(lines, index);
      for (const imageLine of renderImage(block))
        emit(transformInline(imageLine, link));
      index = nextIndex;
      continue;
    }

    if (trimmed.startsWith('<Badge')) {
      const { block, nextIndex } = readJsxBlock(lines, index);
      for (const badgeLine of renderBadge(block)) emit(badgeLine);
      index = nextIndex;
      continue;
    }

    if (trimmed.startsWith('<CatalogOverview')) {
      emit(`*${text(messages, CATALOG_NOTE_ID)}*`);
      index += 1;
      continue;
    }

    if (trimmed.startsWith('<AgentPicker')) {
      for (const agentLine of renderAgentPicker(messages))
        emit(transformInline(agentLine, link));
      index += 1;
      continue;
    }

    if (trimmed.startsWith('<CategoryPicker')) {
      for (const categoryLine of renderCategoryPicker(messages))
        emit(categoryLine);
      index += 1;
      continue;
    }

    if (selfClosingComponent.test(trimmed)) {
      index += 1;
      continue;
    }

    emit(transformInline(line, link));
    index += 1;
  }

  return output.join('\n');
};

const stripLeadingH1 = (markdown: string): string => {
  const lines = markdown.split('\n');
  const first = lines.findIndex((line) => line.trim() !== '');
  if (first === -1 || !(lines[first] ?? '').startsWith('# ')) return markdown;
  return lines.slice(first + 1).join('\n');
};

const staleNotice = (messages: Messages, originalUrl: string): string =>
  text(messages, STALE_NOTICE_ID, {
    original: `[${text(messages, ORIGINAL_LINK_ID)}](${originalUrl})`,
  });

export const renderDocMarkdown = (
  input: MarkdownDocInput,
  corpus: CorpusLocale,
  messages: Messages
): string => {
  const body = stripLeadingH1(
    cleanMdxBody(input.body, corpus.link, messages)
  ).trim();
  const header = [
    `# ${input.title}`,
    '',
    ...(input.original?.stale
      ? [`> ${staleNotice(messages, input.original.url)}`, '']
      : []),
    ...(input.description ? [`> ${input.description}`, ''] : []),
    `${text(messages, CANONICAL_LABEL_ID)}: ${corpus.siteUrl}${input.permalink}`,
    ...(corpus.language
      ? [`${text(messages, LANGUAGE_LABEL_ID)}: ${corpus.language}`]
      : []),
    ...(input.original
      ? [`${text(messages, ORIGINAL_LABEL_ID)}: ${input.original.url}`]
      : []),
    ...(input.dateModified
      ? [
          `${text(messages, LAST_UPDATED_LABEL_ID)}: ${input.dateModified.slice(0, 10)}`,
        ]
      : []),
    '',
  ];

  return `${[...header, body].join('\n')}\n`;
};

export const renderCorpusHeader = (messages: Messages): string[] => [
  '# Lagune',
  '',
  `> ${text(messages, TAGLINE_ID)}`,
  '',
  text(messages, SUMMARY_ID),
];

export const renderCorpusIndex = ({
  entries,
  corpus,
  messages,
}: {
  entries: CorpusEntry[];
  corpus: CorpusLocale;
  messages: Messages;
}): string =>
  [
    ...renderCorpusHeader(messages),
    '',
    text(messages, LINKS_NOTE_ID, {
      url: `${corpus.siteUrl}${corpus.baseUrl}llms-full.txt`,
    }),
    '',
    `## ${text(messages, DOCS_HEADING_ID)}`,
    '',
    ...entries.map((entry) => {
      const url = `${corpus.siteUrl}${entry.permalink}.md`;

      return entry.description
        ? `- [${entry.title}](${url}): ${entry.description}`
        : `- [${entry.title}](${url})`;
    }),
    ...(corpus.otherLanguages.length > 0
      ? [
          '',
          `## ${text(messages, LANGUAGES_HEADING_ID)}`,
          '',
          ...corpus.otherLanguages.map(
            ({ label, url }) => `- [${label}](${url})`
          ),
        ]
      : []),
    '',
  ].join('\n');
