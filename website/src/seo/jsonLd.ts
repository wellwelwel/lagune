const UNSAFE_IN_SCRIPT = /[<>&\u2028\u2029]/g;

const unicodeEscape = (character: string): string =>
  `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`;

/** Serializes structured data for a script tag, escaping every character that could end the script or the HTML around it */
export const jsonLd = (data: unknown): string =>
  JSON.stringify(data).replace(UNSAFE_IN_SCRIPT, unicodeEscape);
