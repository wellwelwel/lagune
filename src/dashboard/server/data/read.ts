import { readdir } from 'node:fs/promises';

export const readSkillNames = async (dir: string): Promise<string[]> => {
  try {
    const entries = await readdir(dir);
    return entries
      .filter((entry) => entry.endsWith('.md'))
      .map((entry) => entry.slice(0, -'.md'.length));
  } catch {
    return [];
  }
};
