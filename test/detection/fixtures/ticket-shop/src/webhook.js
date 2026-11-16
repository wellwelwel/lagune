import { stripe } from './stripe.js';

const issued = new Set();

export const webhook = (req, res) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.get('stripe-signature'),
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return res.sendStatus(400);
  }

  if (
    event.type === 'payment_intent.succeeded' &&
    !issued.has(event.data.object.id)
  )
    issued.add(event.data.object.id);

  res.sendStatus(200);
};
