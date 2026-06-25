import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join } from 'node:path';
import { makeThumbnail } from './lib/thumbnail.js';
import { handleAvatarUpload } from './routes/avatar.js';
import { handleImport } from './routes/import.js';
import { handlePhotoUpload } from './routes/photos.js';

const UPLOAD_DIR = join(process.cwd(), 'uploads');
const PORT = process.env.PORT ?? 3000;

const parseMultipart = (buffer, contentType) => {
  const boundaryMatch = contentType.match(/boundary=(.+)$/);
  if (!boundaryMatch) return null;
  const boundary = `--${boundaryMatch[1]}`;
  const raw = buffer.toString('binary');
  const part = raw.split(boundary).find((p) => p.includes('filename='));
  if (!part) return null;
  const filenameMatch = part.match(/filename="([^"]*)"/);
  const typeMatch = part.match(/Content-Type:\s*([^\r\n]+)/i);
  const headerEnd = part.indexOf('\r\n\r\n');
  const body = part.slice(headerEnd + 4).replace(/\r\n$/, '');
  return {
    filename: filenameMatch ? filenameMatch[1] : 'file',
    declaredType: typeMatch ? typeMatch[1].trim() : 'application/octet-stream',
    data: Buffer.from(body, 'binary'),
  };
};

const readBody = (request) =>
  new Promise((resolve) => {
    const chunks = [];
    request.on('data', (chunk) => chunks.push(chunk));
    request.on('end', () => resolve(Buffer.concat(chunks)));
  });

const serveUpload = async (response, name) => {
  try {
    const data = await readFile(join(UPLOAD_DIR, name));
    const types = { '.html': 'text/html', '.js': 'text/javascript' };
    const type = types[extname(name)] ?? 'application/octet-stream';
    response.writeHead(200, { 'content-type': type });
    response.end(data);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
};

const server = createServer(async (request, response) => {
  if (request.method === 'POST' && request.url === '/avatar') {
    const file = parseMultipart(
      await readBody(request),
      request.headers['content-type'] ?? ''
    );
    if (!file) {
      response.writeHead(400);
      response.end('No file');
      return;
    }
    await handleAvatarUpload(request, response, file);
    return;
  }

  if (request.method === 'POST' && request.url === '/photos') {
    const file = parseMultipart(
      await readBody(request),
      request.headers['content-type'] ?? ''
    );
    if (!file) {
      response.writeHead(400);
      response.end('No file');
      return;
    }
    await handlePhotoUpload(request, response, file);
    return;
  }

  if (request.method === 'POST' && request.url === '/import') {
    await handleImport(request, response);
    return;
  }

  if (request.method === 'GET' && request.url?.startsWith('/uploads/')) {
    await serveUpload(response, request.url.slice('/uploads/'.length));
    return;
  }

  if (request.method === 'GET' && request.url?.startsWith('/thumb/')) {
    const name = request.url.slice('/thumb/'.length);
    const out = await makeThumbnail(name, 'png');
    response.writeHead(200, { 'content-type': 'text/plain' });
    response.end(out);
    return;
  }

  response.writeHead(200, { 'content-type': 'text/plain' });
  response.end('PixVault');
});

server.listen(PORT, () =>
  console.log(`PixVault listening on http://localhost:${PORT}`)
);
