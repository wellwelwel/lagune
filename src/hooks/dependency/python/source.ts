import type {
  DependencyFlag,
  PythonRequirement,
} from '../../../types/hooks/dependency.js';
import { isPlainTransport, sourceTableFlags } from '../transport.js';

const SOURCE_URL_KEYS = ['git', 'url', 'file'];

export const extraIndexFlags = (names: readonly string[]): DependencyFlag[] =>
  names.map((name) => ({ verdict: 'extra-index', name }));

export const requirementFlags = (
  requirement: PythonRequirement
): DependencyFlag[] =>
  requirement.kind === 'reference' && isPlainTransport(requirement.url)
    ? [{ verdict: 'plain-transport', name: requirement.text }]
    : [];

/** The plain-transport flags of a package's source tables, such as `{ git = "..." }` in Poetry, Pipenv, or uv */
export const packageSourceFlags = (
  file: string,
  where: string,
  name: string,
  sources: readonly Record<string, unknown>[]
): DependencyFlag[] =>
  sourceTableFlags(file, where, name, sources, SOURCE_URL_KEYS);
