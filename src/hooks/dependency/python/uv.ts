import type {
  DependencyFlag,
  DependencyRead,
  DependencySource,
  LockedEntry,
} from '../../../types/hooks/dependency.js';
import { quotedExcerpt } from '../../../core/errors.js';
import {
  pathOf,
  tableAt,
  tableEntriesAt,
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
import { requirementOf } from './requirement.js';
import {
  extraIndexFlags,
  packageSourceFlags,
  requirementFlags,
} from './source.js';

/** The strategies uv itself names unsafe: they let a package on a later index win over the first index that has the name */
const UNSAFE_STRATEGIES: ReadonlySet<string> = new Set([
  'unsafe-first-match',
  'unsafe-best-match',
]);

const REMOTE_URL = /^https?:\/\//i;

const LOCKED_SOURCE_KEYS = ['registry', 'git', 'url'];

const indexSettingsFlags = (
  file: string,
  settings: Record<string, unknown>,
  where: string
): DependencyFlag[] => {
  const strategy = textAt(file, settings, 'index-strategy', where);
  const defaultIndex = textAt(file, settings, 'index-url', where);

  return [
    ...plainUrlFlags([
      ...(defaultIndex === undefined ? [] : [defaultIndex]),
      ...textsAt(file, settings, 'extra-index-url', where),
      ...textsAt(file, settings, 'find-links', where),
      ...tablesAt(file, settings, 'index', where).flatMap(
        (index) => textAt(file, index, 'url', pathOf(where, 'index')) ?? []
      ),
    ]),
    ...(strategy !== undefined && UNSAFE_STRATEGIES.has(strategy)
      ? extraIndexFlags([`index-strategy ${strategy}`])
      : []),
  ];
};

/** The indexes uv's settings name, read from `[tool.uv]` in pyproject.toml or from the top of uv.toml, and from their `pip` table */
const uvSettingsFlags = (
  file: string,
  settings: Record<string, unknown>,
  where: string
): DependencyFlag[] => {
  const pip = tableAt(file, settings, 'pip', where);

  return [
    ...indexSettingsFlags(file, settings, where),
    ...(pip === undefined
      ? []
      : indexSettingsFlags(file, pip, pathOf(where, 'pip'))),
  ];
};

/** What `[tool.uv]` in a pyproject.toml decides, beyond its settings */
export const uvProjectRead = (
  file: string,
  uv: Record<string, unknown> | undefined
): DependencyRead => {
  if (uv === undefined) return flagsRead([]);

  const where = 'tool.uv';
  const development = textsAt(file, uv, 'dev-dependencies', where).map((text) =>
    requirementOf(file, text)
  );
  const constraints = [
    ...textsAt(file, uv, 'constraint-dependencies', where),
    ...textsAt(file, uv, 'override-dependencies', where),
  ].map((text) => requirementOf(file, text));
  const sources = tableEntriesAt(file, uv, 'sources', where).flatMap(
    ([name, tables]) =>
      packageSourceFlags(file, `${where}.sources`, name, tables)
  );

  return {
    flags: [
      ...uvSettingsFlags(file, uv, where),
      ...[...development, ...constraints].flatMap(requirementFlags),
      ...sources,
    ],
    needsLockfile: development.length > 0,
    pins: false,
    declaresWorkspace: tableAt(file, uv, 'workspace', where) !== undefined,
  };
};

export const readUvConfig = (file: string, content: string): DependencyRead =>
  flagsRead(uvSettingsFlags(file, tomlOf(file, content), ''));

const uvSourceOf = (
  urls: readonly string[],
  source: Record<string, unknown>,
  registry: string | undefined
): DependencySource => {
  if (urls.some(isPlainTransport)) return 'plain';
  if (registry !== undefined)
    return REMOTE_URL.test(registry) ? 'registry' : 'project';
  if (Object.hasOwn(source, 'git') || Object.hasOwn(source, 'url'))
    return 'remote';

  return 'project';
};

/** A package of uv.lock, whose distributions from a remote registry each carry a hash */
const uvEntryOf = (
  file: string,
  locked: Record<string, unknown>
): LockedEntry => {
  const name = textAt(file, locked, 'name', 'package');

  if (name === undefined)
    throw cannotJudge(file, 'locks a package with no name');

  const where = `package.${name}`;
  const source = tableAt(file, locked, 'source', where);

  if (source === undefined)
    throw cannotJudge(file, `locks ${quotedExcerpt(name)} with no source`);

  const sdist = tableAt(file, locked, 'sdist', where);
  const distributions = [
    ...(sdist === undefined ? [] : [sdist]),
    ...tablesAt(file, locked, 'wheels', where),
  ];
  const sourceWhere = `${where}.source`;
  const registry = textAt(file, source, 'registry', sourceWhere);
  const urls = [
    ...LOCKED_SOURCE_KEYS.flatMap(
      (key) => textAt(file, source, key, sourceWhere) ?? []
    ),
    ...distributions.flatMap(
      (distribution) => textAt(file, distribution, 'url', where) ?? []
    ),
  ];

  return {
    name: lockedName(name, textAt(file, locked, 'version', where)),
    source: uvSourceOf(urls, source, registry),
    missingHash:
      distributions.length === 0 ||
      distributions.some(
        (distribution) =>
          textAt(file, distribution, 'hash', where) === undefined
      ),
    installScript: false,
  };
};

export const readUvLock = (file: string, content: string): DependencyRead => {
  const lock = tomlOf(file, content);

  if (!Object.hasOwn(lock, 'version'))
    throw cannotJudge(file, 'is not a uv lockfile');

  return flagsRead(
    unverifiedFlags(
      tablesAt(file, lock, 'package', '').map((locked) =>
        uvEntryOf(file, locked)
      )
    )
  );
};
