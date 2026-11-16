import express from 'express';
import session from 'express-session';
import { requireUser } from './auth.js';
import { invoices } from './routes/invoices.js';
import { profile } from './routes/profile.js';

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: true, sameSite: 'lax' },
  })
);
app.use(requireUser);
app.use('/invoices', invoices);
app.use('/profile', profile);

app.listen(3000);
