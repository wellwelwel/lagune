import type { Digest, Entry, EntryKind, Probe } from './types.ts';
import { open, readFile } from 'node:fs/promises';
import { basename, extname } from 'node:path';

const SIGNATURE = 'Directory structure:\n';
const TREE_BRANCH = '\u2500\u2500 ';
const PROBE_BYTES = 4096;
const SEPARATOR = '='.repeat(48);
const HEADER_START = `${SEPARATOR}\n`;
const FILE_LABEL = 'FILE: ';
const SYMLINK_LABEL = 'SYMLINK: ';
const SYMLINK_ARROW = ' -> ';
const ENTRY_TRAILER = '\n\n';
const BINARY_MARKER = '[Binary file]';
const EMPTY_MARKER = '[Empty file]';
const MARKED_KINDS = new Map<string, EntryKind>([
  [BINARY_MARKER, 'binary'],
  [EMPTY_MARKER, 'empty'],
]);

const LOCKFILES = new Set([
  'bun.lock',
  'bun.lockb',
  'Cargo.lock',
  'composer.lock',
  'flake.lock',
  'Gemfile.lock',
  'go.sum',
  'package-lock.json',
  'Pipfile.lock',
  'pnpm-lock.yaml',
  'poetry.lock',
  'uv.lock',
  'yarn.lock',
]);

const NOISE_SUFFIXES = ['.map', '.min.js', '.min.css', '.snap', '.svg'];

const isNoise = (path: string): boolean => {
  const name = basename(path);

  return (
    LOCKFILES.has(name) ||
    NOISE_SUFFIXES.some((suffix) => name.toLowerCase().endsWith(suffix))
  );
};

const treeRootOf = (head: string): string | null => {
  const branch = head.indexOf(TREE_BRANCH);
  const lineEnd = head.indexOf('\n', branch);

  if (branch < 0 || lineEnd < 0) return null;

  const name = head.slice(branch + TREE_BRANCH.length, lineEnd).trim();

  return name.endsWith('/') ? name.slice(0, -1) : name;
};

const findHeaders = (text: string): number[] => {
  const starts: number[] = [];
  let cursor = text.indexOf(HEADER_START);

  while (cursor >= 0) {
    const labelStart = cursor + HEADER_START.length;
    const isHeader =
      (cursor === 0 || text[cursor - 1] === '\n') &&
      (text.startsWith(FILE_LABEL, labelStart) ||
        text.startsWith(SYMLINK_LABEL, labelStart));

    if (isHeader) starts.push(cursor);

    cursor = text.indexOf(HEADER_START, labelStart);
  }

  return starts;
};

const withoutTrailer = (body: string): string => {
  const content = body.endsWith(ENTRY_TRAILER)
    ? body.slice(0, -ENTRY_TRAILER.length)
    : body;

  return content.endsWith('\n') ? content.slice(0, -1) : content;
};

const parseEntry = (block: string): Entry | null => {
  const labelEnd = block.indexOf('\n', HEADER_START.length);
  const closing = block.indexOf('\n', labelEnd + 1);

  if (labelEnd < 0 || closing < 0) return null;
  if (block.slice(labelEnd + 1, closing) !== SEPARATOR) return null;

  const label = block.slice(HEADER_START.length, labelEnd);
  const content = withoutTrailer(block.slice(closing + 1));

  if (label.startsWith(SYMLINK_LABEL)) {
    const link = label.slice(SYMLINK_LABEL.length);
    const arrow = link.indexOf(SYMLINK_ARROW);
    const path = arrow < 0 ? link : link.slice(0, arrow);
    const target = arrow < 0 ? null : link.slice(arrow + SYMLINK_ARROW.length);

    return {
      path,
      kind: 'symlink',
      target,
      lines: [],
      characters: 0,
      noise: false,
    };
  }

  const path = label.slice(FILE_LABEL.length);
  const kind = MARKED_KINDS.get(content) ?? 'text';
  const lines = kind === 'text' ? content.split('\n') : [];

  return {
    path,
    kind,
    target: null,
    lines,
    characters: kind === 'text' ? content.length : 0,
    noise: isNoise(path),
  };
};

export const probeDigest = async (file: string): Promise<Probe> => {
  const handle = await open(file, 'r');

  try {
    const { size } = await handle.stat();
    const { buffer, bytesRead } = await handle.read({
      buffer: Buffer.alloc(PROBE_BYTES),
    });
    const head = buffer.toString('utf8', 0, bytesRead);
    const root = head.startsWith(SIGNATURE) ? treeRootOf(head) : null;

    return { file, root, bytes: size };
  } finally {
    await handle.close();
  }
};

export const loadDigest = async (file: string): Promise<Digest> => {
  const text = await readFile(file, 'utf8');
  const starts = findHeaders(text);

  if (starts.length === 0)
    throw new Error(`${file} does not look like a GitIngest digest`);

  const entries = starts
    .map((start, index) => parseEntry(text.slice(start, starts[index + 1])))
    .filter((entry): entry is Entry => entry !== null);

  return {
    file,
    root: treeRootOf(text.slice(0, starts[0])) ?? basename(file, extname(file)),
    bytes: Buffer.byteLength(text),
    entries,
    byPath: new Map(entries.map((entry) => [entry.path, entry])),
  };
};
