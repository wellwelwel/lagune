import express from 'express';
import session from 'express-session';
import { catalog } from './routes/catalog.js';

const accounts = new Map();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: true, sameSite: 'none' },
  })
);

app.post('/account/email', (req, res) => {
  const account = accounts.get(req.session.accountId);

  if (!account) return res.sendStatus(401);

  account.email = String(req.body.email);
  res.redirect('/account');
});

app.use('/catalog', catalog);

app.listen(3000);
