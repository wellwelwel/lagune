import express from 'express';
import { checkout } from './checkout.js';
import { webhook } from './webhook.js';

const app = express();

app.post('/webhook', express.raw({ type: 'application/json' }), webhook);
app.post('/checkout', express.json({ limit: '10kb' }), checkout);

app.listen(3000);
