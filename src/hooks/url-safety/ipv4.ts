import {
  OCTET_BITS,
  OCTET_COUNT,
  OCTET_MAX,
  packOctets,
  stripRootDot,
  toDottedQuad,
  unpackOctets,
} from './ipv4-address.js';

const NON_HOST_CHARS = /[:/\\@?#[\]\s]/;

const HEX_DIGITS = /^[0-9a-fA-F]+$/;
const OCTAL_DIGITS = /^[0-7]+$/;
const DECIMAL_DIGITS = /^[0-9]+$/;

const parseHex = (part: string): number | null => {
  const digits = part.slice(2);

  if (digits.length === 0) return 0;
  if (!HEX_DIGITS.test(digits)) return null;

  return Number.parseInt(digits, 16);
};

const isHexPart = (part: string): boolean =>
  part.length >= 2 && part[0] === '0' && (part[1] === 'x' || part[1] === 'X');

const isOctalPart = (part: string): boolean =>
  part.length >= 2 && part[0] === '0';

const parsePart = (part: string): number | null => {
  if (isHexPart(part)) return parseHex(part);

  if (isOctalPart(part))
    return OCTAL_DIGITS.test(part) ? Number.parseInt(part, 8) : null;

  return DECIMAL_DIGITS.test(part) ? Number.parseInt(part, 10) : null;
};

const packParts = (parts: number[]): number | null => {
  const lastIndex = parts.length - 1;

  for (let index = 0; index < lastIndex; index += 1)
    if (parts[index] > OCTET_MAX) return null;

  const remainingBits = (OCTET_COUNT - parts.length + 1) * OCTET_BITS;

  if (parts[lastIndex] > 2 ** remainingBits - 1) return null;

  const highOctets = parts.slice(0, lastIndex);
  const lowOctets = unpackOctets(parts[lastIndex]).slice(parts.length - 1);

  return packOctets([...highOctets, ...lowOctets]);
};

export const canonicalizeIPv4 = (host: string): string | null => {
  if (host.length === 0 || NON_HOST_CHARS.test(host)) return null;

  const parts = stripRootDot(host).split('.');

  if (parts.length > OCTET_COUNT) return null;

  const values: number[] = [];

  for (const part of parts) {
    if (part === '') return null;

    const value = parsePart(part);

    if (value === null) return null;

    values.push(value);
  }

  const address = packParts(values);

  return address === null ? null : toDottedQuad(address);
};
