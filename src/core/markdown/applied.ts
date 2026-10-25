import type { AppliedEntry } from '../../types/core.js';
import { leadingNameLength } from '../../catalog/name.js';
import { afterSeparator } from './fields';
import { inlineText } from './lines';

export const APPLIED_HEADINGS = [
  'Applied specializations',
  'Applied sub-skills',
];

export const LEGACY_SPECIALIZATION_PATH = '.lagune/skills/';

const LEGACY_EXTENSION = '.md';
const BOLD_MARKS = ['**', '__'];
const CODE_MARK = '`';

const dropPrefix = (text: string, mark: string): string =>
  text.startsWith(mark) ? text.slice(mark.length) : text;

const dropOpeningDecoration = (text: string): string =>
  dropPrefix(BOLD_MARKS.reduce(dropPrefix, text), CODE_MARK);

const skipClosingDecoration = (text: string, index: number): number => {
  let cursor = index;

  if (text.startsWith(CODE_MARK, cursor)) cursor += CODE_MARK.length;

  for (const mark of BOLD_MARKS)
    if (text.startsWith(mark, cursor)) cursor += mark.length;

  return cursor;
};

const legacyName = (
  content: string
): { name: string; end: number } | undefined => {
  if (!content.startsWith(LEGACY_SPECIALIZATION_PATH)) return undefined;

  const dot = content.indexOf(
    LEGACY_EXTENSION,
    LEGACY_SPECIALIZATION_PATH.length
  );

  if (dot === -1) return undefined;

  const name = content.slice(LEGACY_SPECIALIZATION_PATH.length, dot);

  if (name === '' || name.includes(CODE_MARK) || name.includes('/'))
    return undefined;

  return { name, end: dot + LEGACY_EXTENSION.length };
};

const bareName = (
  content: string
): { name: string; end: number } | undefined => {
  const end = leadingNameLength(content);

  return end === 0 ? undefined : { name: content.slice(0, end), end };
};

/** Reads one "Applied specializations" bullet, named as the catalog lists it or by its legacy path */
export const appliedEntry = (bullet: string): AppliedEntry | undefined => {
  const content = dropOpeningDecoration(bullet);
  const named = legacyName(content) ?? bareName(content);

  if (named === undefined) return undefined;

  const cursor = afterSeparator(
    content,
    skipClosingDecoration(content, named.end)
  );

  if (cursor === -1) return undefined;

  const contribution = inlineText(content.slice(cursor));

  return contribution === '' ? undefined : { name: named.name, contribution };
};
