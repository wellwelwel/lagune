import type {
  ParsedCommit,
  TreeEntry,
  TreeEntryKind,
} from '../../types/git.js';
import { SHA256_LENGTH } from './repository.js';

const SPACE = 0x20;
const NUL = 0x00;
const MAX_MODE_LENGTH = 7;
const TYPE_MASK = 0o170000;
const OCTAL_MODE = /^[0-7]{1,7}$/;
const CONTROL_CHARACTER = /[\u0000-\u001f\u007f]/;
const COMMITTER_TIME = />\s{0,16}(\d{1,16})\s{1,16}[+-]\d{4}\s{0,16}$/;
const HEADER_END = '\n\n';
const SHA1_ID = /^[0-9a-f]{40}$/;
const SHA256_ID = /^[0-9a-f]{64}$/;

const ENTRY_KINDS: ReadonlyMap<number, TreeEntryKind> = new Map([
  [0o040000, 'tree'],
  [0o100000, 'file'],
  [0o120000, 'link'],
  [0o160000, 'submodule'],
]);

/** The hex form of an object id in a SHA-1 or SHA-256 repository */
export const objectIdPattern = (hashLength: number): RegExp =>
  hashLength === SHA256_LENGTH ? SHA256_ID : SHA1_ID;

const headerLinesOf = (content: Buffer): string[] => {
  const text = content.toString('utf8');
  const end = text.indexOf(HEADER_END);

  return (end === -1 ? text : text.slice(0, end)).split('\n');
};

const valueAfter = (line: string, key: string): string | null =>
  line.startsWith(`${key} `) ? line.slice(key.length + 1) : null;

const committerTimeOf = (lines: readonly string[]): number => {
  const committer = lines.find((line) => line.startsWith('committer '));
  const time = committer === undefined ? null : COMMITTER_TIME.exec(committer);

  return time === null ? 0 : Number(time[1]);
};

/** The tree, parents, and committer time a commit names, or none for one that does not open with a valid tree */
export const parseCommit = (
  id: string,
  content: Buffer,
  hashLength: number
): ParsedCommit | null => {
  const objectId = objectIdPattern(hashLength);
  const lines = headerLinesOf(content);
  const tree = valueAfter(lines[0], 'tree');

  if (tree === null || !objectId.test(tree)) return null;

  const parents: string[] = [];

  for (const line of lines.slice(1)) {
    const parent = valueAfter(line, 'parent');

    if (parent === null) break;
    if (!objectId.test(parent)) return null;

    parents.push(parent);
  }

  return { id, tree, parents, time: committerTimeOf(lines) };
};

/** The object a tag points to, or none for a tag that does not open with a valid one */
export const tagTargetOf = (
  content: Buffer,
  hashLength: number
): string | null => {
  const target = valueAfter(headerLinesOf(content)[0], 'object');

  return target !== null && objectIdPattern(hashLength).test(target)
    ? target
    : null;
};

const isSafeName = (name: string): boolean =>
  name !== '' &&
  name !== '.' &&
  name !== '..' &&
  !name.includes('/') &&
  !CONTROL_CHARACTER.test(name);

const entryKindOf = (mode: string): TreeEntryKind | undefined =>
  OCTAL_MODE.test(mode)
    ? ENTRY_KINDS.get(Number.parseInt(mode, 8) & TYPE_MASK)
    : undefined;

/** The entries a tree lists, or none for a tree whose bytes, modes, or names the checker cannot trust */
export const parseTree = (
  content: Buffer,
  hashLength: number
): TreeEntry[] | null => {
  const entries: TreeEntry[] = [];
  let offset = 0;

  while (offset < content.length) {
    const space = content.indexOf(SPACE, offset);

    if (space === -1 || space - offset > MAX_MODE_LENGTH) return null;

    const end = content.indexOf(NUL, space + 1);

    if (end === -1 || end + 1 + hashLength > content.length) return null;

    const kind = entryKindOf(content.toString('latin1', offset, space));
    const name = content.toString('utf8', space + 1, end);

    if (kind === undefined || !isSafeName(name)) return null;

    entries.push({
      kind,
      name,
      id: content.toString('hex', end + 1, end + 1 + hashLength),
    });
    offset = end + 1 + hashLength;
  }

  return entries;
};
