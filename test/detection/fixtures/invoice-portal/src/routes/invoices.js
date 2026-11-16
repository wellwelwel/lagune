import express from 'express';
import { findInvoice, invoicesOf } from '../db.js';

export const invoices = express.Router();

invoices.get('/', (req, res) => {
  res.json(invoicesOf(req.user.id));
});

invoices.get('/:id', (req, res) => {
  const invoice = findInvoice(req.params.id);

  if (!invoice) return res.sendStatus(404);

  res.json(invoice);
});
