import type {
  DependencyFlag,
  DependencyRule,
} from '../../types/hooks/dependency.js';
import type { FileAnalysis } from '../../types/scan.js';
import { deepFreeze } from '../../core/collections.js';
import { analysisBySeverity } from '../../core/scan/driver.js';
import { shownName } from './text.js';

const LISTED_NAMES = 20;

const RULES: readonly DependencyRule[] = deepFreeze([
  {
    verdict: 'plain-transport',
    severity: 'finding',
    detail: 'fetched over plain http:// or git://',
  },
  {
    verdict: 'missing-integrity',
    severity: 'finding',
    detail: 'no integrity hash to check the download against',
  },
  {
    verdict: 'extra-index',
    severity: 'finding',
    detail:
      'merges package indexes, so a public package can shadow a private one',
  },
  {
    verdict: 'outside-registry',
    severity: 'advisory',
    detail: 'fetched from outside the registry (git or a remote tarball)',
  },
  {
    verdict: 'install-script',
    severity: 'advisory',
    detail: 'runs install scripts',
  },
  {
    verdict: 'floating-specifier',
    severity: 'advisory',
    detail: 'floating specifier (such as * or latest)',
  },
  {
    verdict: 'no-lockfile',
    severity: 'advisory',
    detail: 'declares dependencies, but no lockfile covers it',
  },
]);

const ruleLine = (detail: string, names: readonly string[]): string => {
  if (names.length === 0) return detail;

  const sorted = [...new Set(names.map(shownName))].toSorted((left, right) =>
    left.localeCompare(right)
  );
  const listed = sorted.slice(0, LISTED_NAMES);
  const rest = sorted.length - listed.length;

  return `${detail}: ${listed.join(', ')}${rest > 0 ? `, and ${rest} more` : ''}`;
};

const namesOf = (flags: readonly DependencyFlag[]): string[] =>
  flags.flatMap(({ name }) => (name === null ? [] : [name]));

export const analysisOf = (flags: readonly DependencyFlag[]): FileAnalysis =>
  analysisBySeverity(
    RULES.flatMap(({ verdict, severity, detail }) => {
      const fired = flags.filter((flag) => flag.verdict === verdict);

      return fired.length === 0
        ? []
        : [{ severity, detail: ruleLine(detail, namesOf(fired)) }];
    })
  );
