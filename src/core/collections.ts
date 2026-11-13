import type { ConfigsAction, ListChange } from '../types/core.js';

export const isString = (value: unknown): value is string =>
  typeof value === 'string';

export const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(isString);

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const ownValue = <Value>(
  record: Record<string, Value>,
  key: string
): Value | undefined => (Object.hasOwn(record, key) ? record[key] : undefined);

export const readField = (payload: unknown, field: string): unknown =>
  isRecord(payload) ? ownValue(payload, field) : undefined;

/** A record written as an object literal or parsed from text, never a class instance such as a date */
export const isPlainRecord = (
  value: unknown
): value is Record<string, unknown> => {
  if (!isRecord(value)) return false;

  const prototype: unknown = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype === null;
};

const isPlainContainer = (value: unknown): value is object =>
  Array.isArray(value) || isPlainRecord(value);

/** Freezes an array or plain object and every one nested in it, leaving any other value as it is */
export const deepFreeze = <Value>(value: Value): Value => {
  if (!isPlainContainer(value) || Object.isFrozen(value)) return value;

  Object.freeze(value);

  for (const child of Object.values(value)) deepFreeze(child);

  return value;
};

const joinNaturally = (
  values: readonly string[],
  conjunction: string
): string => {
  if (values.length <= 1) return values[0] ?? '';
  if (values.length === 2) return `${values[0]} ${conjunction} ${values[1]}`;

  return `${values.slice(0, -1).join(', ')}, ${conjunction} ${values[values.length - 1]}`;
};

export const oneOf = (values: readonly string[]): string =>
  joinNaturally(values, 'or');

export const allOf = (values: readonly string[]): string =>
  joinNaturally(values, 'and');

/** Adds the requested values a list lacks, keeping its order and naming what changed */
export const addToList = (
  current: readonly string[],
  requested: readonly string[]
): ListChange => {
  const distinct = [...new Set(requested)];
  const changed = distinct.filter((value) => !current.includes(value));

  return {
    values: [...current, ...changed],
    changed,
    unchanged: distinct.filter((value) => current.includes(value)),
  };
};

/** Drops the requested values a list holds, naming what changed */
export const removeFromList = (
  current: readonly string[],
  requested: readonly string[]
): ListChange => {
  const distinct = [...new Set(requested)];

  return {
    values: current.filter((value) => !distinct.includes(value)),
    changed: distinct.filter((value) => current.includes(value)),
    unchanged: distinct.filter((value) => !current.includes(value)),
  };
};

export const changeList = (
  action: ConfigsAction,
  current: readonly string[],
  requested: readonly string[]
): ListChange =>
  action === 'add'
    ? addToList(current, requested)
    : removeFromList(current, requested);
