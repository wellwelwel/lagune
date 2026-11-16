import { randomUUID } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import express from 'express';
import multer from 'multer';

const AVATAR_ROOT = path.resolve('storage/avatars');
const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);
const ID = /^[0-9a-f-]{36}$/;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024, files: 1 },
});

export const avatars = express.Router();

avatars.post('/', upload.single('avatar'), async (req, res) => {
  if (!req.file || !req.file.buffer.subarray(0, 8).equals(PNG_SIGNATURE))
    return res.status(415).json({ error: 'Only PNG images are accepted' });

  const id = randomUUID();

  await writeFile(path.join(AVATAR_ROOT, `${id}.png`), req.file.buffer);
  res.status(201).json({ id });
});

avatars.get('/:id', async (req, res) => {
  if (!ID.test(req.params.id)) return res.sendStatus(404);

  const image = await readFile(path.join(AVATAR_ROOT, `${req.params.id}.png`));

  res.set('X-Content-Type-Options', 'nosniff').type('image/png').send(image);
});
