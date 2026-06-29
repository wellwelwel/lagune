import type { ExtractedHosts } from '../../types/hooks/network.js';

const SCHEME = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;

const AUTHORITY_END = /[/?#]/;

const tryParse = (source: string): URL | null => {
  try {
    return new URL(source);
  } catch {
    return null;
  }
};

const sourceOf = (input: string): string =>
  SCHEME.test(input) ? input : `http://${input}`;

const authorityOf = (source: string): string => {
  const afterScheme = source.replace(SCHEME, '').replace(/^\/+/, '');
  const end = afterScheme.search(AUTHORITY_END);

  return end === -1 ? afterScheme : afterScheme.slice(0, end);
};

const stripPort = (candidate: string): string => {
  if (candidate.startsWith('[')) {
    const close = candidate.indexOf(']');

    return close === -1 ? candidate : candidate.slice(0, close + 1);
  }

  return candidate.replace(/:\d{1,5}$/, '');
};

const hostBeforeUserinfo = (authority: string): string =>
  stripPort(authority.split('@')[0]).toLowerCase();

const hostAfterUserinfo = (authority: string): string => {
  const atIndex = authority.lastIndexOf('@');

  if (atIndex === -1) return '';

  return stripPort(authority.slice(atIndex + 1)).toLowerCase();
};

export const extractHosts = (input: string): ExtractedHosts | null => {
  const source = sourceOf(input);
  const parsed = tryParse(source);

  if (parsed === null || parsed.hostname === '') return null;

  const authority = authorityOf(source);

  return {
    whatwgHost: parsed.hostname,
    naiveHosts: [hostBeforeUserinfo(authority), hostAfterUserinfo(authority)],
  };
};
