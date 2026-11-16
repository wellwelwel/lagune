import express from 'express';
import session from 'express-session';
import { login } from './routes/login.js';
import { reset } from './routes/reset.js';

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: true, sameSite: 'lax' },
  })
);
app.use('/login', login);
app.use('/password-reset', reset);

app.listen(3000);
