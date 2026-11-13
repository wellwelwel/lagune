import type {
  DependencyRead,
  PlacedTable,
} from '../../../types/hooks/dependency.js';
import { isPlainRecord, ownValue } from '../../../core/collections.js';
import { parseJsonObject } from '../../../core/json.js';
import { pathOf, tableOrEmptyAt, textAt, wrongKind } from '../fields.js';
import { cannotJudge } from '../text.js';
import { plainUrlFlags } from '../transport.js';
import { packageUrls } from './package.js';

const REQUIRE_FIELDS = ['require', 'require-dev'];

const REPOSITORIES = 'repositories';

const PACKAGE = 'package';

/** A package Composer resolves from a repository, unlike a platform package such as php or ext-json, whose name never holds a slash */
const isRepositoryPackage = (name: string): boolean => name.includes('/');

const requiredNames = (
  file: string,
  manifest: Record<string, unknown>
): string[] =>
  REQUIRE_FIELDS.flatMap((field) =>
    Object.keys(tableOrEmptyAt(file, manifest, field, ''))
  );

/** The repositories a composer.json lists or names, leaving out the ones it switches off with false */
const repositoryTables = (
  file: string,
  manifest: Record<string, unknown>
): PlacedTable[] => {
  const repositories = ownValue(manifest, REPOSITORIES);

  if (repositories === undefined) return [];
  if (!Array.isArray(repositories) && !isPlainRecord(repositories))
    throw wrongKind(file, '', REPOSITORIES, 'a list or an object');

  return Object.entries(repositories).flatMap(
    ([key, repository]: [string, unknown]): PlacedTable[] => {
      if (repository === false) return [];
      if (isPlainRecord(repository))
        return [[pathOf(REPOSITORIES, key), repository]];

      throw wrongKind(file, REPOSITORIES, key, 'a repository or false');
    }
  );
};

/** The packages a package repository defines inline, one or a list of them */
const inlinePackages = (
  file: string,
  [where, repository]: PlacedTable
): PlacedTable[] => {
  const path = pathOf(where, PACKAGE);
  const value = ownValue(repository, PACKAGE);

  if (value === undefined) return [];
  if (isPlainRecord(value)) return [[path, value]];
  if (Array.isArray(value) && value.every(isPlainRecord))
    return value.map((inline, index): PlacedTable => [
      pathOf(path, String(index)),
      inline,
    ]);

  throw wrongKind(file, where, PACKAGE, 'a package or a list of packages');
};

/** A composer.json, read for the packages it requires and every URL its repositories fetch from */
export const readComposerManifest = (
  file: string,
  content: string
): DependencyRead => {
  const manifest = parseJsonObject(content, file, cannotJudge);
  const repositories = repositoryTables(file, manifest);
  const urls = [
    ...repositories.flatMap(
      ([where, repository]) => textAt(file, repository, 'url', where) ?? []
    ),
    ...repositories
      .flatMap((placed) => inlinePackages(file, placed))
      .flatMap((placed) => packageUrls(file, placed)),
  ];

  return {
    flags: plainUrlFlags(urls),
    needsLockfile: requiredNames(file, manifest).some(isRepositoryPackage),
    pins: false,
    declaresWorkspace: false,
  };
};
