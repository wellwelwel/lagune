import type { Digest } from './types.ts';
import { revealHidden } from './hidden.ts';

const CHARACTERS_PER_TOKEN = 4;

export const formatCount = (value: number): string =>
  value.toLocaleString('en-US');

export const tokens = (length: number): string =>
  `~${formatCount(Math.ceil(length / CHARACTERS_PER_TOKEN))} tokens`;

export const clip = (line: string, width: number): string => {
  const visible = revealHidden(line);

  return visible.length > width ? `${visible.slice(0, width)} [...]` : visible;
};

export const displayPath = (
  digests: Digest[],
  digest: Digest,
  path: string
): string => (digests.length > 1 ? `${digest.root}/${path}` : path);

export const omitted = (count: number, hint: string): string[] =>
  count > 0 ? [`[... ${formatCount(count)} more${hint}]`] : [];
