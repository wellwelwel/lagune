import express from 'express';
import { hashPassword } from './passwords.js';
import { createResetToken } from './tokens.js';

const resets = new Map();
const passwords = new Map();

const app = express();

app.use(express.json({ limit: '10kb' }));

app.post('/reset', (req, res) => {
  const token = createResetToken();

  resets.set(token, {
    email: String(req.body.email),
    expires: Date.now() + 3600000,
  });
  res.status(202).json({ ok: true });
});

app.post('/reset/:token', async (req, res) => {
  const reset = resets.get(req.params.token);

  if (!reset || reset.expires < Date.now()) return res.sendStatus(404);

  resets.delete(req.params.token);
  passwords.set(reset.email, await hashPassword(String(req.body.password)));
  res.json({ ok: true });
});

app.listen(3000);
