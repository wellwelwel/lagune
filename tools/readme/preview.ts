import type { IncomingMessage, ServerResponse } from 'node:http';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { exit, stderr, stdout } from 'node:process';
import { writeFlows } from './asset';

const HOST = '127.0.0.1';
const PORT = 4789;
const ALLOWED_HOSTS = new Set([`${HOST}:${PORT}`, `localhost:${PORT}`]);
const SECURITY_HEADERS = {
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
};

const { readme: svg } = await writeFlows();
const page = await readFile(new URL('./preview.html', import.meta.url));
const version = createHash('sha256')
  .update(svg)
  .update(page)
  .digest('hex')
  .slice(0, 16);

const ROUTES = new Map([
  ['/', { type: 'text/html; charset=utf-8', body: page }],
  ['/flow.svg', { type: 'image/svg+xml', body: Buffer.from(svg) }],
]);

const streamVersion = (request: IncomingMessage, response: ServerResponse) => {
  response.writeHead(200, {
    ...SECURITY_HEADERS,
    'content-type': 'text/event-stream',
  });
  response.write(`retry: 500\ndata: ${version}\n\n`);
  request.on('close', () => response.end());
};

const server = createServer((request, response) => {
  if (!ALLOWED_HOSTS.has(request.headers.host ?? '')) {
    response.writeHead(403, SECURITY_HEADERS).end();

    return;
  }

  if (request.method !== 'GET') {
    response.writeHead(405, { ...SECURITY_HEADERS, allow: 'GET' }).end();

    return;
  }

  const { pathname } = new URL(request.url ?? '/', `http://${HOST}`);

  if (pathname === '/events') {
    streamVersion(request, response);

    return;
  }

  const route = ROUTES.get(pathname);

  if (!route) {
    response.writeHead(404, SECURITY_HEADERS).end();

    return;
  }

  response
    .writeHead(200, { ...SECURITY_HEADERS, 'content-type': route.type })
    .end(route.body);
});

server.on('error', (error: NodeJS.ErrnoException) => {
  const reason =
    error.code === 'EADDRINUSE'
      ? `port ${PORT} is already in use, is the preview already running?`
      : error.message;

  stderr.write(`[readme] ${reason}\n`);
  exit(1);
});
server.listen(PORT, HOST, () => {
  stdout.write(`[readme] preview at http://${HOST}:${PORT}/\n`);
});
