import { ALL_AGENTS, ALL_CATEGORIES } from '../../src/data/registry';

const COUNTS: Record<string, number> = {
  agents: ALL_AGENTS.length,
  categories: ALL_CATEGORIES.length,
};

const TOKEN = /\{\{\s*([a-z]+)\s*\}\}/g;

export const substituteCounts = (source: string, origin: string): string =>
  source.replace(TOKEN, (token: string, name: string) => {
    const count = COUNTS[name];

    if (count === undefined)
      throw new Error(
        `[lagune-docs-content] Unknown count token ${token} in ${origin}.`
      );

    return String(count);
  });
