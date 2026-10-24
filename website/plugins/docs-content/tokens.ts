import { ALL_CATEGORIES } from '../../src/data/categories';
import { LAGUNE_VERSION } from './version';

const TOKENS: Record<string, string> = {
  categories: String(ALL_CATEGORIES.length),
  version: LAGUNE_VERSION,
};

const TOKEN = /\{\{\s*([a-z]+)\s*\}\}/g;

export const substituteTokens = (source: string, origin: string): string =>
  source.replace(TOKEN, (token: string, name: string) => {
    const value = TOKENS[name];

    if (value === undefined)
      throw new Error(
        `[lagune-docs-content] Unknown token ${token} in ${origin}.`
      );

    return value;
  });
