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

const isPlainContainer = (value: unknown): value is object => {
  if (Array.isArray(value)) return true;
  if (!isRecord(value)) return false;

  const prototype: unknown = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype === null;
};

/** Freezes an array or plain object and every one nested in it, leaving any other value as it is */
export const deepFreeze = <Value>(value: Value): Value => {
  if (!isPlainContainer(value) || Object.isFrozen(value)) return value;

  Object.freeze(value);

  for (const child of Object.values(value)) deepFreeze(child);

  return value;
};

const joinNaturally = (values: string[], conjunction: string): string => {
  if (values.length <= 1) return values[0] ?? '';
  if (values.length === 2) return `${values[0]} ${conjunction} ${values[1]}`;

  return `${values.slice(0, -1).join(', ')}, ${conjunction} ${values[values.length - 1]}`;
};

export const oneOf = (values: string[]): string => joinNaturally(values, 'or');

export const allOf = (values: string[]): string => joinNaturally(values, 'and');
