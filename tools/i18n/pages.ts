import type { SourceDoc } from './docs';
import type { LocaleFolder, Site } from './site';
import { execFile } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import {
  SOURCE_HASH,
  sourceHash,
} from '../../website/plugins/docs-content/translation';
import { frontmatterOf, withSourceHash } from './frontmatter';
import { confinedPath, displayPath, readIfPresent } from './site';

type Revision = {
  commit: string;
  path: string;
};

const execute = promisify(execFile);

export const translationFile = (
  locale: LocaleFolder,
  doc: SourceDoc
): Promise<string> => confinedPath(locale.contentFolder, doc.relativeFile);

const recordedSourceHash = (text: string): string | undefined => {
  const value = frontmatterOf(text)?.source_hash;

  return typeof value === 'string' && SOURCE_HASH.test(value)
    ? value
    : undefined;
};

export const copyPage = async (
  site: Site,
  locale: LocaleFolder,
  doc: SourceDoc
): Promise<string> => {
  const target = await translationFile(locale, doc);

  if ((await readIfPresent(target)) !== undefined)
    throw new Error(
      `${displayPath(site, target)} already exists. Use diff and stamp to bring it in sync instead.`
    );

  const english = await readFile(doc.file, 'utf8');

  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, withSourceHash(english, sourceHash(english)), {
    encoding: 'utf8',
    flag: 'wx',
  });

  return `Copied ${doc.docId} to ${displayPath(site, target)}. Translate it, then run check.`;
};

export const stampPage = async (
  site: Site,
  locale: LocaleFolder,
  doc: SourceDoc
): Promise<string> => {
  const target = await translationFile(locale, doc);
  const translated = await readIfPresent(target);

  if (translated === undefined)
    throw new Error(
      `${displayPath(site, target)} does not exist. Use copy to start the translation.`
    );

  const hash = sourceHash(await readFile(doc.file, 'utf8'));

  await writeFile(target, withSourceHash(translated, hash), 'utf8');

  return `Stamped ${displayPath(site, target)} with the current English source.`;
};

const git = async (site: Site, args: string[]): Promise<string> =>
  (
    await execute('git', args, {
      cwd: site.root,
      maxBuffer: 64 * 1024 * 1024,
    })
  ).stdout;

const revisionsOf = async (site: Site, file: string): Promise<Revision[]> => {
  const log = await git(site, [
    'log',
    '--follow',
    '--format=%x00%H',
    '--name-only',
    '--',
    path.relative(site.root, file),
  ]);

  return log
    .split('\0')
    .map((entry) => entry.trim().split(/\n+/))
    .flatMap(([commit, changed]) =>
      commit && changed ? [{ commit, path: changed }] : []
    );
};

export const diffPage = async (
  site: Site,
  locale: LocaleFolder,
  doc: SourceDoc
): Promise<string> => {
  const target = await translationFile(locale, doc);
  const translated = await readIfPresent(target);

  if (translated === undefined)
    throw new Error(
      `${displayPath(site, target)} does not exist. Use copy to start the translation.`
    );

  const recorded = recordedSourceHash(translated);

  if (recorded === undefined)
    throw new Error(
      `${displayPath(site, target)} has no valid source_hash. Only copy and stamp write it.`
    );

  if (recorded === sourceHash(await readFile(doc.file, 'utf8')))
    return `${doc.docId} has not changed in English since its translation.`;

  const repository = (await git(site, ['rev-parse', '--show-toplevel'])).trim();
  const revisions = await revisionsOf(site, doc.file);
  const contents = await Promise.all(
    revisions.map(async (revision) => ({
      revision,
      hash: sourceHash(
        await git(site, ['show', `${revision.commit}:${revision.path}`])
      ),
    }))
  );
  const match = contents.find(({ hash }) => hash === recorded);

  if (!match)
    throw new Error(
      `No commit of ${displayPath(site, doc.file)} matches the recorded source_hash, so the English changes cannot be shown.`
    );

  return git(site, [
    'diff',
    '--find-renames',
    match.revision.commit,
    '--',
    path.relative(site.root, path.join(repository, match.revision.path)),
    path.relative(site.root, doc.file),
  ]);
};
