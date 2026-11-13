import type { DependencyFlag } from '../../types/hooks/dependency.js';
import { textAt } from './fields.js';

const PLAIN_TRANSPORT =
  /^(?:(?:git|hg|svn|bzr|registry|sparse)\+)?(?:http|git):\/\//i;

/** Whether a URL travels over plain http:// or git://, including behind a prefix that names its kind, such as git+ or Cargo's sparse+ */
export const isPlainTransport = (url: string): boolean =>
  PLAIN_TRANSPORT.test(url);

/** The plain-transport flags of URLs that name nothing but themselves, such as a package index */
export const plainUrlFlags = (urls: readonly string[]): DependencyFlag[] =>
  urls
    .filter(isPlainTransport)
    .map((url) => ({ verdict: 'plain-transport', name: url }));

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
