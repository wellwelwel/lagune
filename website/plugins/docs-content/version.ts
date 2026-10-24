import { readFileSync } from 'node:fs';

const rootPackage: { version?: unknown } = JSON.parse(
  readFileSync(new URL('../../../package.json', import.meta.url), 'utf8')
);

if (typeof rootPackage.version !== 'string')
  throw new Error(
    '[lagune-docs-content] The root package.json carries no version.'
  );

export const LAGUNE_VERSION = rootPackage.version;
