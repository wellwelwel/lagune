import path from 'node:path';

const DOCS_ROOT = path.resolve('docs');

export const download = (req, res) => {
  const file = path.join(DOCS_ROOT, String(req.query.name));

  res.download(file);
};
