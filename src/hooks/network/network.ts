import type {
  AddressClass,
  NetworkVerdict,
} from '../../types/hooks/network.js';
import { classifyAddress } from './classify.js';
import { extractHosts } from './extract.js';

const INTERNAL: ReadonlySet<AddressClass> = new Set([
  'metadata',
  'unspecified',
  'loopback',
  'link-local',
  'private',
]);

const canonicalHost = (host: string): string | null => {
  try {
    return new URL(`http://${host}/`).hostname.toLowerCase();
  } catch {
    return null;
  }
};

const isPlausibleHost = (host: string): boolean =>
  host.includes('.') || host.includes(':');

const divergesFrom = (naiveHost: string, connectHost: string): boolean => {
  if (naiveHost === '' || !isPlausibleHost(naiveHost)) return false;

  const naiveCanonical = canonicalHost(naiveHost);

  if (naiveCanonical === null) return false;

  return naiveCanonical !== connectHost;
};

const diverges = (naiveHosts: string[], connectHost: string): boolean =>
  naiveHosts.some((naiveHost) => divergesFrom(naiveHost, connectHost));

export const check = (destination: string): NetworkVerdict => {
  const hosts = extractHosts(destination);

  if (hosts === null) return 'invalid url';
  if (INTERNAL.has(classifyAddress(hosts.whatwgHost))) return 'private-target';
  if (diverges(hosts.naiveHosts, hosts.whatwgHost)) return 'parser-divergent';

  return 'safe';
};
