import type { ScanDetail, ScanReport } from '../../../src/types/scan.js';
import type { CraftedEntry } from '../../../src/types/test.js';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import process, { platform } from 'node:process';
import { deflateSync } from 'node:zlib';
import { it } from 'poku';
import { scanSecrets } from '../../../src/hooks/secrets/scan.js';
import { git, newWorkspace } from '../scan/__utils__.js';

const IDENTITY: readonly string[] = [
  '-c',
  'user.name=Lagune',
  '-c',
  'user.email=lagune@example.invalid',
];

const PACK_HEADER = Buffer.from('PACK\u0000\u0000\u0000\u0002', 'latin1');
const INDEX_HEADER = Buffer.from([0xff, 0x74, 0x4f, 0x63, 0, 0, 0, 2]);
const BLOB = 3;
const OFFSET_DELTA = 6;
const REF_DELTA = 7;

export const itWithPermissionBits =
  platform === 'win32' || process.getuid?.() === 0 ? it.skip : it;

export const sortedDetails = (details: readonly ScanDetail[]): ScanDetail[] =>
  details.toSorted(
    (left, right) =>
      left.file.localeCompare(right.file) ||
      left.detail.localeCompare(right.detail)
  );

export const reported = ({
  findings,
  review,
  advisory,
}: ScanReport): Pick<ScanReport, 'findings' | 'review' | 'advisory'> => ({
  findings: sortedDetails(findings),
  review: sortedDetails(review),
  advisory: sortedDetails(advisory),
});

export const scanWhole = (workspace: string): Promise<ScanReport> =>
  scanSecrets(workspace, [workspace]);

const datedEnv = (time: number): Record<string, string> => ({
  GIT_AUTHOR_DATE: `${time} +0000`,
  GIT_COMMITTER_DATE: `${time} +0000`,
});

export const newRepository = async (): Promise<string> => {
  const workspace = await newWorkspace();

  await git(workspace, ['init', '--quiet', '--initial-branch=main']);

  return workspace;
};

/** Commits everything in the workspace at a fixed time, returning the commit's id */
export const commitAt = async (
  workspace: string,
  time: number
): Promise<string> => {
  await git(workspace, ['add', '--all']);
  await git(
    workspace,
    [...IDENTITY, 'commit', '--quiet', '--allow-empty', '--message', 'change'],
    datedEnv(time)
  );

  return (await git(workspace, ['rev-parse', 'HEAD'])).trim();
};

/** Stashes every change in the workspace at a fixed time, untracked files included */
export const stashAt = async (
  workspace: string,
  time: number
): Promise<void> => {
  await git(
    workspace,
    [...IDENTITY, 'stash', 'push', '--include-untracked', '--quiet'],
    datedEnv(time)
  );
};

/** Commits a tree that names an object the store need not hold, at a path and mode, returning the commit's id */
export const commitEntryAt = async (
  workspace: string,
  mode: string,
  id: string,
  path: string,
  time: number
): Promise<string> => {
  await git(workspace, [
    'update-index',
    '--add',
    '--cacheinfo',
    `${mode},${id},${path}`,
  ]);

  const tree = (await git(workspace, ['write-tree', '--missing-ok'])).trim();
  const commit = (
    await git(
      workspace,
      [...IDENTITY, 'commit-tree', tree, '-m', 'crafted'],
      datedEnv(time)
    )
  ).trim();

  await git(workspace, ['update-ref', 'refs/heads/main', commit]);

  return commit;
};

const sha1 = (content: Buffer): Buffer =>
  createHash('sha1').update(content).digest();

/** A distinct object id for a crafted object, never the hash of its content */
export const craftedId = (seed: string): string =>
  sha1(Buffer.from(seed)).toString('hex');

/** Git's variable-length size: seven bits a byte after the first, least significant first, every byte but the last flagged by its high bit */
const continued = (first: number, rest: number): number[] => {
  const bytes = [first];
  let remaining = rest;

  while (remaining > 0) {
    bytes[bytes.length - 1] |= 0x80;
    bytes.push(remaining & 0x7f);
    remaining = Math.floor(remaining / 0x80);
  }

  return bytes;
};

const sizeHeader = (type: number, size: number): Buffer =>
  Buffer.from(continued((type << 4) | (size & 0x0f), Math.floor(size / 0x10)));

const baseDistance = (distance: number): Buffer => {
  const bytes = [distance & 0x7f];
  let rest = Math.floor(distance / 0x80);

  while (rest > 0) {
    rest -= 1;
    bytes.unshift(0x80 | (rest & 0x7f));
    rest = Math.floor(rest / 0x80);
  }

  return Buffer.from(bytes);
};

const deltaSize = (size: number): number[] =>
  continued(size & 0x7f, Math.floor(size / 0x80));

/** A delta that copies its whole base, up to 16 MiB, and appends up to 127 bytes */
export const appendingDelta = (baseSize: number, appended: Buffer): Buffer => {
  const sizeBytes = [baseSize & 0xff, (baseSize >> 8) & 0xff, baseSize >> 16];
  const present = sizeBytes.filter((byte) => byte !== 0);
  const opcode = sizeBytes.reduce(
    (code, byte, index) => (byte === 0 ? code : code | (0x10 << index)),
    0x80
  );

  return Buffer.from([
    ...deltaSize(baseSize),
    ...deltaSize(baseSize + appended.length),
    opcode,
    ...present,
    appended.length,
    ...appended,
  ]);
};

const packedEntry = (
  entry: CraftedEntry,
  offset: number,
  offsets: readonly number[]
): Buffer => {
  if (entry.kind === 'blob')
    return Buffer.concat([
      sizeHeader(BLOB, entry.content.length),
      deflateSync(entry.content),
    ]);

  if (entry.kind === 'offset-delta')
    return Buffer.concat([
      sizeHeader(OFFSET_DELTA, entry.delta.length),
      baseDistance(offset - offsets[entry.base]),
      deflateSync(entry.delta),
    ]);

  return Buffer.concat([
    sizeHeader(REF_DELTA, entry.delta.length),
    Buffer.from(entry.base, 'hex'),
    deflateSync(entry.delta),
  ]);
};

const packIndex = (
  ids: readonly string[],
  offsets: readonly number[],
  packChecksum: Buffer
): Buffer => {
  const order = ids
    .map((id, index) => ({ id, offset: offsets[index] }))
    .toSorted((left, right) => (left.id < right.id ? -1 : 1));
  const fanout = Buffer.alloc(256 * 4);
  const offsetTable = Buffer.alloc(order.length * 4);

  for (let byte = 0; byte < 256; byte++)
    fanout.writeUInt32BE(
      order.filter(({ id }) => Number.parseInt(id.slice(0, 2), 16) <= byte)
        .length,
      byte * 4
    );

  for (const [index, { offset }] of order.entries())
    offsetTable.writeUInt32BE(offset, index * 4);

  const body = Buffer.concat([
    INDEX_HEADER,
    fanout,
    ...order.map(({ id }) => Buffer.from(id, 'hex')),
    Buffer.alloc(order.length * 4),
    offsetTable,
    packChecksum,
  ]);

  return Buffer.concat([body, sha1(body)]);
};

/** Writes a version 2 pack and its index holding the entries in order, each delta pointing back at an earlier entry or at an id */
export const writeCraftedPack = async (
  workspace: string,
  entries: readonly CraftedEntry[]
): Promise<void> => {
  const count = Buffer.alloc(4);
  const chunks: Buffer[] = [PACK_HEADER, count];
  const offsets: number[] = [];
  let offset = PACK_HEADER.length + count.length;

  count.writeUInt32BE(entries.length);

  for (const entry of entries) {
    const chunk = packedEntry(entry, offset, offsets);

    offsets.push(offset);
    chunks.push(chunk);
    offset += chunk.length;
  }

  const body = Buffer.concat(chunks);
  const checksum = sha1(body);
  const name = `pack-${checksum.toString('hex')}`;
  const folder = join(workspace, '.git', 'objects', 'pack');

  await mkdir(folder, { recursive: true });
  await writeFile(
    join(folder, `${name}.pack`),
    Buffer.concat([body, checksum])
  );
  await writeFile(
    join(folder, `${name}.idx`),
    packIndex(
      entries.map(({ id }) => id),
      offsets,
      checksum
    )
  );
};
