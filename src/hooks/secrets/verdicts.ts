import type { FileAnalysis } from '../../types/scan.js';

const UNTRACK = 'stop tracking it (git rm --cached) and add it to .gitignore';

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

export const trackedFinding = (label: string): FileAnalysis =>
  findingOf(`${label} tracked by Git: ${UNTRACK}`);

export const unknownTrackingLead = (label: string): FileAnalysis =>
  reviewOf(
    `${label} with no readable Git index to tell whether Git tracks it: confirm it is not committed`
  );

export const unreadLead = (label: string): FileAnalysis =>
  reviewOf(
    `possible ${label} in a file that could not be read: check it by hand`
  );
