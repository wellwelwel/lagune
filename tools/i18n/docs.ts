import type { Site } from './site';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { docIdOf } from '../../website/plugins/docs-content/translation';
import { frontmatterOf } from './frontmatter';

export type SourceDoc = {
  docId: string;
  parent: string | undefined;
  relativeFile: string;
  file: string;
};

const PAGE_FILE = /\.mdx?$/;
const DOC_ID = /^[a-z0-9][a-z0-9_-]*(?:\/[a-z0-9][a-z0-9_-]*)*$/;

export const docsFolder = (site: Site): string => path.join(site.root, 'docs');

export const pageFiles = async (folder: string): Promise<string[]> => {
  const entries = await readdir(folder, {
    recursive: true,
    withFileTypes: true,
  });

  return entries
    .filter(
      (entry) =>
        entry.isFile() &&
        PAGE_FILE.test(entry.name) &&
        !entry.name.startsWith('_')
    )
    .map((entry) =>
      path
        .relative(folder, path.join(entry.parentPath, entry.name))
        .split(path.sep)
        .join('/')
    )
    .sort();
};

export const sourceDocs = async (site: Site): Promise<SourceDoc[]> => {
  const folder = docsFolder(site);

  return Promise.all(
    (await pageFiles(folder)).map(async (relativeFile) => {
      const file = path.join(folder, relativeFile);
      const frontmatter = frontmatterOf(await readFile(file, 'utf8'));
      const parent = frontmatter?.parent;

      return {
        docId: docIdOf(relativeFile, frontmatter?.id),
        parent: typeof parent === 'string' ? parent : undefined,
        relativeFile,
        file,
      };
    })
  );
};

export const resolveDoc = async (
  site: Site,
  docId: string
): Promise<SourceDoc> => {
  if (!DOC_ID.test(docId)) throw new Error(`"${docId}" is not a doc id.`);

  const doc = (await sourceDocs(site)).find((entry) => entry.docId === docId);

  if (!doc) throw new Error(`No English page has the doc id "${docId}".`);

  return doc;
};
