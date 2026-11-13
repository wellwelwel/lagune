import type {
  DependencySource,
  LockedEntry,
  NpmPackage,
} from '../../../types/hooks/dependency.js';
import { isRecord, ownValue } from '../../../core/collections.js';
import { quotedExcerpt } from '../../../core/errors.js';
import { parseJsonObject } from '../../../core/json.js';
import { pathOf, switchAt, textAt, wrongKind } from '../fields.js';
import { cannotJudge } from '../text.js';
import { isPlainTransport } from '../transport.js';
import { lockedSourceOf, sourceOf, specifiersIn } from './specifier.js';

const NODE_MODULES = 'node_modules/';

const SPECIFIER_FIELDS = [
  'dependencies',
  'optionalDependencies',
  'devDependencies',
  'peerDependencies',
];

const recordsOf = (
  file: string,
  value: unknown,
  field: string
): [string, Record<string, unknown>][] => {
  if (!isRecord(value))
    throw cannotJudge(file, `sets ${field} to something other than an object`);

  return Object.entries(value).map(([key, entry]) => {
    if (!isRecord(entry))
      throw cannotJudge(
        file,
        `sets ${quotedExcerpt(key)} under ${field} to something other than an object`
      );

    return [key, entry];
  });
};

const packageOf = (
  file: string,
  [path, entry]: [string, Record<string, unknown>]
): NpmPackage => {
  const where = pathOf('packages', path);
  const at = path.lastIndexOf(NODE_MODULES);
  const name = at === -1 ? path : path.slice(at + NODE_MODULES.length);
  const version = textAt(file, entry, 'version', where);
  const resolved = textAt(file, entry, 'resolved', where);
  const linked = switchAt(file, entry, 'link', where);
  const bundled = switchAt(file, entry, 'inBundle', where);

  return {
    name,
    display: version === undefined ? name : `${name}@${version}`,
    fetched:
      at !== -1 &&
      !linked &&
      !bundled &&
      (version !== undefined || resolved !== undefined),
    resolved,
    hashed: textAt(file, entry, 'integrity', where) !== undefined,
    installScript: switchAt(file, entry, 'hasInstallScript', where),
    specs: specifiersIn(entry, SPECIFIER_FIELDS, (field) =>
      wrongKind(file, where, field, 'package names and their specifiers')
    ),
  };
};

const packageSourceOf = (
  { name, resolved }: NpmPackage,
  remoteNames: ReadonlySet<string>
): DependencySource => {
  const source = resolved === undefined ? 'registry' : lockedSourceOf(resolved);

  return source === 'registry' && remoteNames.has(name) ? 'remote' : source;
};

/** The entries of a lockfile from npm 7 or later, read from its packages map */
const packagesEntries = (file: string, packages: unknown): LockedEntry[] => {
  const nodes = recordsOf(file, packages, 'packages').map((record) =>
    packageOf(file, record)
  );
  const remoteNames = new Set(
    nodes.flatMap(({ specs }) =>
      specs
        .filter(([, spec]) => sourceOf(spec) === 'remote')
        .map(([name]) => name)
    )
  );

  return nodes
    .filter(({ fetched }) => fetched)
    .map((node) => ({
      name: node.display,
      source: packageSourceOf(node, remoteNames),
      hashed: node.hashed,
      installScript: node.installScript,
    }));
};

const legacySourceOf = (
  version: string,
  resolved: string | undefined
): DependencySource => {
  const source = sourceOf(version);

  return source === 'registry' &&
    resolved !== undefined &&
    isPlainTransport(resolved)
    ? 'plain'
    : source;
};

const legacyEntryOf = (
  file: string,
  [name, entry]: [string, Record<string, unknown>]
): LockedEntry | null => {
  const where = pathOf('dependencies', name);
  const version = textAt(file, entry, 'version', where);
  const resolved = textAt(file, entry, 'resolved', where);
  const hashed = textAt(file, entry, 'integrity', where) !== undefined;
  const bundled = switchAt(file, entry, 'bundled', where);

  if (version === undefined || bundled) return null;

  return {
    name: `${name}@${version}`,
    source: legacySourceOf(version, resolved),
    hashed,
    installScript: false,
  };
};

/** The entries of a lockfile from npm 6 or earlier, read from its nested dependencies tree */
const legacyEntries = (file: string, dependencies: unknown): LockedEntry[] => {
  const entries: LockedEntry[] = [];
  const levels: unknown[] = [dependencies];

  while (levels.length > 0) {
    for (const record of recordsOf(file, levels.pop(), 'dependencies')) {
      const nested = ownValue(record[1], 'dependencies');
      const entry = legacyEntryOf(file, record);

      if (nested !== undefined) levels.push(nested);
      if (entry !== null) entries.push(entry);
    }
  }

  return entries;
};

export const npmEntries = (file: string, content: string): LockedEntry[] => {
  const lockfile = parseJsonObject(content, file, cannotJudge);
  const packages = ownValue(lockfile, 'packages');

  if (packages !== undefined) return packagesEntries(file, packages);

  const dependencies = ownValue(lockfile, 'dependencies');

  if (dependencies !== undefined) return legacyEntries(file, dependencies);
  if (ownValue(lockfile, 'lockfileVersion') !== undefined) return [];

  throw cannotJudge(file, 'is not an npm lockfile');
};
