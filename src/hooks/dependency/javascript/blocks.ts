import type {
  BlockNode,
  IndentedLine,
  KeyValue,
  OpenBlock,
} from '../../../types/hooks/dependency.js';
import { isString } from '../../../core/collections.js';
import { quotedExcerpt } from '../../../core/errors.js';
import { cannotJudge } from '../text.js';

const DOCUMENT_MARKERS: ReadonlySet<string> = new Set(['---', '...']);

const LINE_BREAKS = /\r?\n/;

const indentedLinesOf = (file: string, content: string): IndentedLine[] =>
  content.split(LINE_BREAKS).flatMap((line, index) => {
    const text = line.trimStart();

    if (text === '' || text.startsWith('#')) return [];

    const indent = line.length - text.length;

    if (line.slice(0, indent).includes('\t'))
      throw cannotJudge(file, `indents line ${index + 1} with a tab`);

    return [{ indent, text: text.trimEnd(), line: index + 1 }];
  });

export const blocksOf = (file: string, content: string): BlockNode[] => {
  const roots: BlockNode[] = [];
  const open: OpenBlock[] = [];

  for (const { indent, text, line } of indentedLinesOf(file, content)) {
    if (indent === 0 && DOCUMENT_MARKERS.has(text)) {
      open.length = 0;
      continue;
    }

    const node: BlockNode = { text, line, children: [] };

    while (open.length > 0 && open[open.length - 1].indent >= indent)
      open.pop();

    (open.at(-1)?.node.children ?? roots).push(node);
    open.push({ indent, node });
  }

  return roots;
};

const closingQuoteOf = (text: string): number => {
  const quote = text[0];

  for (let index = 1; index < text.length; index += 1) {
    if (quote === '"' && text[index] === '\\') {
      index += 1;
      continue;
    }

    if (text[index] !== quote) continue;

    if (quote === "'" && text[index + 1] === "'") {
      index += 1;
      continue;
    }

    return index;
  }

  return -1;
};

export const unquoted = (file: string, text: string): string => {
  if (!text.startsWith('"') && !text.startsWith("'")) return text;
  if (closingQuoteOf(text) !== text.length - 1)
    throw cannotJudge(
      file,
      `holds a quoted value that does not close: ${quotedExcerpt(text)}`
    );
  if (text.startsWith("'")) return text.slice(1, -1).replaceAll("''", "'");

  try {
    const value: unknown = JSON.parse(text);

    if (isString(value)) return value;
  } catch {}

  throw cannotJudge(
    file,
    `holds a quoted value it cannot read: ${quotedExcerpt(text)}`
  );
};

const notMapping = (file: string, line: number): Error =>
  cannotJudge(file, `holds line ${line}, which is not a key and a value`);

const quotedMapping = (file: string, text: string, line: number): KeyValue => {
  const closing = closingQuoteOf(text);
  const rest = text.slice(closing + 1);

  if (rest !== ':' && !rest.startsWith(': ')) throw notMapping(file, line);

  return {
    key: unquoted(file, text.slice(0, closing + 1)),
    value: rest.slice(1).trim(),
  };
};

export const mappingOf = (
  file: string,
  text: string,
  line: number
): KeyValue => {
  if (text.startsWith('"') || text.startsWith("'"))
    return quotedMapping(file, text, line);

  const separator = text.indexOf(': ');

  if (separator !== -1)
    return {
      key: text.slice(0, separator),
      value: text.slice(separator + 2).trim(),
    };

  if (text.endsWith(':')) return { key: text.slice(0, -1), value: '' };

  throw notMapping(file, line);
};

const unquotedPairOf = (
  file: string,
  text: string,
  line: number
): [key: string, value: string] => {
  const { key, value } = mappingOf(file, text, line);

  return [key, unquoted(file, value)];
};

export const blockMappingOf = (
  file: string,
  nodes: readonly BlockNode[]
): Map<string, string> =>
  new Map(nodes.map(({ text, line }) => unquotedPairOf(file, text, line)));

export const splitOutsideQuotes = (text: string): string[] => {
  const parts: string[] = [];
  let quote: string | null = null;
  let start = 0;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (quote === null && (character === '"' || character === "'"))
      quote = character;
    else if (quote === '"' && character === '\\') index += 1;
    else if (character === quote) quote = null;
    else if (quote === null && character === ',') {
      parts.push(text.slice(start, index));
      start = index + 1;
    }
  }

  parts.push(text.slice(start));

  return parts;
};

export const flowMappingOf = (
  file: string,
  value: string,
  line: number
): Map<string, string> => {
  if (!value.startsWith('{') || !value.endsWith('}'))
    throw notMapping(file, line);

  const body = value.slice(1, -1).trim();

  if (body === '') return new Map();

  return new Map(
    splitOutsideQuotes(body).map((pair) =>
      unquotedPairOf(file, pair.trim(), line)
    )
  );
};
