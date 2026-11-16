import type {
  BindingState,
  BoundString,
  SourceReading,
  SourceToken,
} from '../../types/hooks/regex.js';
import {
  CLOSER_OF,
  CLOSERS,
  isIdentifierChar,
  isPrefixChar,
  PREFIX_LIMIT,
} from './lexer.js';

export const IDENTIFIER = /[A-Za-z_]\w*/g;

const HEAD_NAMES = 16;

const CALLEE_LENGTH = 96;

const NAME_LENGTH = 64;

const GAP = 8;

const NO_NAMES: readonly string[] = Object.freeze([]);

const BLANKS = new Set([' ', '\t', '\r']);

const COMPARES = new Set(['=', '!', '<', '>']);

const NOT_ASSIGNED = new Set(['=', '>', '~']);

const CONTINUES = new Set(['=', '+', '.', '\\']);

const PLAIN_QUOTES = new Set(["'", '"']);

const PATH = /[\w.:]/;

/** Lists the identifiers a piece of code names */
export const identifiersIn = (code: string): string[] =>
  code.match(IDENTIFIER) ?? [];

const isPathChar = (char: string): boolean => PATH.test(char);

const skipBlanksBack = (text: string, end: number): number => {
  let index = end;

  while (index > 0 && end - index < GAP && BLANKS.has(text[index - 1]))
    index -= 1;

  return index;
};

const wordBefore = (
  text: string,
  end: number,
  limit: number,
  belongs: (char: string) => boolean
): string => {
  let start = end;

  while (start > 0 && end - start < limit && belongs(text[start - 1]))
    start -= 1;

  return text.slice(start, end);
};

const calleeBefore = (text: string, paren: number): string => {
  const spaced = skipBlanksBack(text, paren);
  const marked = text[spaced - 1] === '!' || text[spaced - 1] === '?';

  return wordBefore(
    text,
    marked ? spaced - 1 : spaced,
    CALLEE_LENGTH,
    isPathChar
  );
};

/** The word written right before a literal: the name a definition gives it, or the label it is passed under */
const labelBefore = (text: string, open: number): string => {
  const prefixed =
    open - wordBefore(text, open, PREFIX_LIMIT, isPrefixChar).length;
  const spaced = skipBlanksBack(text, prefixed);
  const labeled = text[spaced - 1] === ':' && text[spaced - 2] !== ':';

  return wordBefore(
    text,
    labeled ? skipBlanksBack(text, spaced - 1) : spaced,
    NAME_LENGTH,
    isIdentifierChar
  );
};

const assignsAt = (text: string, index: number): boolean =>
  text[index] === '='
    ? !COMPARES.has(text[index - 1]) && !NOT_ASSIGNED.has(text[index + 1])
    : text[index] === '<' && text[index + 1] === '-';

const depthOf = ({ closers }: BindingState): number => closers.length;

const endLine = (state: BindingState, index: number): void => {
  const { binding } = state;

  if (
    binding !== null &&
    binding.depth === depthOf(state) &&
    !CONTINUES.has(state.last)
  )
    state.binding = null;

  state.segment = index + 1;
};

const openBracket = (
  state: BindingState,
  text: string,
  index: number,
  closer: string
): void => {
  const char = text[index];

  state.closers.push(closer);
  state.callees.push(char === '(' ? calleeBefore(text, index) : '');
  state.segment = index + 1;
  state.last = char;
};

const closeBracket = (state: BindingState, char: string): void => {
  state.last = char;

  if (state.closers.at(-1) !== char) {
    state.closers.length = 0;
    state.callees.length = 0;
    state.binding = null;
    return;
  }

  state.closers.pop();
  state.callees.pop();

  if (state.binding !== null && depthOf(state) < state.binding.depth)
    state.binding = null;
};

const endItem = (state: BindingState, index: number, char: string): void => {
  const { binding } = state;

  if (char === ';' || (binding !== null && binding.depth === depthOf(state)))
    state.binding = null;

  state.segment = index + 1;
  state.last = char;
};

const bind = (state: BindingState, bare: string, index: number): void => {
  state.binding = {
    names: identifiersIn(bare.slice(state.segment, index)).slice(-HEAD_NAMES),
    depth: depthOf(state),
  };
  state.segment = index + 1;
  state.last = '=';
};

const step = (
  state: BindingState,
  { text, bare }: SourceReading,
  index: number
): void => {
  const char = text[index];

  if (BLANKS.has(char)) return;
  if (char === '\n') return endLine(state, index);

  const closer = CLOSER_OF.get(char);

  if (closer !== undefined) return openBracket(state, text, index, closer);
  if (CLOSERS.has(char)) return closeBracket(state, char);
  if (char === ',' || char === ';') return endItem(state, index, char);
  if (assignsAt(text, index)) return bind(state, bare, index);

  state.last = char;
};

const boundAt = (
  state: BindingState,
  text: string,
  token: SourceToken
): BoundString => {
  const { binding } = state;
  const positional = binding === null || binding.depth < depthOf(state);

  return {
    token,
    names: binding?.names ?? NO_NAMES,
    label: labelBefore(text, token.open),
    callee: positional ? (state.callees.at(-1) ?? '') : '',
  };
};

/** Reads, for each quoted string, the names its code binds it to: the target of its assignment, the label or definition before it, and the call that takes it as a plain argument */
export const boundStrings = (source: SourceReading): BoundString[] => {
  if (source.language === 'javascript') return [];

  const { text, tokens } = source;
  const bound: BoundString[] = [];
  const state: BindingState = {
    closers: [],
    callees: [],
    binding: null,
    segment: 0,
    last: '',
  };
  let cursor = 0;

  for (const token of tokens) {
    for (let index = cursor; index < token.open; index += 1)
      step(state, source, index);

    cursor = token.end + token.flags.length + 1;

    if (token.kind === 'comment') continue;
    if (text[token.open] === '}') closeBracket(state, '}');

    if (token.kind === 'string' && PLAIN_QUOTES.has(text[token.open]))
      bound.push(boundAt(state, text, token));

    state.last = text[token.open];
  }

  return bound;
};
