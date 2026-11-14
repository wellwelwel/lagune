import type {
  BoundedRead,
  GitEntry,
  GitIgnores,
  IgnoreList,
  TrackedIndex,
} from '../../types/git.js';
import { lstat, readFile, stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import { isAbsolute, join } from 'node:path';
import { env } from 'node:process';
import { deepFreeze } from '../collections.js';
import { hasErrorCode } from '../fs-actions.js';
import { configValue } from './config.js';
import { trackedIndexOf } from './index-file.js';
import { parseIgnoreText } from './pattern.js';

const MAX_IGNORE_BYTES = 256 * 1024;
const MAX_CONFIG_BYTES = 256 * 1024;
const MAX_INDEX_BYTES = 64 * 1024 * 1024;
const SHA1_LENGTH = 20;
const SHA256_LENGTH = 32;

const ABSENT: BoundedRead = deepFreeze({ status: 'absent' });

const UNUSABLE: BoundedRead = deepFreeze({ status: 'unusable' });

const NOTHING_TRACKED: TrackedIndex = deepFreeze({
  files: new Set<string>(),
  directories: new Set<string>(),
});

const isMissing = (error: unknown): boolean =>
  hasErrorCode(error, 'ENOENT') || hasErrorCode(error, 'ENOTDIR');

const readBounded = async (
  path: string,
  maxBytes: number,
  followLinks: boolean
): Promise<BoundedRead> => {
  try {
    const stats = followLinks ? await stat(path) : await lstat(path);

    if (!stats.isFile() || stats.size > maxBytes) return UNUSABLE;

    const content = await readFile(path);

    return content.length > maxBytes ? UNUSABLE : { status: 'read', content };
  } catch (error) {
    return isMissing(error) ? ABSENT : UNUSABLE;
  }
};

const textOf = (read: BoundedRead): string | undefined =>
  read.status === 'read' ? read.content.toString('utf8') : undefined;

/** The rules an ignore file sets for the paths below its base, or none when the file is absent or unsafe to read */
export const ignoreListAt = async (
  path: string,
  base: readonly string[],
  followLinks: boolean
): Promise<IgnoreList | null> => {
  const text = textOf(await readBounded(path, MAX_IGNORE_BYTES, followLinks));

  return text === undefined ? null : { base, rules: parseIgnoreText(text) };
};

const isRealDirectory = async (path: string): Promise<boolean> => {
  try {
    return (await lstat(path)).isDirectory();
  } catch {
    return false;
  }
};

const homeFolder = (): string | undefined => {
  try {
    const folder = homedir();

    return isAbsolute(folder) ? folder : undefined;
  } catch {
    return undefined;
  }
};

const userConfigDirectory = (home: string): string => {
  const configured = env.XDG_CONFIG_HOME;

  return configured !== undefined && isAbsolute(configured)
    ? configured
    : join(home, '.config');
};

const configuredExcludes = async (
  path: string
): Promise<string | undefined> => {
  const text = textOf(await readBounded(path, MAX_CONFIG_BYTES, true));

  return text === undefined
    ? undefined
    : configValue(text, 'core', 'excludesfile');
};

const expandHome = (path: string, home: string): string | undefined => {
  const expanded = path.startsWith('~/') ? join(home, path.slice(2)) : path;

  return isAbsolute(expanded) ? expanded : undefined;
};

const globalExcludesPath = async (
  home: string
): Promise<string | undefined> => {
  const configDirectory = userConfigDirectory(home);
  const [fromHome, fromConfigDirectory] = await Promise.all([
    configuredExcludes(join(home, '.gitconfig')),
    configuredExcludes(join(configDirectory, 'git', 'config')),
  ]);
  const configured = fromHome ?? fromConfigDirectory;

  return configured === undefined
    ? join(configDirectory, 'git', 'ignore')
    : expandHome(configured, home);
};

const globalList = async (): Promise<IgnoreList | null> => {
  const home = homeFolder();
  const path = home === undefined ? undefined : await globalExcludesPath(home);

  return path === undefined ? null : ignoreListAt(path, [], true);
};

const localList = async (gitDirectory: string): Promise<IgnoreList | null> => {
  const info = join(gitDirectory, 'info');

  if (!(await isRealDirectory(info))) return null;

  return ignoreListAt(join(info, 'exclude'), [], false);
};

const hashLengthOf = async (gitDirectory: string): Promise<number> => {
  const text = textOf(
    await readBounded(join(gitDirectory, 'config'), MAX_CONFIG_BYTES, false)
  );
  const format =
    text === undefined
      ? undefined
      : configValue(text, 'extensions', 'objectformat');

  return format?.toLowerCase() === 'sha256' ? SHA256_LENGTH : SHA1_LENGTH;
};

const trackedIn = async (
  gitDirectory: string
): Promise<TrackedIndex | null> => {
  const index = await readBounded(
    join(gitDirectory, 'index'),
    MAX_INDEX_BYTES,
    false
  );

  if (index.status === 'absent') return NOTHING_TRACKED;
  if (index.status === 'unusable') return null;

  return trackedIndexOf(index.content, await hashLengthOf(gitDirectory));
};

/** What sits at a project's .git, read without following a link or the gitdir a worktree or submodule names */
export const gitEntryOf = async (root: string): Promise<GitEntry> => {
  try {
    const stats = await lstat(join(root, '.git'));

    if (stats.isDirectory()) return 'folder';

    return stats.isFile() || stats.isSymbolicLink() ? 'pointer' : 'other';
  } catch (error) {
    return isMissing(error) ? 'absent' : 'other';
  }
};

/** What Git ignores and tracks in a project whose root holds a real .git folder with an index this reader trusts, or none */
export const gitIgnoresOf = async (
  root: string
): Promise<GitIgnores | null> => {
  const gitDirectory = join(root, '.git');

  if (!(await isRealDirectory(gitDirectory))) return null;

  const [tracked, global, local] = await Promise.all([
    trackedIn(gitDirectory),
    globalList(),
    localList(gitDirectory),
  ]);

  return tracked === null
    ? null
    : { tracked, lists: [global, local].filter((list) => list !== null) };
};
