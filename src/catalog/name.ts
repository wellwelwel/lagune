const NAME_CHARACTER = /[a-z0-9-]/;

export const leadingNameLength = (text: string): number => {
  let length = 0;

  while (length < text.length && NAME_CHARACTER.test(text[length])) length += 1;

  return length;
};

export const isSpecializationName = (value: string): boolean =>
  value.length > 0 && leadingNameLength(value) === value.length;
