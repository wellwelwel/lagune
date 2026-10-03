import { readFile } from 'node:fs/promises';
import { stripComments } from './comments';

export const readText = async (path: string): Promise<string | null> => {
  try {
    return await readFile(path, 'utf8');
  } catch {
    return null;
  }
};

export const readMarkdown = async (path: string): Promise<string | null> => {
  const text = await readText(path);
  return text === null ? null : stripComments(text);
};
