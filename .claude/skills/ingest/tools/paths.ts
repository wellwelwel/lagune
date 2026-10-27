import type { Digest } from './types.ts';
import { basename, extname } from 'node:path';

export const extensionOf = (path: string): string => {
  const name = basename(path);
  const extension = extname(name);

  return extension === '' ? name : extension.toLowerCase();
};

export const stripRoot = (digest: Digest, path: string): string =>
  path.startsWith(`${digest.root}/`)
    ? path.slice(digest.root.length + 1)
    : path;
