import type { TrackingVerdicts } from '../../types/hooks/secrets.js';
import type { FileAnalysis } from '../../types/scan.js';
import { deepFreeze } from '../../core/collections.js';

export const findingOf = (detail: string): FileAnalysis => ({
  findings: [detail],
  review: [],
  advisory: [],
});

const reviewOf = (detail: string): FileAnalysis => ({
  findings: [],
  review: [detail],
  advisory: [],
});

export const advisoryOf = (detail: string): FileAnalysis => ({
  findings: [],
  review: [],
  advisory: [detail],
});

export const unknownTrackingLead = (label: string): FileAnalysis =>
  reviewOf(
    `${label} with no readable Git index to tell whether Git tracks it: confirm it is not committed`
  );

export const unreadLead = (label: string): FileAnalysis =>
  reviewOf(
    `possible ${label} in a file that could not be read: check it by hand`
  );

/** What a file holding the labelled secret means for each Git status that does not ignore it */
export const verdictsFor = (label: string): TrackingVerdicts =>
  deepFreeze({
    tracked: findingOf(
      `${label} tracked by Git: stop tracking it (git rm --cached) and add it to .gitignore`
    ),
    unignored: advisoryOf(
      `${label} that Git does not ignore: add it to .gitignore, so the next git add cannot commit it`
    ),
    unknown: unknownTrackingLead(label),
  });
