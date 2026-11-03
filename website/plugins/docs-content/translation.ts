import { createHash } from 'node:crypto';
import path from 'node:path';

export type PageState = 'original' | 'translated' | 'stale' | 'untranslated';

export type RecordedTranslation = {
  sourceHash: unknown;
};

export const PLUGIN_NAME = 'lagune-docs-content';

export const SOURCE_HASH = /^[0-9a-f]{64}$/;

export const sourceHash = (content: string): string =>
  createHash('sha256').update(content.replace(/\r\n?/g, '\n')).digest('hex');

export const pageState = (
  translation: RecordedTranslation | undefined,
  currentSourceHash: string
): Exclude<PageState, 'original'> => {
  if (translation === undefined) return 'untranslated';

  return translation.sourceHash === currentSourceHash ? 'translated' : 'stale';
};

export const isPairedTranslation = (state: PageState): boolean =>
  state === 'translated' || state === 'stale';

export const docIdOf = (
  relativeFile: string,
  frontMatterId: unknown
): string => {
  const relativeId = relativeFile.replace(/\.mdx?$/, '');
  const parentDirectory = path.posix.dirname(relativeId);
  const baseName =
    typeof frontMatterId === 'string'
      ? frontMatterId
      : path.posix.basename(relativeId);

  return parentDirectory === '.'
    ? baseName
    : path.posix.join(parentDirectory, baseName);
};
