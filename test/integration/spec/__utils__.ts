import type {
  Frontmatter,
  SpecLimits,
  SpecLimitViolation,
  SpecMeasurement,
} from '../../../src/types/test.js';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { get_encoding } from 'tiktoken';
import { parse } from 'yaml.min';

export type FrontmatterSource = {
  relativePath: string;
  frontmatter: string;
};

export const packageRoot = new URL('../../../', import.meta.url);

const listMarkdownFiles = async (dir: URL): Promise<string[]> => {
  const root = fileURLToPath(dir);
  const entries = await readdir(root, { recursive: true, withFileTypes: true });

  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => relative(root, join(entry.parentPath, entry.name)));

  return files.sort((left, right) => left.localeCompare(right));
};

const FRONTMATTER_PATTERN = /^---\n([\s\S]*?)\n---\n/;

const readFrontmatter = (contents: string): Partial<Frontmatter> => {
  const match = contents.match(FRONTMATTER_PATTERN);

  if (!match) return Object.create(null);

  return parse<Partial<Frontmatter>>(match[1]);
};

const measureFiles = async (
  dir: URL,
  files: string[]
): Promise<SpecMeasurement[]> => {
  const encoding = get_encoding('o200k_base');

  try {
    const measurements: SpecMeasurement[] = [];

    for (const file of files) {
      const relativePath = file.split(sep).join('/');
      const contents = await readFile(new URL(relativePath, dir), 'utf8');
      const frontmatter = readFrontmatter(contents);

      measurements.push({
        relativePath,
        nameChars: (frontmatter.name ?? '').length,
        descriptionChars: (frontmatter.description ?? '').length,
        tokens: encoding.encode(contents).length,
        lines: contents.split('\n').length,
      });
    }

    return measurements;
  } finally {
    encoding.free();
  }
};

const measureMarkdown = async (
  dir: URL,
  keep: (relativePath: string) => boolean
): Promise<SpecMeasurement[]> => {
  const files = await listMarkdownFiles(dir);

  return measureFiles(
    dir,
    files.filter((file) => keep(file.split(sep).join('/')))
  );
};

export const listFrontmatterSources = async (
  dir: URL,
  keep: (relativePath: string) => boolean = () => true
): Promise<FrontmatterSource[]> => {
  const files = await listMarkdownFiles(dir);
  const sources: FrontmatterSource[] = [];

  for (const file of files) {
    const relativePath = file.split(sep).join('/');

    if (!keep(relativePath)) continue;

    const contents = await readFile(new URL(relativePath, dir), 'utf8');
    const match = contents.match(FRONTMATTER_PATTERN);

    if (match) sources.push({ relativePath, frontmatter: match[1] });
  }

  return sources;
};

export const measureSpecs = (): Promise<SpecMeasurement[]> =>
  measureMarkdown(new URL('spec/', packageRoot), () => true);

export const measureSkills = (): Promise<SpecMeasurement[]> =>
  measureMarkdown(new URL('.claude/skills/', packageRoot), (relativePath) =>
    relativePath.endsWith('SKILL.md')
  );

export const measureClaudeMd = (): Promise<SpecMeasurement[]> =>
  measureFiles(packageRoot, ['CLAUDE.md']);

export const findViolations = (
  measurement: SpecMeasurement,
  limits: SpecLimits
): SpecLimitViolation[] => {
  const checks: SpecLimitViolation[] = [
    {
      limit: 'nameChars',
      actual: measurement.nameChars,
      max: limits.nameChars,
    },
    {
      limit: 'descriptionChars',
      actual: measurement.descriptionChars,
      max: limits.descriptionChars,
    },
    { limit: 'tokens', actual: measurement.tokens, max: limits.tokens },
    { limit: 'lines', actual: measurement.lines, max: limits.lines },
  ];

  return checks.filter((check) => check.actual > check.max);
};
