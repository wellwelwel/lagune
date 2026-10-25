import type { TokenCount } from '../types/core.js';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { get_encoding } from 'tiktoken';

const listMarkdownFiles = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, {
    recursive: true,
    withFileTypes: true,
  });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => join(entry.parentPath, entry.name));
};

/** Counts the tokens of every markdown file under the given folders, by path from the root */
export const countTokens = async (
  root: string,
  dirs: string[]
): Promise<TokenCount[]> => {
  const nested = await Promise.all(
    dirs.map((dir) => listMarkdownFiles(join(root, dir)))
  );
  const files = nested
    .flat()
    .map((file) => relative(root, file).split(sep).join('/'))
    .toSorted((left, right) => left.localeCompare(right));
  const encoding = get_encoding('o200k_base');

  try {
    return await Promise.all(
      files.map(async (relativePath) => {
        const contents = await readFile(join(root, relativePath), 'utf8');

        return {
          relativePath,
          tokens: encoding.encode(contents).length,
        };
      })
    );
  } finally {
    encoding.free();
  }
};
