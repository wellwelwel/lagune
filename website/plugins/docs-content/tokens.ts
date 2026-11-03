import lagunePackage from '../../../package.json';
import { CATEGORIES } from '../../src/data/lagune';
import { TOKEN } from './token-pattern';

const TOKENS: Record<string, string> = {
  categories: String(CATEGORIES.length),
  version: lagunePackage.version,
};

export const substituteTokens = (source: string, origin: string): string =>
  source.replace(TOKEN, (token: string, name: string) => {
    const value = TOKENS[name];

    if (value === undefined)
      throw new Error(
        `[lagune-docs-content] Unknown token ${token} in ${origin}.`
      );

    return value;
  });
