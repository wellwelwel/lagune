import type { Location } from '@ruby/prism/src/location.js';

export type PrismParseError = {
  message: string;
  location: Location;
};

/** A parse as the engine trusts it: the errors Prism reports, and a value only an instanceof check makes a program */
export type PrismParseResult = {
  value: unknown;
  errors: PrismParseError[];
};

/** Prism's parse as TypeScript sees it through the package's imports: @ruby/prism 2.1.0 ships declarations that do not compile */
export declare const parsePrism: (
  prism: WebAssembly.Exports,
  source: Uint8Array
) => PrismParseResult;
