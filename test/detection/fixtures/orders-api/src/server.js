import express from 'express';
import { findCustomer } from './customers.js';
import { listOrders } from './orders.js';

const app = express();

app.get('/orders', async (req, res) => {
  const status = String(req.query.status ?? 'open');
  const sort = String(req.query.sort ?? 'created_at');

  res.json(await listOrders(status, sort));
});

app.get('/customers/:id', async (req, res) => {
  const customer = await findCustomer(req.params.id);

  if (!customer) return res.sendStatus(404);

  res.json(customer);
});

app.listen(3000);
