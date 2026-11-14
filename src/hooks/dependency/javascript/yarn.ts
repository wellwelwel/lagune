import type {
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
  mappingOf,
  splitOutsideQuotes,
  unquoted,
} from './blocks.js';
import { sourceOf } from './specifier.js';

const CLASSIC_MARKER = /^# yarn lockfile v1\r?$/m;

const BERRY_MARKER = '__metadata:';

const HASH_FRAGMENT = /#[0-9a-f]{40,128}$/i;

const REGISTRY_PROTOCOL = 'npm:';

/** The hosts Yarn 1 always reaches over https, whatever scheme the lockfile writes, as its own request code matches them */
const YARN_FORCED_HTTPS =
  /^http:\/\/(?:[^/]{1,253}\.)?(?:yarnpkg\.com|npmjs\.(?:org|com))(?:\/|$)/;

/** What a Yarn 2 or later entry records when the package installs only on some platforms, which Yarn never checksums */
const CONDITIONS = 'conditions';

const descriptorParts = (
  file: string,
  descriptor: string
): [name: string, reference: string] => {
  const at = descriptor.indexOf('@', 1);

  if (at === -1)
    throw cannotJudge(
      file,
      `locks ${quotedExcerpt(descriptor)}, which names no version or source`
    );

  return [descriptor.slice(0, at), descriptor.slice(at + 1)];
};

const classicFieldOf = (file: string, node: BlockNode): [string, string] => {
  const space = node.text.indexOf(' ');

  if (space === -1)
    throw cannotJudge(
      file,
      `holds line ${node.line}, which is not a field and a value`
    );

  return [
    node.text.slice(0, space),
    unquoted(file, node.text.slice(space + 1).trim()),
  ];
};

/** Whether Yarn 1 fetches a URL in the clear, as it does every plain one but those on the hosts it moves to https */
export const isClassicPlainTransport = (url: string): boolean =>
  isPlainTransport(url) && !YARN_FORCED_HTTPS.test(url);

const classicSourceOf = (
  range: string,
  resolved: string | undefined
): DependencySource => {
  if (resolved !== undefined && isClassicPlainTransport(resolved))
    return 'plain';

  return sourceOf(range);
};

/** An entry of a Yarn 1 lockfile, whose registry entries carry an integrity field or a hash after the resolved URL */
const classicEntryOf = (file: string, node: BlockNode): LockedEntry => {
  if (!node.text.endsWith(':'))
    throw cannotJudge(
      file,
      `holds line ${node.line}, which opens no locked entry`
    );

  const [descriptor] = splitOutsideQuotes(node.text.slice(0, -1));
  const [name, range] = descriptorParts(
    file,
    unquoted(file, descriptor.trim())
  );
  const fields = new Map(
    node.children
      .filter(({ children }) => children.length === 0)
      .map((child) => classicFieldOf(file, child))
  );
  const resolved = fields.get('resolved');

  return {
    name: `${name}@${fields.get('version') ?? range}`,
    source: classicSourceOf(range, resolved),
    missingHash:
      !fields.has('integrity') &&
      (resolved === undefined || !HASH_FRAGMENT.test(resolved)),
    installScript: false,
  };
};

/** Where a resolution fetches from, reading any protocol other than the registry's as outside it */
const berrySourceOf = (reference: string): DependencySource => {
  if (reference.startsWith(REGISTRY_PROTOCOL)) return 'registry';

  const source = sourceOf(reference);

  return source === 'registry' ? 'remote' : source;
};

/** An entry of a Yarn 2 or later lockfile, whose registry entries carry a checksum unless they install only on some platforms */
const berryEntryOf = (file: string, node: BlockNode): LockedEntry[] => {
  const { key } = mappingOf(file, node.text, node.line);

  if (key === '__metadata') return [];

  const fields = blockMappingOf(file, node.children);
  const resolution = fields.get('resolution');

  if (resolution === undefined)
    throw cannotJudge(file, `locks ${quotedExcerpt(key)} with no resolution`);

  const [name, reference] = descriptorParts(file, resolution);

  return [
    {
      name: `${name}@${fields.get('version') ?? reference}`,
      source: berrySourceOf(reference),
      missingHash: !fields.has('checksum') && !fields.has(CONDITIONS),
      installScript: false,
    },
  ];
};

/** The entries of a yarn.lock from Yarn 1 or from Yarn 2 and later, where an empty file marks a project with nothing locked yet */
export const yarnEntries = (file: string, content: string): LockedEntry[] => {
  if (content.trim() === '') return [];

  const roots = blocksOf(file, content);

  if (roots.some(({ text }) => text === BERRY_MARKER))
    return roots.flatMap((node) => berryEntryOf(file, node));
  if (CLASSIC_MARKER.test(content))
    return roots.map((node) => classicEntryOf(file, node));

  throw cannotJudge(file, 'is not a Yarn lockfile');
};
