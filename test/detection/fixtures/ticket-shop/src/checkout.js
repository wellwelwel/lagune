import { findEvent } from './events.js';
import { stripe } from './stripe.js';

export const checkout = async (req, res) => {
  const { eventId, quantity, amount } = req.body;
  const event = findEvent(eventId);

  if (!event) return res.sendStatus(404);

  const intent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    metadata: { eventId, quantity: String(quantity) },
  });

  res.json({ clientSecret: intent.client_secret });
};
