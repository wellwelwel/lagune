import type {
  BlockField,
  BlockNode,
  DependencyFlag,
  DependencyRead,
  YarnRegistries,
} from '../../../types/hooks/dependency.js';
import { quotedExcerpt } from '../../../core/errors.js';
import { flagsRead } from '../read.js';
import { cannotJudge } from '../text.js';
import { isPlainTransport } from '../transport.js';
import {
  blocksOf,
  closingQuoteOf,
  fieldOf,
  splitOutsideQuotes,
  unquoted,
} from './blocks.js';
import { isRegistryKey } from './npmrc.js';
import { isClassicPlainTransport } from './yarn.js';

const LINE_BREAKS = /\r?\n/;

const CLASSIC_SKIPPED = /^(?:\s|#|$)/;

const WHITESPACE = /\s/;

const TRAILING_COMMENT = /\s#/;

const LIST_ITEM = '- ';

const REGISTRY_SERVER = 'npmRegistryServer';

/** The checksum behaviors under which Yarn installs a package that does not match the checksum its lockfile records */
const SKIPPING_BEHAVIORS: ReadonlySet<string> = new Set(['ignore', 'update']);

/** The longest hostname DNS allows, beyond which a hostname or a pattern is never matched */
const HOSTNAME_LENGTH = 253;

/** The most whitelist patterns and plain registries matched in one file, keeping the match in bounded time */
const MATCH_LIMIT = 32;

/** A configuration scalar, unquoted, with any comment after it left out */
const configScalar = (file: string, raw: string): string => {
  const text = raw.trim();

  if (!text.startsWith('"') && !text.startsWith("'")) {
    const comment = text.search(TRAILING_COMMENT);

    return (comment === -1 ? text : text.slice(0, comment)).trim();
  }

  const closing = closingQuoteOf(text);
  const rest = closing === -1 ? '' : text.slice(closing + 1).trim();

  if (closing === -1 || (rest !== '' && !rest.startsWith('#')))
    throw cannotJudge(
      file,
      `holds a quoted value it cannot read: ${quotedExcerpt(text)}`
    );

  return unquoted(file, text.slice(0, closing + 1));
};

/** A top-level .yarnrc line split into its key, quoted or bare, and the value after the whitespace that ends the key */
const classicEntryOf = (
  file: string,
  line: string
): [key: string, value: string] => {
  const text = line.trimEnd();
  const keyEnd = text.startsWith('"')
    ? closingQuoteOf(text) + 1
    : text.search(WHITESPACE);

  if (keyEnd <= 0 || !WHITESPACE.test(text.charAt(keyEnd)))
    throw cannotJudge(
      file,
      `holds a line Yarn 1 reads as no key and value: ${quotedExcerpt(line)}`
    );

  return [unquoted(file, text.slice(0, keyEnd)), text.slice(keyEnd).trim()];
};

const classicFlagsOf = (file: string, line: string): DependencyFlag[] => {
  const [key, value] = classicEntryOf(file, line);
  const url = configScalar(file, value);

  return isRegistryKey(key) && isClassicPlainTransport(url)
    ? [{ verdict: 'plain-transport', name: url }]
    : [];
};

/** A .yarnrc, which Yarn 1 reads for the registries it fetches from, one key and its value on each top-level line */
export const readYarnrc = (file: string, content: string): DependencyRead =>
  flagsRead(
    content
      .split(LINE_BREAKS)
      .filter(
        (line) => !CLASSIC_SKIPPED.test(line) && !line.trimEnd().endsWith(':')
      )
      .flatMap((line) => classicFlagsOf(file, line))
  );

const settingsOf = (
  file: string,
  nodes: readonly BlockNode[]
): Map<string, BlockField> =>
  new Map(
    nodes.map((node) => {
      const field = fieldOf(file, node);

      return [field.key, field];
    })
  );

/** The items of a YAML list, written as lines that each open with a dash or as a flow between brackets */
const yamlList = (file: string, { value, children }: BlockField): string[] => {
  const flow = value.trim();

  if (flow === '')
    return children.map(({ text }) => {
      if (!text.startsWith(LIST_ITEM))
        throw cannotJudge(
          file,
          `holds a list item that does not open with a dash: ${quotedExcerpt(text)}`
        );

      return configScalar(file, text.slice(LIST_ITEM.length));
    });

  if (!flow.startsWith('[') || !flow.endsWith(']'))
    return [configScalar(file, flow)];

  const body = flow.slice(1, -1).trim();

  return body === ''
    ? []
    : splitOutsideQuotes(body).map((item) => configScalar(file, item));
};

/** The registries a .yarnrc.yml names, at its top and for each scope, and the hosts it lets Yarn reach over plain http:// */
const yarnRegistriesOf = (
  file: string,
  settings: ReadonlyMap<string, BlockField>
): YarnRegistries => {
  const server = settings.get(REGISTRY_SERVER);
  const scopes = settings.get('npmScopes')?.children ?? [];
  const whitelist = settings.get('unsafeHttpWhitelist');

  return {
    servers: [
      ...(server === undefined ? [] : [configScalar(file, server.value)]),
      ...scopes.flatMap(({ children }) => {
        const scoped = settingsOf(file, children).get(REGISTRY_SERVER);

        return scoped === undefined ? [] : [configScalar(file, scoped.value)];
      }),
    ],
    allowedHttpHosts: whitelist === undefined ? [] : yamlList(file, whitelist),
  };
};

/** Whether a hostname matches a glob of * and ?, in one pass that steps back only to the last star */
const matchesGlob = (pattern: string, hostname: string): boolean => {
  let patternAt = 0;
  let hostnameAt = 0;
  let star = -1;
  let resumeAt = 0;

  while (hostnameAt < hostname.length) {
    const expected = pattern[patternAt];

    if (expected === '*') {
      star = patternAt;
      patternAt += 1;
      resumeAt = hostnameAt;
      continue;
    }

    if (expected === '?' || expected === hostname[hostnameAt]) {
      patternAt += 1;
      hostnameAt += 1;
      continue;
    }

    if (star === -1) return false;

    patternAt = star + 1;
    resumeAt += 1;
    hostnameAt = resumeAt;
  }

  while (pattern[patternAt] === '*') patternAt += 1;

  return patternAt === pattern.length;
};

const hostnameOf = (url: string): string | null => {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
};

/** Whether the file's own whitelist lets Yarn reach a URL over plain http://, which a hostname or a pattern too long to be a host never settles */
const isAllowedOverHttp = (
  url: string,
  patterns: readonly string[]
): boolean => {
  const hostname = hostnameOf(url);

  if (hostname === null || hostname.length > HOSTNAME_LENGTH) return false;

  return patterns
    .slice(0, MATCH_LIMIT)
    .some(
      (pattern) =>
        pattern.length <= HOSTNAME_LENGTH && matchesGlob(pattern, hostname)
    );
};

const checksumFlags = (
  file: string,
  settings: ReadonlyMap<string, BlockField>
): DependencyFlag[] => {
  const behavior = settings.get('checksumBehavior');
  const value =
    behavior === undefined ? undefined : configScalar(file, behavior.value);

  return value !== undefined && SKIPPING_BEHAVIORS.has(value)
    ? [{ verdict: 'skipped-checksum', name: `checksumBehavior ${value}` }]
    : [];
};

/** A .yarnrc.yml, which Yarn 2 and later read for the registries they fetch from and for how they treat a checksum that does not match, an http:// registry being one Yarn refuses unless a whitelist allows its host */
export const readYarnrcYml = (
  file: string,
  content: string
): DependencyRead => {
  const settings = settingsOf(file, blocksOf(file, content));
  const { servers, allowedHttpHosts } = yarnRegistriesOf(file, settings);
  const plain = servers.filter(isPlainTransport);

  return flagsRead([
    ...plain.map((url, index): DependencyFlag => ({
      verdict:
        index < MATCH_LIMIT && isAllowedOverHttp(url, allowedHttpHosts)
          ? 'plain-transport'
          : 'guarded-plain-transport',
      name: url,
    })),
    ...checksumFlags(file, settings),
  ]);
};
