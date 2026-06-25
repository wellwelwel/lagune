import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const UPLOAD_DIR = join(process.cwd(), 'uploads');
const BLOCKED_HOSTS = ['127.0.0.1', 'localhost', '0.0.0.0', '169.254.169.254'];

const readJson = (request) =>
  new Promise((resolve) => {
    const chunks = [];
    request.on('data', (chunk) => chunks.push(chunk));
    request.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        resolve(null);
      }
    });
  });

const extensionFor = (type) => {
  if (type.includes('png')) return 'png';
  if (type.includes('jpeg') || type.includes('jpg')) return 'jpg';
  if (type.includes('gif')) return 'gif';
  return 'bin';
};

export const handleImport = async (request, response) => {
  const body = await readJson(request);
  if (!body || typeof body.url !== 'string') {
    response.writeHead(400);
    response.end('Missing url');
    return;
  }

  const host = new URL(body.url).hostname;
  if (BLOCKED_HOSTS.some((blocked) => host.includes(blocked))) {
    response.writeHead(403);
    response.end('Host not allowed');
    return;
  }

  const remote = await fetch(body.url);
  const data = Buffer.from(await remote.arrayBuffer());
  const type = remote.headers.get('content-type') ?? 'application/octet-stream';
  const name = `${randomUUID()}.${extensionFor(type)}`;
  await writeFile(join(UPLOAD_DIR, name), data);

  response.writeHead(200, { 'content-type': 'application/json' });
  response.end(JSON.stringify({ url: `/uploads/${name}`, type }));
};
