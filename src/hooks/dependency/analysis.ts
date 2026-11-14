import type { GitEntry } from '../../types/git.js';
import type {
  DependencyFlag,
  DependencyRule,
} from '../../types/hooks/dependency.js';
import type { FileAnalysis, ScanDetail } from '../../types/scan.js';
import { deepFreeze } from '../../core/collections.js';
import { analysisBySeverity } from '../../core/scan/driver.js';
import { shownName } from './text.js';

const LISTED_NAMES = 20;

const UNREADABLE_INDEX =
  'with a Git index it cannot read, since Git may ignore the lockfile (confirm by hand that it does not)';

/** Why the checker cannot confirm a manifest's lockfile coverage, for each thing a project can hold at .git */
const UNKNOWN_GIT_CAUSES: Readonly<Record<GitEntry, string>> = deepFreeze({
  absent:
    'without a .git at the project root, since Git may ignore the lockfile or a workspace above the project may hold one (run the check from the repository root)',
  pointer:
    'through a .git that points elsewhere, as a worktree or submodule does, since Git may ignore the lockfile (confirm in this checkout with git check-ignore)',
  folder: UNREADABLE_INDEX,
  other: UNREADABLE_INDEX,
});

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
    verdict: 'skipped-checksum',
    severity: 'finding',
    detail:
      'accepts a package that does not match the checksum its lockfile records',
  },
  {
    verdict: 'guarded-plain-transport',
    severity: 'review',
    detail:
      'fetched over plain http:// or git://, which the package manager refuses unless a setting outside the project allows it',
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
  {
    verdict: 'pinned-plain-transport',
    severity: 'advisory',
    detail:
      'downloaded over plain http://, though the checksum it pins rejects any other file',
  },
  {
    verdict: 'unrecorded-checksum',
    severity: 'advisory',
    detail:
      'no go.sum checksum, so Go builds nothing from it until go mod tidy records one from the checksum database',
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

/** The lead for a file the checker cannot judge */
export const unjudgedAnalysis = (problem: string): FileAnalysis => ({
  findings: [],
  review: [
    `${problem}, so the checker cannot judge it: fix it, or, when another tool reads it as it is, such as a template or a test fixture, leave it out with npx lagune write add --ignore <path> --checker dependency`,
  ],
  advisory: [],
});

/** The one lead for every manifest whose lockfile coverage waits on a Git state the checker cannot read, naming why it cannot */
export const unknownGitLead = (
  entry: GitEntry,
  manifests: readonly string[]
): ScanDetail => ({
  file: '.git',
  detail: ruleLine(
    `lockfile coverage the checker cannot confirm ${UNKNOWN_GIT_CAUSES[entry]}`,
    manifests
  ),
});

export const analysisOf = (flags: readonly DependencyFlag[]): FileAnalysis =>
  analysisBySeverity(
    RULES.flatMap(({ verdict, severity, detail }) => {
      const fired = flags.filter((flag) => flag.verdict === verdict);

      return fired.length === 0
        ? []
        : [{ severity, detail: ruleLine(detail, namesOf(fired)) }];
    })
  );
