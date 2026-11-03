import type { SiteLocale } from '../../website/i18n/locales';
import { lstat, readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_LOCALE,
  findTranslationLocale,
} from '../../website/i18n/locales';
import { PLUGIN_NAME } from '../../website/plugins/docs-content/translation';

export type Site = {
  root: string;
};

export type LocaleFolder = SiteLocale & {
  folder: string;
  contentFolder: string;
};

export const WEBSITE: Site = {
  root: fileURLToPath(new URL('../../website', import.meta.url)),
};

const LOCALE_CODE = /^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/;
const CONTROL_CHARACTER = /\p{Cc}/u;

const isMissingFile = (error: unknown): boolean =>
  error instanceof Error &&
  'code' in error &&
  (error.code === 'ENOENT' || error.code === 'ENOTDIR');

export const readIfPresent = async (
  file: string
): Promise<string | undefined> => {
  try {
    return await readFile(file, 'utf8');
  } catch (error) {
    if (isMissingFile(error)) return undefined;

    throw error;
  }
};

const isInside = (folder: string, target: string): boolean =>
  target === folder || target.startsWith(`${folder}${path.sep}`);

const canonicalPath = async (target: string): Promise<string> => {
  try {
    return await realpath(target);
  } catch (error) {
    const parent = path.dirname(target);

    if (!isMissingFile(error) || parent === target) throw error;

    return path.join(await canonicalPath(parent), path.basename(target));
  }
};

const refuseSymbolicLink = async (target: string): Promise<void> => {
  try {
    if ((await lstat(target)).isSymbolicLink())
      throw new Error(`Refusing to follow the symbolic link "${target}".`);
  } catch (error) {
    if (!isMissingFile(error)) throw error;
  }
};

/** Resolves a path under a folder, refusing any that leaves it as text or once the file system resolves it */
export const confinedPath = async (
  folder: string,
  relativePath: string
): Promise<string> => {
  if (CONTROL_CHARACTER.test(relativePath))
    throw new Error(`The path "${relativePath}" holds a control character.`);

  const base = path.resolve(folder);
  const target = path.resolve(base, relativePath);

  if (!isInside(base, target))
    throw new Error(`The path "${relativePath}" leaves "${base}".`);

  if (!isInside(await canonicalPath(base), await canonicalPath(target)))
    throw new Error(`The path "${relativePath}" resolves outside "${base}".`);

  await refuseSymbolicLink(target);

  return target;
};

export const resolveLocale = async (
  site: Site,
  code: string
): Promise<LocaleFolder> => {
  if (!LOCALE_CODE.test(code))
    throw new Error(`"${code}" is not a BCP 47 locale code.`);

  if (code === DEFAULT_LOCALE)
    throw new Error(
      `"${code}" is the English source, which every locale is translated from.`
    );

  const locale = findTranslationLocale(code);

  if (!locale)
    throw new Error(
      `The locale registry (website/i18n/locales.ts) has no translated locale "${code}".`
    );

  const folder = await confinedPath(path.join(site.root, 'i18n'), locale.code);

  return {
    ...locale,
    folder,
    contentFolder: await confinedPath(folder, PLUGIN_NAME),
  };
};

export const displayPath = (site: Site, file: string): string =>
  path.relative(site.root, file).split(path.sep).join('/');
