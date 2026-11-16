import { createHmac, timingSafeEqual } from 'node:crypto';

const SECRET = process.env.SESSION_SECRET;

export const verifySession = (token) => {
  const [userId, signature] = String(token).split('.');

  if (!userId || !signature) return undefined;

  const expected = createHmac('sha256', SECRET)
    .update(userId)
    .digest('base64url');
  const valid =
    expected.length === signature.length &&
    timingSafeEqual(Buffer.from(expected), Buffer.from(signature));

  return valid ? { id: userId } : undefined;
};
