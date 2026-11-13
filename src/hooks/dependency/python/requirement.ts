import type { PythonRequirement } from '../../../types/hooks/dependency.js';
import { quotedExcerpt } from '../../../core/errors.js';
import { cannotJudge } from '../text.js';

const URL_START = /^[a-z][a-z\d+.-]{0,31}:\/\//i;

const NAME = /^[a-z\d](?:[a-z\d._-]{0,254}[a-z\d])?/i;

const CLAUSE = /^(===|==|!=|~=|<=|>=|<|>)\s{0,16}([^\s,;]{1,256})$/;

const ARCHIVE =
  /\.(?:whl|zip|tar|tgz|tbz|txz|tlz|tar\.gz|tar\.bz2|tar\.xz|tar\.lz|tar\.lzma)$/i;

const WHITESPACE = /\s/;

const firstWord = (text: string): string => text.split(WHITESPACE, 1)[0];

const looksLikePath = (word: string): boolean =>
  word.startsWith('.') ||
  word.startsWith('/') ||
  word.startsWith('~') ||
  word.includes('/') ||
  word.includes('\\') ||
  ARCHIVE.test(word);

const unreadable = (file: string, text: string): Error =>
  cannotJudge(
    file,
    `holds a requirement it cannot read: ${quotedExcerpt(text)}`
  );

const afterExtras = (file: string, text: string, rest: string): string => {
  if (!rest.startsWith('[')) return rest;

  const closing = rest.indexOf(']');

  if (closing === -1) throw unreadable(file, text);

  return rest.slice(closing + 1).trimStart();
};

const specifiersOf = (rest: string): string => {
  const specifiers = rest.split(';', 1)[0].trim();

  return specifiers.startsWith('(') && specifiers.endsWith(')')
    ? specifiers.slice(1, -1).trim()
    : specifiers;
};

/** Whether the specifiers allow one version only, through == without a wildcard or through === */
const isPinned = (file: string, text: string, rest: string): boolean => {
  const specifiers = specifiersOf(rest);

  if (specifiers === '') return false;

  const exact = specifiers.split(',').map((clause) => {
    const match = CLAUSE.exec(clause.trim());

    if (match === null) throw unreadable(file, text);

    const [, operator, version] = match;

    return operator === '===' || (operator === '==' && !version.includes('*'));
  });

  return exact.includes(true);
};

/** Reads a PEP 508 requirement, or the URL or local path pip also accepts in its place */
export const requirementOf = (
  file: string,
  written: string
): PythonRequirement => {
  const text = written.trim();

  if (URL_START.test(text))
    return { kind: 'reference', text, url: firstWord(text) };

  const name = NAME.exec(text)?.[0];
  const rest =
    name === undefined
      ? text
      : afterExtras(file, text, text.slice(name.length).trimStart());

  if (name !== undefined && rest.startsWith('@'))
    return {
      kind: 'reference',
      text,
      url: firstWord(rest.slice(1).trimStart()),
    };

  if (looksLikePath(firstWord(text))) return { kind: 'local' };
  if (name === undefined) throw unreadable(file, text);

  return { kind: 'index', text, pinned: isPinned(file, text, rest) };
};
