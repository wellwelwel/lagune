import express from 'express';

const PLANS = [
  { id: 'free', price: 0 },
  { id: 'pro', price: 12 },
];

export const catalog = express.Router();

catalog.get('/plans', (_req, res) => {
  res.json(PLANS);
});
