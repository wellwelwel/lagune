import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { requestReset } from '../users.js';

export const reset = express.Router();

reset.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 5 }));

reset.post('/', (req, res) => {
  requestReset(String(req.body.email));
  res.status(202).json({ ok: true });
});
