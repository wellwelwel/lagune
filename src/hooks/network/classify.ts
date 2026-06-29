import type { AddressClass, IPv4Range } from '../../types/hooks/network.js';
import {
  DOTTED_QUAD,
  packOctets,
  stripRootDot,
  toDottedQuad,
} from './ipv4-address.js';
import { canonicalizeIPv4 } from './ipv4.js';
import { normalizeIPv6 } from './ipv6.js';

const LOOPBACK_NAMES = new Set([
  'localhost',
  'localhost.localdomain',
  'ip6-localhost',
  'ip6-loopback',
]);

const dottedToAddress = (dotted: string): number =>
  packOctets(dotted.split('.').map((octet) => Number.parseInt(octet, 10)));

const range = (
  network: string,
  prefix: number,
  addressClass: AddressClass
): IPv4Range => ({
  network: dottedToAddress(network),
  prefix,
  class: addressClass,
});

const IPV4_RANGES_BY_PRECEDENCE: IPv4Range[] = [
  range('169.254.169.254', 32, 'metadata'),
  range('0.0.0.0', 8, 'unspecified'),
  range('127.0.0.0', 8, 'loopback'),
  range('169.254.0.0', 16, 'link-local'),
  range('10.0.0.0', 8, 'private'),
  range('100.64.0.0', 10, 'private'),
  range('172.16.0.0', 12, 'private'),
  range('192.168.0.0', 16, 'private'),
];

const contains = (address: number, { network, prefix }: IPv4Range): boolean => {
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;

  return (address & mask) >>> 0 === network;
};

const classifyIPv4 = (dotted: string): AddressClass => {
  const octets = dotted.split('.').map((octet) => Number.parseInt(octet, 10));
  if (octets.some((octet) => octet > 0xff)) return 'invalid';

  const address = packOctets(octets);
  const match = IPV4_RANGES_BY_PRECEDENCE.find((candidate) =>
    contains(address, candidate)
  );

  return match?.class ?? 'public';
};

const MAPPED_PREFIX = [0, 0, 0, 0, 0, 0xffff];
const COMPATIBLE_PREFIX = [0, 0, 0, 0, 0, 0];
const NAT64_PREFIX = [0x0064, 0xff9b, 0, 0, 0, 0];
const SIXTOFOUR_TAG = 0x2002;

const matchesPrefix = (hextets: number[], prefix: number[]): boolean =>
  prefix.every((value, index) => hextets[index] === value);

const hextetPairToIPv4 = (high: number, low: number): number =>
  packOctets([
    (high >>> 8) & 0xff,
    high & 0xff,
    (low >>> 8) & 0xff,
    low & 0xff,
  ]);

const embeddedIPv4 = (hextets: number[]): number | null => {
  const trailing = hextetPairToIPv4(hextets[6], hextets[7]);

  if (matchesPrefix(hextets, MAPPED_PREFIX)) return trailing;
  if (matchesPrefix(hextets, COMPATIBLE_PREFIX) && trailing > 0xffff)
    return trailing;
  if (matchesPrefix(hextets, NAT64_PREFIX)) return trailing;
  if (hextets[0] === SIXTOFOUR_TAG)
    return hextetPairToIPv4(hextets[1], hextets[2]);

  return null;
};

const isUnspecified = (hextets: number[]): boolean =>
  hextets.every((value) => value === 0);

const isLoopback = (hextets: number[]): boolean =>
  hextets.slice(0, 7).every((value) => value === 0) && hextets[7] === 1;

const isLinkLocal = (hextets: number[]): boolean =>
  (hextets[0] & 0xffc0) === 0xfe80;

const isUniqueLocal = (hextets: number[]): boolean =>
  (hextets[0] & 0xfe00) === 0xfc00;

const classifyIPv6 = (host: string): AddressClass => {
  const hextets = normalizeIPv6(host);
  if (hextets === null) return 'invalid';

  const embedded = embeddedIPv4(hextets);
  if (embedded !== null) return classifyIPv4(toDottedQuad(embedded));

  if (isUnspecified(hextets)) return 'unspecified';
  if (isLoopback(hextets)) return 'loopback';
  if (isLinkLocal(hextets)) return 'link-local';
  if (isUniqueLocal(hextets)) return 'private';

  return 'public';
};

const isPinnedLoopback = (name: string): boolean =>
  LOOPBACK_NAMES.has(name) || name.endsWith('.localhost');

export const classifyAddress = (host: string): AddressClass => {
  const name = stripRootDot(host.toLowerCase());

  if (isPinnedLoopback(name)) return 'loopback';
  if (host.includes(':')) return classifyIPv6(host);
  if (DOTTED_QUAD.test(host)) return classifyIPv4(host);

  const dotted = canonicalizeIPv4(host);
  return dotted === null ? 'public' : classifyIPv4(dotted);
};
