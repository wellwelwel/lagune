import type { Entry, Stats } from './types.ts';

export const groupBy = <Value>(
  values: Value[],
  keyOf: (value: Value) => string
): Map<string, Value[]> =>
  values.reduce((groups, value) => {
    const key = keyOf(value);
    const group = groups.get(key);

    if (group === undefined) return groups.set(key, [value]);

    group.push(value);

    return groups;
  }, new Map<string, Value[]>());

export const sumStats = (entries: Entry[]): Stats => ({
  files: entries.length,
  characters: entries.reduce((total, entry) => total + entry.characters, 0),
});
