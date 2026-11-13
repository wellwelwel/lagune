export type TranslationMessage = { message: string; description?: string };

export type TranslationMessages = Record<string, TranslationMessage>;

export type Messages = Record<string, string>;

const PLACEHOLDER = /\{(\w+)\}/g;

export const messageTexts = (messages: TranslationMessages): Messages =>
  Object.fromEntries(
    Object.entries(messages).map(([id, { message }]) => [id, message])
  );

export const text = (
  messages: Messages,
  id: string,
  values: Record<string, string | number> = Object.create(null)
): string => {
  const message = messages[id];

  if (message === undefined)
    throw new Error(`No message is registered under the id "${id}".`);

  return message.replace(PLACEHOLDER, (placeholder: string, name: string) =>
    name in values ? String(values[name]) : placeholder
  );
};

export const slugOf = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
