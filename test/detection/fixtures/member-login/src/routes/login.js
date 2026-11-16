import bcrypt from 'bcrypt';
import express from 'express';
import { findMember } from '../users.js';

export const login = express.Router();

login.post('/', async (req, res) => {
  const { email, password } = req.body;
  const member = findMember(String(email));
  const valid =
    member && (await bcrypt.compare(String(password), member.passwordHash));

  if (!valid)
    return res.status(401).json({ error: 'Invalid email or password' });

  req.session.regenerate(() => {
    req.session.memberId = member.id;
    res.json({ ok: true });
  });
});
