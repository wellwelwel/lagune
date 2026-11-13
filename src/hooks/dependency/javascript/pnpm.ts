import type {
  BlockField,
  BlockNode,
  DependencySource,
  LockedEntry,
} from '../../../types/hooks/dependency.js';
import { quotedExcerpt } from '../../../core/errors.js';
import { cannotJudge } from '../text.js';
import { isPlainTransport } from '../transport.js';
import {
  blockMappingOf,
  blocksOf,
  flowMappingOf,
  mappingOf,
} from './blocks.js';
import { sourceOf } from './specifier.js';

const NAME_SEPARATOR = /[@/]/;

const REGISTRY_VERSION = /^\d/;

const LEGACY_KEY_PREFIX = '/';

/** The version part of a locked name, written as `name@version` or, by older pnpm releases, as `name/version` */
const lockedVersionOf = (name: string): string => {
  const from = name.startsWith('@') ? name.indexOf('/') + 1 : 0;
  const separator = name.slice(from).search(NAME_SEPARATOR);

  return separator === -1 ? '' : name.slice(from + separator + 1);
};

const fieldOf = (file: string, node: BlockNode): BlockField => ({
  ...mappingOf(file, node.text, node.line),
  line: node.line,
  children: node.children,
});

const resolutionOf = (
  file: string,
  { value, line, children }: BlockField
): Map<string, string> =>
  value === ''
    ? blockMappingOf(file, children)
    : flowMappingOf(file, value, line);

const pnpmSourceOf = (
  name: string,
  resolution: ReadonlyMap<string, string>
): DependencySource => {
  const tarball = resolution.get('tarball');
  const repository = resolution.get('repo');
  const version = lockedVersionOf(name);

  if (
    [tarball, repository].some(
      (url) => url !== undefined && isPlainTransport(url)
    )
  )
    return 'plain';
  if (resolution.get('type') === 'directory' || resolution.has('directory'))
    return 'project';
  if (sourceOf(version) === 'project') return 'project';
  if (resolution.get('type') === 'git' || !REGISTRY_VERSION.test(version))
    return 'remote';
  if (tarball !== undefined && !resolution.has('integrity')) return 'remote';

  return 'registry';
};

const pnpmEntryOf = (file: string, entry: BlockNode): LockedEntry => {
  const { key } = mappingOf(file, entry.text, entry.line);
  const fields = entry.children.map((child) => fieldOf(file, child));
  const resolutionField = fields.find((field) => field.key === 'resolution');

  if (resolutionField === undefined)
    throw cannotJudge(file, `locks ${quotedExcerpt(key)} with no resolution`);

  const resolution = resolutionOf(file, resolutionField);
  const name = key.startsWith(LEGACY_KEY_PREFIX)
    ? key.slice(LEGACY_KEY_PREFIX.length)
    : key;

  return {
    name,
    source: pnpmSourceOf(name, resolution),
    hashed: resolution.has('integrity'),
    installScript: fields.some(
      (field) => field.key === 'requiresBuild' && field.value === 'true'
    ),
  };
};

/** The packages of every document a pnpm-lock.yaml holds */
export const pnpmEntries = (file: string, content: string): LockedEntry[] => {
  const sections = blocksOf(file, content).map((node) => fieldOf(file, node));

  if (!sections.some(({ key }) => key === 'lockfileVersion'))
    throw cannotJudge(file, 'is not a pnpm lockfile');

  return sections
    .filter(({ key }) => key === 'packages')
    .flatMap(({ children }) =>
      children.map((entry) => pnpmEntryOf(file, entry))
    );
};
