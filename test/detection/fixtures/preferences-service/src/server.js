import express from 'express';
import { deepMerge } from './merge.js';
import { readPreferences, savePreferences } from './store.js';

const app = express();

app.use(express.json({ limit: '10kb' }));

app.get('/users/:id/preferences', (req, res) => {
  res.json(readPreferences(req.params.id));
});

app.patch('/users/:id/preferences', (req, res) => {
  const current = readPreferences(req.params.id);
  const next = deepMerge(current, req.body);

  savePreferences(req.params.id, next);
  res.json(next);
});

app.listen(3000);
