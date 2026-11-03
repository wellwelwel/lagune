import type { TranslationMessages } from '../../website/src/data/messages';
import type { Site } from './site';
import { readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { isRecord, isTranslationMessages } from './guards';
import { displayPath } from './site';

type SourceFileTranslations = {
  sourceCodeFilePath: string;
  translations: TranslationMessages;
  warnings: string[];
};

type Extractor = {
  extractAllSourceCodeFileTranslations: (
    sourceCodeFilePaths: string[],
    babelOptions: unknown
  ) => Promise<unknown>;
  getBabelOptions: (options: {
    isServer: boolean;
    babelOptions: string | undefined;
  }) => unknown;
  getCustomBabelConfigFilePath: (
    siteDir: string
  ) => Promise<string | undefined>;
};

const SOURCE_FILE = /\.[jt]sx?$/;
const DECLARATION_FILE = /\.d\.ts$/;

const isExtractor = (value: unknown): value is Extractor =>
  isRecord(value) &&
  typeof value.extractAllSourceCodeFileTranslations === 'function' &&
  typeof value.getBabelOptions === 'function' &&
  typeof value.getCustomBabelConfigFilePath === 'function';

const isSourceFileTranslations = (
  value: unknown
): value is SourceFileTranslations =>
  isRecord(value) &&
  typeof value.sourceCodeFilePath === 'string' &&
  isTranslationMessages(value.translations) &&
  Array.isArray(value.warnings) &&
  value.warnings.every((warning) => typeof warning === 'string');

const docusaurusExtractor = (): Extractor => {
  const extractor: unknown = createRequire(import.meta.url)(
    '@docusaurus/babel'
  );

  if (!isExtractor(extractor))
    throw new Error(
      '@docusaurus/babel no longer exposes the translation extractor this tool runs.'
    );

  return extractor;
};

const sourceFiles = async (folder: string): Promise<string[]> => {
  const entries = await readdir(folder, {
    recursive: true,
    withFileTypes: true,
  });

  return entries
    .filter(
      (entry) =>
        entry.isFile() &&
        SOURCE_FILE.test(entry.name) &&
        !DECLARATION_FILE.test(entry.name)
    )
    .map((entry) => path.join(entry.parentPath, entry.name))
    .sort();
};

/** Extracts the interface messages the way `docusaurus write-translations` does, from the site's own source alone */
export const codeMessages = async (
  site: Site
): Promise<TranslationMessages> => {
  const extractor = docusaurusExtractor();
  const babelOptions = extractor.getBabelOptions({
    isServer: true,
    babelOptions: await extractor.getCustomBabelConfigFilePath(site.root),
  });
  const extracted: unknown =
    await extractor.extractAllSourceCodeFileTranslations(
      await sourceFiles(path.join(site.root, 'src')),
      babelOptions
    );

  if (!Array.isArray(extracted) || !extracted.every(isSourceFileTranslations))
    throw new Error(
      'The Docusaurus translation extractor answered in an unknown shape.'
    );

  const warnings = extracted.flatMap(({ sourceCodeFilePath, warnings }) =>
    warnings.map(
      (warning) => `${displayPath(site, sourceCodeFilePath)}: ${warning}`
    )
  );

  if (warnings.length > 0)
    throw new Error(
      `Some interface messages cannot be extracted:\n${warnings.join('\n')}`
    );

  const entries = extracted.flatMap(({ translations }) =>
    Object.entries(translations)
  );
  const conflict = entries.find(([id, { message }]) =>
    entries.some(
      ([otherId, other]) => otherId === id && other.message !== message
    )
  );

  if (conflict)
    throw new Error(
      `The message id "${conflict[0]}" carries two different English messages.`
    );

  return Object.fromEntries(entries);
};
