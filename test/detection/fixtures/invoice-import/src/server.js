import express from 'express';
import { exportInvoice } from './export.js';
import { importInvoice } from './import.js';

const app = express();

app.post(
  '/invoices/import',
  express.text({ type: 'application/xml', limit: '1mb' }),
  (req, res) => {
    res.json(importInvoice(req.body));
  }
);

app.get('/invoices/:id/export', (req, res) => {
  res
    .type('application/xml')
    .send(exportInvoice({ id: req.params.id, lines: [] }));
});

app.listen(3000);
