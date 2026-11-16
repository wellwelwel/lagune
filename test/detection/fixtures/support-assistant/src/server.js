import express from 'express';
import { resolveTicket } from './agent.js';
import { summarize } from './summary.js';

const app = express();

app.use(express.json({ limit: '50kb' }));

app.post('/tickets/:id/summary', async (req, res) => {
  res.json({ summary: await summarize(String(req.body.body)) });
});

app.post('/tickets/:id/resolve', async (req, res) => {
  res.json({ reply: await resolveTicket(String(req.body.body)) });
});

app.listen(3000);
