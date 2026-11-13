import type { GoDirective } from '../../../types/hooks/dependency.js';
import { Buffer } from 'node:buffer';
import { quotedExcerpt } from '../../../core/errors.js';
import { cannotJudge } from '../text.js';

/** One token of a go.mod line, the way Go's own lexer splits it: a comment, an interpreted or raw string, a punctuation mark, or a run of printable characters that ends where a comment starts */
const TOKEN =
  /[ \t\r]*(?:(\/\/)|"((?:[^"\\]|\\.)*)"|`([^`]*)`|([()[\]{},]|(?:[^\s()[\]{},"`/\p{Cc}]|\/(?![/*]))(?:[^\s()[\]{},/\p{Cc}]|\/(?![/*]))*))/guy;

const BLANK = /^[ \t\r]*$/;

/** One piece of an interpreted string: a run without escapes, or one of the escapes Go's strconv.Unquote accepts between double quotes */
const STRING_PIECE =
  /([^\\]+)|\\(?:([abfnrtv\\"])|x([\da-fA-F]{2})|([0-7]{3})|u([\da-fA-F]{4})|U([\da-fA-F]{8}))/gy;

const ESCAPED_BYTES: ReadonlyMap<string, number> = new Map([
  ['a', 0x07],
  ['b', 0x08],
  ['f', 0x0c],
  ['n', 0x0a],
  ['r', 0x0d],
  ['t', 0x09],
  ['v', 0x0b],
  ['\\', 0x5c],
  ['"', 0x22],
]);

const LARGEST_BYTE = 0xff;

const LARGEST_CODE_POINT = 0x10ffff;

const FIRST_SURROGATE = 0xd800;

const LAST_SURROGATE = 0xdfff;

const UTF8 = new TextDecoder('utf-8', { fatal: true });

const ENCODER = new TextEncoder();

const OPEN_BLOCK = '(';

const CLOSE_BLOCK = ')';

const isCodePoint = (value: number): boolean =>
  value <= LARGEST_CODE_POINT &&
  (value < FIRST_SURROGATE || value > LAST_SURROGATE);

/** The bytes one piece of an interpreted string stands for, or null when Go refuses it */
const pieceBytes = ([
  ,
  run,
  escaped,
  hex,
  octal,
  short,
  long,
]: RegExpExecArray): Uint8Array | null => {
  if (run !== undefined) return ENCODER.encode(run);
  if (escaped !== undefined) {
    const byte = ESCAPED_BYTES.get(escaped);

    return byte === undefined ? null : Uint8Array.of(byte);
  }
  if (hex !== undefined) return Uint8Array.of(Number.parseInt(hex, 16));
  if (octal !== undefined) {
    const value = Number.parseInt(octal, 8);

    return value > LARGEST_BYTE ? null : Uint8Array.of(value);
  }

  const codePoint = Number.parseInt(short ?? long, 16);

  return isCodePoint(codePoint)
    ? ENCODER.encode(String.fromCodePoint(codePoint))
    : null;
};

/** An interpreted string decoded the way Go's strconv.Unquote decodes it, or null when Go refuses it */
const unquoted = (text: string): string | null => {
  const pieces: Uint8Array[] = [];
  let read = 0;

  for (const piece of text.matchAll(STRING_PIECE)) {
    const bytes = pieceBytes(piece);

    if (bytes === null) return null;

    read += piece[0].length;
    pieces.push(bytes);
  }

  if (read !== text.length) return null;

  try {
    return UTF8.decode(Buffer.concat(pieces));
  } catch {
    return null;
  }
};

const interpreted = (file: string, line: number, text: string): string => {
  const decoded = unquoted(text);

  if (decoded === null)
    throw cannotJudge(
      file,
      `holds a string on line ${line} that Go cannot read: ${quotedExcerpt(text)}`
    );

  return decoded;
};

const tokensOf = (file: string, line: number, text: string): string[] => {
  const tokens: string[] = [];
  let read = 0;

  for (const [whole, comment, quoted, raw, word] of text.matchAll(TOKEN)) {
    if (comment !== undefined) return tokens;

    read += whole.length;

    tokens.push(
      quoted === undefined
        ? (raw?.replaceAll('\r', '') ?? word)
        : interpreted(file, line, quoted)
    );
  }

  if (!BLANK.test(text.slice(read)))
    throw cannotJudge(file, `holds line ${line}, which Go cannot read`);

  return tokens;
};

/** The directives of a go.mod, reading each entry of a block as a directive of the block's verb */
export const goDirectivesOf = (
  file: string,
  content: string
): GoDirective[] => {
  const directives: GoDirective[] = [];
  let block: string | null = null;

  for (const [index, text] of content.split('\n').entries()) {
    const line = index + 1;
    const tokens = tokensOf(file, line, text);

    if (tokens.length === 0) continue;

    const closes = tokens.length === 1 && tokens[0] === CLOSE_BLOCK;

    if (block !== null && closes) {
      block = null;
      continue;
    }

    if (closes)
      throw cannotJudge(
        file,
        `closes a block on line ${line} that it never opened`
      );

    if (block !== null) {
      directives.push({ verb: block, operands: tokens, line });
      continue;
    }

    if (tokens.length === 2 && tokens[1] === OPEN_BLOCK) {
      block = tokens[0];
      continue;
    }

    directives.push({ verb: tokens[0], operands: tokens.slice(1), line });
  }

  if (block !== null)
    throw cannotJudge(file, `never closes its ${quotedExcerpt(block)} block`);

  return directives;
};
