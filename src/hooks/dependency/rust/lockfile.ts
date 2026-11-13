import type {
  DependencyRead,
  DependencySource,
  LockedEntry,
} from '../../../types/hooks/dependency.js';
import { quotedExcerpt } from '../../../core/errors.js';
import { tableOrEmptyAt, tablesAt, textAt } from '../fields.js';
import { unverifiedFlags } from '../locked.js';
import { flagsRead } from '../read.js';
import { cannotJudge } from '../text.js';
import { tomlOf } from '../toml.js';
import { isPlainTransport } from '../transport.js';

/** The kinds Cargo prefixes a locked source with, a local path being locked with no source at all */
const SOURCE_KINDS: ReadonlyMap<string, DependencySource> = new Map([
  ['registry', 'registry'],
  ['sparse', 'registry'],
  ['git', 'remote'],
]);

/** The value a lockfile from before Rust 1.41 records for a package with no checksum */
const NO_CHECKSUM = '<none>';

const cargoSourceOf = (
  file: string,
  name: string,
  source: string | undefined
): DependencySource => {
  if (source === undefined) return 'project';
  if (isPlainTransport(source)) return 'plain';

  const separator = source.indexOf('+');
  const kind =
    separator === -1 ? undefined : SOURCE_KINDS.get(source.slice(0, separator));

  if (kind === undefined)
    throw cannotJudge(
      file,
      `locks ${quotedExcerpt(name)} from a source Cargo does not write: ${quotedExcerpt(source)}`
    );

  return kind;
};

/** The checksum a lockfile from before Rust 1.41 keeps under `[metadata]` instead of on the package */
const legacyChecksum = (
  file: string,
  metadata: Record<string, unknown>,
  name: string,
  version: string | undefined,
  source: string | undefined
): string | undefined =>
  version === undefined || source === undefined
    ? undefined
    : textAt(
        file,
        metadata,
        `checksum ${name} ${version} (${source})`,
        'metadata'
      );

const cargoEntryOf = (
  file: string,
  locked: Record<string, unknown>,
  metadata: Record<string, unknown>
): LockedEntry => {
  const name = textAt(file, locked, 'name', 'package');

  if (name === undefined)
    throw cannotJudge(file, 'locks a package with no name');

  const where = `package.${name}`;
  const version = textAt(file, locked, 'version', where);
  const source = textAt(file, locked, 'source', where);
  const checksum =
    textAt(file, locked, 'checksum', where) ??
    legacyChecksum(file, metadata, name, version, source);

  return {
    name: version === undefined ? name : `${name}@${version}`,
    source: cargoSourceOf(file, name, source),
    hashed: checksum !== undefined && checksum !== NO_CHECKSUM,
    installScript: false,
  };
};

/** The packages of a Cargo.lock, whose registry packages each carry a checksum */
export const readCargoLock = (
  file: string,
  content: string
): DependencyRead => {
  const lock = tomlOf(file, content);
  const metadata = tableOrEmptyAt(file, lock, 'metadata', '');

  return flagsRead(
    unverifiedFlags(
      tablesAt(file, lock, 'package', '').map((locked) =>
        cargoEntryOf(file, locked, metadata)
      )
    )
  );
};
