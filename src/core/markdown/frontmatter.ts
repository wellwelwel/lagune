import type { Frontmatter } from '../../types/core.js';

const FENCE = '---';

const toFields = (line: string): [string, string][] => {
  const separator = line.indexOf(':');

  if (separator <= 0) return [];

  return [[line.slice(0, separator).trim(), line.slice(separator + 1).trim()]];
};

export const readFrontmatter = (text: string): Frontmatter => {
  const lines = text.split('\n');
  const closing = lines.indexOf(FENCE, 1);

  if (lines[0] !== FENCE || closing === -1)
    return { fields: new Map(), body: text };

  return {
    fields: new Map(lines.slice(1, closing).flatMap(toFields)),
    body: lines.slice(closing + 1).join('\n'),
  };
};
