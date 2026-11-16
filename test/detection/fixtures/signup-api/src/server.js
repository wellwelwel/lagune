import express from 'express';
import { isValidEmail } from './validators/email.js';
import { isValidUsername } from './validators/username.js';

const app = express();

app.use(express.json({ limit: '10kb' }));

app.post('/signup', (req, res) => {
  const { email, username } = req.body;

  if (typeof email !== 'string' || !isValidEmail(email))
    return res.status(400).json({ error: 'Invalid email' });

  if (typeof username !== 'string' || !isValidUsername(username))
    return res.status(400).json({ error: 'Invalid username' });

  res.status(201).json({ email, username });
});

app.listen(3000);
