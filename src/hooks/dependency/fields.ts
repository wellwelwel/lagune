import type { PlacedTable } from '../../types/hooks/dependency.js';
import { isPlainRecord, isString, ownValue } from '../../core/collections.js';
import { cannotJudge } from './text.js';

/** The dotted path of a key, as a message names it */
export const pathOf = (where: string, key: string): string =>
  where === '' ? key : `${where}.${key}`;

export const wrongKind = (
  file: string,
  where: string,
  key: string,
  expected: string
): Error =>
  cannotJudge(
    file,
    `sets ${pathOf(where, key)} to something other than ${expected}`
  );

export const textAt = (
  file: string,
  record: Record<string, unknown>,
  key: string,
  where: string
): string | undefined => {
  const value = ownValue(record, key);

  if (value === undefined || isString(value)) return value;

  throw wrongKind(file, where, key, 'text');
};

export const switchAt = (
  file: string,
  record: Record<string, unknown>,
  key: string,
  where: string
): boolean => {
  const value = ownValue(record, key);

  if (value === undefined) return false;
  if (typeof value === 'boolean') return value;

  throw wrongKind(file, where, key, 'true or false');
};

export const textsAt = (
  file: string,
  record: Record<string, unknown>,
  key: string,
  where: string
): string[] => {
  const value = ownValue(record, key);

  if (value === undefined) return [];
  if (Array.isArray(value) && value.every(isString)) return value;

  throw wrongKind(file, where, key, 'a list of text');
};

export const tableAt = (
  file: string,
  record: Record<string, unknown>,
  key: string,
  where: string
): Record<string, unknown> | undefined => {
  const value = ownValue(record, key);

  if (value === undefined || isPlainRecord(value)) return value;

  throw wrongKind(file, where, key, 'a table');
};

/** A table at its dotted path, or none when the key is absent */
export const placedTableAt = (
  file: string,
  record: Record<string, unknown>,
  key: string,
  where: string
): PlacedTable[] => {
  const table = tableAt(file, record, key, where);

  return table === undefined ? [] : [[pathOf(where, key), table]];
};

export const tableOrEmptyAt = (
  file: string,
  record: Record<string, unknown>,
  key: string,
  where: string
): Record<string, unknown> =>
  tableAt(file, record, key, where) ?? Object.create(null);

export const tablesAt = (
  file: string,
  record: Record<string, unknown>,
  key: string,
  where: string
): Record<string, unknown>[] => {
  const value = ownValue(record, key);

  if (value === undefined) return [];
  if (Array.isArray(value) && value.every(isPlainRecord)) return value;

  throw wrongKind(file, where, key, 'a list of tables');
};

/** A table's entries, each a table of its own, such as the registries a Cargo configuration names */
export const subtablesAt = (
  file: string,
  record: Record<string, unknown>,
  key: string,
  where: string
): PlacedTable[] => {
  const path = pathOf(where, key);
  const table = tableOrEmptyAt(file, record, key, where);

  return Object.entries(table).map(([name, value]) => {
    if (isPlainRecord(value)) return [pathOf(path, name), value];

    throw wrongKind(file, path, name, 'a table');
  });
};

/** A table's entries, each a table or a list of tables, such as the sources a package names */
export const tableEntriesAt = (
  file: string,
  record: Record<string, unknown>,
  key: string,
  where: string
): [string, Record<string, unknown>[]][] =>
  Object.entries(tableOrEmptyAt(file, record, key, where)).map(
    ([name, value]) => {
      if (isPlainRecord(value)) return [name, [value]];
      if (Array.isArray(value) && value.every(isPlainRecord))
        return [name, value];

      throw wrongKind(
        file,
        pathOf(where, key),
        name,
        'a table or a list of tables'
      );
    }
  );
