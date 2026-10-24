import { readFile } from 'node:fs/promises';

export const loadVersion = async (packageRoot: URL): Promise<string> => {
  const raw = await readFile(new URL('package.json', packageRoot), 'utf8');
  const parsed: { version?: unknown } = JSON.parse(raw);

  if (typeof parsed.version !== 'string')
    throw new Error('package.json is missing a string `version` field');

  return parsed.version;
};
