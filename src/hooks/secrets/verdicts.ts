import type { GitEntry } from '../../types/git.js';
import type { CommittableTracking } from '../../types/hooks/secrets.js';
import type { FileAnalysis, ScanDetail } from '../../types/scan.js';
import { allOf, deepFreeze } from '../../core/collections.js';

const NAMED_FILES = 5;

export const findingOf = (detail: string): FileAnalysis => ({
  findings: [detail],
  review: [],
  advisory: [],
});

export const reviewOf = (detail: string): FileAnalysis => ({
  findings: [],
  review: [detail],
  advisory: [],
});

export const advisoryOf = (detail: string): FileAnalysis => ({
  findings: [],
  review: [],
  advisory: [detail],
});

export const PLACES: Readonly<Record<CommittableTracking, string>> = deepFreeze(
  {
    tracked: 'tracked by Git',
    unignored: 'that Git does not ignore',
  }
);

export const REMEDIES: Readonly<Record<CommittableTracking, string>> =
  deepFreeze({
    tracked:
      'stop tracking this file (git rm --cached) and add it to .gitignore',
    unignored:
      'add this file to .gitignore, so the next git add cannot commit it',
  });

export const EXPOSURES: Readonly<
  Record<CommittableTracking, (detail: string) => FileAnalysis>
> = deepFreeze({ tracked: findingOf, unignored: advisoryOf });

const UNREADABLE_INDEX =
  'with a Git index the checker cannot read to tell whether Git tracks them: confirm by hand that none of them is committed';

const UNKNOWN_GIT_CAUSES: Readonly<Record<GitEntry, string>> = deepFreeze({
  absent:
    'with no .git at the project root to tell whether Git tracks them: run the check from the repository root, or confirm by hand that none of them is committed',
  pointer:
    'with a .git that points to an index elsewhere, as a worktree or submodule does, which the checker never follows: confirm in this checkout, with git ls-files, that none of them is committed',
  folder: UNREADABLE_INDEX,
  other: UNREADABLE_INDEX,
});

export const unreadLead = (label: string): FileAnalysis =>
  reviewOf(
    `possible ${label} in a file that could not be read: check it by hand`
  );

/** What a file holding the labelled secret means under a Git status that does not ignore it */
export const exposureOf = (
  label: string,
  tracking: CommittableTracking
): FileAnalysis =>
  EXPOSURES[tracking](`${label} ${PLACES[tracking]}: ${REMEDIES[tracking]}`);

const namedFiles = (files: readonly string[]): string => {
  const sorted = files.toSorted((left, right) => left.localeCompare(right));
  const named = sorted.slice(0, NAMED_FILES);
  const unnamed = sorted.length - named.length;

  return allOf(unnamed === 0 ? named : [...named, `${unnamed} more`]);
};

/** The one lead for every file whose verdict waits on a Git status the checker cannot read, naming why it cannot */
export const unknownGitLead = (
  entry: GitEntry,
  files: readonly string[]
): ScanDetail => ({
  file: '.git',
  detail: `possible secrets in ${namedFiles(files)}, ${UNKNOWN_GIT_CAUSES[entry]}`,
});
