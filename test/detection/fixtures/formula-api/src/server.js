import express from 'express';
import { calculate } from './calculate.js';
import { convert } from './units.js';

const app = express();

app.use(express.json({ limit: '10kb' }));

app.post('/calculate', (req, res) => {
  res.json({ result: calculate(String(req.body.expression)) });
});

app.post('/convert', (req, res) => {
  const { value, from, to } = req.body;

  res.json({ result: convert(Number(value), String(from), String(to)) });
});

app.listen(3000);
