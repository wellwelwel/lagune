import { randomUUID } from 'node:crypto';
import path from 'node:path';
import express from 'express';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: 'public/attachments',
  filename: (_req, file, done) =>
    done(null, `${randomUUID()}${path.extname(file.originalname)}`),
});

const upload = multer({ storage });

export const attachments = express.Router();

attachments.post(
  '/:ticketId/attachments',
  upload.single('file'),
  (req, res) => {
    res.status(201).json({ url: `/attachments/${req.file.filename}` });
  }
);
