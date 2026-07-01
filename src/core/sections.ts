import type { SectionRemoval } from '../types/core.js';

const HEADING_PREFIX = '### ';

const isBoundary = (line: string): boolean =>
  line.startsWith('### ') || line.startsWith('## ');

const isTargetHeading = (line: string, name: string): boolean =>
  line.startsWith(HEADING_PREFIX) &&
  line.slice(HEADING_PREFIX.length).trimEnd() === name.trimEnd();

const findSectionEnd = (lines: string[], headingIndex: number): number => {
  const after = lines.slice(headingIndex + 1).findIndex(isBoundary);

  return after === -1 ? lines.length : headingIndex + 1 + after;
};

const tidy = (content: string): string =>
  `${content.replace(/\n{3,}/g, '\n\n').replace(/\s+$/, '')}\n`;

export const removeSection = (
  markdown: string,
  name: string
): SectionRemoval => {
  const lines = markdown.split('\n');
  const headingIndex = lines.findIndex((line) => isTargetHeading(line, name));

  if (headingIndex === -1) return { content: markdown, removed: false };

  const end = findSectionEnd(lines, headingIndex);
  const kept = [...lines.slice(0, headingIndex), ...lines.slice(end)];

  return { content: tidy(kept.join('\n')), removed: true };
};

export const hasFindingSection = (markdown: string): boolean =>
  markdown.split('\n').some((line) => line.startsWith(HEADING_PREFIX));
