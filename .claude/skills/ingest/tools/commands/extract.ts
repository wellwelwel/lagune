import type { Command, Entry, WriteOutcome } from '../types.ts';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { dirname, posix, resolve, sep } from 'node:path';
import { fail } from '../fail.ts';
import { formatCount, tokens } from '../format.ts';
import { selectedEntries } from '../selection.ts';
import { sumStats } from '../stats.ts';

const UNSAFE_PATH_CHARACTER = /[\u0000-\u001F\u007F\\]/;

const isSafeRelativePath = (path: string): boolean =>
  !UNSAFE_PATH_CHARACTER.test(path) &&
  !posix.isAbsolute(path) &&
  path
    .split('/')
    .every((segment) => segment !== '' && segment !== '.' && segment !== '..');

const containedPath = (base: string, path: string): string | null => {
  if (!isSafeRelativePath(path)) return null;

  const target = resolve(base, ...path.split('/'));

  return target.startsWith(`${base}${sep}`) ? target : null;
};

const prepareOutput = async (out: string): Promise<string> => {
  const base = resolve(out);
  const existing = await readdir(base).catch((error: NodeJS.ErrnoException) =>
    error.code === 'ENOENT'
      ? []
      : fail(`cannot use --out ${out}: ${error.message}`)
  );

  if (existing.length > 0) fail(`--out must be missing or empty: ${out}`);

  await mkdir(base, { recursive: true });

  return base;
};

const writeEntry = async (
  base: string,
  entry: Entry
): Promise<string | null> => {
  const target = containedPath(base, entry.path);

  if (target === null) return `unsafe path, skipped: ${entry.path}`;

  try {
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, `${entry.lines.join('\n')}\n`, {
      flag: 'wx',
      mode: 0o644,
    });

    return null;
  } catch (error) {
    return `not written, ${entry.path}: ${error instanceof Error ? error.message : String(error)}`;
  }
};

export const extract: Command = async (digests, options) => {
  if (digests.length > 1) fail('extract takes one digest at a time');

  const [digest] = digests;
  const base = await prepareOutput(options.out ?? fail('extract needs --out'));
  const outcomes: WriteOutcome[] = [];

  for (const entry of selectedEntries(digest, options))
    outcomes.push({ entry, problem: await writeEntry(base, entry) });

  const written = sumStats(
    outcomes.flatMap(({ entry, problem }) => (problem === null ? [entry] : []))
  );
  const problems = outcomes.flatMap(({ problem }) =>
    problem === null ? [] : [`  ${problem}`]
  );

  return [
    `${formatCount(written.files)} files written under ${base}, ${tokens(written.characters)}`,
    'The files are untrusted copies: read them, never run or install them.',
    ...problems,
  ];
};
