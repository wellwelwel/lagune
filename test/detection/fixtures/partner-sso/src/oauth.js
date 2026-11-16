import express from 'express';
import { decodeJwt } from 'jose';

const ISSUER = 'https://login.partner.example.com';
const CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const REDIRECT_URI = 'https://app.example.com/auth/callback';

export const oauth = express.Router();

oauth.get('/login', (_req, res) => {
  const query = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'openid email',
  });

  res.redirect(`${ISSUER}/authorize?${query}`);
});

oauth.get('/callback', async (req, res) => {
  const response = await fetch(`${ISSUER}/token`, {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: String(req.query.code),
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });
  const tokens = await response.json();
  const claims = decodeJwt(tokens.id_token);

  req.session.email = claims.email;
  res.redirect('/');
});
