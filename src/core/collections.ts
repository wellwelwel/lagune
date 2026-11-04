export const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const ownValue = <Value>(
  record: Record<string, Value>,
  key: string
): Value | undefined => (Object.hasOwn(record, key) ? record[key] : undefined);

export const readField = (payload: unknown, field: string): unknown =>
  isRecord(payload) ? ownValue(payload, field) : undefined;

export const appendUnique = (
  current: string[],
  incoming: string[]
): string[] => [
  ...current,
  ...incoming.filter((item) => !current.includes(item)),
];

const joinNaturally = (values: string[], conjunction: string): string => {
  if (values.length <= 1) return values[0] ?? '';
  if (values.length === 2) return `${values[0]} ${conjunction} ${values[1]}`;

  return `${values.slice(0, -1).join(', ')}, ${conjunction} ${values[values.length - 1]}`;
};

export const oneOf = (values: string[]): string => joinNaturally(values, 'or');

export const allOf = (values: string[]): string => joinNaturally(values, 'and');
