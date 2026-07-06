import type { Token, TokenMatch } from '../../../../types/dashboard/client';

const CODE = '`';
const STRONG = '**';
const EM = '*';

const matchCode = (text: string, start: number): TokenMatch | null => {
  if (text[start] !== CODE) return null;

  const close = text.indexOf(CODE, start + 1);
  if (close <= start + 1) return null;

  return {
    token: { kind: 'code', value: text.slice(start + 1, close) },
    length: close + 1 - start,
  };
};

const matchLink = (text: string, start: number): TokenMatch | null => {
  if (text[start] !== '[') return null;

  const label = text.indexOf(']', start + 1);
  if (label <= start + 1 || text[label + 1] !== '(') return null;

  const close = text.indexOf(')', label + 2);
  if (close <= label + 2) return null;

  return {
    token: {
      kind: 'link',
      value: text.slice(start + 1, label),
      href: text.slice(label + 2, close),
    },
    length: close + 1 - start,
  };
};

const URL_SCHEMES = ['https://', 'http://'];
const URL_TRAILING = /[.,;:!?)\]]+$/;

const matchUrl = (text: string, start: number): TokenMatch | null => {
  const scheme = URL_SCHEMES.find((prefix) => text.startsWith(prefix, start));
  if (scheme === undefined) return null;

  let end = start + scheme.length;
  while (end < text.length && !/\s/.test(text[end])) end += 1;

  const url = text.slice(start, end).replace(URL_TRAILING, '');
  if (url.length <= scheme.length) return null;

  return { token: { kind: 'link', value: url, href: url }, length: url.length };
};

const matchWrapped = (
  text: string,
  start: number,
  marker: string,
  kind: 'strong' | 'em'
): TokenMatch | null => {
  if (!text.startsWith(marker, start)) return null;

  const from = start + marker.length;
  const close = text.indexOf(marker, from);

  if (close <= from) return null;

  return {
    token: { kind, value: text.slice(from, close) },
    length: close + marker.length - start,
  };
};

const matchAt = (text: string, start: number): TokenMatch | null =>
  matchCode(text, start) ??
  matchLink(text, start) ??
  matchUrl(text, start) ??
  matchWrapped(text, start, STRONG, 'strong') ??
  matchWrapped(text, start, EM, 'em');

export const tokenize = (text: string): Token[] => {
  const tokens: Token[] = [];
  let plainFrom = 0;
  let position = 0;

  while (position < text.length) {
    const match = matchAt(text, position);

    if (!match) {
      position += 1;
      continue;
    }

    if (plainFrom < position)
      tokens.push({ kind: 'text', value: text.slice(plainFrom, position) });

    tokens.push(match.token);

    position += match.length;
    plainFrom = position;
  }

  if (plainFrom < text.length)
    tokens.push({ kind: 'text', value: text.slice(plainFrom) });

  return tokens;
};
