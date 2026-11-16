import path from 'node:path';

const PAGES_ROOT = path.resolve('pages');

export const page = (req, res) => {
  const resolved = path.resolve(PAGES_ROOT, `${req.params.name}.html`);

  if (!resolved.startsWith(PAGES_ROOT + path.sep)) return res.sendStatus(404);

  res.sendFile(resolved);
};
