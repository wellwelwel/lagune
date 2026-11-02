import type { IncomingMessage, ServerResponse } from 'node:http';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { join } from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';

type JsonObject = Record<string, unknown>;

const UPSTREAM = 'https://registry.npmjs.org';
const PREFIX = 'lagune-';
const SUFFIX = '.tgz';
const PACKAGE_PATH = '/lagune';
const TARBALL_PATH = '/lagune/-/';

const port = Number(process.argv[2]);
const folder = process.argv[3] ?? '';
const origin = `http://127.0.0.1:${port}`;
const run = promisify(execFile);

const isObject = (value: unknown): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const versions = async (): Promise<string[]> =>
  (await readdir(folder))
    .filter((file) => file.startsWith(PREFIX) && file.endsWith(SUFFIX))
    .map((file) => file.slice(PREFIX.length, -SUFFIX.length));

const packagedManifest = async (path: string): Promise<JsonObject> => {
  const { stdout } = await run('tar', ['-xzOf', path, 'package/package.json'], {
    encoding: 'utf8',
  });
  const parsed: unknown = JSON.parse(stdout);

  return isObject(parsed) ? parsed : {};
};

const manifest = async (version: string): Promise<[string, JsonObject]> => {
  const path = join(folder, `${PREFIX}${version}${SUFFIX}`);
  const [packaged, tarball] = await Promise.all([
    packagedManifest(path),
    readFile(path),
  ]);

  return [
    version,
    {
      ...packaged,
      version,
      dist: {
        tarball: `${origin}${TARBALL_PATH}${PREFIX}${version}${SUFFIX}`,
        shasum: createHash('sha1').update(tarball).digest('hex'),
        integrity: `sha512-${createHash('sha512').update(tarball).digest('base64')}`,
      },
    },
  ];
};

const packument = async (): Promise<JsonObject> => {
  const all = await versions();
  const [latest, manifests] = await Promise.all([
    readFile(join(folder, 'latest'), 'utf8'),
    Promise.all(all.map(manifest)),
  ]);

  return {
    name: 'lagune',
    'dist-tags': { latest: latest.trim() },
    versions: Object.fromEntries(manifests),
    time: Object.fromEntries(
      all.map((version) => [version, new Date().toISOString()])
    ),
  };
};

const isServedTarball = (file: string): boolean =>
  file.startsWith(PREFIX) && file.endsWith(SUFFIX) && !file.includes('/');

const forward = async (
  request: IncomingMessage,
  response: ServerResponse
): Promise<void> => {
  const upstream = await fetch(`${UPSTREAM}${request.url ?? '/'}`, {
    headers: { accept: request.headers.accept ?? 'application/json' },
  });

  response.writeHead(upstream.status, {
    'content-type': upstream.headers.get('content-type') ?? 'application/json',
  });
  response.end(Buffer.from(await upstream.arrayBuffer()));
};

const answer = async (
  request: IncomingMessage,
  response: ServerResponse
): Promise<void> => {
  const path = decodeURIComponent((request.url ?? '/').split('?')[0]);

  if (path === PACKAGE_PATH) {
    const body = JSON.stringify(await packument());

    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(body);
    return;
  }

  if (!path.startsWith(TARBALL_PATH)) return forward(request, response);

  const file = path.slice(TARBALL_PATH.length);

  if (!isServedTarball(file)) {
    response.writeHead(404).end();
    return;
  }

  const tarball = await readFile(join(folder, file));

  response.writeHead(200, { 'content-type': 'application/octet-stream' });
  response.end(tarball);
};

createServer(async (request, response) => {
  try {
    await answer(request, response);
  } catch (error) {
    response.writeHead(502, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ error: String(error) }));
  }
}).listen(port, '127.0.0.1');
