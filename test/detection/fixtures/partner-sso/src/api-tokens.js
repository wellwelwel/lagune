import express from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const JWKS = createRemoteJWKSet(
  new URL('https://login.partner.example.com/jwks')
);

export const apiTokens = express.Router();

apiTokens.use(async (req, res, next) => {
  const token = req.get('authorization')?.replace(/^Bearer /, '');

  if (!token) return res.sendStatus(401);

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: 'https://login.partner.example.com',
      audience: 'partner-api',
      algorithms: ['RS256'],
    });

    req.client = payload.sub;
    next();
  } catch {
    res.sendStatus(401);
  }
});

apiTokens.get('/whoami', (req, res) => {
  res.json({ client: req.client });
});
