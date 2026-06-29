import type { FileScan, RegexScanResult } from '../../types/hooks/regex.js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { buildsDynamicRegex, wrapsStaticRegex } from './dynamic.js';
import { extractCandidates } from './extract.js';
import { languageOf } from './language.js';
import { check } from './regex.js';
import { walk } from './walk.js';

const EMPTY: FileScan = { unsafe: [], dynamic: null, staticWrap: null };

const scanFile = async (
  root: string,
  file: string,
  repetitionLimit: number | undefined
): Promise<FileScan> => {
  const language = languageOf(file);

  if (language === null) return EMPTY;

  let text;

  try {
    text = await readFile(join(root, file), 'utf8');
  } catch {
    return EMPTY;
  }

  const unsafe = new Set<string>();

  for (const source of extractCandidates(text, language))
    if (check(source, { repetitionLimit }) === 'unsafe') unsafe.add(source);

  return {
    unsafe: [...unsafe]
      .toSorted((a, b) => a.localeCompare(b))
      .map((source) => ({ file, source })),
    dynamic: buildsDynamicRegex(text, language) ? file : null,
    staticWrap: wrapsStaticRegex(text, language) ? file : null,
  };
};

const sortedFiles = (files: (string | null)[]): string[] =>
  files
    .filter((file): file is string => file !== null)
    .toSorted((a, b) => a.localeCompare(b));

/** Maps ReDoS-prone literals and dynamic-regex files across paths, deterministic */
export const scan = async (
  root: string,
  targets: string[],
  repetitionLimit?: number
): Promise<RegexScanResult> => {
  const walked = await Promise.all(targets.map((target) => walk(root, target)));
  const files = [...new Set(walked.flat())];
  const perFile = await Promise.all(
    files.map((file) => scanFile(root, file, repetitionLimit))
  );

  return {
    unsafe: perFile.flatMap((entry) => entry.unsafe),
    dynamic: sortedFiles(perFile.map((entry) => entry.dynamic)),
    staticWrap: sortedFiles(perFile.map((entry) => entry.staticWrap)),
  };
};
