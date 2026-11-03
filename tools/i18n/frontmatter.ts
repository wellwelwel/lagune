import { parse } from 'yaml.min';

export type Frontmatter = Record<string, unknown>;

export type SplitPage = {
  frontmatter: string | undefined;
  body: string;
};

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;
const SOURCE_HASH_LINE = /^source_hash\s*:/;

const isFrontmatter = (value: unknown): value is Frontmatter =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const splitPage = (text: string): SplitPage => {
  const match = text.match(FRONTMATTER);

  if (!match) return { frontmatter: undefined, body: text };

  return { frontmatter: match[1], body: text.slice(match[0].length) };
};

export const frontmatterOf = (text: string): Frontmatter | undefined => {
  const { frontmatter } = splitPage(text);

  if (frontmatter === undefined) return undefined;

  const parsed: unknown = parse(frontmatter);

  return isFrontmatter(parsed) ? parsed : undefined;
};

export const withSourceHash = (text: string, hash: string): string => {
  const { frontmatter, body } = splitPage(text);

  if (frontmatter === undefined)
    throw new Error(
      'The page has no frontmatter to record its source_hash in.'
    );

  const lines = frontmatter
    .split(/\r?\n/)
    .filter((line) => !SOURCE_HASH_LINE.test(line));

  return `---\n${[...lines, `source_hash: '${hash}'`].join('\n')}\n---\n${body}`;
};
