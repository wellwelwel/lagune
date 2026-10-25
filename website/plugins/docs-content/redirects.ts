export const docsRedirects: Record<string, string> = {
  'commands/skills': 'commands/catalog',
  'skill-categories': 'categories',
  'supported-agents': '',
  'references/comparison': '',
  'get-started/install': '',
};

export const redirectPage = (target: string): string =>
  [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="robots" content="noindex">',
    `<link rel="canonical" href="${target}">`,
    `<meta http-equiv="refresh" content="0; url=${target}">`,
    '<title>Moved</title>',
    '</head>',
    `<body><a href="${target}">This page moved.</a></body>`,
    '</html>',
    '',
  ].join('\n');

export const redirectMarkdown = (target: string): string =>
  `# Moved\n\nThis page moved to ${target}.md\n`;
