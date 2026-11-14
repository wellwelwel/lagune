import type {
  DependencyRead,
  DependencySource,
  LockedEntry,
} from '../../../types/hooks/dependency.js';
import { isPlainRecord, isString } from '../../../core/collections.js';
import { quotedExcerpt } from '../../../core/errors.js';
import { parseJsonObject } from '../../../core/json.js';
import {
  pathOf,
  tableAt,
  tableOrEmptyAt,
  tablesAt,
  textAt,
  textsAt,
} from '../fields.js';
import { unverifiedFlags } from '../locked.js';
import { flagsRead } from '../read.js';
import { cannotJudge } from '../text.js';
import { tomlOf } from '../toml.js';
import { isPlainTransport, plainUrlFlags } from '../transport.js';
import { lockedName } from './lockfile.js';
import { packageSourceFlags } from './source.js';

/** The top-level tables of a Pipfile that are not a category of packages */
const PIPFILE_SETTINGS: ReadonlySet<string> = new Set([
  'source',
  'requires',
  'pipenv',
  'scripts',
]);

const LOCK_METADATA = '_meta';

const REMOTE_KEYS = ['git', 'file'];

const EXACT = '==';

const pipfilePackageSources = (
  file: string,
  category: string,
  name: string,
  value: unknown
): Record<string, unknown>[] => {
  if (isString(value)) return [];
  if (isPlainRecord(value)) return [value];

  throw cannotJudge(
    file,
    `sets ${pathOf(category, name)} to something other than a version or a table`
  );
};

/** A Pipfile, whose every table but its settings lists a category of packages, such as `[packages]` and `[dev-packages]` */
export const readPipfile = (file: string, content: string): DependencyRead => {
  const pipfile = tomlOf(file, content);
  const packages = Object.keys(pipfile)
    .filter((category) => !PIPFILE_SETTINGS.has(category))
    .flatMap((category) =>
      Object.entries(tableOrEmptyAt(file, pipfile, category, '')).map(
        ([name, value]) => ({ category, name, value })
      )
    );
  const sources = tablesAt(file, pipfile, 'source', '').flatMap(
    (source) => textAt(file, source, 'url', 'source') ?? []
  );

  return {
    flags: [
      ...plainUrlFlags(sources),
      ...packages.flatMap(({ category, name, value }) =>
        packageSourceFlags(
          file,
          category,
          name,
          pipfilePackageSources(file, category, name, value)
        )
      ),
    ],
    needsLockfile: packages.length > 0,
    pins: false,
    declaresWorkspace: false,
  };
};

const indexUrls = (
  file: string,
  metadata: Record<string, unknown>
): Map<string, string | undefined> =>
  new Map(
    tablesAt(file, metadata, 'sources', LOCK_METADATA).map((source) => [
      textAt(file, source, 'name', `${LOCK_METADATA}.sources`) ?? '',
      textAt(file, source, 'url', `${LOCK_METADATA}.sources`),
    ])
  );

const pipenvSourceOf = (
  urls: readonly string[],
  registry: boolean,
  remote: boolean
): DependencySource => {
  if (urls.some(isPlainTransport)) return 'plain';
  if (registry) return 'registry';

  return remote ? 'remote' : 'project';
};

/** A package of Pipfile.lock, where one resolved from an index carries its version and the hashes of its files */
const pipenvEntryOf = (
  file: string,
  indexes: ReadonlyMap<string, string | undefined>,
  where: string,
  name: string,
  locked: Record<string, unknown>
): LockedEntry => {
  const scope = pathOf(where, name);
  const version = textAt(file, locked, 'version', scope);
  const remoteUrls = REMOTE_KEYS.flatMap(
    (key) => textAt(file, locked, key, scope) ?? []
  );
  const registry =
    version !== undefined &&
    remoteUrls.length === 0 &&
    textAt(file, locked, 'path', scope) === undefined;
  const index =
    textAt(file, locked, 'index', scope) ?? indexes.keys().next().value;

  if (registry && index !== undefined && !indexes.has(index))
    throw cannotJudge(
      file,
      `locks ${quotedExcerpt(name)} from the index ${quotedExcerpt(index)}, which ${LOCK_METADATA}.sources does not list`
    );

  const indexUrl =
    registry && index !== undefined ? indexes.get(index) : undefined;

  return {
    name: lockedName(
      name,
      version?.startsWith(EXACT) ? version.slice(EXACT.length) : version
    ),
    source: pipenvSourceOf(
      [...remoteUrls, ...(indexUrl === undefined ? [] : [indexUrl])],
      registry,
      remoteUrls.length > 0
    ),
    missingHash: textsAt(file, locked, 'hashes', scope).length === 0,
    installScript: false,
  };
};

/** The packages of a Pipfile.lock, in `default`, `develop`, and every other category it locks */
export const readPipfileLock = (
  file: string,
  content: string
): DependencyRead => {
  const lock = parseJsonObject(content, file, cannotJudge);
  const metadata = tableAt(file, lock, LOCK_METADATA, '');

  if (metadata === undefined) throw cannotJudge(file, 'is not a Pipfile.lock');

  const indexes = indexUrls(file, metadata);
  const entries = Object.keys(lock)
    .filter((category) => category !== LOCK_METADATA)
    .flatMap((category) =>
      Object.entries(tableOrEmptyAt(file, lock, category, '')).map(
        ([name, locked]) => {
          if (!isPlainRecord(locked))
            throw cannotJudge(
              file,
              `sets ${pathOf(category, name)} to something other than a table`
            );

          return pipenvEntryOf(file, indexes, category, name, locked);
        }
      )
    );

  return flagsRead(unverifiedFlags(entries));
};
