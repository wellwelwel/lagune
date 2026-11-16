import express from 'express';
import session from 'express-session';
import { apiTokens } from './api-tokens.js';
import { oauth } from './oauth.js';

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: true, sameSite: 'lax' },
  })
);
app.use('/auth', oauth);
app.use('/api', apiTokens);

app.listen(3000);
