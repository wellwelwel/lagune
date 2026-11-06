import { fromMarkdown } from 'mdast-util-from-markdown';
import remarkDirective from 'remark-directive';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { parseCliArgs } from '../../src/cli/parse-args';
import { runsCommand, toolBehind } from '../../src/mcp/tools';
import { TOKEN } from '../../website/plugins/docs-content/token-pattern';
import { frontmatterOf, splitPage } from './frontmatter';
import { isRecord } from './guards';

type CodeBlock = {
  lang: string | undefined;
  meta: string | undefined;
  value: string;
};

type Features = {
  esm: string[];
  expressions: string[];
  elements: string[];
  directives: string[];
  codeBlocks: CodeBlock[];
  inlineCode: string[];
  urls: string[];
  texts: string[];
};

type Shape = {
  shape: unknown;
  texts: string[];
};

type Diagram = {
  structure: string[];
  labels: string[];
};

type MaskedLine = {
  line: string;
  labels: string[];
};

const TRANSLATABLE_ATTRIBUTES = new Set(['label', 'title', 'alt']);
const TRANSLATABLE_PROPERTIES = new Set([
  'question',
  'answer',
  'label',
  'title',
  'alt',
  'description',
]);
const TRANSLATABLE_FRONTMATTER = new Set([
  'title',
  'sidebar_label',
  'description',
  'keywords',
]);
const LINK_ATTRIBUTES = new Set(['href', 'to', 'src']);
const POSITION_KEYS = new Set([
  'start',
  'end',
  'loc',
  'range',
  'raw',
  'comments',
]);
const TEXT_PLACEHOLDER = '<translatable text>';

const URL_PATTERN =
  /\b(?:[a-z][a-z0-9+.-]*:\/\/|www\.|mailto:)[^\s<>"'`)\]}“”‘’«»]+/gi;
const TRAILING_PUNCTUATION = /[.,;:!?]+$/;
const PLACEHOLDER = /\{\w+\}/g;
const CODE_SPAN = /`[^`]+`/g;
const SLASH_COMMAND = /(?<![\w/.:@-])\/[a-z][\w:-]*/g;
const CLI_RUNNER = /^(?:npx|npm|pnpm|yarn|bunx)$/;
const CLI_WORD = /^[a-z][a-z0-9]*$/;
const CLI_FLAG = /^-{1,2}[A-Za-z]/;
const CLI_WORD_LIMIT = 3;
const ENGINE_PACKAGE = 'lagune';
const SENTENCE_CLOSE = /[.,;:!?]$/;
const PROMPT_FIXED =
  /`[^`\n]+`|<[A-Za-z][\w-]*>|(?<![\w/])[\w.@~-]*\/[\w.@~/:-]*/g;
const WRAPPING_PUNCTUATION = /^[("'“”‘’«»[]+|[)"'“”‘’«»\].,;:!?]+$/g;
const QUOTES_AND_BRACKETS = /^[("'“”‘’«»[]+|[)"'“”‘’«»\]]+$/g;
const REGEX_SPECIAL = /[.*+?^${}()|[\]\\]/g;
const QUOTED_PHRASE = /^(["'“‘])(.*)(["'”’])$/su;
const QUOTE_PAIRS: Record<string, string> = {
  '"': '"',
  "'": "'",
  '“': '”',
  '‘': '’',
};
const PHRASE_CODE_CHARACTER = /[()[\]{}<>/\\=;_$@#|*`~^&%+]/;
const PHRASE_WORDS =
  /\p{L}\p{M}*[\s\u00a0]+\p{L}|[\p{sc=Han}\p{sc=Hiragana}\p{sc=Katakana}]{2}/u;
const MERMAID_QUOTED_LABEL = /"([^"]*)"/g;
const MERMAID_SHAPE_LABEL =
  /(?<=[\w-])(\[\[|\[\(|\(\(|\(\[|\{\{|\[|\(|\{)(?!")([^\]\)\}"]+?)(\]\]|\)\]|\)\)|\]\)|\}\}|\]|\)|\})/g;
const MERMAID_EDGE_LABEL = /\|(?!")([^|"]+)\|/g;
const MERMAID_STATE_LABEL = /^([^:]+?)\s*:\s*(.+)$/;
const MERMAID_LINE_BREAK = /<br\s*\/?>/gi;
const MERMAID_COMMENT = /^%%/;
const STATE_DIAGRAM = /^stateDiagram(?:-v2)?\b/;

const EMPTY: Features = {
  esm: [],
  expressions: [],
  elements: [],
  directives: [],
  codeBlocks: [],
  inlineCode: [],
  urls: [],
  texts: [],
};

const processor = unified()
  .use(remarkParse)
  .use(remarkMdx)
  .use(remarkDirective);

const stringField = (
  record: Record<string, unknown>,
  key: string
): string | undefined => {
  const value = record[key];

  return typeof value === 'string' ? value : undefined;
};

const matchesOf = (text: string, pattern: RegExp): string[] =>
  [...text.matchAll(pattern)].map(([match]) => match);

const urlsIn = (text: string): string[] =>
  matchesOf(text, URL_PATTERN).map((url) =>
    url.replace(TRAILING_PUNCTUATION, '')
  );

const merge = (...parts: Features[]): Features => ({
  esm: parts.flatMap((part) => part.esm),
  expressions: parts.flatMap((part) => part.expressions),
  elements: parts.flatMap((part) => part.elements),
  directives: parts.flatMap((part) => part.directives),
  codeBlocks: parts.flatMap((part) => part.codeBlocks),
  inlineCode: parts.flatMap((part) => part.inlineCode),
  urls: parts.flatMap((part) => part.urls),
  texts: parts.flatMap((part) => part.texts),
});

const translatableProperty = (
  node: Record<string, unknown>
): string | undefined => {
  if (node.type !== 'Property' || node.computed === true) return undefined;

  const key = node.key;
  const value = node.value;

  if (!isRecord(key) || !isRecord(value) || value.type !== 'Literal')
    return undefined;

  const name = stringField(key, 'name') ?? stringField(key, 'value');
  const text = stringField(value, 'value');

  return name !== undefined && TRANSLATABLE_PROPERTIES.has(name)
    ? text
    : undefined;
};

const comparableShape = (value: unknown): Shape => {
  if (Array.isArray(value)) {
    const items = value.map(comparableShape);

    return {
      shape: items.map((item) => item.shape),
      texts: items.flatMap((item) => item.texts),
    };
  }

  if (typeof value === 'bigint') return { shape: `${value}n`, texts: [] };
  if (!isRecord(value)) return { shape: value, texts: [] };

  const translatable = translatableProperty(value);

  if (translatable !== undefined)
    return {
      shape: {
        type: 'Property',
        key: comparableShape(value.key).shape,
        value: TEXT_PLACEHOLDER,
      },
      texts: [translatable],
    };

  const entries = Object.entries(value)
    .filter(([key]) => !POSITION_KEYS.has(key))
    .map(([key, item]) => ({ key, ...comparableShape(item) }));

  return {
    shape: Object.fromEntries(entries.map(({ key, shape }) => [key, shape])),
    texts: entries.flatMap((entry) => entry.texts),
  };
};

const literalStrings = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.flatMap(literalStrings);
  if (!isRecord(value)) return [];

  const own =
    value.type === 'Literal' && typeof value.value === 'string'
      ? [value.value]
      : [];

  return [
    ...own,
    ...Object.entries(value)
      .filter(([key]) => !POSITION_KEYS.has(key))
      .flatMap(([, item]) => literalStrings(item)),
  ];
};

const estreeOf = (node: Record<string, unknown>): unknown =>
  isRecord(node.data) ? node.data.estree : undefined;

const programFeatures = (
  node: Record<string, unknown>,
  kind: 'esm' | 'expressions'
): Features => {
  const estree = estreeOf(node);
  const { shape } = comparableShape(estree ?? stringField(node, 'value'));

  return {
    ...EMPTY,
    [kind]: [JSON.stringify(shape)],
    urls: literalStrings(estree).flatMap(urlsIn),
  };
};

const attributeFeatures = (
  attribute: unknown
): Features & { signature: unknown } => {
  if (!isRecord(attribute)) return { ...EMPTY, signature: attribute };

  if (attribute.type === 'mdxJsxExpressionAttribute') {
    const estree = estreeOf(attribute);

    return {
      ...EMPTY,
      signature: { spread: comparableShape(estree ?? attribute.value).shape },
      urls: literalStrings(estree).flatMap(urlsIn),
    };
  }

  const name = stringField(attribute, 'name') ?? '';
  const value = attribute.value;

  if (typeof value === 'string') {
    const urls = [
      ...urlsIn(value),
      ...(LINK_ATTRIBUTES.has(name) ? [value] : []),
    ];

    if (TRANSLATABLE_ATTRIBUTES.has(name))
      return {
        ...EMPTY,
        signature: { name, value: TEXT_PLACEHOLDER },
        texts: [value],
        urls,
      };

    return { ...EMPTY, signature: { name, value }, urls };
  }

  if (!isRecord(value)) return { ...EMPTY, signature: { name } };

  const estree = estreeOf(value);
  const { shape, texts } = comparableShape(estree ?? value.value);

  return {
    ...EMPTY,
    signature: { name, expression: shape },
    texts,
    urls: literalStrings(estree).flatMap(urlsIn),
  };
};

const elementFeatures = (node: Record<string, unknown>): Features => {
  const attributes = Array.isArray(node.attributes) ? node.attributes : [];
  const parts = attributes.map(attributeFeatures);

  return merge(
    {
      ...EMPTY,
      elements: [
        JSON.stringify({
          name: node.name ?? null,
          attributes: parts.map((part) => part.signature),
        }),
      ],
    },
    ...parts
  );
};

const ownFeatures = (node: Record<string, unknown>): Features => {
  const value = stringField(node, 'value') ?? '';

  switch (node.type) {
    case 'mdxjsEsm':
      return programFeatures(node, 'esm');
    case 'mdxFlowExpression':
    case 'mdxTextExpression':
      return programFeatures(node, 'expressions');
    case 'mdxJsxFlowElement':
    case 'mdxJsxTextElement':
      return elementFeatures(node);
    case 'containerDirective':
    case 'leafDirective':
      return {
        ...EMPTY,
        directives: [
          JSON.stringify({
            type: node.type,
            name: node.name,
            attributes: node.attributes ?? null,
          }),
        ],
      };
    case 'code':
      return {
        ...EMPTY,
        codeBlocks: [
          {
            lang: stringField(node, 'lang'),
            meta: stringField(node, 'meta'),
            value,
          },
        ],
        urls: urlsIn(value),
      };
    case 'inlineCode':
      return { ...EMPTY, inlineCode: [value], urls: urlsIn(value) };
    case 'link':
    case 'image':
    case 'definition':
      return { ...EMPTY, urls: [stringField(node, 'url') ?? ''] };
    default:
      return { ...EMPTY, urls: urlsIn(value) };
  }
};

const featuresOf = (node: unknown): Features => {
  if (!isRecord(node)) return EMPTY;

  const children = Array.isArray(node.children) ? node.children : [];

  return merge(ownFeatures(node), ...children.map(featuresOf));
};

const bodyFeatures = (text: string): Features | Error => {
  try {
    return featuresOf(
      processor.parse(
        splitPage(text).body.replace(TOKEN, (_token, name: string) => name)
      )
    );
  } catch (error) {
    return error instanceof Error ? error : new Error(String(error));
  }
};

const sorted = (values: string[]): string[] =>
  [...values].sort((left, right) => left.localeCompare(right));

const sameList = (left: string[], right: string[]): boolean =>
  left.length === right.length &&
  left.every((value, index) => value === right[index]);

const occurrences = (text: string, fragment: string): number =>
  matchesOf(
    text,
    new RegExp(
      `(?<![\\w@/-])${fragment.replace(REGEX_SPECIAL, '\\$&')}(?![\\w@/-])`,
      'g'
    )
  ).length;

const countOf = (values: string[], value: string): number =>
  values.filter((item) => item === value).length;

const multisetMissing = (expected: string[], actual: string[]): string[] =>
  [...new Set(expected)].flatMap((value) =>
    Array.from(
      {
        length: Math.max(0, countOf(expected, value) - countOf(actual, value)),
      },
      () => value
    )
  );

const isPathLike = (token: string): boolean =>
  token.includes('/') &&
  /[a-z0-9]/i.test(token) &&
  (!/[A-Z]/.test(token) || /^[.@~/]/.test(token) || /\.[a-z0-9]+$/.test(token));

const isCodeLike = (token: string): boolean =>
  /[@_\\{}<>=]/.test(token) ||
  /\w\(/.test(token) ||
  CLI_FLAG.test(token) ||
  isPathLike(token);

const codeLikeTokens = (text: string): string[] =>
  text
    .replace(TOKEN, ' ')
    .replace(PLACEHOLDER, ' ')
    .split(/\s+/)
    .map((token) => token.replace(WRAPPING_PUNCTUATION, ''))
    .filter((token) => token !== '' && isCodeLike(token));

type CommandToken = {
  raw: string;
  word: string;
  closes: boolean;
};

const commandTokenOf = (raw: string): CommandToken => {
  const unwrapped = raw.replace(QUOTES_AND_BRACKETS, '');

  return {
    raw,
    word: unwrapped.replace(TRAILING_PUNCTUATION, ''),
    closes: SENTENCE_CLOSE.test(unwrapped),
  };
};

const isArgument = (token: CommandToken | undefined): boolean =>
  token !== undefined && token.word !== '' && isCodeLike(token.word);

/** How many command words follow the runner: the engine's own grammar for lagune, a package and one subcommand for any other */
const commandWordCount = (tokens: CommandToken[]): number => {
  const [packageName, first, second] = tokens.map(({ word }) => word);

  if (packageName === undefined || !CLI_WORD.test(packageName)) return 0;
  if (packageName !== ENGINE_PACKAGE)
    return first !== undefined && CLI_WORD.test(first) && !tokens[0]?.closes
      ? 2
      : 1;

  const tool = toolBehind(first);

  if (tool !== undefined && runsCommand(tool, second)) return 3;
  if (parseCliArgs([first ?? '']).command !== undefined) return 2;

  return 1;
};

const argumentCount = (tokens: CommandToken[], index: number): number => {
  const token = tokens[index];
  const previous = tokens[index - 1];

  if (token === undefined) return 0;

  const isFlagValue =
    previous !== undefined &&
    CLI_FLAG.test(previous.word) &&
    !previous.closes &&
    CLI_WORD.test(token.word) &&
    (token.closes || isArgument(tokens[index + 1]));

  if (!isArgument(token) && !isFlagValue) return 0;
  if (token.closes) return 1;

  return 1 + argumentCount(tokens, index + 1);
};

const trimmedEnd = (raw: string): string =>
  raw.replace(/[)"'“”‘’«»\]]*[.,;:!?]*[)"'“”‘’«»\]]*$/, '');

/** The command a runner such as npx starts, kept only when it has arguments, follows the engine's grammar, or closes a sentence */
const commandAt = (
  tokens: CommandToken[],
  index: number
): string | undefined => {
  const rest = tokens.slice(index + 1);
  const words = Math.min(commandWordCount(rest), CLI_WORD_LIMIT);
  const closedAt = rest.slice(0, words).findIndex(({ closes }) => closes);
  const wordCount = closedAt === -1 ? words : closedAt + 1;
  const argumentsCount = closedAt === -1 ? argumentCount(rest, wordCount) : 0;
  const span = rest.slice(0, wordCount + argumentsCount);
  const isEngine = rest[0]?.word === ENGINE_PACKAGE;
  const closes = span.at(-1)?.closes ?? false;

  if (span.length === 0 || (!isEngine && argumentsCount === 0 && !closes))
    return undefined;

  const lastIndex = span.length - 1;

  return [
    tokens[index]?.word ?? '',
    ...span.map(({ raw }, position) =>
      position === lastIndex ? trimmedEnd(raw) : raw
    ),
  ].join(' ');
};

const commandSpans = (text: string): string[] => {
  const tokens = text.split(/\s+/).map(commandTokenOf);

  return tokens.flatMap(({ word }, index) => {
    if (!CLI_RUNNER.test(word)) return [];

    const span = commandAt(tokens, index);

    return span === undefined ? [] : [span];
  });
};

const protectedFragments = (text: string): string[] => [
  ...urlsIn(text),
  ...matchesOf(text, TOKEN),
  ...matchesOf(text, PLACEHOLDER),
  ...matchesOf(text, CODE_SPAN),
  ...matchesOf(text, SLASH_COMMAND),
  ...commandSpans(text),
  ...codeLikeTokens(text),
];

const promptFixedTokens = (value: string): string[] =>
  matchesOf(value, PROMPT_FIXED)
    .map((token) => token.replace(/[.,;:!?)]+$/, ''))
    .filter((token) => token !== '' && token !== '/');

const labelText = (label: string): string =>
  label.replace(MERMAID_LINE_BREAK, ' ').replaceAll('&quot;', '"');

const labelPlaceholder = (label: string): string =>
  `<label ${matchesOf(label, MERMAID_LINE_BREAK).length} line breaks>`;

const maskPattern = (
  masked: MaskedLine,
  pattern: RegExp,
  wrap: (placeholder: string, match: RegExpMatchArray) => string,
  labelGroup: number
): MaskedLine => {
  const matches = [...masked.line.matchAll(pattern)];
  const line = matches.reduceRight((text, match) => {
    const start = match.index ?? 0;
    const replacement = wrap(labelPlaceholder(match[labelGroup] ?? ''), match);

    return `${text.slice(0, start)}${replacement}${text.slice(start + match[0].length)}`;
  }, masked.line);

  return {
    line,
    labels: [
      ...masked.labels,
      ...matches.map((match) => match[labelGroup] ?? ''),
    ],
  };
};

const maskStateLabel = (masked: MaskedLine): MaskedLine => {
  const match = masked.line.match(MERMAID_STATE_LABEL);

  if (!match) return masked;

  const [, states = '', label = ''] = match;

  return {
    line: `${states}: ${labelPlaceholder(label)}`,
    labels: [...masked.labels, label],
  };
};

/** A Mermaid diagram split into the structure a translation keeps and the labels it translates */
const diagramOf = (value: string): Diagram => {
  const lines = value
    .split('\n')
    .map((line) => line.trim().replace(/\s+/g, ' '))
    .filter((line) => line !== '');
  const isStateDiagram = STATE_DIAGRAM.test(lines[0] ?? '');
  const masked = lines.map((line): MaskedLine => {
    if (MERMAID_COMMENT.test(line))
      return { line: '%%', labels: [line.slice(2).trim()] };

    const quoted = maskPattern(
      { line, labels: [] },
      MERMAID_QUOTED_LABEL,
      (placeholder) => `"${placeholder}"`,
      1
    );
    const shaped = maskPattern(
      quoted,
      MERMAID_SHAPE_LABEL,
      (placeholder, match) =>
        `${match[1] ?? ''}${placeholder}${match[3] ?? ''}`,
      2
    );
    const edged = maskPattern(
      shaped,
      MERMAID_EDGE_LABEL,
      (placeholder) => `|${placeholder}|`,
      1
    );

    return isStateDiagram ? maskStateLabel(edged) : edged;
  });

  return {
    structure: masked.map(({ line }) => line),
    labels: masked.flatMap(({ labels }) => labels),
  };
};

const diagramParity = (
  position: string,
  english: string,
  translated: string
): string[] => {
  const source = diagramOf(english);
  const target = diagramOf(translated);
  const changedLine = source.structure.findIndex(
    (line, index) => line !== target.structure[index]
  );

  if (changedLine !== -1 || source.structure.length !== target.structure.length)
    return [
      `${position} changes its diagram structure${changedLine === -1 ? '' : ` at "${source.structure[changedLine]}"`}, where only the labels translate`,
    ];

  return source.labels.flatMap((label, index) =>
    textParity(labelText(label), labelText(target.labels[index] ?? '')).map(
      (problem) => `${position} label ${index + 1} ${problem}`
    )
  );
};

/** What a translated text drops or adds that its English text must keep: commands, code, tokens, placeholders, and URLs */
export const textParity = (english: string, translated: string): string[] => {
  const dropped = [...new Set(protectedFragments(english))]
    .filter(
      (fragment) =>
        occurrences(translated, fragment) < occurrences(english, fragment)
    )
    .map((fragment) => `drops or changes "${fragment}"`);
  const englishUrls = new Set(urlsIn(english));
  const added = urlsIn(translated)
    .filter((url) => !englishUrls.has(url))
    .map((url) => `adds the URL "${url}"`);

  return [...dropped, ...added];
};

const frontmatterParity = (english: string, translated: string): string[] => {
  const source = frontmatterOf(english) ?? {};
  const target = frontmatterOf(translated);

  if (target === undefined) return ['has no frontmatter'];

  const sourceKeys = Object.keys(source);
  const targetKeys = Object.keys(target).filter((key) => key !== 'source_hash');
  const dropped = sourceKeys
    .filter((key) => !targetKeys.includes(key))
    .map((key) => `drops the frontmatter key "${key}"`);
  const added = targetKeys
    .filter((key) => !sourceKeys.includes(key))
    .map((key) => `adds the frontmatter key "${key}"`);
  const changed = sourceKeys
    .filter(
      (key) =>
        !TRANSLATABLE_FRONTMATTER.has(key) &&
        targetKeys.includes(key) &&
        JSON.stringify(source[key]) !== JSON.stringify(target[key])
    )
    .map(
      (key) => `changes the frontmatter key "${key}", which stays as in English`
    );
  const texts = ['title', 'sidebar_label', 'description'].flatMap((key) => {
    const sourceText = source[key];
    const targetText = target[key];

    return typeof sourceText === 'string' && typeof targetText === 'string'
      ? textParity(sourceText, targetText).map((problem) => `${key} ${problem}`)
      : [];
  });

  return [...dropped, ...added, ...changed, ...texts];
};

const fixedTokenParity = (
  position: string,
  english: string,
  translated: string
): string[] => {
  const sourceTokens = promptFixedTokens(english);
  const targetTokens = promptFixedTokens(translated);

  return [
    ...multisetMissing(sourceTokens, targetTokens).map(
      (token) => `${position} drops or changes the command or path "${token}"`
    ),
    ...multisetMissing(targetTokens, sourceTokens).map(
      (token) => `${position} adds the command or path "${token}"`
    ),
  ];
};

/** A Markdown block split into its prose and the fenced blocks nested in it */
const markdownBlock = (
  value: string
): { prose: string; blocks: CodeBlock[] } => {
  const nested = fromMarkdown(value).children.filter(
    (node) => node.type === 'code'
  );
  const prose = nested.reduceRight((text, node) => {
    const start = node.position?.start.offset ?? 0;
    const end = node.position?.end.offset ?? start;

    return `${text.slice(0, start)}\n${text.slice(end)}`;
  }, value);

  return {
    prose,
    blocks: nested.map((node) => ({
      lang: node.lang ?? undefined,
      meta: node.meta ?? undefined,
      value: node.value,
    })),
  };
};

const codeBlockParity = (
  english: CodeBlock[],
  translated: CodeBlock[],
  label = 'code block'
): string[] => {
  if (english.length !== translated.length)
    return [
      `has ${translated.length} code blocks where English has ${english.length}`,
    ];

  return english.flatMap((source, index) => {
    const target = translated[index];
    const position = `${label} ${index + 1}`;

    if (target === undefined) return [];

    if (source.lang !== target.lang || source.meta !== target.meta)
      return [`${position} changes its language or meta`];

    if (source.lang === 'mermaid')
      return diagramParity(position, source.value, target.value);

    if (source.lang === 'prompt')
      return fixedTokenParity(position, source.value, target.value);

    if (source.lang === 'md') {
      const sourceMarkdown = markdownBlock(source.value);
      const targetMarkdown = markdownBlock(target.value);

      return [
        ...fixedTokenParity(
          position,
          sourceMarkdown.prose,
          targetMarkdown.prose
        ),
        ...codeBlockParity(
          sourceMarkdown.blocks,
          targetMarkdown.blocks,
          `${position} nested block`
        ),
      ];
    }

    return source.value === target.value
      ? []
      : [
          `${position} differs from English, and code blocks stay exactly as in English`,
        ];
  });
};

const quotedPhrase = (span: string): string | undefined => {
  const match = span.match(QUOTED_PHRASE);
  const [, opening = '', phrase = '', closing = ''] = match ?? [];

  if (!match || QUOTE_PAIRS[opening] !== closing) return undefined;
  if (PHRASE_CODE_CHARACTER.test(phrase) || !PHRASE_WORDS.test(phrase))
    return undefined;

  return phrase;
};

const inlineCodeParity = (
  english: string[],
  translated: string[]
): string[] => {
  if (english.length !== translated.length)
    return [
      `has ${translated.length} inline code spans where English has ${english.length}`,
    ];

  return english.flatMap((source, index) => {
    const target = translated[index] ?? '';
    const position = `inline code ${index + 1}`;
    const sourcePhrase = quotedPhrase(source);

    if (sourcePhrase === undefined)
      return source === target
        ? []
        : [
            `${position} changes \`${source}\`, which stays exactly as in English`,
          ];

    const targetPhrase = quotedPhrase(target);

    if (targetPhrase === undefined)
      return [
        `${position} replaces the quoted phrase \`${source}\` with something that is not a quoted phrase`,
      ];

    return textParity(sourcePhrase, targetPhrase).map(
      (problem) => `${position} ${problem}`
    );
  });
};

const listParity = (
  label: string,
  english: string[],
  translated: string[]
): string[] =>
  sameList(english, translated)
    ? []
    : [`changes its ${label}, which stay exactly as in English`];

/** Everything a translated page changes that must stay as in its English source */
export const pageParity = (english: string, translated: string): string[] => {
  const frontmatter = frontmatterParity(english, translated);
  const tokens = sameList(
    sorted(matchesOf(english, TOKEN)),
    sorted(matchesOf(translated, TOKEN))
  )
    ? []
    : [
        'changes its tokens, such as {{version}}, which stay exactly as in English',
      ];
  const source = bodyFeatures(english);
  const target = bodyFeatures(translated);

  if (source instanceof Error)
    return [
      ...frontmatter,
      ...tokens,
      `has an English source that does not parse as MDX: ${source.message}`,
    ];

  if (target instanceof Error)
    return [
      ...frontmatter,
      ...tokens,
      `does not parse as MDX: ${target.message}`,
    ];

  const englishUrls = new Set(source.urls);
  const texts =
    source.texts.length === target.texts.length
      ? source.texts.flatMap((text, index) =>
          textParity(text, target.texts[index] ?? '').map(
            (problem) => `component text ${index + 1} ${problem}`
          )
        )
      : [];

  return [
    ...frontmatter,
    ...tokens,
    ...listParity('imports and exports', source.esm, target.esm),
    ...listParity('expressions', source.expressions, target.expressions),
    ...listParity('components or their ids', source.elements, target.elements),
    ...listParity('callouts', source.directives, target.directives),
    ...codeBlockParity(source.codeBlocks, target.codeBlocks),
    ...inlineCodeParity(source.inlineCode, target.inlineCode),
    ...[...new Set(target.urls)]
      .filter((url) => !englishUrls.has(url))
      .map((url) => `adds the link target or URL "${url}"`),
    ...texts,
  ];
};
