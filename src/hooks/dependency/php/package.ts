import type { PlacedTable } from '../../../types/hooks/dependency.js';
import { pathOf, tableAt, textAt } from '../fields.js';

/** Where Composer downloads a package from: its dist archive or its source checkout */
const SOURCE_KEYS = ['dist', 'source'];

/** The URLs a Composer package downloads from, as a lockfile locks it or a package repository defines it */
export const packageUrls = (
  file: string,
  [where, entry]: PlacedTable
): string[] =>
  SOURCE_KEYS.flatMap((key) => {
    const source = tableAt(file, entry, key, where);

    return source === undefined
      ? []
      : (textAt(file, source, 'url', pathOf(where, key)) ?? []);
  });
