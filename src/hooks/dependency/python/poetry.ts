import type {
  DependencyRead,
  DependencySource,
  LockedEntry,
  PlacedTable,
} from '../../../types/hooks/dependency.js';
import {
  isPlainRecord,
  isString,
  ownValue,
} from '../../../core/collections.js';
import {
  pathOf,
  placedTableAt,
  subtablesAt,
  tableAt,
  tableOrEmptyAt,
  tablesAt,
  textAt,
} from '../fields.js';
import { unverifiedFlags } from '../locked.js';
import { flagsRead } from '../read.js';
import { cannotJudge } from '../text.js';
import { tomlOf } from '../toml.js';
import { isPlainTransport, plainUrlFlags } from '../transport.js';
import { lockedName } from './lockfile.js';
import { packageSourceFlags } from './source.js';

const INTERPRETER = 'python';

const REGISTRY_TYPES: ReadonlySet<string> = new Set(['legacy', 'pypi']);

const REMOTE_TYPES: ReadonlySet<string> = new Set(['git', 'url']);

const NAME_SEPARATORS = /[-_.]+/g;

/** The constraints Poetry accepts for one dependency: a version, a table, or a list of tables */
const constraintTables = (
  file: string,
  where: string,
  name: string,
  value: unknown
): Record<string, unknown>[] => {
  if (isString(value)) return [];
  if (isPlainRecord(value)) return [value];
  if (Array.isArray(value) && value.every(isPlainRecord)) return value;

  throw cannotJudge(
    file,
    `sets ${pathOf(where, name)} to something other than a version, a table, or a list of tables`
  );
};

/** Every table of dependencies Poetry installs, from the main one to each group's */
const dependencyTables = (
  file: string,
  poetry: Record<string, unknown>
): PlacedTable[] => {
  const where = 'tool.poetry';

  return [
    ...placedTableAt(file, poetry, 'dependencies', where),
    ...placedTableAt(file, poetry, 'dev-dependencies', where),
    ...subtablesAt(file, poetry, 'group', where).flatMap(([group, table]) =>
      placedTableAt(file, table, 'dependencies', group)
    ),
  ];
};

/** What `[tool.poetry]` in a pyproject.toml decides */
export const poetryProjectRead = (
  file: string,
  poetry: Record<string, unknown> | undefined
): DependencyRead => {
  if (poetry === undefined) return flagsRead([]);

  const dependencies = dependencyTables(file, poetry).flatMap(
    ([where, table]) =>
      Object.entries(table).map(([name, value]) => ({ where, name, value }))
  );
  const sources = tablesAt(file, poetry, 'source', 'tool.poetry').flatMap(
    (source) => textAt(file, source, 'url', 'tool.poetry.source') ?? []
  );

  return {
    flags: [
      ...plainUrlFlags(sources),
      ...dependencies.flatMap(({ where, name, value }) =>
        packageSourceFlags(
          file,
          where,
          name,
          constraintTables(file, where, name, value)
        )
      ),
    ],
    needsLockfile: dependencies.some(({ name }) => name !== INTERPRETER),
    pins: false,
    declaresWorkspace: false,
  };
};

const normalized = (name: string): string =>
  name.toLowerCase().replace(NAME_SEPARATORS, '-');

/** The files a lockfile from Poetry 1.2 or earlier lists under `[metadata.files]`, by normalized package name */
const legacyFilesOf = (
  file: string,
  metadata: Record<string, unknown>
): Map<string, Record<string, unknown>[]> => {
  const legacyFiles = tableOrEmptyAt(file, metadata, 'files', 'metadata');

  return new Map(
    Object.keys(legacyFiles).map((name) => [
      normalized(name),
      tablesAt(file, legacyFiles, name, 'metadata.files'),
    ])
  );
};

const poetrySourceOf = (
  source: Record<string, unknown> | undefined,
  type: string | undefined,
  url: string | undefined
): DependencySource => {
  if (url !== undefined && isPlainTransport(url)) return 'plain';
  if (source === undefined || (type !== undefined && REGISTRY_TYPES.has(type)))
    return 'registry';
  if (type !== undefined && REMOTE_TYPES.has(type)) return 'remote';

  return 'project';
};

const poetryEntryOf = (
  file: string,
  locked: Record<string, unknown>,
  legacyFiles: ReadonlyMap<string, Record<string, unknown>[]>
): LockedEntry => {
  const name = textAt(file, locked, 'name', 'package');

  if (name === undefined)
    throw cannotJudge(file, 'locks a package with no name');

  const where = `package.${name}`;
  const source = tableAt(file, locked, 'source', where);
  const sourceWhere = `${where}.source`;
  const type =
    source === undefined
      ? undefined
      : textAt(file, source, 'type', sourceWhere);
  const url =
    source === undefined ? undefined : textAt(file, source, 'url', sourceWhere);
  const files =
    ownValue(locked, 'files') === undefined
      ? (legacyFiles.get(normalized(name)) ?? [])
      : tablesAt(file, locked, 'files', where);

  return {
    name: lockedName(name, textAt(file, locked, 'version', where)),
    source: poetrySourceOf(source, type, url),
    missingHash:
      files.length === 0 ||
      files.some(
        (entry) => textAt(file, entry, 'hash', `${where}.files`) === undefined
      ),
    installScript: false,
  };
};

/** The packages of a poetry.lock, whose registry packages each list their files with a hash */
export const readPoetryLock = (
  file: string,
  content: string
): DependencyRead => {
  const lock = tomlOf(file, content);
  const metadata = tableAt(file, lock, 'metadata', '');

  if (metadata === undefined)
    throw cannotJudge(file, 'is not a Poetry lockfile');

  const legacyFiles = legacyFilesOf(file, metadata);

  return flagsRead(
    unverifiedFlags(
      tablesAt(file, lock, 'package', '').map((locked) =>
        poetryEntryOf(file, locked, legacyFiles)
      )
    )
  );
};
