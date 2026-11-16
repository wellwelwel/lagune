import express from 'express';

export const profile = express.Router();

profile.get('/', (req, res) => {
  const { id, name, email } = req.user;

  res.json({ id, name, email });
});
