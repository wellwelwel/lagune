import type {
  DependencyFlag,
  DependencyRead,
  PlacedTable,
} from '../../../types/hooks/dependency.js';
import { isPlainRecord, isString } from '../../../core/collections.js';
import { placedTableAt, subtablesAt, tableAt, wrongKind } from '../fields.js';
import { tomlOf } from '../toml.js';
import { sourceTableFlags } from '../transport.js';

/** The tables a package declares its dependencies in, including the underscore spellings older editions accept */
const DEPENDENCY_KINDS = [
  'dependencies',
  'dev-dependencies',
  'dev_dependencies',
  'build-dependencies',
  'build_dependencies',
];

const SOURCE_URL_KEYS = ['git', 'registry-index'];

const kindTables = (
  file: string,
  record: Record<string, unknown>,
  where: string
): PlacedTable[] =>
  DEPENDENCY_KINDS.flatMap((kind) => placedTableAt(file, record, kind, where));

/** The dependency tables of a package, at the top of its manifest and under each target */
const packageTables = (
  file: string,
  manifest: Record<string, unknown>
): PlacedTable[] => [
  ...kindTables(file, manifest, ''),
  ...subtablesAt(file, manifest, 'target', '').flatMap(([where, target]) =>
    kindTables(file, target, where)
  ),
];

/** The tables of dependencies that override what others resolve to: the workspace's shared ones and `[replace]` */
const overridingTables = (
  file: string,
  manifest: Record<string, unknown>,
  workspace: Record<string, unknown> | undefined
): PlacedTable[] => [
  ...(workspace === undefined
    ? []
    : placedTableAt(file, workspace, 'dependencies', 'workspace')),
  ...placedTableAt(file, manifest, 'replace', ''),
];

/** The plain-transport flags of a table of dependencies, each a version or a table naming where it comes from */
export const dependencyTableFlags = (
  file: string,
  [where, table]: PlacedTable
): DependencyFlag[] =>
  Object.entries(table).flatMap(([name, value]) => {
    if (isString(value)) return [];
    if (isPlainRecord(value))
      return sourceTableFlags(file, where, name, [value], SOURCE_URL_KEYS);

    throw wrongKind(file, where, name, 'a version or a table');
  });

/** A Cargo.toml, read for every table of dependencies it declares, overrides, or patches */
export const readCargoManifest = (
  file: string,
  content: string
): DependencyRead => {
  const manifest = tomlOf(file, content);
  const workspace = tableAt(file, manifest, 'workspace', '');
  const declared = packageTables(file, manifest);
  const tables = [
    ...declared,
    ...overridingTables(file, manifest, workspace),
    ...subtablesAt(file, manifest, 'patch', ''),
  ];

  return {
    flags: tables.flatMap((table) => dependencyTableFlags(file, table)),
    needsLockfile: declared.some(([, table]) => Object.keys(table).length > 0),
    pins: false,
    declaresWorkspace: workspace !== undefined,
  };
};
