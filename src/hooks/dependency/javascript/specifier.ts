import type {
  DependencySource,
  Specifier,
} from '../../../types/hooks/dependency.js';
import { isRecord, isString, ownValue } from '../../../core/collections.js';
import { isPlainTransport } from '../transport.js';

const GIT_SOURCE =
  /^(?:git\+[a-z]{1,10}:|git:\/\/|git@|ssh:|github:|gitlab:|bitbucket:|gist:)/i;

const URL_SOURCE = /^https?:\/\//i;

const PROJECT_SOURCE =
  /^(?:file:|link:|portal:|workspace:|patch:|exec:|catalog:|\.{0,2}\/|~\/)/i;

const HOSTED_SHORTHAND = /^[\w.-]{1,214}\/[\w.-]{1,214}(?:#\S{0,256})?$/;

const ALIAS = /^(?:npm|jsr):/i;

const ANY_VERSION = /^(?:[*xX](?:\.[*xX]){0,2})?$/;

const DIST_TAG = /^(?!v?\d)[A-Za-z][\w.-]{0,213}$/;

export const sourceOf = (spec: string): DependencySource => {
  if (isPlainTransport(spec)) return 'plain';
  if (GIT_SOURCE.test(spec) || URL_SOURCE.test(spec)) return 'remote';
  if (PROJECT_SOURCE.test(spec)) return 'project';
  if (HOSTED_SHORTHAND.test(spec)) return 'remote';

  return 'registry';
};

/** Where a locked URL fetches from, reading an https URL as the registry's */
export const lockedSourceOf = (resolved: string): DependencySource => {
  if (isPlainTransport(resolved)) return 'plain';
  if (GIT_SOURCE.test(resolved)) return 'remote';
  if (PROJECT_SOURCE.test(resolved)) return 'project';

  return 'registry';
};

const aliasedRange = (spec: string): string => {
  const target = spec.slice(spec.indexOf(':') + 1);
  const at = target.indexOf('@', 1);

  return at === -1 ? '' : target.slice(at + 1);
};

const isOpenEnded = (range: string): boolean =>
  ANY_VERSION.test(range) ||
  DIST_TAG.test(range) ||
  (range.includes('>') && !range.includes('<'));

/** Whether a registry specifier takes whatever is published next, instead of a bounded range */
export const isFloating = (spec: string): boolean =>
  (ALIAS.test(spec) ? aliasedRange(spec) : spec)
    .split('||')
    .some((range) => isOpenEnded(range.trim()));

export const specifiersIn = (
  entry: Record<string, unknown>,
  fields: readonly string[],
  wrong: (field: string) => Error
): Specifier[] =>
  fields.flatMap((field) => {
    const value = ownValue(entry, field);

    if (value === undefined) return [];
    if (!isRecord(value)) throw wrong(field);

    return Object.entries(value).map(([name, spec]): Specifier => {
      if (!isString(spec)) throw wrong(field);

      return [name, spec];
    });
  });
