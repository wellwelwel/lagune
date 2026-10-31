import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { lstat, readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import process, { argv, env } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

type BundleFile = {
  path: string;
  mode: '100644' | '100755';
  content: Buffer;
  sha: string;
};

type Credentials = {
  token: string;
  repository: string;
};

type Publication = {
  branch: string;
  bundle: string;
  message: string;
};

const GITHUB_API = 'https://api.github.com';
const BRANCH_NAME = /^[\w-][\w.-]*$/;
const REPOSITORY_NAME = /^[\w.-]+\/[\w.-]+$/;
const OBJECT_ID = /^[0-9a-f]{40}$/;
const EXECUTABLE_BITS = 0o111;
const REPOSITORY_ROOT = fileURLToPath(new URL('../', import.meta.url));

const execute = promisify(execFile);

export const objectId = (content: Buffer): string =>
  createHash('sha1')
    .update(`blob ${content.length}\0`)
    .update(content)
    .digest('hex');

const readBundleFile = async (
  bundle: string,
  location: string
): Promise<BundleFile> => {
  const [content, stats] = await Promise.all([
    readFile(location),
    lstat(location),
  ]);

  return {
    path: relative(bundle, location).split(sep).join('/'),
    mode: stats.mode & EXECUTABLE_BITS ? '100755' : '100644',
    content,
    sha: objectId(content),
  };
};

export const readBundle = async (bundle: string): Promise<BundleFile[]> => {
  const entries = await readdir(bundle, {
    recursive: true,
    withFileTypes: true,
  });
  const unsupported = entries.filter(
    (entry) => !entry.isFile() && !entry.isDirectory()
  );
  const files = entries.filter((entry) => entry.isFile());

  if (unsupported.length > 0)
    throw new Error(
      `The bundle carries entries that are neither files nor folders: ${unsupported.map((entry) => join(entry.parentPath, entry.name)).join(', ')}.`
    );

  if (files.length === 0)
    throw new Error(`The bundle at "${bundle}" carries no files.`);

  return Promise.all(
    files.map((entry) =>
      readBundleFile(bundle, join(entry.parentPath, entry.name))
    )
  );
};

const readCredentials = (): Credentials => {
  const { GITHUB_TOKEN, GITHUB_REPOSITORY } = env;

  if (
    !GITHUB_TOKEN ||
    !GITHUB_REPOSITORY ||
    !REPOSITORY_NAME.test(GITHUB_REPOSITORY)
  )
    throw new Error(
      'Missing GITHUB_TOKEN, or GITHUB_REPOSITORY as owner/name.'
    );

  return { token: GITHUB_TOKEN, repository: GITHUB_REPOSITORY };
};

const readPublication = (): Publication => {
  const [branch, bundle, message] = argv.slice(2);

  if (!branch || !BRANCH_NAME.test(branch) || !bundle || !message)
    throw new Error(
      'Usage: node tools/publish-branch.ts <branch> <bundle folder> <commit message>'
    );

  return { branch, bundle, message };
};

const send = (
  credentials: Credentials,
  method: string,
  path: string,
  body?: unknown
): Promise<Response> =>
  fetch(`${GITHUB_API}/repos/${credentials.repository}/git${path}`, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${credentials.token}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

const readAnswer = async (
  response: Response,
  description: string
): Promise<unknown> => {
  if (!response.ok)
    throw new Error(
      `${description} failed with ${response.status} ${response.statusText}.`
    );

  return response.json();
};

const request = async (
  credentials: Credentials,
  method: string,
  path: string,
  body?: unknown
): Promise<unknown> =>
  readAnswer(await send(credentials, method, path, body), `${method} ${path}`);

const readField = (payload: unknown, field: string): unknown =>
  typeof payload === 'object' && payload !== null
    ? Object.entries(payload).find(([name]) => name === field)?.[1]
    : undefined;

const requireObjectId = (payload: unknown, description: string): string => {
  const sha = readField(payload, 'sha');

  if (typeof sha !== 'string' || !OBJECT_ID.test(sha))
    throw new Error(`${description} answered without an object id.`);

  return sha;
};

const listSourceObjects = async (): Promise<Set<string>> => {
  const { stdout } = await execute(
    'git',
    ['ls-tree', '-r', '--object-only', 'HEAD'],
    { cwd: REPOSITORY_ROOT }
  );

  return new Set(stdout.split('\n').filter((line) => line.length > 0));
};

const findHead = async (
  credentials: Credentials,
  branch: string
): Promise<string | undefined> => {
  const path = `/ref/heads/${branch}`;
  const response = await send(credentials, 'GET', path);

  if (response.status === 404) return undefined;

  return requireObjectId(
    readField(await readAnswer(response, `GET ${path}`), 'object'),
    `GET ${path}`
  );
};

const uploadBlob = async (credentials: Credentials, file: BundleFile) => {
  const stored = requireObjectId(
    await request(credentials, 'POST', '/blobs', {
      content: file.content.toString('base64'),
      encoding: 'base64',
    }),
    `Uploading ${file.path}`
  );

  if (stored !== file.sha)
    throw new Error(
      `GitHub stored ${file.path} as ${stored}, not ${file.sha}.`
    );
};

const createTree = async (
  credentials: Credentials,
  files: BundleFile[]
): Promise<string> =>
  requireObjectId(
    await request(credentials, 'POST', '/trees', {
      tree: files.map(({ path, mode, sha }) => ({
        path,
        mode,
        type: 'blob',
        sha,
      })),
    }),
    'Creating the tree'
  );

const readCommitTree = async (
  credentials: Credentials,
  commit: string
): Promise<string> =>
  requireObjectId(
    readField(await request(credentials, 'GET', `/commits/${commit}`), 'tree'),
    `Reading commit ${commit}`
  );

const createCommit = async (
  credentials: Credentials,
  message: string,
  tree: string,
  head: string | undefined
): Promise<string> =>
  requireObjectId(
    await request(credentials, 'POST', '/commits', {
      message,
      tree,
      parents: head === undefined ? [] : [head],
    }),
    'Creating the commit'
  );

const moveBranch = async (
  credentials: Credentials,
  branch: string,
  commit: string,
  head: string | undefined
) => {
  if (head === undefined) {
    await request(credentials, 'POST', '/refs', {
      ref: `refs/heads/${branch}`,
      sha: commit,
    });
    return;
  }

  await request(credentials, 'PATCH', `/refs/heads/${branch}`, {
    sha: commit,
    force: false,
  });
};

const run = async () => {
  const credentials = readCredentials();
  const publication = readPublication();
  const [files, sourceObjects, head] = await Promise.all([
    readBundle(publication.bundle),
    listSourceObjects(),
    findHead(credentials, publication.branch),
  ]);

  await Promise.all(
    files
      .filter((file) => !sourceObjects.has(file.sha))
      .map((file) => uploadBlob(credentials, file))
  );

  const tree = await createTree(credentials, files);

  if (
    head !== undefined &&
    (await readCommitTree(credentials, head)) === tree
  ) {
    console.log(`${publication.branch} already carries this bundle.`);
    return;
  }

  const commit = await createCommit(
    credentials,
    publication.message,
    tree,
    head
  );

  await moveBranch(credentials, publication.branch, commit, head);
  console.log(`Published ${publication.branch} at ${commit}.`);
};

if (import.meta.url === pathToFileURL(argv[1] ?? '').href)
  run().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
