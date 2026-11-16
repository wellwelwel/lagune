import { findUser } from './db.js';

export const requireUser = (req, res, next) => {
  const user = findUser(req.session.userId);

  if (!user) return res.sendStatus(401);

  req.user = user;
  next();
};
