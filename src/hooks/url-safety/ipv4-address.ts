export const OCTET = /^(0|[1-9]\d{0,2})$/;

export const DOTTED_QUAD =
  /^(0|[1-9]\d{0,2})\.(0|[1-9]\d{0,2})\.(0|[1-9]\d{0,2})\.(0|[1-9]\d{0,2})$/;

export const OCTET_COUNT = 4;
export const OCTET_MAX = 0xff;
export const OCTET_BITS = 8;

export const packOctets = (octets: number[]): number =>
  octets.reduce((address, octet) => address * (OCTET_MAX + 1) + octet, 0) >>> 0;

export const unpackOctets = (address: number): number[] => [
  (address >>> 24) & OCTET_MAX,
  (address >>> 16) & OCTET_MAX,
  (address >>> 8) & OCTET_MAX,
  address & OCTET_MAX,
];

export const toDottedQuad = (address: number): string =>
  unpackOctets(address).join('.');

export const stripRootDot = (host: string): string =>
  host.length > 1 && host.endsWith('.') && !host.endsWith('..')
    ? host.slice(0, -1)
    : host;
