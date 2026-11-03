const TYPED_SPECIAL = /[&<>"'`^]/g;

const ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#96;',
  '^': '&#94;',
};

/** Typed.js writes its strings as HTML and reads backticks and carets as typing controls */
export const typedText = (value: string): string =>
  value.replace(TYPED_SPECIAL, (character) => ENTITIES[character] ?? '');
