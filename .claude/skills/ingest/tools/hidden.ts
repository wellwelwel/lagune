import type { Entry } from './types.ts';

const HIDDEN_CHARACTERS =
  /[\u0000-\u0008\u000B-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u2069\uFEFF]/g;

export const revealHidden = (text: string): string =>
  text.replace(
    HIDDEN_CHARACTERS,
    (character) =>
      `\\u{${character.codePointAt(0)?.toString(16).toUpperCase()}}`
  );

export const hasHidden = (entry: Entry): boolean =>
  entry.lines.some((line) => line.search(HIDDEN_CHARACTERS) >= 0);
