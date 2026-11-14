import type {
  DependencyFlag,
  DependencyVerdict,
} from '../../types/hooks/dependency.js';
import { textAt } from './fields.js';

const PLAIN_TRANSPORT =
  /^(?:(?:git|hg|svn|bzr|registry|sparse)\+)?(?:http|git):\/\//i;

/** A loopback host spelled only in the forms every URL parser reads alike, so no userinfo, backslash, or numeric encoding can point a client elsewhere */
const LOOPBACK_HOST =
  /^(?:localhost|127(?:\.\d{1,3}){3}|\[::1\])(?::\d{1,5})?(?:[/?#]|$)/i;

/** Whether a URL crosses a network over plain http:// or git://, including behind a prefix that names its kind, such as git+ or Cargo's sparse+, never one that stays on the machine */
export const isPlainTransport = (url: string): boolean => {
  const scheme = PLAIN_TRANSPORT.exec(url);

  return scheme !== null && !LOOPBACK_HOST.test(url.slice(scheme[0].length));
};

/** The plain-transport flags of URLs that name nothing but themselves, such as a package index */
export const plainUrlFlags = (
  urls: readonly string[],
  verdict: DependencyVerdict = 'plain-transport'
): DependencyFlag[] =>
  urls.filter(isPlainTransport).map((url) => ({ verdict, name: url }));

/** The plain-transport flags of the URLs a package's source tables hold under the given keys, each named by the package and its URL */
export const sourceTableFlags = (
  file: string,
  where: string,
  name: string,
  sources: readonly Record<string, unknown>[],
  keys: readonly string[]
): DependencyFlag[] =>
  sources
    .flatMap((source) =>
      keys.flatMap((key) => textAt(file, source, key, `${where}.${name}`) ?? [])
    )
    .filter(isPlainTransport)
    .map((url) => ({ verdict: 'plain-transport', name: `${name} @ ${url}` }));
