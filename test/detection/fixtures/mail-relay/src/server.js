import express from 'express';
import { pool } from './database.js';
import { sendMail } from './mailer.js';

const app = express();

app.use(express.json({ limit: '50kb' }));

app.post('/messages', async (req, res) => {
  const { to, subject, text } = req.body;

  await sendMail({ to, subject, text });
  await pool.query(
    'INSERT INTO deliveries (recipient, subject) VALUES ($1, $2)',
    [to, subject]
  );
  res.status(202).json({ ok: true });
});

app.listen(3000);
