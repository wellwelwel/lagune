import express from 'express';
import { fetchAvatar } from './avatars.js';
import { fetchPreview } from './preview.js';

const app = express();

app.get('/preview', async (req, res) => {
  if (typeof req.query.url !== 'string')
    return res.status(400).json({ error: 'Missing url' });

  res.json(await fetchPreview(req.query.url));
});

app.get('/avatars/:id', async (req, res) => {
  const image = await fetchAvatar(req.params.id);

  res.type('image/png').send(image);
});

app.listen(3000);
