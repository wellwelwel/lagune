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
