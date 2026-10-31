import lagunePackage from '../../../package.json';
import { ALL_CATEGORIES } from '../../src/data/categories';

const TOKENS: Record<string, string> = {
  categories: String(ALL_CATEGORIES.length),
  version: lagunePackage.version,
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
